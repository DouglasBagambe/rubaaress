# CMS Migration Plan

## Strategy

Sanity content is the primary future source. Local TypeScript content remains the fallback until each section is migrated and verified.

Do not remove `src/content/*` or `public/images/*` during migration. Public pages must keep rendering when Sanity documents are missing.

## Migration Order

1. Site Settings
2. Homepage
3. Enrolment
4. News and events
5. Gallery
6. Downloads
7. Staff
8. Academics
9. Admissions
10. Student Life
11. Facilities
12. Master Plan
13. Other pages

## Phase 2 Start

Connect Site Settings, Homepage and Current Enrolment to Sanity queries with local fallbacks. Keep page layout, header behaviour, styling and routes controlled in code.

## Publishing Model

Editors update content in `/studio`, publish through Sanity, and the Next.js public site later reads published content through `next-sanity` Live Content helpers.

## Safety Rules

- No private tokens in browser code.
- No custom admin login.
- No unauthenticated uploads.
- Validate known internal routes before publishing links.
- Keep class and enrolment totals calculated in code from class rows.
