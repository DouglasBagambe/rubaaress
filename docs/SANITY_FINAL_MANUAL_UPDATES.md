# Sanity final content updates

The website includes verified local fallbacks for the final school content. Production Sanity could not be updated during implementation because no authenticated Sanity write token was available in the local environment. Complete the following narrow updates in Sanity Studio after deployment.

## Before editing

- Open the production dataset for project `9x78oq9t`.
- Do not publish process notes, internal briefs, source photographs, draft event ideas, placeholder articles or unverified claims.
- Preserve gallery assets and all unrelated approved content.

## Site settings

Confirm the singleton contains:

- School name: `Rubaare Secondary School`
- Short name: `Rubaare SS`
- Motto: `Rise and Shine`
- Telephone: `0772 923 571`
- Email: `rubaaress2012@gmail.com`
- Physical location: `Rubaare, Ntungamo District, Uganda`

## Headteacher

Confirm the published headteacher is `Ms. Mpeirwe Monic Atukunda`. Replace the existing photograph with the approved professional office portrait in which she is wearing glasses. Remove or unpublish any conflicting headteacher name or draft biography.

## Current enrolment

Create or update the one `current` enrolment record with:

- Academic year: `2026`
- Reporting date: `2026-07-27`
- Public headline totals: 1,418 students; 1,066 boarding; 352 day

The two official records conflict on gender totals, and the detailed class/stream sheet does not reconcile cleanly with its printed grand total. Do not publish `803 female` or `615 male` as headline figures. Keep any existing class/stream rows only as an internal reference pending correction. Maintain the boarding/day table as the public class-level breakdown and do not derive or replace official figures.

Archive older current enrolment records after confirming the new record is published.

## News, events and announcements

- Unpublish workflow/process entries such as CMS setup notes, draft migration articles and sample content.
- Create one published News article dated `2026-08-18` titled `Rubaare SS Issues Term II Closing Circular and Term III 2026 Programme`, using the verified local article at `/news/term-ii-2026-closing-circular-term-iii-programme` as the exact editorial reference. Preserve the full body, not only the excerpt.
- Create the `Term III 2026 Reporting` announcement with publication date `2026-08-18`, expiry after reporting on `2026-09-15`, and a link to the article.
- Create the confirmed dated Term III events shown on `/events`: staff meeting (13 September), beginning of term (14 September), Beginning-of-Term examinations (16 September), S.1/S.2 Career's Day (26 September), UCE Briefing (8 October), Independence Day (9 October), Visiting Day (10 October), End-of-Term examinations (19–27 November), and end of term (4 December 2026).
- Use the date-only fields for these entries because the circular does not provide event times.
- Do not create dated entries for the S.6 farewell party or S.4/S.6 dedication because the circular supplies no dates.
- Leave venue and time empty when the circular does not supply them.
- Remove expired announcements or set an expiry date so they disappear automatically.
- Do not create additional filler content. The verified local fallback keeps the live website correct until the matching Sanity documents are published.

## School life and facilities

Only publish facts confirmed by the school. Do not add club names, student-leader names, coordinates, founding dates, social links, facility counts or programme claims without school confirmation.

Official structure photography from this pass supports the computer laboratory, boys' and girls' dormitory structures, dormitory-area sanitation facilities, junior staff quarters and headteacher accommodation. These may be maintained as factual facilities content without inventing counts, capacities or construction dates.

The 18 August 2026 circular additionally confirms that the clean water project and Junior Staff Quarters I are complete. It confirms that construction of a three-storeyed girls' dormitory was launched on 11 August 2026 and remains under construction. Do not describe the dormitory or proposed master-plan renders as completed.

## Downloads

The thirteen approved PDFs, including `Communication from School — 18 August 2026`, are served from `/public/downloads` and do not require Sanity uploads. Do not upload internal reference documents, working notes, implementation briefs or source photographs.

## Verification

After publishing changes:

1. Visit `/about`, `/news`, `/events`, `/announcements`, `/downloads` and `/school-life` on the production domain.
2. Confirm the About page displays `27 July 2026` and the 1,418 headline.
3. Open one PDF with **View PDF** and save one with **Download PDF**.
4. Confirm no workflow/process content appears in News or search results.
