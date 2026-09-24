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
  not-found.tsx           Branded 404 page
  (public)/               Shared public layout (Navbar + Footer + SkipLink)
    page.tsx              Landing (hero, schedule-at-a-glance strip,
                          8 event cards with scroll-reveal)
    about/                Department/faculty/committee + dev credit card
    brochure/             Invitation + rules/schedule downloads
    contact/              Map embed + contact cards (tel: links)
    register/             Leader signup (split-panel AuthShell)
    login/                Leader login (split-panel AuthShell)
  dashboard/              Leader area (guard: leader_token + leader_id)
    layout.tsx            title "Dashboard"
    page.tsx              Stats banner, registered teams, registration form
                          (deadline-gated), payment status card + Pay dialog
  admin/                  Admin area
    providers.tsx         AdminProviders: react-query QueryClient +
                          cache-level 401 redirect to /admin/login
    login/                Admin login (bypasses admin guard)
    changepassword/       Change own password (outside protected group)
    (dashboard)/          Protected admin route group (auth layout wrapper)
      layout.tsx          AdminProviders + AdminLayout (client guard)
      page.tsx            Dashboard
      adminreg/           Super Admin-only moderator creation

components/
  ui/                     shadcn/ui (Base UI based): button, card, dialog,
                          alert-dialog, input, label, select, table, tabs,
                          badge, alert, separator, skeleton, sonner, field;
                          ToasterClient.tsx (Sonner with ssr:false);
                          select-classes.ts (shared native <select> styles)
  layout/                 navbar.tsx, footer.tsx, skip-link.tsx
  public/                 reveal.tsx (IntersectionObserver scroll-reveal,
                          respects prefers-reduced-motion)
  auth/                   auth-shell.tsx (split-panel brand shell:
                            dark panel lg+ / banner mobile),
                          password-input.tsx (show/hide Eye toggle)
  dashboard/              stats-banner.tsx, team-registration-form.tsx
                          (deadline-gated - disables after admin deadline),
                          registered-members-table.tsx, food-badge.tsx,
                          dashboard-nav.tsx, payment-status-card.tsx
                          (Pay CTA + outstanding amount), payment-dialog.tsx
                          (amount + QR, then multipart proof upload)
  admin/                  AdminLayout.tsx (client auth guard + role-aware tabs),
                          AdminTabs.tsx (role-filtered tab switcher),
                          DashboardPanel.tsx (stats cards + login timeline),
                          PaymentsPanel.tsx (payment verification:
                            list/detail/proof/verify/reject/reopen),
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
                          redirectToAdminLogin, isSuperAdmin(),
                          requireSuperAdmin()
  candidate.ts            client-side rules engine
  types.ts                shared TypeScript types (incl. payments)
  alerts.ts               aionAlert (SweetAlert2 wrapper for confirmations)
  export.ts               Excel export helpers (xlsx)
  utils.ts                cn(), formatRupees(), getOutstandingPaises(),
                          buildUpiUriWithAmount()

services/
  auth.ts, team.ts, college.ts, admin.ts, payment.ts
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
| `POST /registerteam`                 | `created`, `updated`, `uniqueStudents`, `amountDuePaises`, `currency`, `upiUri`, `paymentStatus` | `registerTeam`        |
| `GET /stats/{leader_id}`             | `stats` (nested: totalStudents, studentsRemaining), `registrationDeadline` | `getLeaderStats`     |
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
| `GET /payments/mine`                 | `uniqueStudents`, `amountDuePaises`, `upiUri`, `data` | `getMyPayment`  |
| `POST /payments/proof` (multipart)   | `paymentId`, `paymentStatus`               | `submitPaymentProof`      |
| `GET /admin/payments[?status]`       | `count`, `data`                            | `listPayments`            |
| `GET /admin/payments/{id}`           | `data`, `audit`                            | `getPaymentDetail`        |
| `GET /admin/payments/{id}/proof`     | `url`, `expiresIn`                         | `getPaymentProof`         |
| `POST /admin/payments/{id}/{action}` | `paymentStatus` (verify/reject/reopen)     | `verify/reject/reopenPayment` |

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
are `{ name, registerNumber, mobile, degree, foodPreference? }`. The response
also carries the payment snapshot (`uniqueStudents`, `amountDuePaises`,
`upiUri`, `paymentStatus`).

`getLeaderStats` normalizes the nested `stats` object plus the top-level
`registrationDeadline`: `stats?.studentsRemaining ?? studentsRemaining`,
`stats?.totalStudents ?? totalStudents`, `registrationDeadline ?? null`.

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

### `services/payment.ts` — registration payments

Money is **integer paise** everywhere; format with `formatRupees()`.

| Function              | Method | Path                                  | Auth          | Returns / Notes                                   |
| --------------------- | ------ | ------------------------------------- | ------------- | ------------------------------------------------- |
| `getMyPayment`        | GET    | `/payments/mine`                      | leader        | uniqueStudents, amountDuePaises, upiUri, status   |
| `submitPaymentProof`  | POST   | `/payments/proof`                     | leader        | multipart FormData (`utr`, `amountPaises`, `screenshot`); never set Content-Type manually — uses api-client `rawBody` |
| `listPayments`        | GET    | `/admin/payments[?status=]`           | admin         | `{ count, data: PaymentSummaryRow[] }`            |
| `getPaymentDetail`    | GET    | `/admin/payments/{id}`                | Super Admin*  | `{ data: PaymentDetail, audit }`                  |
| `getPaymentProof`     | GET    | `/admin/payments/{id}/proof`          | Super Admin*  | presigned URL; fetched as Bearer blob for display |
| `verifyPayment`       | POST   | `/admin/payments/{id}/verify`         | Super Admin*  | confirms the leader's registrations               |
| `rejectPayment`       | POST   | `/admin/payments/{id}/reject`         | Super Admin*  | requires a reason (captured via `aionAlert.input`)|
| `reopenPayment`       | POST   | `/admin/payments/{id}/reopen`         | Super Admin*  | back to Verification Pending                      |

