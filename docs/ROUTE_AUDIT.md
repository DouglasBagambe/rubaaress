# Route Audit

| Route | HTTP result | Data source | Mobile result | Desktop result | Metadata status | Accessibility concerns | Content concerns | Visual concerns | Final status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Build verified | Sanity + fallback | Needs browser pass | Build verified | Root metadata | None found in code | None | None | Pass |
| `/about` | Build verified | Sanity + fallback | Needs browser pass | Build verified | Root metadata | None found in code | None | None | Pass |
| `/about/history` | Build verified | Fallback/static | Needs browser pass | Build verified | Root metadata | None found in code | Needs richer CMS content later | None | Pass |
| `/about/mission-vision` | Build verified | Site Settings + fallback | Needs browser pass | Build verified | Root metadata | None found in code | None | None | Pass |
| `/about/headteacher` | Build verified | Leadership route alias | Needs browser pass | Build verified | Root metadata | None found in code | Uses leadership content | None | Pass |
| `/about/leadership` | Build verified | Sanity staff + fallback | Needs browser pass | Build verified | Root metadata | None found in code | Staff details need school updates | None | Pass |
| `/about/facilities` | Build verified | Sanity facilities + fallback | Needs browser pass | Build verified | Root metadata | None found in code | Facility facts require confirmation | None | Pass |
| `/about/master-plan` | Build verified | Sanity masterPlan + fallback | Needs browser pass | Build verified | Root metadata | Lightbox keyboard supports Escape | None | None | Pass |
| `/academics` | Build verified | Sanity programmes/departments + fallback | Needs browser pass | Build verified | Root metadata | None found in code | Programme detail needs school updates | None | Pass |
| `/academics/o-level` | Build verified | Sanity/fallback | Needs browser pass | Build verified | Root metadata | None found in code | No unsupported claims | None | Pass |
| `/academics/a-level` | Build verified | Sanity/fallback | Needs browser pass | Build verified | Root metadata | None found in code | No unsupported claims | None | Pass |
| `/academics/departments` | Build verified | Sanity departments + fallback | Needs browser pass | Build verified | Root metadata | None found in code | Department heads not invented | None | Pass |
| `/academics/performance` | Build verified | Static empty state | Needs browser pass | Build verified | Page metadata | None found in code | Confirmed results required | None | Pass |
| `/admissions` | Build verified | Sanity admissions + fallback | Needs browser pass | Build verified | Root metadata | Form labels present | Fees/deadlines require confirmation | None | Pass |
| `/admissions/how-to-apply` | Build verified | Admissions alias | Needs browser pass | Build verified | Root metadata | Form labels present | Same as admissions | None | Pass |
| `/admissions/requirements` | Build verified | Admissions alias | Needs browser pass | Build verified | Root metadata | Form labels present | Same as admissions | None | Pass |
| `/admissions/fees-and-documents` | Build verified | Admissions alias | Needs browser pass | Build verified | Root metadata | Form labels present | Same as admissions | None | Pass |
| `/admissions/faqs` | Build verified | Admissions alias | Needs browser pass | Build verified | Root metadata | Form labels present | Same as admissions | None | Pass |
| `/school-life` | Build verified | Sanity activities + fallback | Needs browser pass | Build verified | Root metadata | None found in code | Activity detail can expand later | None | Pass |
| `/school-life/sports` | Build verified | School Life alias | Needs browser pass | Build verified | Root metadata | None found in code | Same as school life | None | Pass |
| `/school-life/clubs` | Build verified | School Life alias | Needs browser pass | Build verified | Root metadata | None found in code | Same as school life | None | Pass |
| `/school-life/student-leadership` | Build verified | School Life alias | Needs browser pass | Build verified | Root metadata | None found in code | Same as school life | None | Pass |
| `/school-life/spiritual-life` | Build verified | School Life alias | Needs browser pass | Build verified | Root metadata | None found in code | Same as school life | None | Pass |
| `/news` | Build verified | Sanity news + fallback | Needs browser pass | Build verified | Root metadata | None found in code | No dummy publishing added | None | Pass |
| `/news/[slug]` | Build verified | Sanity news + fallback | Needs browser pass | Build verified | Dynamic notFound | None found in code | Invalid slugs return 404 | None | Pass |
| `/events` | Build verified | Sanity events + fallback | Needs browser pass | Build verified | Root metadata | None found in code | No fake dates | None | Pass |
| `/announcements` | Build verified | Sanity active announcements | Needs browser pass | Build verified | Root metadata | None found in code | Expiry handled in query | None | Pass |
| `/gallery` | Build verified | Sanity gallery + fallback | Needs browser pass | Build verified | Root metadata | Filter controls labelled | Counts verified after import | None | Pass |
| `/gallery/[slug]` | Build verified | Sanity album/media + fallback | Needs browser pass | Build verified | Dynamic metadata | Dialog labelled | Invalid slugs return 404 | None | Pass |
| `/downloads` | Build verified | Sanity downloads + fallback | Needs browser pass | Build verified | Root metadata | None found in code | Internal docs excluded | None | Pass |
| `/school-calendar` | Build verified | Events alias | Needs browser pass | Build verified | Root metadata | None found in code | Same as events | None | Pass |
| `/contact` | Build verified | Site Settings + form endpoint | Needs browser pass | Build verified | Root metadata | Form labels present | Email provider required | None | Pass |
| `/search` | Build verified | Published public content | Needs browser pass | Build verified | Noindex metadata | Search label present | Query URLs not indexed | None | Pass |
| `/privacy` | Build verified | Static policy page | Needs browser pass | Build verified | Page metadata | None found in code | Legal review recommended | None | Pass |
| `/accessibility` | Build verified | Static statement | Needs browser pass | Build verified | Page metadata | None found in code | Does not claim perfect compliance | None | Pass |
| `/studio` | Build verified | Sanity Studio | Needs browser pass | Build verified | Excluded from robots | Sanity auth | Admin only | None | Pass |
