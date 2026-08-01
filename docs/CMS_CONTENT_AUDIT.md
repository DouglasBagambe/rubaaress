# CMS Content Audit

## Summary

The public website currently renders from TypeScript content modules and page-level text. Phase 1 preserves these local sources as fallbacks while introducing Sanity schemas for future editing.

| Content area | Current source file | Consumers | Editable in CMS | Proposed Sanity type | Priority | Keep fallback |
| --- | --- | --- | --- | --- | --- | --- |
| School identity, motto, mission, vision | `src/content/site.ts`, `src/lib/site-data.ts` | Header, footer, homepage, About, mission/vision, metadata | Yes | `siteSettings` | 1 | Yes |
| Contact, telephone, postal address, maps | `src/content/site.ts`, `src/lib/site-data.ts` | Header utility bar, contact page, footer, location section | Yes | `siteSettings` | 1 | Yes |
| Header, utility links, footer links, quick links | `src/content/navigation.ts`, `src/lib/site-data.ts`, `src/components/header.tsx`, `src/components/footer.tsx` | Header, mobile menu, footer, homepage quick links | Labels and link lists yes; behaviour no | `navigationSettings` | 1 | Yes |
| Homepage hero slides | `src/lib/site-data.ts` | `src/app/(site)/page.tsx`, `FullWidthHero` | Yes | `homepage` with `heroSlide` objects | 2 | Yes |
| Homepage introduction and section copy | `src/app/(site)/page.tsx`, `src/lib/site-data.ts` | Homepage sections | Yes | `homepage` | 2 | Yes |
| Headteacher name, photo and message | `src/lib/site-data.ts`, `src/content/media.ts`, `src/app/(site)/page.tsx` | Homepage, leadership page | Yes | `homepage`, `staffMember` | 2 | Yes |
| Enrolment data | `src/content/enrolment.ts`, `src/lib/site-data.ts` | Homepage stats, About enrolment table, tests | Yes | `enrolment` | 3 | Yes |
| News | `src/lib/site-data.ts`, `src/content/news.ts` | News listing, news detail page, homepage latest news | Yes | `newsArticle`, `announcement` | 4 | Yes |
| Events | `src/lib/site-data.ts`, `src/content/events.ts` | Events page, homepage upcoming events, utility News dropdown | Yes | `event` | 4 | Yes |
| Gallery albums and images | `src/content/media.ts`, `src/content/gallery.ts`, `src/lib/site-data.ts` | Gallery page, homepage gallery preview, navigation feature images | Yes | `galleryAlbum`, `galleryImage` | 5 | Yes |
| Downloads and PDFs | `src/lib/site-data.ts`, `src/content/downloads.ts` | Downloads page, admissions page, footer/resources | Yes | `download` | 6 | Yes |
| Leadership and staff | `src/lib/site-data.ts`, `src/app/(site)/about/leadership/page.tsx` | Leadership page, homepage headteacher section | Yes | `staffMember` | 7 | Yes |
| Departments and academic programmes | `src/lib/site-data.ts`, `src/app/(site)/academics/*` | Academics overview, O-Level, A-Level, departments pages | Yes | `department`, `academicProgramme` | 8 | Yes |
| Admissions content and FAQs | `src/app/(site)/admissions/page.tsx`, `src/lib/site-data.ts` | Admissions page, header dropdown CTA | Yes | `admissionsContent`, `faq` | 9 | Yes |
| Sports, clubs and student activities | `src/lib/site-data.ts`, `src/app/(site)/school-life/page.tsx` | School life page, homepage school life cards | Yes | `schoolLifeActivity` | 10 | Yes |
| Facilities | `src/app/(site)/about/page.tsx`, `src/content/media.ts` | About overview, future facilities pages | Yes | `facility` | 11 | Yes |
| Master plan | `src/content/media.ts`, `src/lib/site-data.ts`, `src/app/(site)/about/master-plan/page.tsx` | Master plan page, homepage preview | Yes | `masterPlan` | 12 | Yes |
| Generic secondary pages | Page files under `src/app/(site)` | Static secondary pages | Yes where no structured schema is needed | `genericPage` | 13 | Yes |
| Public images | `public/images/school/*`, `src/content/media.ts` | Hero, gallery, cards, master plan, leadership | Yes for future uploads | Sanity image fields | Per section | Yes |
| Page layout and components | `src/components/*`, `src/app/(site)/*` | All public routes | No | Code-controlled | N/A | N/A |
| Colours and typography | `src/app/globals.css`, `brand.md`, Tailwind classes | All public routes | No | Code-controlled | N/A | N/A |

## Current Hardcoded Text In Components And Pages

- `src/components/header.tsx`: header labels, search text, utility behaviour and CTA styling are code-controlled; future labels can come from `navigationSettings`.
- `src/components/footer.tsx`: footer columns and legal links are code-controlled; text and link lists can move to `siteSettings` and `navigationSettings`.
- `src/app/(site)/page.tsx`: homepage section headings and intro copy should migrate to `homepage`.
- `src/app/(site)/about/page.tsx`: About profile cards and enrolment section should migrate after `siteSettings` and `enrolment`.
- `src/app/(site)/admissions/page.tsx`: application steps and requirements should migrate to `admissionsContent`.
- `src/app/(site)/academics/*`: programme copy should migrate to `academicProgramme` and `department`.
- `src/app/(site)/school-life/page.tsx`: activity copy should migrate to `schoolLifeActivity`.

## Fallback Rule

Every migrated query should resolve as:

1. Published Sanity document
2. Existing local TypeScript fallback
3. Never an empty public section
