# CyberSafe SW refinement — 17 October 2026

This is a refinement of the existing static website in CustardCode/CyberSafeWebsite. It retains the navy, warm-white and teal identity, original logo, local business details, service URLs, sample PDF and GitHub/Render hosting.

## Customer journey

The opening screen now identifies onsite security check-ups for homes and small businesses in Bunbury and South West WA, explains the practical checks and offers a quote or sample report. Two compact routes help visitors choose home or business assistance. The assessment and report are shown before the detailed service cards. A consistent three-step process explains first contact, the visit and recommendations.

The sample report preview uses readable findings and priorities rather than a decorative score. Its three example findings match the unchanged full report. It is explicitly fictional. The browser-readable report and six-page PDF remain available. Report availability is consistently qualified by the agreed package; no universal reporting entitlement, free assessment or protection guarantee has been introduced.

Navigation now includes Services, How it works, Sample report and Meet Josh, with a prominent Request a Quote action. Quote links lead directly to the form and preserve the selected service. Visitors without a specific service in mind start with Something Else / Not Sure. A duplicate contact panel was removed. The website continues to prepare an email draft; visitors review and send it in their own email application. Testing did not send enquiries or emails.

## Responsive and accessible implementation

Tablet navigation changes at 900 px. Mobile navigation supports Escape, focus return, click outside, keyboard focus leaving the header and return to desktop. A separate noscript stylesheet keeps navigation available without JavaScript while avoiding a flash or layout shift for normal visitors. Layouts, touch targets, headings, forms, report navigation and content density were refined for small phones, tablets and large screens. Reduced-motion preferences disable transitions. Small service-card numbers now have readable contrast. Link accessible names use their visible text.

No external fonts, stock image downloads, runtime frameworks, tracking or production dependencies were added. The unused scroll-reveal observer was removed. Pricing remains by request. Existing security headers, account permissions, enquiry privacy, phone links and mailbox setup are preserved. Internal pre-launch wording was removed from the public privacy page without inventing a retention policy.

## Verification

Required repository checks: node scripts/build.ts; node scripts/check.mjs; node --test tests/contact.test.mjs. The structural check covers 21 pages, 571 local link/asset targets, unique metadata, one H1 per page, sitemap, JSON-LD and JavaScript syntax. All four existing contact tests pass.

Playwright checks cover every page at 25 viewport/orientation combinations in Chromium and WebKit: 525 per engine, 1,050 in total. These include every requested viewport: 320×568, 375×667, 390×844, 430×932, 600×960, 768×1024, 1024×768, 834×1194, 1194×834, 1366×768, 1440×900, 1920×1080 and 2560×1440. Twelve additional widths/orientations cover breakpoints and landscape phones. Real screenshots include the homepage at all required sizes and the key customer pages at 390, 768 and 1440 px.

Checks cover horizontal overflow, clipped headings/buttons/form/report, loaded images, menu interaction, report anchors, PDF download, quote service selection, field errors, email drafting without sending, local draft download, phone links, consent, FAQ, skip-link activation, reduced motion, tablet navigation and navigation without JavaScript. On this WebKit build, Tab follows the browser's default control-only focus preference; the skip link was focused explicitly to verify activation. Chromium's Tab reaches the skip link directly.

Axe scans cover all 21 pages at 390, 834 and 1440 px in both available engines (126 scans), using WCAG A/AA rule tags through WCAG 2.2. Automated scans complement visual and interaction checks; they do not establish full WCAG conformance or replace testing with assistive technology and physical devices.

Lighthouse audits cover the homepage, sample report and contact page in mobile and desktop configurations. Measurements are local lab tests, not production field Core Web Vitals. The final measured scores and metrics are recorded in the delivered audit bundle. Field INP, real visitor connection speeds and physical-device rendering have not been measured.

Firefox was downloaded and attempted, but exits with Windows process error 3221225477 before opening a page in this environment. Firefox verification remains outstanding. Chromium and WebKit are tested; WebKit automation is not a substitute for a physical iPhone Safari check.

The sample PDF is unchanged. SHA-256: 44baa97330d16c752cd5439c913ce47813eef56947965b2885c8d9fa3d5463f1.

## Repeat the browser audit

Install Playwright and axe-core as optional QA tooling outside production dependencies, with the needed browser binaries. Run node scripts/responsive-audit.mjs after the normal build. PLAYWRIGHT_MODULE_PATH can point to an installed Playwright package; AXE_MODULE_PATH must point to axe.min.js to include accessibility scans. PLAYWRIGHT_BROWSERS_PATH can select the downloaded browser directory. QA_OUTPUT sets the report/screenshot directory. QA_BASE can select an already running preview; otherwise the script starts its own local server. QA_ENGINES accepts a comma-separated list of engines. Missing browser launches are reported separately from page failures.

Final local Lighthouse results: all six audits (home, report and contact × mobile/desktop) scored 100 for Performance, Accessibility, Best Practices and SEO. Mobile LCP was 1.2–1.4 seconds; desktop LCP 0.3 seconds; TBT 0 ms and CLS 0 in every audit. These are local lab measurements, not a promise about production field results.

Playwright's WebKit screenshot implementation attempts an inline stylesheet that the existing CSP correctly blocks. A separate diagnostic reproduced the warning during screenshot capture, not normal page navigation. The audit harness records instrumentation messages separately from website errors and preserves the CSP. Full layout and accessibility results remain available alongside the targeted final instrumentation check.
