# Deployment and GoDaddy domain connection

## Recommended host

**Netlify**, using the static `dist/` output plus the included serverless contact function. This fits the site's static pages, clean URLs, HTTPS, security headers, Git deployments and rollback requirements without a server to maintain. Resend is the proposed email-delivery service; Josh must confirm the actual recipient and sender. Pricing and account limits must be checked when choosing a plan.

Reference documentation: [Netlify Functions](https://docs.netlify.com/build/functions/overview/), [function API and rate limits](https://docs.netlify.com/build/functions/api/), [Resend email API](https://resend.com/docs/api-reference/emails/send-email). These support the integration prepared here; no account has been created or configured.

## 1. Review and approve publication

Complete the launch checklist first. Publishing to a provider URL is still a production deployment, even before connecting the domain. This brief requires Josh's approval before publishing. Nothing here authorises live DNS changes.

## 2. Deploy the code after approval

Create a Git repository for the contents of this project directory, including `public/`, `src/`, scripts, the function, documentation and the prebuilt PDF/PNGs. Keep `.env` files out of Git. Connect that repository to an approved Netlify account.

Settings are in `netlify.toml`:

- Node version: **24**
- Build command: `node scripts/build.ts`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

Do not add a catch-all rewrite to `index.html`: this is a multipage site, and missing URLs must return 404. The generated `404.html` is the custom error page. Verify clean routes and slash normalisation on the provider before launching.

For a static-only alternate host, upload `dist/`, configure clean routes and the actual 404 response, and translate `_headers` into that provider's header configuration. The Netlify contact function must be replaced or hosted separately; keep `contactEnabled:false` until that works. A drag-and-drop upload of only `dist/` does **not** deploy the server-side function.

## 3. Connect cybersafesw.com in GoDaddy

Add the domain in the host's domain-management screen. Choose **cybersafesw.com** as the primary, non-www domain; redirect **www.cybersafesw.com** to it.

Get the **exact current DNS values from the selected host's instructions for this site**. Depending on the host, the apex may use A records, an ALIAS/ANAME equivalent or host-managed DNS; www commonly uses a CNAME. GoDaddy's supported record types and the provider's requirements must be checked at the time of setup. Do not invent or reuse a generic DNS target.

Before editing, export or record existing DNS. Preserve any existing MX, SPF, DKIM, DMARC and service verification records. Make only the approved website record changes. Nameserver replacement is optional and must not be done without a deliberate review of all current services. Do not transfer the domain.

After propagation, verify both domain variants and their redirect behaviour. Obtain a certificate through the host's HTTPS provisioning; confirm the correct domain names are covered and HTTP redirects to HTTPS. `Strict-Transport-Security` is supplied for HTTPS responses; the local HTTP preview intentionally omits it.

## 4. Activate real contact delivery

1. Finish setting up **contact@cybersafesw.com** in GoDaddy and verify that it can send, receive and reply to messages from another provider. This is the owner-selected recipient; mailbox verification is still pending.
2. Create the chosen sending-provider account. For Resend, use a dedicated sending subdomain such as **forms.cybersafesw.com** and verify it using the exact records supplied by Resend. Keep receiving email with GoDaddy. Do not replace the root domain's existing mailbox MX records or enable Resend receiving for the main domain. A sending-provider MX record at a separate subdomain serves a different purpose from your main inbox's MX record.
3. Set server-side environment variables: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `SITE_ORIGIN`. `SITE_ORIGIN` must equal the precise HTTPS origin visitors submit from, normally `https://cybersafesw.com`.
4. Confirm the native function's rate limit is available/enforced on the selected plan: five requests per 60 seconds per IP/domain. Honeypot and submission timing checks are also implemented. Review stronger bot controls if real abuse warrants them.
5. Use a private or restricted test deployment approved by Josh. Set its exact origin for that environment. Do not weaken production origin checks to accept arbitrary sites.
6. Test a genuine enquiry with controlled information. Verify provider acceptance, arrival in the recipient inbox, reply-to behaviour and spam placement. Confirm provider failure never shows success.
7. Test retry behaviour. The same UUID is passed to Resend as an idempotency key, protecting against duplicate requests within the provider's supported idempotency window. Reloading the page starts a new enquiry. There is no durable enquiry database.
8. Set `business.contactEnabled:true` in `src/config.ts`, rebuild, deploy the approved source, and re-test. The UI only records `generate_lead` after a genuine success response.
9. Review the privacy policy to reflect actual hosting, email processing, retention and assessment evidence handling. Do not enable collection before this review.

Suggested actual values after domain verification:

| Environment variable | Value |
| --- | --- |
| `RESEND_API_KEY` | The sending API key created in Resend; store privately in Netlify with Functions scope |
| `CONTACT_TO_EMAIL` | `contact@cybersafesw.com` |
| `CONTACT_FROM_EMAIL` | `CyberSafe SW Website <enquiries@forms.cybersafesw.com>` only after verifying that sending subdomain |
| `SITE_ORIGIN` | `https://cybersafesw.com` |

The sender is an application sending identity, not an additional GoDaddy mailbox you must purchase. The enquiry sets the visitor's email as reply-to. The website already displays the intended public email; set `emailReady:true` only when that inbox is verified. Form sending remains a separate `contactEnabled` switch.

The function returns 503 when required email settings are missing. It sends a plain-text email, does not intentionally log personal data, and never exposes the API key to the frontend. Successful acceptance by Resend does not guarantee eventual inbox delivery; provider delivery events should be monitored separately.

## 5. Measurement and Search Console

Create a GA4 property only if desired. Set its real `G-...` measurement ID in `src/config.ts`; update privacy disclosures and test consent before publishing that change. Analytics remains off until permission is granted. Configure `generate_lead` as a key event and check `click_phone`, `click_email`, `view_checkup_service` and `select_service` as appropriate. A phone click is an interaction, not proof of a completed call. Enhanced Measurement settings must be reviewed so unwanted collection is not introduced.

For Search Console, add a domain property and use Google's supplied TXT verification record in GoDaddy. Preserve existing TXT records. Submit **https://cybersafesw.com/sitemap.xml** after the approved domain is live and HTTPS works. Inspect the homepage, flagship and both audience pages. Reference: [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## 6. Live acceptance checks

Check every route, the sitemap and robots.txt; confirm non-www canonical URLs, successful 200 responses, real 404 responses, www redirects, HTTPS and security headers. Verify PDF/PNG MIME types, the report download, mobile menu, keyboard access, reduced motion, telephone links and all quote prefills. Check form delivery and failure, consent and events. Run deployed Lighthouse/mobile testing; local checks do not establish real-user Core Web Vitals.

If a private preview is exposed before launch, keep it access-restricted or apply preview-specific noindex/X-Robots-Tag. The production build deliberately has no accidental noindex on its 20 content pages. Robots rules alone do not provide access control.

## 7. Rollback

Retain the previous successful deployment and source commit. If a problem appears, use the host's deployment rollback to restore that version; do not change DNS to fix a code error. Verify that the restored version includes its compatible function and assets. Review environment values separately because source rollback may not roll them back. Record what failed, correct it locally and re-test before a new approved deployment.
