# Launch setup: moving content to Supabase

Until now the gallery, events, blogs, achievements, team, contact info and user accounts were
stored in `server/data/*.json`. Vercel's filesystem is read-only, so saving from the admin panel
failed with `EROFS: read-only file system`. They now live in Supabase, and images live in
Supabase Storage (compressed in the browser before upload).

Recruitment applications (Supabase) and resume PDFs (Google Drive) are unchanged.

## 1. Create the tables and the image bucket (2 minutes)

Supabase Dashboard -> **SQL Editor** -> New query -> paste the whole of
`server/data/supabase_content_schema.sql` -> **Run**. Safe to run twice.

It creates the tables, turns on Row Level Security with no public policies (only your backend can
read/write them), and creates a public-read `site-images` bucket limited to 5 MB images.

## 2. Local `.env` (never commit this file)

Create `server/.env` from `server/.env.example`. You need at least:

```
SUPABASE_URL=...                 # Supabase -> Project Settings -> API
SUPABASE_SERVICE_ROLE_KEY=...    # same page, "service_role" secret. Server only, never in client code
JWT_SECRET=...                   # node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## 3. Import the existing content and photos (one time)

```bash
cd server
npm install
npm install --no-save sharp                  # compresses photos during migration

node scripts/importContent.js --dry-run      # preview
node scripts/importContent.js                # copy JSON content into Supabase
node scripts/migrateImages.js --dry-run      # preview (shows size before -> after)
node scripts/migrateImages.js                # upload photos, rewrite image URLs in the database
node scripts/createAdmin.js you@college.edu "Your Name"   # your real admin login
```

Both import scripts are safe to re-run (they skip rows that already exist and never touch your
original files). User accounts are deliberately NOT imported; see the security note below.

## 4. Vercel environment variables

Settings -> Environment Variables (Production), then **redeploy**:

| Variable | Value |
|---|---|
| `SUPABASE_URL` | from Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | from Supabase (secret) |
| `JWT_SECRET` | new random 48+ char value (changing it logs everyone out) |
| `GOOGLE_SERVICE_ACCOUNT_JSON`, `GOOGLE_DRIVE_FOLDER_ID` | already set, for resumes |
| `ADMIN_REGISTRATION_KEY` | leave **unset** |
| `GOOGLE_CLIENT_ID` + `VITE_GOOGLE_CLIENT_ID` | optional, only if you want Google sign-in |
| `GOOGLE_ALLOWED_DOMAINS` | optional, e.g. `sode-edu.in` |

## 5. Test on the live site

1. Log in with the admin you created in step 3.
2. Gallery -> Create: use **Upload photos** (pick a big phone photo), save, refresh. It stays.
3. Delete the test album. Edit an event, a blog and a team member too.
4. Open the site in a private window: all images load, blog drafts are not visible.

## 6. Clean up after everything works

- Delete `server/uploads/` and `client/public/uploads/` (about 38 MB; they are now in Supabase).
  Keep `client/public/images/default-cover.jpg`, which is the fallback cover.
- Remove the old JSON content from the repo: `git rm server/data/{gallery,events,blogs,achievements,team,contact,users,testimonials,applications}.json`
  (keep the `.sql` files). **`applications.json` and `contact.json` contain names, phone numbers and
  college emails of real-looking people in a public repository, and `users.json` has the old demo
  password hashes.** Removing the files stops new exposure, but old commits still contain them; if
  that matters to you, ask the people concerned or rewrite history (`git filter-repo`).

## Security changes in this release

- Removed the demo accounts and the "Fill Admin / Fill Member" buttons. `admin@codetroopers.org` /
  `admin123` was a working admin login on the live site.
- `JWT_SECRET` has no fallback value any more (the old one was public in the repo).
- No default admin registration key, and no email address is made admin automatically.
- "Continue with Google" was a mock that trusted any email. It now verifies Google's signed token.
- Draft blog posts are no longer returned by the public API.
- Image uploads: admin only, content sniffed (not just file extension), 4 MB cap, fixed folders.

## Known follow-ups (not done here)

- No rate limiting on login/contact/join-us endpoints (add Vercel WAF rules or Upstash ratelimit).
- Existing `applications` table: `server/data/supabase_schema.sql` does not match the columns the code
  inserts (`resume_drive_url`, `resume_drive_file_id`). Your live table evidently works; update that file
  from your real table (Supabase -> Table editor) so the repo documents reality.
