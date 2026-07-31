# SEO — AION 2K26 Frontend

Search-engine optimization notes for the AION 2K26 Next.js frontend: what is
already in place, current per-route metadata, gaps, and recommended additions.

- [Current State](#current-state)
- [Current Metadata by Route](#current-metadata-by-route)
- [What's Already Good](#whats-already-good)
- [Gaps](#gaps)
- [Recommendations](#recommendations)
  - [1. metadataBase](#1-metadatabase)
  - [2. Open Graph & Twitter cards](#2-open-graph--twitter-cards)
  - [3. robots.txt (`app/robots.ts`)](#3-robotstxt-approbotsts)
  - [4. sitemap.xml (`app/sitemap.ts`)](#4-sitemapxml-appsitemapts)
  - [5. Canonical URLs](#5-canonical-urls)
  - [6. Structured data (JSON-LD)](#6-structured-data-json-ld)
  - [7. Verify each page](#7-verify-each-page)
- [Implementation Checklist](#implementation-checklist)

## Current State

- Metadata is defined in `app/layout.tsx`:
  - `title.default`: `AION 2K26 | National Level Technical Symposium`
  - `title.template`: `%s | AION 2K26`
  - `description`: symposium blurb listing all 8 events
  - `icons.icon`: `/favicon.png`
- `viewport`: `width=device-width, initialScale=1`, `themeColor: #0f172a`
- `<html lang="en">`
- Fonts loaded via `next/font/google` (Outfit, Geist_Mono; Orbitron/Rajdhani on
  `/about`) — self-hosted at build time, no render-blocking font requests.
- All pages are statically prerendered (see `npm run build` output) — great
  for crawlability and LCP.

## Current Metadata by Route

| Route         | Title                          | Description                                             |
| ------------- | ------------------------------ | ------------------------------------------------------- |
| `/`           | AION 2K26 \| National Level Technical Symposium | Symposium blurb + 8 events             |
| `/about`      | About \| AION 2K26             | About AI Dept, St. Joseph's College, AION 2K26 team     |
| `/brochure`   | Brochure \| AION 2K26          | View invitation, download rules & schedule              |
| `/register`   | Register \| AION 2K26 (template) | (no page-level metadata)                              |
| `/login`      | Login \| AION 2K26 (template)  | (no page-level metadata)                                |
| `/dashboard`  | Dashboard \| AION 2K26         | (no description)                                        |
| `/admin`      | Admin Portal (default)         | Admin layout template `%s \| Admin`                     |
| `/admin/login`| Login \| Admin (template)      | (no description)                                        |
| `/admin/adminreg` | Admin Reg \| Admin (template) | (no description)                                      |

## What's Already Good

- Global title template + default title and description.
- `lang="en"`, device viewport, theme color.
- Optimized self-hosted fonts with `display: swap`.
- Static pre-rendering on every route.
- `next/image` usage (proper width/height and descriptive alt text on
  faculty/logos).

## Gaps

1. **No `metadataBase`** — absolute URLs cannot be built reliably for OG /
   canonical / sitemap.
2. **No Open Graph or Twitter cards** — shared links show no preview image,
   title, or description.
3. **No `robots.ts` / `robots.txt`**.
4. **No `sitemap.ts` / `sitemap.xml`**.
5. **No canonical URLs** on public pages.
6. **No structured data (JSON-LD)** — e.g. `Event`, `Organization`,
   `FAQPage`.
7. Some routes (register/login/admin) rely on the template and have no
   description; `generateMetadata` could be used per page.
8. No meta for `og:image` / social preview asset in `public/`.

## Recommendations

### 1. metadataBase

`app/layout.tsx`:

```ts
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://aion2k26.example.com"
  ),
  ...
};
```

All relative URLs in metadata (e.g. `icons.icon`) then resolve to absolute.

### 2. Open Graph & Twitter cards

`app/layout.tsx`:

```ts
export const metadata: Metadata = {
  openGraph: {
    type: "website",
    siteName: "AION 2K26",
    title: "AION 2K26 | National Level Technical Symposium",
    description: "National Level Technical Symposium by Dept. of AI, St. Joseph's College (Autonomous), Tiruchirappalli.",
    url: "/",
    images: [{ url: "/aion2k26-invitation.jpg", width: 1200, height: 630, alt: "AION 2K26 Invitation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AION 2K26",
    description: "Compete in 8 technical events at AION 2K26.",
    images: ["/aion2k26-invitation.jpg"],
  },
};
```

Add a `1200×630` `public/og-image.png` for crisp previews.

### 3. robots.txt (`app/robots.ts`)

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/dashboard", "/login", "/register"] },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://aion2k26.example.com"}/sitemap.xml`,
  };
}
```

### 4. sitemap.xml (`app/sitemap.ts`)

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aion2k26.example.com";
  return ["", "/about", "/brochure", "/register", "/login"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: path === "" ? 1 : 0.8,
  }));
}
```

Include only public, indexable routes.

### 5. Canonical URLs

For public pages, set a stable canonical. If every route is served from one
domain this is optional; add it if the site is reachable from multiple hosts
(e.g. `localhost`, preview deployments, custom domain):

```ts
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};
```

### 6. Structured data (JSON-LD)

Add an `Event` schema to the landing page. In `app/(public)/page.tsx`, render
a `<script type="application/ld+json">` block with the event name, date,
location (St. Joseph's College, Tiruchirappalli), and the event list:

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "AION 2K26",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "St. Joseph's College (Autonomous), Tiruchirappalli"
  },
  "description": "National Level Technical Symposium with 8 events.",
  "organizer": {
    "@type": "Organization",
    "name": "Department of Artificial Intelligence, St. Joseph's College (Autonomous)"
  }
}
```

Optionally add `Organization` (with logo) and `FAQPage` schemas.

### 7. Verify each page

Use the route metadata in [Current Metadata by Route](#current-metadata-by-route)
as the target and fill gaps for `/register`, `/login`, `/dashboard`, and
`/admin/*` with `generateMetadata` or inline `metadata` exports (titles,
descriptions, `robots: { index: false }` for auth/admin routes).

## Implementation Checklist

- [ ] Add `metadataBase` in `app/layout.tsx`
- [ ] Add `openGraph` + `twitter` metadata (and a `public/og-image.png`)
- [ ] Create `app/robots.ts` (disallow `/admin`, `/dashboard`, `/login`)
- [ ] Create `app/sitemap.ts` (public routes only)
- [ ] Add canonical `alternates` on public pages if multi-host
- [ ] Add JSON-LD `Event`/`Organization`/`FAQPage` structured data
- [ ] Add page-level metadata for `/register`, `/login`, `/dashboard`,
      `/admin/*`; mark auth/admin routes `noindex`
- [ ] Run `npm run build` and verify routes render in the build output
- [ ] Test previews with a social/OG validator
