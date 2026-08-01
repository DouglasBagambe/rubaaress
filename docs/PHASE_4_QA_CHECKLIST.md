# Phase 4 QA Checklist

## State Protection

- [x] Confirmed branch `one`
- [x] Confirmed commit `98906c6`
- [x] Confirmed clean worktree before Phase 4 edits
- [x] Baseline lint, tests, TypeScript, Sanity schema validation and production build passed
- [x] No push performed
- [x] No `npm audit fix`

## Implementation Checklist

- [x] Public landmark and skip-link support
- [x] Header search submits to `/search`
- [x] Search page added
- [x] Contact form added with server validation
- [x] Admissions enquiry form added with server validation
- [x] Missing public routes added
- [x] Privacy page added
- [x] Accessibility statement added
- [x] Custom not-found page added
- [x] Route loading and error states added
- [x] Sitemap and robots added
- [x] School JSON-LD added
- [x] Gallery dialog accessible name added
- [x] Footer privacy/accessibility links fixed

## Routes Reviewed

- `/`
- `/about`
- `/about/history`
- `/about/mission-vision`
- `/about/headteacher`
- `/about/leadership`
- `/about/facilities`
- `/about/master-plan`
- `/academics`
- `/academics/o-level`
- `/academics/a-level`
- `/academics/departments`
- `/academics/performance`
- `/admissions`
- `/admissions/how-to-apply`
- `/admissions/requirements`
- `/admissions/fees-and-documents`
- `/admissions/faqs`
- `/school-life`
- `/school-life/sports`
- `/school-life/clubs`
- `/school-life/student-leadership`
- `/school-life/spiritual-life`
- `/news`
- `/events`
- `/announcements`
- `/gallery`
- `/gallery/academics`
- `/downloads`
- `/school-calendar`
- `/contact`
- `/search`
- `/privacy`
- `/accessibility`
- `/studio`

## Manual Follow-Up

- [ ] Browser-check all requested viewport widths
- [ ] Manually test screen-reader output
- [ ] Manually test Studio add/remove/reorder workflows
- [ ] Final legal review for privacy wording
- [ ] Configure form email provider before production launch
