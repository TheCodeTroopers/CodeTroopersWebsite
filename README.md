# Code Troopers

**Learn. Build. Lead.**

> Transforming Students into Industry-Ready Developers.

The official website of **Code Troopers**, the technical club of SMVITM.

The platform provides a centralized digital presence for showcasing the club's activities, events, achievements, projects, members, learning ecosystem, and technical initiatives.
 
---

## ✨ Features

- **Modern Responsive Design** — Optimized for desktop, tablet, and mobile devices
- **Homepage** — Club introduction, vision, highlights, and featured content
- **About** — Club story, mission, vision, values, and objectives
- **Organization** — Overview of the club's structure and teams
- **Members** — Leadership and member profiles with social links
- **Events** — Workshops, hackathons, competitions, technical talks, and other activities
- **Event Protocol** — Overview of the club's event execution process
- **Achievements** — Club accomplishments, awards, and recognitions
- **Workbench** — Internal learning ecosystem and technical learning roadmaps
- **Gallery** — Photos from Code Troopers activities and events
- **Contact** — Contact information and communication channels
- **Responsive Navigation** — Mobile-friendly navigation and layouts
- **GitHub Integration** — Links to project repositories and developer profiles

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, React Router, Axios |
| Styling | CSS Modules, CSS |
| UI / Animation | Framer Motion, React Icons |
| Build Tool | Vite |
| Backend | Node.js, Express.js |
| Data Storage | JSON files |
| Version Control | Git, GitHub |

---

## 📁 Project Structure

```text
CodeTroopersWebsite/
│
├── client/                    # React frontend
│   ├── public/                # Static assets
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── pages/             # Website pages
│       ├── data/              # Frontend data/configuration
│       ├── styles/            # Global styles and variables
│       └── main.jsx           # Application entry point
│
├── server/                    # Express backend
│   ├── data/                  # JSON data files
│   ├── routes/                # API routes
│   ├── controllers/           # Request handlers
│   └── uploads/               # Uploaded/static files
│
├── package.json
└── README.md

---

## 🌐 Website Pages

| Page | Route | Description |
|---|---|---|
| Home | / | Club introduction, vision, highlights, and featured content |
| About | /about | Club story, mission, vision, and values |
| Organization | /organization | Club structure and organizational information |
| Team | /team | Members, leadership, roles, and profiles |
| Events | /events/* | Workshops, hackathons, competitions, talks, and lectures |
| Event Protocol | /event-protocol | Overview of the club's event execution process |
| Achievements | /achievements | Awards, recognitions, projects, and accomplishments |
| Workbench | /workbench | Learning ecosystem and technical roadmaps |
| Gallery | /gallery | Photos from club activities and events |
| Contact | /contact | Contact information and communication channels |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18 or higher
- npm
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CodeTroopersWebsite
```

### 2. Install Dependencies

From the project root:

```bash
npm run install:all
```

### 3. Start the Development Environment

```bash
npm run dev
```

This starts both the frontend and backend.

### Typical Development URLs

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

If port 3000 is already in use, Vite may start the frontend on another available port.

---

## 🔧 Running Services Individually

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 📦 Production Build

Build the frontend:

```bash
npm run build
```

Start the backend:

```bash
npm run start
```

---

## 📊 Data Management

The project currently uses JSON files for application data instead of an external database.

Main data files are maintained under: `server/data/`

Typical data includes:

- **team.json** — Team member information
- **events.json** — Event information
- **achievements.json** — Achievements and recognitions
- **gallery.json** — Gallery information and image references
- **contact.json** — Contact information and related content

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
3. Commit your changes with a meaningful message.
4. Push the branch to GitHub.
5. Create a Pull Request.
6. Get the changes reviewed.
7. Merge after approval.

**Example:**

```bash
git checkout -b feature/gallery-improvements
git add .
git commit -m "Improve gallery layout"
git push origin feature/gallery-improvements
```

Then create a Pull Request on GitHub.

⚠️ Do not push directly to main unless authorized by the project maintainers.

---

## 🎨 Design System

The website follows a dark, premium technical-club aesthetic inspired by the Code Troopers brand.

### Color Palette

| Element | Color |
|---|---|
| Primary Background | #0D0507 |
| Cream | #FDF6EE |
| Primary Gold | #C9973A |
| Highlight Gold | #E8B85A |

The design uses layered burgundy surfaces, cream typography, gold accents, subtle borders, and responsive layouts.

### Typography

- **DM Sans** — Primary interface and body typography
- **DM Mono** — Technical/code-oriented elements
- **Playfair Display** — Display and editorial typography

---

## 📱 Responsive Design

The website is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive testing should include common mobile widths such as:

- 375px
- 390px
- 412px

along with tablet and desktop resolutions.

---

## 👥 Project Team

The website is developed and maintained by the Code Troopers Project Development Team-03.

Contributors are encouraged to work through feature branches and Pull Requests so that changes can be reviewed and integrated safely.

---

## 📌 Project Status

**Status:** Active Development

The core website structure, pages, responsive layouts, event/gallery content, member information, and branding are implemented.

Current development primarily focuses on:

- Final UI refinements
- Content verification
- Responsive testing
- Bug fixes
- Performance improvements
- Final deployment preparation

---

## 📄 License

Academic Year 2026–27

Code Troopers Club
SMVITM
