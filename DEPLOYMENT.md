# CyberSafe SW deployment

The production website is https://cybersafesw.com/. GitHub repository: https://github.com/CustardCode/CyberSafeWebsite, branch main. Render builds and serves the current site; GoDaddy manages registration, DNS and Microsoft365 email. Read LAUNCH-STATUS.md for the latest verification and any outstanding certificate work.

## Updating the website

Edit src/ and public/assets/ on a branch. Legacy root index.html, style.css, script.js and images/ are the old site retained for history.

Run these checks with Node 24 or later:

```
node scripts/build.ts
node scripts/check.mjs
node --test tests/contact.test.mjs
```

The build regenerates render.yaml, including the security-policy hashes for the generated page metadata. Include render.yaml in the same commit whenever it changes. No package installation is required. Inspect affected visual pages at desktop and phone widths, open a pull request and merge the reviewed change into main. Render automatically deploys main; confirm the resulting successful deployment and the live page. Netlify remains a fallback copy, not the custom-domain host.

## Render configuration

- Static site: cybersafesw, service srv-db9cqsqjnfac73bqela0.
- Dashboard: https://dashboard.render.com/static/srv-db9cqsqjnfac73bqela0
- Blueprint: CyberSafe SW, exs-db9cut2jnfac73bqr7q0, linked to render.yaml on main, automatic sync enabled.
- Build: node scripts/build.ts && node scripts/check.mjs && node --test tests/contact.test.mjs
- Publish directory: dist. Keep the root directory blank.
- NODE_VERSION=24; SKIP_INSTALL_DEPS=true; SITE_HOST=Render.
- Auto-deploy: On Commit. Blueprint updates also apply the managed domain and header settings.
- The existing security headers and asset cache rule are declared in render.yaml. Netlify-style dist/_headers alone is not sufficient on Render.
- Keep actual404 behavior; do not add a catch-all rewrite to index.html.
- The default fallback URL is https://cybersafesw.onrender.com/.

For rollback, use the Render service's deployment history to redeploy a previously successful source revision, or revert the relevant GitHub commit through a reviewable pull request. DNS and environment settings are separate and require their own review. Do not delete the archived old-source branch.

## GoDaddy DNS

The website records saved on 17 October 2026 are:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 216.24.57.1 |
| CNAME | www | cybersafesw.onrender.com |

The former apex A records 75.2.60.5 and 99.83.190.102 and former www Netlify target have been replaced. Do not restore them. Keep ns13.domaincontrol.com and ns14.domaincontrol.com nameservers, Microsoft365 MX, SPF, DMARC and other email/service records intact. Do not transfer the domain, replace nameservers, buy services or change subscriptions without Josh's approval.

For a later host migration, first back up the current records and obtain that host's exact instructions. Verify apex/www certificates, HTTP-to-HTTPS and www-to-apex redirects after any switch. A valid primary address does not prove that www is ready.

## Email enquiries

Josh has tested the contact@cybersafesw.com mailbox receiving and sending with the CyberSafe SW display name. The website uses mailto links. The quote form validates fields and prepares an email in the visitor's chosen email app; the visitor must review and send it there. Save enquiry draft downloads a local text copy. The website itself does not transmit form contents or promise delivery.

Keep emailReady:true and contactEnabled:false. The prepared netlify/functions/contact.mjs Resend integration is dormant and is not deployed as a function by this Render static site. Enabling server-side enquiries in future requires an explicitly configured backend, private provider credentials, privacy updates and a real inbox-arrival/reply-to test before changing the switch. Do not expose API keys in the static site or change existing mailbox MX records for a sending service.

## Search and measurement

Canonical URLs and the 20-page sitemap use https://cybersafesw.com. Sitemap: https://cybersafesw.com/sitemap.xml. Robots: https://cybersafesw.com/robots.txt.

Search Console verification and sitemap submission still require the owner's Google account. Use the exact Google TXT verification value without replacing other TXT records. No indexing claim should be made before Google processes the site. Analytics remains disabled until Josh requests it; update privacy disclosures and verify consent before enabling a real measurement ID.
