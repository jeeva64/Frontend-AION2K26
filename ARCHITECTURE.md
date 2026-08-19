# Frontend Architecture — AION 2K26

Human-oriented overview of the frontend internals: structure, request flow,
API contract, auth, validation, and conventions.

- [High-Level Overview](#high-level-overview)
- [Directory Structure](#directory-structure)
- [Request Flow](#request-flow)
- [The API Client (`lib/api-client.ts`)](#the-api-client-libapi-clientts)
- [Envelope Contract](#envelope-contract)
- [Service Layer Reference](#service-layer-reference)
- [Authentication & Route Guards](#authentication--route-guards)
- [Validation Engine (`lib/candidate.ts`)](#validation-engine-libcandidatets)
- [Forms & UI Conventions](#forms--ui-conventions)
- [Styling & Theme](#styling--theme)

## High-Level Overview

```
+----------------+      +-----------------+      +------------------+      +-------------+
|  Next.js pages | ---> |  services/*.ts  | ---> | lib/api-client.ts| ---> | FastAPI backend |
|  (App Router)  |      |  (typed fns)    |      |  (fetch wrapper) |      | + PostgreSQL    |
+----------------+      +-----------------+      +------------------+      +-------------+
        |                        |                        |
        |-- components/*         |-- returns envelope      |-- throws ApiError /
        |-- forms (RHF + zod)    |-- maps top-level fields |   NetworkError
        |-- sonner toasts        |   to typed results      |
```

Pages stay thin: they call typed functions in `services/`, which use the single
`api()` fetch wrapper, which branches on the `success` flag of the backend
envelope and throws typed errors for the UI to catch.

## Directory Structure

```
app/                      Next.js App Router
  layout.tsx              Root layout: Outfit + Geist_Mono fonts, metadata,
                          ToasterWrapper (Sonner SSR-safe via dynamic import)
  globals.css             Tailwind v4; @theme inline + :root/.dark tokens;
                          AION color palette CSS custom properties
  (public)/               Shared public layout (Navbar + Footer + SkipLink)
    page.tsx              Landing (hero + 8 event cards)
    about/                Department/faculty/committee (Orbitron/Rajdhani)
    brochure/             Invitation + rules/schedule downloads
    register/             Leader signup
    login/                Leader login
  dashboard/              Leader area (guard: leader_token + leader_id)
    layout.tsx            title "Dashboard"
    page.tsx              Stats banner, registered teams, registration form
  admin/                  Admin area
    layout.tsx            AdminNav + light gradient background (server component)
    login/                Admin login (bypasses admin guard)
    (dashboard)/          Protected admin route group (auth layout wrapper)
      layout.tsx          AdminProviders (react-query) + AdminLayout (client guard)
      page.tsx            Dashboard (stats cards via DashboardPanel)
      adminreg/           Super Admin-only moderator creation

components/
  ui/                     shadcn/ui (Base UI based): button, card, dialog,
                          alert-dialog, input, label, select, table, tabs,
                          badge, alert, separator, skeleton, sonner, field;
                          ToasterClient.tsx (Sonner with ssr:false)
  layout/                 navbar.tsx, footer.tsx, skip-link.tsx
  auth/                   auth-shell.tsx (shared auth page shell)
  dashboard/              stats-banner.tsx, team-registration-form.tsx,
                          registered-members-table.tsx, food-badge.tsx,
                          dashboard-nav.tsx
  admin/                  AdminLayout.tsx (client auth guard + tab container),
                          AdminTabs.tsx (tab switcher importing real panels),
                          DashboardPanel.tsx (stats cards + login timeline),
                          ViewTeamPanel.tsx (dynamic college/dept dropdowns,
                            grouped-by-leader table, delete, Excel export),
                          ViewEventPanel.tsx (event select, team cards,
                            remove from event, Excel export),
                          ManageCollegesPanel.tsx (add new colleges with
                            auto-generated college IDs, inline edit of
                            existing colleges, Excel-ready layout)

hooks/
  useViewTeam.ts          React Query hook: search (college+dept), deleteTeam
  useViewEventRegs.ts     React Query hook: search (event), deleteByEvent

lib/
  constants.ts            API base, event config, limits, enums, labels
  constants/admin.ts      EVENT_SLOT_MAP, DEPARTMENTS (object[]), TN_DISTRICTS
  api-client.ts           api() / apiPost(), ApiError / NetworkError
  auth.ts                 localStorage token helpers, redirectToLogin,
                          isSuperAdmin(), requireSuperAdmin()
  candidate.ts            client-side rules engine
  types.ts                shared TypeScript types
  alerts.ts               aionAlert (SweetAlert2 wrapper for confirmations)
  export.ts               Excel export helpers (xlsx)
  utils.ts                cn()

services/
  auth.ts, team.ts, college.ts, admin.ts
```

## Request Flow

1. A page/component calls a function in `services/*.ts`, e.g.
   `getCandidates(userId, token)`.
2. The service calls `api(path, { method, body, token })`.
3. `api()` builds headers — JSON `Content-Type` when a body is set, and
   `Authorization: Bearer <token>` when a token is passed — then `fetch`es
   `API_BASE + path`.
4. The JSON body is parsed as an envelope. If `res.ok`, the full envelope is
   returned; otherwise a typed `ApiError` (or `NetworkError`) is thrown.
5. The service reads the envelope's **top-level** fields and maps them to a
   typed result. Empty collections are normalized to `[]`.
6. The UI catches errors, shows a sonner toast (or inline message), and keeps
   the form open on 400.

## The API Client (`lib/api-client.ts`)

- `api<T>(path, options)` — core fetch wrapper. Resolves the JSON body and
  branches on `body.success`/HTTP status, never on `res.ok` alone.
  `options` support a JSON `body` or a raw `rawBody`, plus `token`,
  `rawHeaders`, and standard `RequestInit` fields.
- `apiPost<T>(path, body, token)` — POST convenience; rethrows 400 validation
  errors with `errors` attached.
- `ApiError` — carries `status`, `message`, optional `errors`.
- `NetworkError` — fetch threw (connection problem).

### Status code mapping

| Status | Behavior                                                             |
| ------ | -------------------------------------------------------------------- |
| 400    | Validation failure → show `message`, keep form open                   |
| 401    | Invalid/expired token → clear all auth + redirect `/login`            |
| 403    | Wrong role → surface the message                                      |
| 404    | Resource missing → empty state                                        |
| 409    | Conflict (already registered, limits, slot clash) → show message      |
| 429    | Rate limited → retry message                                          |
| 5xx    | Server error → generic retry message                                  |

## Envelope Contract

Every endpoint returns `{ success: true, message, ... }`. **Extra fields live
at the top level of the envelope** — the `data` key is only used for payloads
that are naturally lists or bundled objects.

| Endpoint                             | Top-level extras                           | `services/` reader        |
| ------------------------------------ | ------------------------------------------ | ------------------------- |
| `POST /admin/adminlogin`             | `role`, `token`                            | `adminLogin`              |
| `POST /admin/adminreg`               | —                                          | `adminRegister`           |
| `POST /regleader`                    | `userid`                                   | `registerLeader`          |
| `POST /loginleader`                  | `userid`, `name`, `token`                  | `loginLeader`             |
| `POST /registerteam`                 | `created`, `updated`                       | `registerTeam`            |
| `GET /stats/{leader_id}`             | `stats` (totalStudents, studentsRemaining) | `getLeaderStats`          |
| `POST /getcandidates`                | `totalStudents`, `registeredEvents`, `data`| `getCandidates`           |
| `GET /getcollege`                    | `data` (college list)                      | `getColleges`             |
| `POST /addcollege`                   | `count`                                    | `addColleges`             |
| `PUT /admin/college/{college_id}`    | — (message only)                           | `updateCollege`           |
| `GET /admin/leader-college-depts`    | `data` (college→departments mapping)       | `getLeaderCollegeDepts`   |
| `POST /admin/viewteam`               | `data` (registration docs)                 | `viewTeam`                |
| `POST /admin/vieweventregs`          | `event`, `totalTeams`, `data`              | `viewEventRegs`           |
| `DELETE /admin/deleteteam/{leader_id}`| `deletedCount`                             | `deleteTeam`              |
| `DELETE /admin/deleteteambyevent/...`| `updatedCount`, `deletedCount`             | `deleteTeamByEvent`       |
| `GET /admin/dashboardstats`          | `stats`                                    | `getDashboardStats`       |

**Caveat that has caused bugs:** keys such as `count`, `stats`, `deletedCount`,
`updatedCount`, `role`, and `token` are **not** inside `data`. When the
`ApiEnvelope<T>` type does not declare them, read them via a cast of the
returned envelope (see `adminLogin` in `services/admin.ts` for the pattern),
and never reach into `body.data?.<topLevelKey>`.

## Service Layer Reference

### `services/auth.ts` — leader auth
| Function          | Method | Path               | Auth     | Returns                       |
| ----------------- | ------ | ------------------ | -------- | ----------------------------- |
| `registerLeader`  | POST   | `/regleader`       | none     | `{ userid?, message? }`       |
| `loginLeader`     | POST   | `/loginleader`     | none     | `{ token?, userid?, name?, ...}` |

### `services/team.ts` — leader dashboard
| Function           | Method | Path               | Auth    | Returns                                |
| ------------------ | ------ | ------------------ | ------- | -------------------------------------- |
| `registerTeam`     | POST   | `/registerteam`    | leader  | `{ created?, updated?, message? }`     |
| `getCandidates`    | POST   | `/getcandidates`   | leader  | `CandidatesResponse`                   |
| `getLeaderStats`   | GET    | `/stats/{leaderId}`| leader  | `LeaderStats`                          |

`registerTeam` body: `{ leaderId, event, participants: Student[] }`. Students
are `{ name, registerNumber, mobile, degree, foodPreference? }`.

### `services/college.ts` — colleges
| Function        | Method | Path                          | Auth       | Returns                       |
| --------------- | ------ | ----------------------------- | ---------- | ----------------------------- |
| `getColleges`   | GET    | `/getcollege`                 | none       | `College[]`                   |
| `addColleges`   | POST   | `/addcollege`                 | Super Admin| `{ count?, message? }`        |
| `updateCollege` | PUT    | `/admin/college/{collegeId}`  | Super Admin| `{ message? }`                |

`addColleges` sends a **bare JSON array** as the body — do not wrap it in an
object. Duplicate `collegeId` values are skipped server-side; `count` = inserted.

`updateCollege` sends `{ collegeId?, name?, state?, district? }`. When changing
a college's district, the frontend auto-generates a new `collegeId`
(district prefix 3 letters + 3-digit sequential number) and sends it in the
payload.

### `services/admin.ts` — admin portal
| Function            | Method | Path                                   | Auth   | Returns                                  |
| ------------------- | ------ | -------------------------------------- | ------ | ---------------------------------------- |
| `adminLogin`        | POST   | `/admin/adminlogin`                    | none   | `{ role?, token?, message? }`            |
| `adminRegister`     | POST   | `/admin/adminreg`                      | Super  | `{ message? }`                           |
| `viewTeam`          | POST   | `/admin/viewteam`                      | admin  | `RegisteredStudent[]` (empty → no team)  |
| `viewEventRegs`     | POST   | `/admin/vieweventregs`                 | admin  | `EventRegEntry[]` (404 → empty state)    |
| `deleteTeam`        | DELETE | `/admin/deleteteam/{leader_id}`        | admin  | `{ deletedCount?, message? }`            |
| `deleteTeamByEvent` | DELETE | `/admin/deleteteambyevent/{leader_id}/{event}` | admin | `{ updatedCount?, deletedCount?, message? }` |
| `getDashboardStats` | GET    | `/admin/dashboardstats`                | admin  | `{ stats? }`                             |
| `getLeaderCollegeDepts` | GET | `/admin/leader-college-depts`          | admin  | `{ data: CollegeDepartments[] }`         |

Event names with spaces must be URL-encoded for `deleteteambyevent`
(e.g. `Bid%20Mayhem`) — handled with `encodeURIComponent`.

## Authentication & Route Guards

- Storage keys (localStorage): `leader_token`, `leader_id`, `admin_token`,
  `admin_role` (`1` Super Admin, `2` Moderator).
- `lib/auth.ts` exposes `get/set/clear` helpers per role plus
  `clearAllAuth()`, `isLeaderLoggedIn()`, `isAdminLoggedIn()`, and
  `redirectToLogin(router)` (clears all four keys and pushes `/login`).
- Guards run in client components/layouts. Missing tokens redirect to the
  appropriate login page. `adminreg` additionally rejects non-Super Admins.
- Admin pages use a **route group** `app/admin/(dashboard)/` so that
  `/admin/login` and `/admin/changepassword` bypass the `AdminLayout` guard.
- `AdminLayout` uses `useState`/`useEffect` for auth (not render-time
  `getAdminToken()`) to avoid SSR/client hydration mismatches.
- `lib/auth.ts` exposes `isSuperAdmin()` for conditional UI (e.g. Edit buttons
  on the Manage Colleges panel).

## Validation Engine (`lib/candidate.ts`)

Pure functions shared by the registration form:

- `checkParticipantConflict(student, selectedEvent)` — Bid Mayhem exclusivity,
  max-2-events, and same-slot clash checks, returning a `ConflictResult`.
- `isMobileValid(mobile)` — `/^[6-9]\d{9}$/`.
- `getTeamLimitExceededMessage(totalStudents, newStudents)` — 15-student cap.
- `getMaxEventsMessage()` — 2-events-per-student message.

Limits and the event → slot/participants/time map live in `lib/constants.ts`
(`EVENT_CONFIG`, `MAX_STUDENTS_PER_LEADER`, `MAX_EVENTS_PER_STUDENT`) and are
the single source of truth for the frontend.

## Forms & UI Conventions

- All **public forms** use **react-hook-form** + **zod** schemas resolved with
  `@hookform/resolvers/zod`.
- Field wiring uses the Base UI based `Field`/`FieldLabel`/`FieldError`/
  `FieldContent` components from `components/ui/field.tsx` with RHF's
  `Controller` — there is **no legacy `Form` wrapper**.
- **Admin panels** use native `<button>` elements (not shadcn `Button` which
  uses `@base-ui/react/button`). The shadcn `Button` component is excluded
  from admin panel imports.
- Feedback uses **two systems**: `aionAlert` (SweetAlert2) for confirmation
  dialogs and loading states, **sonner** toasts for simple success/error
  messages. Both are used across admin and public UI.
- **Admin data panels** use `@tanstack/react-query` hooks for server state
  (caching, refetching, mutations).
- Import via the `@/*` path alias; TypeScript strict; **no code comments**
  unless asked.

## Styling & Theme

- Tailwind v4 with tokens in `app/globals.css` (`@theme inline` +
  `:root`/`.dark`).
- Fonts: Outfit (`--font-sans`, via `next/font/google`) throughout;
  Orbitron/Rajdhani only in the `/about` dev section.
- Palette: primary blue `#3B82F6`/`#2563EB`, purple accent `#8B5CF6`,
  dark hero `#0F172A`.
- Animations: `float`, `particle-float`, `pulse-ring`, `glow`, `fadeInUp`,
  `deadlinePulse`.
