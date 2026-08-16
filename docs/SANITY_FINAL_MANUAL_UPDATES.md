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

Confirm the published headteacher is `Ms. Mpeirwe Monic Atukunda`. Remove or unpublish any conflicting headteacher name or draft biography.

## Current enrolment

Create or update the one `current` enrolment record with:

- Academic year: `2026`
- Reporting date: `2026-07-27`
- Headline totals: 1,418 students; 803 female; 615 male; 1,066 boarding; 352 day

Enter the stream table and boarding/day table in their separate fields. Do not derive one from the other or combine them: the school supplied them as distinct official datasets. The complete verified values are recorded in the scoped seed script and rendered by the website fallback on the public About page.

Archive older current enrolment records after confirming the new record is published.

## News, events and announcements

- Unpublish workflow/process entries such as CMS setup notes, draft migration articles and sample content.
- Keep News empty when there is no real school story with a title, publication date and approved content.
- Keep Events empty when there is no confirmed event with an actual date.
- Remove expired announcements or set an expiry date so they disappear automatically.
- Do not create filler content to avoid an empty section; the website intentionally hides empty homepage sections and shows factual empty states on listing pages.

## School life and facilities

Only publish facts confirmed by the school. Do not add club names, student-leader names, coordinates, founding dates, social links, facility counts or programme claims without school confirmation.

## Downloads

The twelve approved PDFs are served from `/public/downloads` and do not require Sanity uploads. Do not upload internal reference documents, working notes, implementation briefs or source photographs.

## Verification

After publishing changes:

1. Visit `/about`, `/news`, `/events`, `/announcements`, `/downloads` and `/school-life` on the production domain.
2. Confirm the About page displays `27 July 2026` and the 1,418 headline.
3. Open one PDF with **View PDF** and save one with **Download PDF**.
4. Confirm no workflow/process content appears in News or search results.
