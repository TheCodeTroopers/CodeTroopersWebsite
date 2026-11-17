# Code Troopers

**Learn. Build. Lead.**

> Transforming Students into Industry-Ready Developers.

The official website of **Code Troopers**, the technical club of SMVITM.

The platform provides a centralized digital presence for showcasing the club's activities, events, achievements, projects, members, blogs, and learning ecosystem, along with a recruitment portal and an admin dashboard for managing everything.

🔗 **Live site:** [code-troopers-website.vercel.app](https://code-troopers-website.vercel.app)

---

## ✨ Features

- **Modern Responsive Design** — Optimized for desktop, tablet, and mobile devices
- **Homepage** — Club introduction, vision, highlights, and featured content
- **About & Organization** — Club story, mission, values, and team structure
- **Team** — Leadership and member profiles with social links
- **Events** — Workshops, hackathons, competitions, technical talks, and guest lectures
- **Event Protocol** — Overview of the club's event execution process
- **Achievements** — Club accomplishments, awards, and detailed achievement views
- **Blogs** — Technical blogs and editorial posts with detail pages
- **Workbench** — Internal learning ecosystem and technical learning roadmaps
- **Gallery** — Photos from Code Troopers activities and events
- **Join Us (Recruitment)** — Online application form with PDF resume upload
- **Contact** — Contact form and club contact information
- **Authentication** — Login/register with JWT-based sessions and role-based access (member / admin)
- **Admin Dashboard** — Protected dashboard to manage all site content, applications, and users
- **SEO & Animations** — Per-page SEO metadata and smooth page transitions

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, React Router, Axios |
| Styling | CSS Modules, CSS |
| UI / Animation | Framer Motion, React Icons |
| Build Tool | Vite |
| Backend | Node.js, Express.js |
| Authentication | JWT, bcryptjs |
| Database | Supabase (recruitment applications) |
| File Storage | Google Drive (candidate resume PDFs, via `googleapis`) |
| File Uploads | Multer |
| Content Storage | JSON files (`server/data/`) |
| Hosting | Vercel (static frontend + serverless API) |
| Version Control | Git, GitHub |

---

## 📁 Project Structure

```
CodeTroopersWebsite/
│
├── api/                       # Vercel serverless entry point for the Express backend
│
├── client/                    # React frontend
│   ├── public/                # Static assets
│   └── src/
│       ├── components/        # Reusable UI components (Navbar, Footer, ProtectedRoute, ...)
│       ├── context/           # Auth context
│       ├── data/              # Static frontend content
│       ├── pages/             # Website pages
│       │   └── admin/         # Admin dashboard
│       ├── services/          # API client (Axios)
│       ├── styles/            # Global styles and design variables
│       ├── utils/             # Helper utilities
│       └── main.jsx           # Application entry point
│
├── server/                    # Express backend
│   ├── controllers/           # Request handlers
│   ├── routes/                # API routes
│   ├── utils/                 # Auth middleware, Supabase, Google Drive, JSON store
│   ├── data/                  # JSON content files + Supabase SQL schema
│   ├── scripts/               # Helper scripts
│   ├── uploads/               # Uploaded/static files
│   └── .env.example           # Environment variable template
│
├── docs/                      # Club documents (event protocol, constitution/SOP, coordinators list)
├── vercel.json                # Vercel build, function, and routing config
├── package.json               # Root scripts (install, dev, build, start)
└── README.md
```

---

## 🌐 Website Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Club introduction, vision, highlights, and featured content |
| About | `/about` | Club story, mission, vision, and values |
| Organization | `/organization` | Club structure and organizational information |
| Team | `/team` | Members, leadership, roles, and profiles |
| Events | `/events/workshops`, `/events/hackathons`, `/events/competitions`, `/events/technical-talks`, `/events/guest-lectures` | Events by category |
| Event Protocol | `/event-protocol` | Overview of the club's event execution process |
| Achievements | `/achievements`, `/achievements/:id` | Awards, recognitions, and accomplishments |
| Workbench | `/workbench` | Learning ecosystem and technical roadmaps |
| Blogs | `/blogs`, `/blogs/:id` | Technical blogs and posts |
| Gallery | `/gallery` | Photos from club activities and events |
| Contact | `/contact` | Contact form and information |
| Join Us | `/join-us` | Recruitment application form |
| Login | `/login` | Sign in / register |
| Admin | `/admin` | Admin dashboard (admin access only) |

---

## 🛡️ Admin Dashboard

The dashboard lives at `/admin` and is protected by role-based access (`ProtectedRoute`), so only users with the **admin** role can open it.

| Section | What admins can do |
|---|---|
| Overview | Summary stats and recent activity across the site |
| Recruitment | View applications, open resumes, update status, delete applications |
| Members | Manage the team roster |
| Events | Create, edit, and delete events |
| Achievements | Manage milestones and achievements |
| Blogs | Write, edit, and delete blog posts |
| Gallery | Manage gallery albums and media |
| Inquiries | Read and delete messages from the contact form |
| Roles & Access | View users, promote/demote admins, delete users |
| Settings | Update club contact details shown on the site |

Application statuses: `pending` → `reviewing` → `shortlisted` → `accepted` / `rejected`.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/TheCodeTroopers/CodeTroopersWebsite.git
cd CodeTroopersWebsite
```

### 2. Install Dependencies

From the project root:

```bash
npm run install:all
```

This installs the root, `server/`, and `client/` dependencies.

### 3. Configure Environment Variables

```bash
cp server/.env.example server/.env
```

Then fill in `server/.env`:

| Variable | Purpose |
|---|---|
| `PORT` | Backend port (default `5000`) |
| `JWT_SECRET` | Secret used to sign login tokens |
| `ADMIN_REGISTRATION_KEY` | Key required to register an admin account |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (backend only) |
| `GOOGLE_DRIVE_FOLDER_ID` | Drive folder where resume PDFs are stored |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Google service account credentials (or use the OAuth2 option in `.env.example`) |

### 4. Set Up Supabase

Run `server/data/supabase_schema.sql` in the Supabase SQL Editor to create the `applications` table, indexes, and Row Level Security policies.

### 5. Start the Development Environment

```bash
npm run dev
```

This starts both the frontend and backend together.

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

The Vite dev server proxies `/api` and `/uploads` to the backend. If port 3000 is already in use, Vite may start on another available port.

---

## 🔧 Available Scripts

Run from the project root:

| Script | Description |
|---|---|
| `npm run install:all` | Install root, server, and client dependencies |
| `npm run dev` | Start frontend and backend together |
| `npm run dev:client` | Start the frontend only |
| `npm run dev:server` | Start the backend only |
| `npm run build` | Build the frontend for production |
| `npm run start` | Start the backend in production mode |

---

## 🔌 API Overview

All routes are prefixed with `/api`. Routes marked 🔒 require an admin token.

| Route | Description |
|---|---|
| `/auth` | Login, register, current user, 🔒 user management and roles |
| `/team` | Team members (read public, 🔒 write) |
| `/events` | Events (read public, 🔒 write) |
| `/achievements` | Achievements (read public, 🔒 write) |
| `/blogs` | Blog posts (read public, 🔒 write) |
| `/gallery` | Gallery items (read public, 🔒 write) |
| `/contact` | Submit contact form, 🔒 view/delete submissions |
| `/contact-info` | Club contact details (read public, 🔒 update) |
| `/applications` | Submit recruitment application (PDF resume, max 10 MB), 🔒 list, view, update status, delete |
| `/recruitment/stats` | 🔒 Recruitment statistics |
| `/health` | API health check |

---

## ☁️ Deployment

The site is deployed on **Vercel**, configured through `vercel.json`:

- **Build command:** `npm --prefix client run build`
- **Output directory:** `client/dist`
- **API:** the Express backend runs as a serverless function via `api/[...route].js`, bundled with the `server/` folder
- **Routing:** `/api/*` and `/uploads/*` are forwarded to the serverless function; all other routes fall back to `index.html` for client-side routing
- **Environment variables:** set the same variables listed in `server/.env.example` in the Vercel project settings

---

## 📊 Data Management

- **Supabase** — stores recruitment applications (`applications` table)
- **Google Drive** — stores applicant resume PDFs; the file link is saved with the application
- **JSON files** — store site content under `server/data/`: team, events, achievements, blogs, gallery, contact, testimonials, and users

Uploaded images and static files are served from `server/uploads/`.

---

## 🔗 GitHub Workflow

All contributors should follow the project's Git workflow.

### Branch Structure

```
main
│
├── feature/feature-name
├── fix/issue-name
└── docs/documentation-name
```

### Contribution Workflow

1. Create a feature/fix branch.
2. Make your changes.
3. Test locally (responsiveness, routing, and UI consistency).
4. Commit your changes with a meaningful message.
5. Push the branch to GitHub.
6. Create a Pull Request.
7. Get the changes reviewed.
8. Merge after approval.

**Example:**

```bash
git checkout -b feature/gallery-improvements
git add .
git commit -m "Improve gallery layout"
git push origin feature/gallery-improvements
```

Then create a Pull Request on GitHub.

### Commit Message Standards

Use clean, descriptive messages. Avoid vague names like `update`, `changes`, or `fixed`.

```
✅ Added responsive navbar
✅ Improved landing page animations
❌ update
❌ fixed stuff
```

⚠️ Do not push directly to `main` unless authorized by the project maintainers.

---

## 🎨 Design System

The website follows a dark, premium technical-club aesthetic inspired by the Code Troopers brand.

### Color Palette

| Element | Color |
|---|---|
| Primary Background | `#0D0507` |
| Cream | `#FDF6EE` |
| Primary Gold | `#C9973A` |
| Highlight Gold | `#E8B85A` |

The design uses layered burgundy surfaces, cream typography, gold accents, subtle borders, and responsive layouts.

### Typography

- **DM Sans** — Primary interface and body typography
- **DM Mono** — Technical/code-oriented elements
- **Playfair Display** — Display and editorial typography

---

## 📱 Responsive Design

The website is designed to work across desktop, laptop, tablet, and mobile.

Responsive testing should include common mobile widths such as **375px**, **390px**, and **412px**, along with tablet and desktop resolutions.

---

## 👥 Project Team

The website is developed and maintained by the Code Troopers Project Development Team-03.

Contributors are encouraged to work through feature branches and Pull Requests so that changes can be reviewed and integrated safely.

---

## 📌 Project Status

**Status:** Active Development

The core website, pages, responsive layouts, blogs, recruitment portal, admin dashboard, authentication, and branding are implemented.

Current development primarily focuses on:

- Final UI refinements
- Content verification
- Responsive testing
- Bug fixes
- Performance improvements
- Final deployment preparation

---

## 🔮 Future Scope

- Move all site content from JSON files to Supabase
- Leaderboard and GitHub activity integration
- AI chatbot assistant
- Event registrations and ticketing

---

## 📄 License

Academic Year 2026–27

Code Troopers Club SMVITM
