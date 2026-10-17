# CyberSafe SW launch status — 17 October 2026

The approved website is live at https://cybersafesw.com/. This record supersedes earlier Netlify/domain-release and mailbox-setup notes.

## Verified live

- Public homepage opens at the real domain in the browser, with the approved design.
- Both cybersafesw.com and www.cybersafesw.com are verified in Render and have issued certificates.
- HTTP apex, HTTP www and HTTPS www redirect to https://cybersafesw.com/.
- All 20 content pages return200 with the expected canonical domain, one h1 and security headers. A nonexistent URL returns404.
- Sitemap and robots point to the correct domain. The branded sample PDF is 144,620 bytes and matches the approved file exactly.
- Public email links target mailto:contact@cybersafesw.com; the quote form prepares a draft for the visitor to send. Phone 0409 224 814 links to tel:+61409224814.
- Josh has tested the Microsoft365 mailbox receiving and sending as CyberSafe SW <contact@cybersafesw.com>.
- GoDaddy website DNS: A @ → 216.24.57.1; CNAME www → cybersafesw.onrender.com. Public resolvers 1.1.1.1 and 8.8.8.8 agree.
- Microsoft365 MX, GoDaddy nameservers, SPF and existing email/service records are retained.
- Live verification used fresh public DNS with normal TLS validation because the local system DNS cache still retained old hosting addresses. Some visitors may continue to see a cached old result until its TTL expires.
- Desktop browser inspected at actual 1280 × 720. Earlier responsive/PDF QA is recorded in QA-REPORT.md. A new live phone-width check remains unconfirmed because the browser viewport override did not apply.

## Hosting and source

GitHub: https://github.com/CustardCode/CyberSafeWebsite, branch main. PRs 1–5 are merged; the verified launch source is 803490419aff95a27af3aa7a1db1c13811d31951. The archived previous site remains on archive/pre-launch-2026-10-15.

Render static service: srv-db9cqsqjnfac73bqela0. Dashboard: https://dashboard.render.com/static/srv-db9cqsqjnfac73bqela0. Default hosting URL: https://cybersafesw.onrender.com/. Verified deployment: dep-db9cuuiog99s738l3p5g.

Render Blueprint CyberSafe SW: exs-db9cut2jnfac73bqr7q0, associated with that service and render.yaml on main. Automatic GitHub deployment is On Commit, and automatic Blueprint sync applies tracked configuration. Node 24 builds dist without external dependencies. SITE_HOST=Render produces accurate privacy wording. The generated render.yaml preserves CSP hashes and all seven security/cache header rules.

Netlify remains a fallback at https://cybersafesw.netlify.app/. Its old custom-domain association is no longer needed for launch. Domain-release ticket #1144599 can remain with support; do not move working DNS back to the old Netlify targets if a reply arrives. No domain transfer or nameserver change was made.

## Future changes

Ask Codex for the change in this GitHub project. Edit src/ and public/assets/ on a branch, run build/check/contact tests, include regenerated render.yaml, inspect affected pages and create a pull request. Merge the reviewed change to main and verify the resulting Render deployment and real website. Legacy root HTML/CSS/JS belongs to the retained old site.

Use Render deployment history or a reviewed GitHub revert for code rollback. DNS/environment settings need separate review. See DEPLOYMENT.md for configuration and email boundaries.

## Optional follow-up

Search Console ownership verification and sitemap submission still require Josh's Google account. Analytics remains off. contactEnabled:false intentionally keeps server-side delivery disabled; mailto enquiries do not require Resend. Do not enable that dormant function on a static host without a configured backend and real inbox-arrival test.
