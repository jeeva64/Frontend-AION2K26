# AION 2K26 2.0 : Frontend

Frontend for **AION 2K26 2.0**, the **State Level Technical Symposium** of the
Department of Artificial Intelligence, St. Joseph's College (Autonomous),
Tiruchirappalli. Event date: **October 7, 2026 · Wednesday**.

Built as a modern rebuild of the original static HTML site:

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** + **shadcn/ui** (Base UI based, not Radix)
- **@tanstack/react-query** for server state
- **react-hook-form** + **zod** for all forms
- **sonner** toasts, `aionAlert` (SweetAlert2) for confirmations
- **xlsx** for Excel exports, `next/font` (Outfit + Orbitron/Rajdhani for admin)
- SEO via App Router `metadata` + `robots.ts` / `sitemap.ts` (see `SEO.md`)

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
- [Registration Payments](#registration-payments)
- [Public UI Notes](#public-ui-notes)
- [Environment Variables](#environment-variables)
- [Public Assets](#public-assets)
- [Related Repositories](#related-repositories)

## Getting Started

**Prerequisites**

- Node.js **>= 18.18** and npm
- PostgreSQL running locally (e.g. `postgresql://localhost:5432/aion2026` —
  see the backend `.env.example`)
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
| `/`                  | Public                 | Landing (hero, schedule strip, event cards)  |
| `/about`             | Public                 | Department, faculty, committee, dev credit   |
| `/brochure`          | Public                 | Invitation + rules download (schedule Coming soon) |
| `/register`          | Public                 | Leader signup (`POST /regleader`)            |
| `/login`             | Public                 | Leader login (`POST /loginleader`)           |
| `/dashboard`         | Leader                 | Stats, registered teams, registration, payments |
| `/admin/login`       | Public                 | Admin login (`POST /admin/adminlogin`)       |
| `/admin/changepassword` | Admin               | Change own password (`POST /admin/changepassword`) |
| `/admin`             | Admin                  | Stats, payment verification, views, colleges |
| `/admin/adminreg`    | Super Admin only       | Create moderators (`POST /admin/adminreg`)   |

Also: `robots.txt` + `sitemap.xml` from `app/robots.ts` / `app/sitemap.ts`.

Route guards: no `leader_token`/`leader_id` → redirect `/login`; no
`admin_token` → redirect `/admin/login`.

## Project Structure

```
app/
  layout.tsx            Root layout: fonts, global metadata, Toaster
  globals.css           Tailwind v4 @theme, AION palette, animations
  not-found.tsx         Branded 404 page
  (public)/             Public pages: page (landing), about, brochure,
                        register, login, layout
  dashboard/            Leader dashboard (layout + page)
  admin/                Admin portal
    providers.tsx       AdminProviders (react-query + cache-level 401 redirect)
    login/              Admin login
    changepassword/     Change own password
    (dashboard)/        Protected admin area (auth layout wrapper)
      layout.tsx        AdminProviders + AdminLayout (client guard)
      page.tsx          Dashboard
      adminreg/         Super Admin-only moderator creation
components/
  ui/                   shadcn/ui components (Base UI based),
                        ToasterClient.tsx (Sonner SSR-safe wrapper),
                        select-classes.ts (shared native select styles)
  layout/               navbar, footer, skip-link
  auth/                 auth-shell (split-panel brand shell),
                        password-input (show/hide Eye toggle)
  public/               reveal.tsx (IntersectionObserver scroll-reveal)
  dashboard/            stats-banner, team-registration-form,
                        registered-members-table, food-badge, dashboard-nav,
                        payment-status-card (Pay CTA + status),
                        payment-dialog (amount + QR → proof upload)
  admin/                AdminLayout.tsx (client auth guard + tabs),
                        AdminTabs.tsx (role-filtered tab switcher),
                        DashboardPanel.tsx (stats cards),
                        PaymentsPanel.tsx (payment verification),
                        ViewTeamPanel.tsx (college/dept search, grouped table),
                        ViewEventPanel.tsx (event search, team cards),
                        ManageCollegesPanel.tsx (add/edit colleges, auto-ID)
lib/
  constants.ts          API base, events, limits, enums, labels
  constants/admin.ts    EVENT_SLOT_MAP, DEPARTMENTS (objects), TN_DISTRICTS
  api-client.ts         fetch wrapper (envelope handling, typed errors, rawBody)
  auth.ts               localStorage token helpers + redirects
  candidate.ts          client-side conflict/validation rules
  types.ts              shared TypeScript types (incl. payments)
  alerts.ts             aionAlert (SweetAlert2 wrapper)
  export.ts             Excel export helpers (xlsx)
  utils.ts              cn(), formatRupees(), getOutstandingPaises,
                        buildUpiUriWithAmount
services/
  auth.ts               leader register/login
  team.ts               register team, candidates, leader stats
  college.ts            list colleges, bulk-add colleges, update college
  payment.ts            leader payment status + proof upload;
                        admin verification (list/detail/proof/actions)
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
| `POST /registerteam`                 | `created`, `updated`, `uniqueStudents`, `amountDuePaises`, `currency`, `upiUri`, `paymentStatus` |
| `GET /stats/{leader_id}`             | `stats` (nested), `registrationDeadline`   |
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
| `GET /payments/mine`                 | `uniqueStudents`, `amountDuePaises`, `upiUri`, `data` |
| `POST /payments/proof` (multipart)   | `paymentId`, `paymentStatus`               |
| `GET /admin/payments[?status]`       | `count`, `data`                            |
| `GET /admin/payments/{id}`           | `data`, `audit`                            |
| `GET /admin/payments/{id}/proof`     | `url` (presigned)                          |
| `POST /admin/payments/{id}/{action}` | `paymentStatus` — action = verify/reject/reopen |

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
(`redirectToLogin` in `lib/auth.ts`). The admin side centralizes mid-session
expiry too: a react-query cache-level handler in `app/admin/providers.tsx`
catches any 401 from admin queries/mutations, clears all auth, and redirects
to `/admin/login` (`redirectToAdminLogin`).

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

- **Registration deadline**: admin-set, read from `GET /stats/{leader_id}` /
  `GET /payments/mine` (`registrationDeadline`). Past it, the team form
  disables itself client-side (backend also returns `400`). Payment status
  never blocks registration.
- Max **15 students** per leader; disable when `studentsRemaining` reaches 0.
- Max **2 events** per student.
- **Bid Mayhem** blocks all other events (and vice-versa).
- No same-slot clash for a student.
- Mobile: 10 digits starting with **6–9**.
- Degree: `ug | pg`. Department: `cs | it | ai | ds | ca`. Shift: `1 | 2`.

## Registration Payments

Registration fees are **flat per unique student**; money is **integer paise**
everywhere (format with `formatRupees()`). Each leader has **one payment row**
whose status machine is `PENDING → VERIFICATION_PENDING → SUCCESS`, with
`REJECTED` back to resubmit. Payment never blocks team registration — the only
gate is the registration deadline.

- Registering a team does **not** auto-open the payment dialog anymore. A
  success toast points to the visible **Pay** button on
  `components/dashboard/payment-status-card.tsx`.
- The card shows the **outstanding** amount via `getOutstandingPaises()`
  (`lib/utils.ts`): PENDING/REJECTED = full expected, VERIFICATION_PENDING = 0,
  SUCCESS = expected − submitted — with contextual Pay Now / Resubmit Payment /
  Pay Balance wording.
- The dialog (`components/dashboard/payment-dialog.tsx`) opens on that button
  and **auto-triggers once** when a leader hits the 15-student cap or registers
  all 8 events (never while a proof is under review). The UPI QR amount is
  rebuilt from the outstanding figure via `buildUpiUriWithAmount()`.
- After submitting a proof the state is **Verification Pending** (never
  "Payment Successful") until a Super Admin verifies it on the
  `/admin` → Payment Verification tab. Leaders can register first and pay later.

## Public UI Notes

Branding and recent public-page changes (do not regress):

- **Branding:** “AION 2K26 2.0” everywhere visible (navbar, footer, auth shell,
  layout metadata, admin/Excel labels). Level: **State Level Technical Symposium**.
- **Hero (`/`):** October 7, 2026 · Wednesday; venue chip wraps on small
  screens; **Sail Hall, Arrupe Library** links to Google Maps
  (`https://maps.app.goo.gl/tfLssgZkGV4i1Wtz7`). No admin-deadline pill
  (deadline is backend-driven only). Logo is `public/logo-v2.png`
  (1665×945 — set `width`/`height` and `height: auto` in style when constrained).
- **CollegeHeader:** logos visible on mobile (flex-wrap); text full-width on
  small screens, side-by-side at `sm+`.
- **Footer (`components/layout/footer.tsx`):** 4-column layout (Brand / Explore /
  Event / Credits) + blue→purple hairline; college name is an external link to
  **https://www.sjctni.edu/** (new tab).
- **`/brochure`:** Two-column layout — **Invitation** card (preview image +
  View PDF / Download PDF for `aion-2k26-2.0-invite.pdf`) + **Downloads**
  (Rules live via `aion-2k26-overall-rules.pdf`; Event Schedule **Coming soon**
  static card). Root
  OG/Twitter uses `/aion-2k26-invite.jpg`.
- **`/about`:** Dev credit section is a centered brand glass card
  (`max-w-md`, Developer/System Admin badges) inside `<main>` — no full-row
  neon Orbitron block. Committee grid is 2-col centered with per-member `tel:`
  links; Secretaries render in a separate section (`sm:grid-cols-2
  md:grid-cols-3`, no phone). Hero gradient uses brand blue→purple; faculty
  badge always visible on touch (`sm+` hover reveal).
- **AuthShell:** clears fixed navbar (`pt`); tall register form does not clip.
- Rules PDF is live on `/brochure`; schedule PDF left in `public/` until the
  event schedule is finalized (card still **Coming soon**).

## Environment Variables

| Variable             | Required | Default                | Description                  |
| -------------------- | -------- | ---------------------- | ---------------------------- |
| `NEXT_PUBLIC_API_BASE` | No     | `http://localhost:5000`| Backend base URL             |
| `NEXT_PUBLIC_SITE_URL` | No     | `http://localhost:3000`| Canonical/OG base URL (set production host) |

## Public Assets

Normalized to kebab-case in `public/`: `logo-v2.png` (hero/auth current),
`logo.png` (legacy), `favicon.png`, `clg-logo.png`, `asso-logo.png`,
`mani-sir.jpg`, `mohan-sir.jpg`, `hod.jpg`, `jesu-sir.jpg`, `mam.jpg`,
`aion-2k26-invite.jpg` (OG + brochure preview), `aion-2k26-2.0-invite.pdf`
(invitation download), `aion-2k26-overall-rules.pdf`, `aion-2k26-schedule.pdf`
(rules PDF linked from brochure; schedule PDF not yet linked).

When CSS sets image width, also set `height: "auto"` on `next/image` style
(or vice versa) to avoid distortion.

## Related Repositories

- **Backend:** `E:\AION WINTER\Backend AION2K26`

(The original static reference site at `E:\AION WINTER\FRONTEND\` has been
removed; this Next.js rebuild is the source of truth.)

See also [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the frontend API contract
and internals, [`SEO.md`](./SEO.md) for search-engine optimization notes, and
[`AGENTS.md`](./AGENTS.md) for agent conventions (build after every task).