\* Role enforcement is backend-side (`adminRole: 1` → moderators get 403);
the frontend additionally hides the tab via `superAdminOnly` in `AdminTabs`.

### Leader payment UX (`/dashboard`)

- Registering a team does **not** open the payment dialog anymore. After a
  successful `registerTeam` a sonner toast points to the Pay button on
  `components/dashboard/payment-status-card.tsx`.
- The card derives the **outstanding** amount with `getOutstandingPaises()`
  (`lib/utils.ts`): no payment / `PENDING` / `REJECTED` → full
  `amountDuePaises`; `VERIFICATION_PENDING` → `0`; `SUCCESS` →
  `max(0, expectedAmountPaises − submittedAmountPaises)`. It shows contextual
  **Pay Now / Resubmit Payment / Pay Balance** wording plus a rejection-reason
  banner and an under-review note (with a balance-after-verification hint when
  members were added post-submission).
- `app/dashboard/page.tsx` holds one dialog with a `payMode`
  (`initial` | `supplementary`, chosen from the current payment status) and
  passes `outstandingPaises` as the dialog's `amountPaises`. Opening the dialog
  is manual (Pay button) or **auto-triggered once** (ref-guarded) when the
  leader hits the 15-student cap or registers all 8 events — never while a
  proof is `VERIFICATION_PENDING`. The ref resets when the outstanding hits `0`
  or the status enters review.
- `components/dashboard/payment-dialog.tsx`: pay step renders the amount,
  breakdown and a QR of the UPI URI rebuilt with the outstanding `am` via
  `buildUpiUriWithAmount()`; proof step submits `{ utr, amountPaises, screenshot }`
  as multipart. Supplementary mode labels it "Additional Amount to Pay".
- **Known caveat:** the admin PaymentsPanel "Difference" column compares the
  *last* submitted proof vs. expected — not cumulative. A backend follow-up
  exposing `paidSoFarPaises` would make supplementary payments easier to audit
  (out of scope for the frontend).

### Registration deadline gating

The leader register form (`team-registration-form.tsx`) takes an optional
`registrationDeadline` prop (from `getLeaderStats` / `getMyPayment`). `isClosed`
is computed on mount and re-checked every 60s; past the deadline the form shows
a red "Registration Closed" banner, disables the event `<select>` and submit
button, and refuses to submit defensively. Payment status is deliberately **not**
a gate.

## Authentication & Route Guards

- Storage keys (localStorage): `leader_token`, `leader_id`, `admin_token`,
  `admin_role` (`1` Super Admin, `2` Moderator).
- `lib/auth.ts` exposes `get/set/clear` helpers per role plus
  `clearAllAuth()`, `isLeaderLoggedIn()`, `isAdminLoggedIn()`, and
  `redirectToLogin(router)` (clears all four keys and pushes `/login`).
- Guards run in client components/layouts. Missing tokens redirect to the
  appropriate login page.
- `lib/auth.ts` exposes `redirectToAdminLogin(router)` (clears all four keys
  and pushes `/admin/login`).
- `AdminLayout` accepts **any admin token** (role `1` or `2`). Missing token →
  clear + redirect to `/admin/login`. Role drives the UI: Super Admins see all
  five tabs in `AdminTabs` (Dashboard, Payment Verification, View Team,
  View Event Registrations, Manage Colleges); **Moderators see only View
  Event Registrations** (per-event moderator filtering planned later).
- Admin pages use a **route group** `app/admin/(dashboard)/` so that
  `/admin/login` and `/admin/changepassword` bypass the `AdminLayout` guard.
- `AdminLayout` uses `useState`/`useEffect` for auth (not render-time
  `getAdminToken()`) to avoid SSR/client hydration mismatches.
- `adminreg` additionally rejects non-Super Admins at the page level.
- Mid-session expiry: `app/admin/providers.tsx` wires a react-query
  `QueryCache`/`MutationCache` `onError` handler — any `ApiError` with status
  `401` clears all auth and redirects to `/admin/login`.
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
- Native `<select>` controls share the class constants from
  `components/ui/select-classes.ts` (`selectClass`, `selectClassCompact`).
- Password fields use `components/auth/password-input.tsx` (show/hide toggle);
  mandatory fields show a red asterisk and set `aria-required="true"`.
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
  Orbitron/Rajdhani only for admin UI (root layout CSS variables).
- Palette: primary blue `#3B82F6`/`#2563EB`, purple accent `#8B5CF6`,
  dark hero `#0F172A`.
- Animations: `float`, `particle-float`, `pulse-ring`, `glow`, `fadeInUp`,
  `deadlinePulse`.
- Scroll-reveal: `.reveal` / `.reveal.is-revealed` utilities driven by
  `components/public/reveal.tsx` (IntersectionObserver, reveals once).
- A global `prefers-reduced-motion` guard in globals.css disables decorative
  animations and reveals for users who opt out.
