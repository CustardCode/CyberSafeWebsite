# CyberSafe SW

A complete static website for Josh's onsite cybersecurity service in Bunbury and South West WA. Includes 20 content pages, a 404 page, an interactive report viewer, the six-page fictional sample PDF, SVG identity and branded PNG social previews.

## Run locally

Requires **Node.js 24 or later**. There are no package dependencies to install.

```powershell
cd "C:\Users\JoshB\Documents\Codex\2026-10-13\files-pasted-by-the-user-cybersafe\outputs\cybersafesw"
node scripts/build.ts
node scripts/serve.mjs
```

Open **http://127.0.0.1:4321**. Stop the server with Ctrl+C. If port 4321 is already occupied, use `$env:PORT=4322` before starting it. Re-run the build and refresh after source edits. This deliberately simple preview server does not watch files or implement a framework.

With npm available, the equivalent commands are `npm run dev`, `npm run build`, `npm run preview`, `npm run check` and `npm test`. `npm install` requires no third-party packages for this project. The included `dist/` is ready to host; opening it through an HTTP server is important because routes and assets use root-relative URLs.

## Architecture

TypeScript functions produce ordinary HTML at build time. Node 24 executes these using native type stripping. CSS and browser JavaScript are separate, small files. All commercial and educational content is present in the generated HTML; no client-side framework, database, login, animation library or router is used.

| Location | Purpose |
| --- | --- |
| `src/config.ts` | Business details, service definitions, navigation, FAQs, delivery and analytics switches |
| `src/components.ts` | Header, footer, buttons, cards, process, report preview, breadcrumbs and SEO layout |
| `src/home.ts` | Art-directed homepage and original SVG device/account composition |
| `src/pages.ts` | Service, audience, about, process, contact, privacy and 404 pages |
| `src/articles.ts` | Three original articles, sources and article metadata |
| `src/report.ts` | Fictional findings and full sample report viewer |
| `public/assets/` | CSS, JS, SVG identity, PNG previews and prebuilt PDF |
| `scripts/build.ts` | Static generation, sitemap, robots, JSON-LD CSP hashes and branding |
| `scripts/serve.mjs` | Local HTTP preview and optional local function testing |
| `scripts/check.mjs` | Link, metadata, heading, schema and browser-script syntax checks |
| `netlify/functions/contact.mjs` | Server-side Resend integration, validation and Netlify rate-limit declaration |
| `tests/contact.test.mjs` | Meaningful validation, origin, delivery and idempotency tests |
| `dist/` | Generated deployable site |

The build writes files only inside this project. It does not remove directories or publish anything. Generated `build-manifest.json` records routes and CSP; `report-data.json` supplies fictional findings to PDF generation.

## Current business configuration

Phone: **0409 224 814**, linked as `tel:+61409224814`. The intended email is contact@cybersafesw.com, with mailbox setup pending. Social URLs are empty. Online form delivery and analytics are disabled. The form validates and downloads a local text draft; it does not send a message. Telephone contact is available throughout the site.

`business.emailReady` must remain false until the mailbox is verified. `business.contactEnabled` must remain false until the host's real email function is configured and tested. Analytics only loads after explicit consent and only with a valid configured GA4 ID. No form contents are passed to analytics. See `DEPLOYMENT.md` for activation.

Before changing contact details, search for their current value and regenerate the report and site together: report copy and server fallback messages are also customer-facing assets. Review all rendered phone links after any change.

## Content maintenance

Add services in `src/config.ts`; commercial templates automatically include them. Keep the server-side allowed-services list aligned when adding a service. Add articles in `src/articles.ts`, with useful source links, a unique slug and matching social image. Existing PNGs are retained on normal builds; regenerate an image if its SVG or article subject changes.

Shared blocks remain plain functions, so there is no custom component lifecycle to learn. Return a `Page` with `path`, `title`, `description` and `body` for new pages and add it to the build collection. Canonical URLs, OG/Twitter tags, breadcrumbs and sitemap inclusion are generated. Mark a page `noindex:true` only when justified. Use distinct search intent; don't duplicate the homepage under a new Bunbury slug.

## Sample PDF

`public/assets/cybersafe-sw-sample-report.pdf` is the actual six-page branded example. It ships in `dist/assets/` and is linked from the homepage and report viewer. Every page says SAMPLE REPORT - FOR ILLUSTRATION ONLY. No real assessment data is included.

Optional regeneration requires Python, ReportLab and font files. Run `node scripts/build.ts`, then `python scripts/create_report.py`, then rebuild to copy the new PDF. The script currently uses the local Windows Arial/Georgia fonts for embedding. On another platform, provide equivalent legally embeddable fonts and update `FONT_DIR`. PDF generation is **not** a hosting-build dependency because the finished PDF is committed with the assets.

## Verification

```powershell
node scripts/build.ts
node scripts/check.mjs
node --test tests/contact.test.mjs
```

Runtime TypeScript parsing and execution are verified. **A full semantic `tsc` check was unavailable because npm DNS resolution failed and the compiler is not cached.** Do not interpret `npm run check` as a TypeScript compiler check. When npm access returns, optionally install `typescript` and `@types/node`, include `scripts/**/*.ts` in `tsconfig.json`, and run `npx tsc --noEmit`. No linter is configured. Browser and PDF QA findings are recorded in `QA-REPORT.md`.

## Astro migration, if useful later

Astro would provide a conventional component ecosystem, content collections, a dev watcher and integrated compiler tooling. It is optional for this small static site; the present deliverable is independently usable.

When registry access returns, create a separate Astro branch/directory. Install `astro`, `typescript` and `@astrojs/check`. Retain `public/assets/`, the brand tokens, page copy and contact function. Convert the layout/header/footer into `.astro` components; use `src/pages/index.astro`, service route files and article content collections. Keep client interactions as the same progressive-enhancement script. Configure `site: 'https://cybersafesw.com'`, static output and trailing-slash policy. Recreate sitemap and headers, and repeat the route, metadata, mobile, PDF and contact checks before replacing this implementation. Do not ship an untested framework scaffold over this finished site.

## Before publishing

Read `LAUNCH-CHECKLIST.md`, `DEPLOYMENT.md`, `SEO-ROADMAP.md` and `BRAND-GUIDE.md`. This work is local-only. No site registration, public upload, live DNS edit, domain transfer or production deployment has been performed.

## Optional browser regression check

Final screenshots and the result of 126 page/width checks are included in `qa/`. To repeat the browser suite, start the local server first. When package access is available, install Playwright as an optional local developer tool (`npm install --no-save playwright`) and run `node scripts/browser-check.mjs` from this project directory. It uses the installed Microsoft Edge browser on Windows; on another platform, change its launch channel to an installed supported browser or install Playwright's Chromium. Playwright is not a production dependency.

The local server reads the CSP manifest at startup. Restart it after adding pages or changing structured data so the allowed hashes reflect the new build. To test the inactive email function locally with deliberately configured environment values, Node also supports `node --env-file=.env scripts/serve.mjs`; this does not enable the public form automatically.
