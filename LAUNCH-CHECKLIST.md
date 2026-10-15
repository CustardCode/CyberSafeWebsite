# Launch checklist

This is a local build. **Publishing and DNS edits require Josh's approval.** The site has not been uploaded to a hosting service or connected to the live domain.

## Complete

- [x] Bespoke light/dark homepage, original brand mark, responsive device/account graphic.
- [x] Flagship Check-Up page, six supporting services, distinct business/home landing pages.
- [x] About, process, contact, privacy, tips hub, three useful articles, report viewer and 404.
- [x] Working owner-supplied telephone links: 0409 224 814.
- [x] Six-page fictional sample PDF and actual download links.
- [x] Accessible menu, FAQ, visible focus, skip link and reduced-motion handling.
- [x] Service-specific enquiry prefilling, validation and local draft download.
- [x] Server-side email integration prepared and unit-tested with mocked provider responses.
- [x] Static crawlable output, page-specific metadata, canonical URLs, schema, sitemap, robots, social images.
- [x] Security headers generated; no frontend credentials or live enquiry database.
- [x] Deployment guide, brand guide, SEO roadmap and maintenance instructions.

## Needs configuration

- [ ] Confirm **contact@cybersafesw.com** can send/receive. It is configured as the intended public address, with a setup-in-progress notice.
- [ ] Set the actual server-side sender, recipient, API key and precise `SITE_ORIGIN`.
- [ ] Test real delivery and reply-to; only then set `contactEnabled:true` and `emailReady:true`.
- [ ] If email form activation is deferred, retain the honest notice and telephone/draft options for a phone-only launch.
- [ ] Decide on GA4, configure a real ID if desired, verify consent and review privacy disclosures.
- [ ] Create the hosting project after approval; use the included Node 24 build and functions settings.
- [ ] Confirm clean URLs, custom 404 status, HTTPS and www-to-apex redirects on the host.
- [ ] Ensure native rate limits and security headers are actually enforced on the chosen host/plan.

## Needs owner verification

- [ ] Confirm all services, available access and practical capabilities match what Josh will deliver.
- [ ] Confirm onsite coverage and travel conditions; no additional suburb coverage has been assumed.
- [ ] Confirm reporting packages, assessment evidence handling and additional-work boundaries.
- [ ] Finalise privacy retention, access/correction process, providers and any overseas handling disclosures.
- [ ] Review the intended email address and keep phone prominent during mailbox setup.
- [ ] Confirm business identity and any required business/legal disclosures; no ABN or street address was invented.
- [ ] Confirm article advice and report wording before public use.
- [ ] Supply a genuine photograph if desired. The monogram is deliberately not a portrait.
- [ ] Add real social-profile URLs only when created. No placeholder social links are rendered.
- [ ] Approve public deployment and, separately, live DNS changes.

## Needs external account or tooling

- [ ] Hosting account and controlled Git repository.
- [ ] Email inbox account and sending-provider account with verified sending domain.
- [ ] Owner access to GoDaddy DNS, with existing records backed up.
- [ ] Search Console domain verification and actual Google-supplied TXT record.
- [ ] Eligible Google Business Profile, correct category, real hours/photos and verification.
- [ ] Optional GA4 property; mark actual `generate_lead` successes as key events.
- [ ] Full semantic TypeScript compiler check when registry access returns. Node-native TS execution is checked; `tsc` was unavailable.
- [ ] Deployed Lighthouse, accessibility scanner and real-world performance measurement. No Lighthouse score is claimed.

## Live sign-off, after approved deployment

- [ ] Correct domain and HTTPS, primary non-www URL, www redirect and intact email DNS records.
- [ ] All 20 content routes return 200; a missing URL returns the custom 404 with status 404.
- [ ] PDF opens/downloads, all images load, menus and links work on actual phones.
- [ ] Successful email arrives, failure is honest, retry is controlled and native spam limits work.
- [ ] Privacy policy matches activated services; consent behaves as described.
- [ ] Sitemap submitted and important URLs inspected in Search Console.
- [ ] Confirm preview indexing controls, production noindex absence, CSP and browser console.
- [ ] Verify rollback to the previous known-good deployment.
