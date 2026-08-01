# Performance Audit

## Fixes Applied

- Search runs on the server and returns only matching public results.
- Sanity stega markers are disabled on the public client to avoid source-map marker output.
- Map iframe already uses lazy loading and a responsive container.
- Gallery videos remain paused until opened and use metadata preload.
- Gallery route data remains isolated from unrelated pages.
- Public loading skeletons preserve page dimensions without full-page spinners.

## Large Assets

- The curated gallery contains 29 images and 1 Sports Day video.
- Master Plan has 11 images because detailed drawings need readable viewing.

## Client Components Reviewed

- Header: client component for menus/search/drawer.
- Gallery lightbox: client component isolated to album pages.
- Public forms: client component isolated to contact/admissions pages.

## Remaining Limitations

- Full browser performance profiling should be run after deployment.
- Email delivery provider is not configured.
- Analytics is not activated.
