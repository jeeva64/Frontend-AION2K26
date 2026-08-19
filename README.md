# AION 2K26 — Frontend

Frontend for **AION 2K26**, the National Level Technical Symposium of the
Department of Artificial Intelligence, St. Joseph's College (Autonomous),
Tiruchirappalli.

Built as a modern rebuild of the original static HTML site:

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** + **shadcn/ui** (Base UI based, not Radix)
- **@tanstack/react-query** for server state
- **react-hook-form** + **zod** for all forms
- **sonner** toasts, `aionAlert` (SweetAlert2) for confirmations
- **xlsx** for Excel exports, `next/font` (Outfit)

Backend: FastAPI + SQLAlchemy 2.0 (async PostgreSQL) — see
`E:\AION WINTER\Backend AION2K26`.

## Table of Contents

- [Getting Started](#getting-started)
- [Running Frontend + Backend](#running-frontend--backend)
- [Scripts](#scripts)
- [Routes](#routes)
- [Project Structure](#project-structure)
- [Data Flow & API Contract](#data-flow--api-contract)
- [Authentication](#authentication)
- [Event Configuration](#event-configuration)
- [Client-Side Rules](#client-side-rules)
- [Environment Variables](#environment-variables)
- [Public Assets](#public-assets)
- [Related Repositories](#related-repositories)

## Getting Started

**Prerequisites**

- Node.js **>= 18.18** and npm
- MongoDB running locally (default `mongodb://localhost:27017`)
- Backend running on `http://localhost:5000`

**Install**

```bash
npm install
```

**Configure**

Create `.env.local` (already present in this repo) with the API base URL:

```
NEXT_PUBLIC_API_BASE=http://localhost:5000
```

**Run**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Running Frontend + Backend

Run each in its own terminal window.

| Service     | Command                                                                   | URL                    |
| ----------- | ------------------------------------------------------------------------- | ---------------------- |
| Backend     | `E:\AION WINTER\Backend AION2K26\.venv\Scripts\python run.py`         | http://localhost:5000  |
| Frontend    | `npm run dev` (from this folder)                                          | http://localhost:3000  |

Backend health check: `GET http://localhost:5000/health`. Interactive API
docs: `http://localhost:5000/docs`.

The very first Super Admin cannot be created through the API. Seed it once via
the backend helper:

```powershell
E:\AION WINTER\Backend AION2K26\.venv\Scripts\python scripts\create_super_admin.py SA1 Root "YourPassword"
```

## Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start the development server (port 3000) |
| `npm run build`      | Typecheck + lint + production build      |
| `npm run start`      | Serve the production build               |
| `npm run lint`       | ESLint (flat config, `eslint.config.mjs`)|

Run `npm run build` before finishing any change to catch type/lint errors.

## Routes

| Route                | Access                 | Description                                  |
| -------------------- | ---------------------- | -------------------------------------------- |
| `/`                  | Public                 | Landing page (hero + event cards)            |
| `/about`             | Public                 | Department, faculty, organizing committee    |
| `/brochure`          | Public                 | Invitation preview, rules/schedule download  |
| `/register`          | Public                 | Leader signup (`POST /regleader`)            |
| `/login`             | Public                 | Leader login (`POST /loginleader`)           |
| `/dashboard`         | Leader                 | Stats, registered teams, team registration   |
| `/admin/login`       | Public                 | Admin login (`POST /admin/adminlogin`)       |
| `/admin`             | Admin                  | Dashboard (stats)                            |
| `/admin/adminreg`    | Super Admin only       | Create moderators (`POST /admin/adminreg`)   |

Route guards: no `leader_token`/`leader_id` → redirect `/login`; no
`admin_token` → redirect `/admin/login`.

## Project Structure

```
app/
  layout.tsx            Root layout: fonts, global metadata, Toaster
  globals.css           Tailwind v4 @theme, AION palette, animations
  (public)/             Public pages: page (landing), about, brochure,
                        register, login, layout
  dashboard/            Leader dashboard (layout + page)
  admin/                Admin portal
    layout.tsx          AdminNav + light gradient background (server)
    login/              Admin login
    (dashboard)/        Protected admin area (auth layout wrapper)
      layout.tsx        AdminProviders + AdminLayout (client guard)
      page.tsx          Dashboard (stats)
      adminreg/         Super Admin-only moderator creation
components/
  ui/                   shadcn/ui components (Base UI based)
                        ToasterClient.tsx (Sonner SSR-safe wrapper)
  layout/               navbar, footer, skip-link
  auth/                 auth-shell
  dashboard/            stats-banner, team-registration-form,
                        registered-members-table, food-badge, dashboard-nav
  admin/                AdminLayout.tsx (client auth guard + tabs),
                        AdminTabs.tsx (tab switcher),
                        DashboardPanel.tsx (stats cards),
                        ViewTeamPanel.tsx (college/dept search, grouped table),
                        ViewEventPanel.tsx (event search, team cards),
                        ManageCollegesPanel.tsx (add/edit colleges, auto-ID)
lib/
  constants.ts          API base, events, limits, enums, labels
  constants/admin.ts    EVENT_SLOT_MAP, DEPARTMENTS (objects), TN_DISTRICTS
  api-client.ts         fetch wrapper (envelope handling, typed errors)
  auth.ts               localStorage token helpers + redirects
  candidate.ts          client-side conflict/validation rules
  types.ts              shared TypeScript types
  alerts.ts             aionAlert (SweetAlert2 wrapper)
  export.ts             Excel export helpers (xlsx)
  utils.ts              cn() helper
services/
  auth.ts               leader register/login
  team.ts               register team, candidates, leader stats
  college.ts            list colleges, bulk-add colleges, update college
  admin.ts              admin login/register, view team, event regs,
                        delete team(s), dashboard stats, leader college depts
hooks/
  useViewTeam.ts        React Query hook for team search + delete
  useViewEventRegs.ts   React Query hook for event regs + delete
public/                 images, favicon, PDFs
```

## Data Flow & API Contract

**Flow:** pages → `services/*.ts` → `lib/api-client.ts` → backend.

Every backend endpoint returns the same envelope:

```json
{ "success": true, "message": "Human readable message", "...": "extras" }
```

Branch on `body.success` first — **never on `res.ok` alone**. The api-client
throws typed errors (`ApiError`, `NetworkError`); catch them in the UI layer.

Extra fields live **at the envelope top level**, not inside a `data` object:

| Endpoint                             | Top-level extras                           |
| ------------------------------------ | ------------------------------------------ |
| `POST /admin/adminlogin`             | `role`, `token`                            |
| `POST /regleader`                    | `userid`                                   |
| `POST /loginleader`                  | `userid`, `name`, `token`                  |
| `POST /registerteam`                 | `created`, `updated`                       |
| `GET /stats/{leader_id}`             | `stats`                                    |
| `POST /getcandidates`                | `totalStudents`, `registeredEvents`, `data`|
| `GET /getcollege`                    | `data`                                     |
| `POST /addcollege`                   | `count`                                    |
| `PUT /admin/college/{college_id}`    | — (message only)                           |
| `GET /admin/leader-college-depts`    | `data`                                     |
| `POST /admin/viewteam`               | `data`                                     |
| `POST /admin/vieweventregs`          | `event`, `totalTeams`, `data`              |
| `DELETE /admin/deleteteam/{leader_id}`| `deletedCount`                            |
| `DELETE /admin/deleteteambyevent/...`| `updatedCount`, `deletedCount`             |
| `GET /admin/dashboardstats`          | `stats`                                    |

HTTP status handling: **400** show message (keep form open), **401** clear
tokens + redirect to `/login`, **403** show message, **404** empty state,
**409** conflict message, **429/500** retry message.

## Authentication

Tokens are stored in `localStorage` and sent as
`Authorization: Bearer <token>` (space required).

| Storage key     | Purpose                |
| --------------- | ---------------------- |
| `leader_token`  | Leader JWT             |
| `leader_id`     | Leader user ID         |
| `admin_token`   | Admin JWT              |
| `admin_role`    | Admin role (`1` Super, `2` Moderator) |

On **401** the app clears all four keys and redirects to `/login`
(`redirectToLogin` in `lib/auth.ts`).

## Event Configuration

Source of truth: `lib/constants.ts` → `EVENT_CONFIG` (mirrored by the backend).

| Event            | Slot | Participants | Time                          |
| ---------------- | ---- | ------------ | ----------------------------- |
| Fixathon         | 1    | 2            | 11:00 AM - 1:00 PM            |
| Bid Mayhem       | BOTH | 2            | 11:00 AM - 4:00 PM (P&M)      |
| Mute Masters     | 1    | 2            | 11:00 AM - 1:00 PM            |
| Treasure Titans  | 1    | 2            | 11:00 AM - 1:00 PM            |
| QRush            | 2    | 2            | 2:00 PM - 4:00 PM             |
| VisionX          | 2    | 1            | 2:00 PM - 4:00 PM             |
| ThinkSync        | 2    | 2            | 2:00 PM - 4:00 PM             |
| Crazy Sell       | 2    | 4            | 2:00 PM - 4:00 PM             |

## Client-Side Rules

Enforced before sending (see `lib/candidate.ts`):

- Max **15 students** per leader; disable when `studentsRemaining` reaches 0.
- Max **2 events** per student.
- **Bid Mayhem** blocks all other events (and vice-versa).
- No same-slot clash for a student.
- Mobile: 10 digits starting with **6–9**.
- Degree: `ug | pg`. Department: `cs | it | ai | ds | ca`. Shift: `1 | 2`.

## Environment Variables

| Variable             | Required | Default                | Description                  |
| -------------------- | -------- | ---------------------- | ---------------------------- |
| `NEXT_PUBLIC_API_BASE` | No     | `http://localhost:5000`| Backend base URL             |

## Public Assets

Normalized to kebab-case in `public/`: `logo.png`, `favicon.png`,
`clg-logo.png`, `asso-logo.png`, `mani-sir.jpg`, `mohan-sir.jpg`, `hod.jpg`,
`jesu-sir.jpg`, `mam.jpg`, `aion2k26-invitation.jpg`,
`aion2k26-invitation-old.jpg`, `aion-2k26-overall-rules.pdf`,
`aion-2k26-schedule.pdf`.

## Related Repositories

- **Backend:** `E:\AION WINTER\Backend AION2K26`
- **Reference static site (keep untouched):** `E:\AION WINTER\FRONTEND\`

See also [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the frontend API contract
and internals, and [`SEO.md`](./SEO.md) for search-engine optimization notes.
