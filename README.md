# Code Troopers

**Learn. Build. Lead.**

Transforming Students into Industry-Ready Developers.

A modern full-stack website for the Code Troopers technical club — built with React, Express, and JSON file storage.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, React Router, Axios, CSS Modules, Framer Motion, React Icons |
| Backend | Node.js, Express.js |
| Database | JSON files (no external DB) |

## Project Structure

```
/
├── client/          # React frontend (Vite)
├── server/          # Express API backend
│   ├── data/        # JSON data files
│   ├── routes/      # API routes
│   ├── controllers/ # Request handlers
│   └── uploads/     # Static uploads
└── README.md
```

## Prerequisites

- Node.js 18 or higher
- npm

## Getting Started

### Run locally (development)

1. Install dependencies for root, server, and client:

```bash
npm run install:all
```

2. Start both backend and frontend concurrently:

```bash
npm run dev
```

Notes:
- The root `dev` script uses `concurrently` and `npm --prefix` to start both services.
- Backend: `http://localhost:5000` (API)
- Frontend: `http://localhost:3000` (Vite). If 3000 is in use, Vite will try the next available port (e.g. 3001).

Run services individually (if you prefer separate terminals):

```bash
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm run dev
```

To run the backend on a different port (PowerShell):

```powershell
#$env:PORT=5001; npm --prefix server run dev
# then run in the same shell:
# npm --prefix server run dev
```

Or on Unix/macOS:

```bash
PORT=5001 npm --prefix server run dev
```

### Production build and start

1. Build the React app:

```bash
npm run build
```

2. Start the Express server (serves API and static files if configured):

```bash
npm run start
```

### Troubleshooting

- EADDRINUSE (port already in use): find and stop the process using the port.

	Windows PowerShell:

	```powershell
	netstat -ano | findstr :5000
	tasklist /FI "PID eq <pid>"
	taskkill /PID <pid> /F
	```

	macOS / Linux:

	```bash
	lsof -i :5000
	kill -9 <pid>
	```

- PowerShell `cd /d` note: when running scripts from PowerShell, the root `package.json` now uses `npm --prefix` so shell `cd` quirks are avoided.


## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, vision, stats, featured content |
| About | `/about` | Constitution content, core values, golden rules |
| Organization | `/organization` | Team structure with objectives & KPIs |
| Team | `/team` | Member cards with search & filter |
| Events | `/events/*` | Workshops, hackathons, competitions, talks, lectures |
| Event Protocol | `/event-protocol` | Official event execution framework |
| Achievements | `/achievements` | Wins, projects, certifications, awards |
| Workbench | `/workbench` | Platform policies and roadmaps |
| Gallery | `/gallery` | Photo gallery with lightbox |
| Contact | `/contact` | Contact form, FAQ, social links |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/team` | Get all team members |
| POST | `/api/team` | Add team member |
| PUT | `/api/team/:id` | Update team member |
| DELETE | `/api/team/:id` | Delete team member |
| GET | `/api/events` | Get all events (`?type=workshops`) |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |
| GET | `/api/gallery` | Get gallery items |
| POST | `/api/gallery` | Add gallery item |
| DELETE | `/api/gallery/:id` | Delete gallery item |
| GET | `/api/achievements` | Get achievements |
| POST | `/api/achievements` | Add achievement |
| DELETE | `/api/achievements/:id` | Delete achievement |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/testimonials` | Get testimonials |
| GET | `/api/contact-info` | Get contact info & FAQ |

## Data Files

All data is stored in `server/data/`:

- `team.json` — Team members (populated from Excel)
- `events.json` — Club events
- `achievements.json` — Achievements & awards
- `gallery.json` — Gallery photos
- `testimonials.json` — Member testimonials
- `contact.json` — Contact info, FAQ, form submissions

## Regenerating Team Data

To regenerate `team.json` from the Excel source file:

```bash
cd server && node scripts/generateTeam.js
```

## Theme

- **Primary:** Deep Blue (`#1e3a8a`)
- **Accent:** Sky Blue (`#0ea5e9`)
- **Dark:** Slate (`#0f172a`)
- **Font:** Inter

## License

Academic Year 2026–27 | Code Troopers Club
