# Verification record

Local review completed 13 October 2026. The site remains unpublished.

## Build and structural checks

- Node 24.19.0 executes the TypeScript static generator successfully.
- 21 generated pages: 20 indexable content pages and a noindex 404 page.
- 576 internal links/asset targets resolved, including the PDF and social images.
- Unique page titles and descriptions; one h1 per page; canonical, OG/Twitter metadata and en-AU language.
- 72 JSON-LD records parsed and checked for type/context. This verifies syntax and local structure, not Google rich-result eligibility.
- XML sitemap has all 20 indexable URLs and excludes the error page.
- Browser and contact-function JavaScript syntax checks pass.
- No fixed pricing, fake review markup, frontend credentials or inline event handlers.
- External npm DNS resolution failed; an offline attempt confirmed Astro/compiler dependencies were not cached. The final zero-dependency architecture runs without installation.

## Visual review and refinement

Actual local pages were rendered using headless Microsoft Edge through bundled Playwright, with desktop and mobile screenshots inspected. These are browser renders, not design mockups. Final screenshots are included in `qa/`.

Initial review: original navy/teal hero composition, report preview, ruled questions, service grid, audience panels, process, Josh monogram and footer. Homepage was tested at 360, 390, 430, 768, 1024 and 1440 px.

First refinement pass:

- Replaced visibility-hiding scroll reveals with a small entrance motion while keeping content visible. Full-page captures retain all headings.
- Added a direct telephone link beneath the hero quote actions.
- Made the preview's red/amber/green counts explicit and consistent with six fictional findings.
- Improved vertical spacing above the PDF action plan.

Second refinement pass:

- Rebalanced mobile hero artwork and supporting labels after adding telephone contact.
- Allowed text-only supporting-page heroes to use the full content width.
- Made mobile form actions full-width and inspected their labels/notices.
- Inspected report viewer, contact page, article and cards at actual rendered sizes.
- Added the owner-specified email with an honest setup-in-progress notice.
- Increased full-report mobile table and priority-label sizes for readability.

No horizontal overflow occurred in 126 browser checks (21 pages × six widths). All requested widths were checked, with screenshots principally at 1440 and 390 px. Large whole-page screenshots can compress significantly when opened in an image viewer; zoom in or use the live preview to judge body type.

## Functional browser checks

Passed: mobile menu opens/closes; Escape closes it and restores focus; native FAQ expansion; homepage report link; report section navigation; real PDF download with correct filename; service-specific quote prefilling; accessible invalid-field indication and focus; invalid email rejection; local draft download and truthful “not sent” message; disabled unconfigured submission; telephone link; privacy preferences and no analytics loading when disabled; keyboard skip link; reduced-motion behaviour.

Every route returned the expected response: 200 for content and 404 for the explicit missing-page test. Loaded images had a non-zero natural size. No unexpected browser errors occurred. The harness initially counted the deliberately requested 404 responses as console failures; it was corrected to recognise only that expected route and still flag unexpected failed responses. The full suite was rerun successfully.

## Contact-function tests

Four tests passed with Node's built-in test runner:

1. Required fields, length limits, email format, service choice, honeypot, UUID and timing validation.
2. Method/origin/input restrictions before delivery.
3. Missing delivery configuration returns 503 and never reports success.
4. A mocked accepted provider response returns success; failure does not; retries use the same idempotency key; payload is plain text with the intended reply-to.

No real outbound enquiry was sent. Native host rate limiting, inbox arrival and provider delivery events require an approved deployment and configured external account.

## PDF checks

Six A4 pages generated using ReportLab with embedded Arial/Georgia type. Poppler rendered every page to PNG. Cover, summary, assessed areas, findings, action plan and limitations were visually inspected. Layout bounds assertions caught overflow during generation and were resolved before final export. Each page carries the illustrative-sample notice. The final PDF is linked and downloadable from the site.

## Security, privacy and performance scope

CSP uses self-hosted CSS/scripts and hashes for page JSON-LD, without unsafe inline handlers/styles. The local preview serves CSP, content-type protection, frame restrictions, referrer and permissions headers. Netlify output includes those plus HTTPS HSTS. Secrets are server-side environment values only. No enquiry database, remote fonts, image trackers or frontend framework are used.

Analytics is off by default. Consent handling and events are prepared; no names, addresses, phone numbers or messages enter analytics events. No analytics traffic was observed during the disabled configuration checks.

The static homepage has no remote font/image dependencies and minimal client JavaScript. Local testing does **not** establish deployed Lighthouse scores, real-user LCP/INP/CLS, full WCAG conformance or absence of every security issue. No such scores or certifications are claimed.

## Remaining verification

- Full semantic TypeScript check with `tsc` when compiler tooling is available. Node type stripping is execution/syntax verification, not type checking.
- Actual host response/redirect behaviour, rate limits, HTTPS, security headers and rollback.
- Real mailbox, verified sender, provider acceptance and inbox delivery.
- GA4 property events/consent and Search Console indexing after activation.
- Deployed performance/accessibility scanning and testing on physical phones.
- Owner confirmation of scope, service coverage and privacy/evidence handling.
