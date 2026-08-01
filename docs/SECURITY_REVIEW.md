# Security Review

## Findings

- No private Sanity write token is committed.
- Public Sanity variables are limited to project ID, dataset and API version.
- Sanity write operations use authenticated Studio/CLI access.
- Form submissions use server-side validation, honeypot, timing check, field limits and IP-based rate limiting.
- Contact submissions are not stored in the public Sanity dataset.
- External links use safe `rel` attributes where they open a new tab.
- Public search excludes Studio, drafts, archived and unlisted content.
- Robots excludes Studio, API routes and query-string media/search states.

## Required Before Launch

- Configure a real email provider through environment variables.
- Confirm Sanity project member roles.
- Review hosting security headers at deployment level.
- Legal/privacy review before launch.
