# CyberSafe SW launch status — 15 October 2026

This is the current deployment record. Earlier pre-launch notes describe preparation and are superseded by this record where deployment status differs.

## Verified

- GitHub source: https://github.com/CustardCode/CyberSafeWebsite
- Production branch: `main`.
- Approved-site pull request: https://github.com/CustardCode/CyberSafeWebsite/pull/1 (merged).
- Initial production source commit: `2cc19073a9a7def51e7a6a564791f5e889f9be9b`.
- Old source preserved on `archive/pre-launch-2026-10-15`, at `844f7c9bd14bd5172ee81eba13b4a1bd26e8d06b`.
- Netlify project: `cybersafesw`, team `custardcode` (Cyber Safe SW).
- Project ID: `7b152f94-3fbb-415b-ae2f-febd4b6ee674`.
- Dashboard: https://app.netlify.com/projects/cybersafesw/overview
- Public hosting URL: https://cybersafesw.netlify.app/
- First successful deployment: `6ad08493d817d5af7808d863`.
- Node 24, build/validation/contact tests, `dist` publishing directory, `netlify/functions` function directory.
- Production is public; deploy previews are private.
- Optional Netlify promotional badge is disabled.
- Hosted checks pass for all 20 content pages, correct canonical domain, one h1 per page, sitemap, robots.txt, CSP/HSTS, real 404, and the deployed function's method rejection.
- Downloaded PDF matches the approved 144,620-byte local PDF exactly.
- Live desktop homepage and report were inspected. Earlier local responsive/PDF QA remains in QA-REPORT.md. The in-app browser's viewport override did not change its actual 1280×720 viewport, so a new live mobile-width check has not been confirmed.
- No private environment files or credentials were uploaded. All 38 initial source/assets were checked against local Git blob hashes before committing.

## Domain connection pending

Netlify rejected adding `cybersafesw.com`: **Another project is already using this domain**. The domain's public www record points to `dynamic-lebkuchen-41a54e.netlify.app`. That project is not accessible from the connected account, and Josh does not recognise it.

A public DNS snapshot was saved locally before changes. It is not a full GoDaddy zone export. Observed apex A records were `75.2.60.5` and `99.83.190.102`; nameservers remain `ns13.domaincontrol.com` and `ns14.domaincontrol.com`. Microsoft 365 mail MX is already present. No DNS changes have been made by this launch workflow.

Josh authorised a Netlify domain-release support request. Netlify's support form requires a new, short-lived TXT proof before submission. Josh added the exact TXT record. Netlify confirmed ownership, the release request was submitted, and Josh replied to its acknowledgement. Release is still pending; the current UI continues to reject adding the domain. Use the live form's exact current record; do not invent a ticket number or assume the domain has been released.

After release, add apex/www to this project, obtain exact DNS instructions from the project, preserve mailbox/authentication DNS, choose apex as primary and confirm the www redirect and HTTPS certificate. The earlier custom domain had a certificate-name mismatch; do not bypass TLS validation.

## Email and form pending

GoDaddy screenshots confirm Microsoft 365 Email Essentials with Security, primary `joshua@cybersafesw.com`, and `contact@cybersafesw.com` as an alias routing into that mailbox. Josh tested receiving and replying successfully; the reply used the Joshua primary address and landed in the recipient’s Junk folder. He then requested Contact as the primary address and CyberSafe SW as the display name; GoDaddy is processing that change, and the new sign-in is not yet confirmed. Recovery/MFA and outgoing deliverability still need review. Josh asked us to proceed with mailto contact while the update processes.

`emailReady:true` reflects the owner-tested receiving address. Email links target `mailto:contact@cybersafesw.com`; the enquiry form opens a prefilled email draft and explicitly requires the visitor to send it in their email app. The website does not report delivery. `contactEnabled:false` keeps server-side Resend sending inactive. Phone contact works throughout. Resend is prepared in code but no sending account/domain/API key has been configured. Do not enable delivery until real arrival and reply-to are tested. See DEPLOYMENT.md. Optional analytics is disabled; Search Console verification/submission is pending the custom-domain launch.

## Future updates and rollback

1. Josh describes the change to Codex in this project.
2. Codex updates the current source in `src/` and `public/assets/`, runs the appropriate checks, and opens a pull request. Legacy root HTML/CSS/JS are retained old-site files.
3. Review the Netlify Deploy Preview linked to the pull request. It requires the appropriate Netlify access.
4. Merge the approved change to `main`; the GitHub connection triggers the production build and deployment.
5. Verify the resulting production deployment before reporting success.

For rollback, open the project's Deploys activity, choose a previously successful production deploy and use Netlify's publish/rollback control. Environment settings and DNS need separate review; code rollback does not restore them. Preserve the prior successful deployment and source history.

No GoDaddy hosting purchase, domain transfer or nameserver replacement is required for this Netlify setup.
