# SEO - AION 2K26 2.0 Frontend

Search-engine optimization notes for the AION 2K26 2.0 Next.js frontend:
what is in place, per-route metadata, and remaining optional polish.

- [SEO - AION 2K26 2.0 Frontend](#seo---aion-2k26-20-frontend)
  - [Current State](#current-state)
  - [Current Metadata by Route](#current-metadata-by-route)
  - [What's Already Good](#whats-already-good)
  - [Optional Follow-ups](#optional-follow-ups)
  - [Implementation Checklist](#implementation-checklist)

## Current State

- Metadata is defined in `app/layout.tsx`:
  - `metadataBase` from `NEXT_PUBLIC_SITE_URL` (fallback `http://localhost:3000`)
  - `title.default`: `AION 2K26 2.0 | State Level Technical Symposium`
  - `title.template`: `%s | AION 2K26 2.0`
  - `description`: State Level blurb with date + all 8 events
  - `openGraph` + `twitter` cards (image: `/aion-2k26-invite.jpg`)
  - `icons.icon`: `/favicon.png`
- `viewport`: `width=device-width, initialScale=1`, `themeColor: #0f172a`
- `<html lang="en">`
- Fonts loaded via `next/font/google` — self-hosted at build time.
- `app/robots.ts` — allows public routes; disallows `/admin`, `/dashboard`,
  `/login`, `/register`; references sitemap.
- `app/sitemap.ts` — public routes only: `/`, `/about`, `/brochure`.
- Canonicals: `/` and `/brochure` (+ `/about`).
- JSON-LD `Event` on the landing page (AION 2K26 2.0, 2026-10-07, ₹200).
- `robots: { index: false }` on dashboard + admin layouts; robots.ts also
  blocks `/login` and `/register` (client pages cannot export `metadata`).
- Event level is **State Level Technical Symposium**; hero date
  **October 7, 2026 · Wednesday**.

## Current Metadata by Route

| Route         | Title                          | Description / robots                                  |
| ------------- | ------------------------------ | ----------------------------------------------------- |
| `/`           | Home \| AION 2K26 2.0          | State Level + Oct 7 + events; canonical `/`           |
| `/about`      | About \| AION 2K26 2.0         | About AI Dept + team; canonical `/about`              |
| `/brochure`   | Brochure \| AION 2K26 2.0      | Invitation (live) + downloads (Coming soon); canonical `/brochure` |
| `/register`   | (root template)                | Disallowed in robots.ts; no page-level metadata       |
| `/login`      | (root template)                | Disallowed in robots.ts; no page-level metadata       |
| `/dashboard`  | Dashboard \| AION 2K26 2.0     | `noindex`                                             |
| `/admin`      | Super Admin Dashboard          | Admin layout template `%s \| Admin`; `noindex`        |
| `/admin/login`| Login \| Admin                 | `noindex` (parent layout)                             |

## What's Already Good

- Global title template + default title and description.
- `metadataBase`, Open Graph, Twitter cards.
- `robots.txt` + `sitemap.xml` via App Router metadata routes.
- Canonical public pages; JSON-LD Event schema.
- `lang="en"`, device viewport, theme color.
- Optimized self-hosted fonts with `display: swap`.
- Static pre-rendering on every route.
- `next/image` usage with width/height and descriptive alt text.

## Optional Follow-ups

1. Dedicated `1200×630` `public/og-image.png` (current invite preview is landscape 1600×1086).
2. Server layouts under `/login` and `/register` for page-level titles +
   `noindex` metadata (currently covered by `robots.ts` disallow).
3. FAQ / Organization JSON-LD if content warrants it.
4. Set production `NEXT_PUBLIC_SITE_URL` on Vercel (local `.env.local` has
   `http://localhost:3000`).

## Implementation Checklist

- [x] Add `metadataBase` in `app/layout.tsx`
- [x] Add `openGraph` + `twitter` metadata
- [x] Create `app/robots.ts` (disallow `/admin`, `/dashboard`, `/login`, `/register`)
- [x] Create `app/sitemap.ts` (public routes only)
- [x] Add canonical `alternates` on public pages
- [x] Add JSON-LD `Event` structured data
- [x] Mark dashboard/admin `noindex`; robots.ts blocks auth routes
- [ ] Set production `NEXT_PUBLIC_SITE_URL` and re-test with a social/OG validator
- [ ] Optional: landscape OG image
