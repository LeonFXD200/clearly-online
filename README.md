# Clearly Online

Independent web design, local SEO and website care for Sevenoaks and Kent. Original charcoal, ivory and tangerine design with the owner's supplied portrait.

Live: https://leonfxd200.github.io/clearly-online/

## Build and preview

Requires Node.js 20+ to regenerate the HTML. Install the small development dependency before the first build.

```sh
npm ci
npm run build
npm test
python -m http.server 8000
```

Open http://localhost:8000. The output is plain HTML, CSS and JavaScript. GitHub Pages needs no server-side runtime. Navigation, page content, prices and FAQs remain available without JavaScript; the calculator, price toggle and email-draft tool are enhancements. With JavaScript unavailable, the form submit button stays disabled and a direct email link remains available.

## Editing

- `site.config.mjs`: public brand, current canonical URL, approved email address and optional public founder name.
- `build.mjs`: page copy, pricing packages, audience pages, shared header/footer and metadata. Run the build after edits; commit the resulting HTML, `llms.txt` and sitemap too.
- `styles.css`: responsive layouts and brand tokens. Containers have bounded widths without viewport-derived internal padding, including at 4K.
- `script.js`: menu, pricing switch, cost comparison and local email-draft generation.
- `minify-assets.mjs`: creates the CSS and JavaScript files used by the public pages. The source CSS was already compact, so its extra size reduction is small; the JavaScript reduction is more visible.
- `verify.mjs`: checks page titles/descriptions, H1s, branding, structured-data syntax, canonical targets, local links/anchors and asset budgets.

Pages: home, web design, local SEO, hosting/care, pricing, about, contact and website privacy, plus audience pages for trades, appointment-led businesses and local professional services. A custom 404 is included. There are no fictional client projects, reviews, awards, addresses or ranking claims.

The Websites navigation uses a native disclosure with direct links to design/redesigns and all three audience pages. On phones, the menu opens in the document flow. Escape closes the innermost open disclosure, and focus leaving the header closes it without taking focus back. The skip link targets a focusable main region, and controls use two-colour focus indicators on light and dark sections.

## Publish on GitHub Pages

The repository serves the root of the `main` branch. Build and test, then commit and push to main. Check the Pages deployment completes and inspect the public site. Relative internal links work beneath the repository path. `.nojekyll` preserves the static output.

The repository and GitHub Pages path use the Clearly Online name.

## Contact and privacy

Public email approved by the owner: `leonfxdupree@gmail.com`.

The form prepares a `mailto:` draft addressed to that email. It **does not send email**, submit to a backend, store form contents, or prove message delivery. Visitors open their email app and send the message there, or copy the prepared brief into an email. Long `mailto:` URLs can be limited by email clients, so the full brief is always shown as a fallback.

Pricing links carry the chosen package and payment model into the enquiry form. A Copy enquiry button provides a clipboard action, with manual text selection if clipboard access is unavailable. Editing any enquiry field hides the previous prepared draft until it is rebuilt, so the email link cannot silently use outdated details. Existing website addresses can be entered without `https://`.

No external form provider, analytics, advertising scripts, tracking cookies or embedded maps are installed. Images and fonts are served locally. GitHub infrastructure may retain technical access logs under its own policy. The privacy page describes this current setup, not a comprehensive future business policy.

Before introducing a backend form: choose the receiving provider, configure anti-spam protection and delivery credentials privately, update the privacy information with the controller/contact, purpose, retention and provider details, then test real delivery and failure states. Never commit API secrets.

## Pricing model

Owner-approved guide prices are retained:

| Package | Build | Managed per month | Setup | Managed year one |
| --- | ---: | ---: | ---: | ---: |
| Starter | £795 | £99 | £195 | £1,383 |
| Business | £1,495 | £159 | £295 | £2,203 |
| Growth | from £2,495 | from £239 | £395 | from £3,263 |

The more detailed service model is a proposal to support quoting, not an executed agreement: one-off build uses a proposed 50/50 payment schedule; managed is 12 months from launch plus setup, with hosting/care and 30 minutes of small edits monthly. Standalone care starts at £39/month; optional SEO support starts at £180/month. The calculator explains that 24-month estimates assume current rates continue, not a rate guarantee.

Confirm capacity and commercial terms with the owner before contracting: VAT status, final scope, third-party costs, licence restrictions, cancellation/notice, early-exit settlement, backup schedules, support hours and handover/migration obligations. These are explicitly subject to a written proposal on the website. There is no checkout or purchase acceptance on this site.

## SEO implemented

- Static, crawlable content with separate substantive service pages and internal links.
- Unique titles, meta descriptions, canonical URLs and one primary heading per page.
- Open Graph/Twitter metadata and a 1200 × 630 original social card.
- Organization, WebSite, WebPage, BreadcrumbList and relevant Service JSON-LD; no invented LocalBusiness address or review/rating markup.
- XML sitemap of the ten public marketing pages. The utility privacy page and 404 have `noindex`.
- A project-level `llms.txt` summarises the actual pages and commercial details. Pages link to it with `rel="describedby"`. This is an optional discovery format, not a guarantee of inclusion in assistant answers.
- Public pages use minified CSS and JavaScript. Readable source files remain in the repository.
- Responsive layouts, reduced-motion support, explicit image dimensions, a lightweight initial portrait, lazy-loaded large portrait and self-hosted Manrope.
- Local copy reflects actual service areas rather than cloned town landing pages.

Important: a project-level `robots.txt` under `/clearly-online/` is **not** the origin-root robots file search engines use. A live check of `https://leonfxd200.github.io/robots.txt` returned 404. The project file is ready for a future custom domain; on the current GitHub Pages address, submit the sitemap directly through a verified URL-prefix Search Console property. No Google Search Console submission or Business Profile creation has been performed by this build.

## Owner follow-up / custom domain

1. Choose and buy an available domain after checking the name is suitable for use. No domain is claimed or purchased here.
2. Configure it in GitHub Pages and the registrar DNS using GitHub's current instructions; confirm HTTPS.
3. Update `url` in `site.config.mjs` with the new canonical HTTPS origin and trailing slash, rebuild and redeploy. Canonicals, schema, social URLs, 404 links and sitemap will update together. GitHub Pages domain configuration may create a `CNAME` file.
4. Verify the domain or URL-prefix property in Google Search Console and submit `sitemap.xml`. Inspect key URLs and monitor indexing. Re-submit after a domain migration.
5. Add a Google Business Profile only if the business meets Google's eligibility rules. Use genuine business details and reviews; never invent a premises address.
6. Add real, permissioned project case studies as work is completed. Revisit content and search performance over time.
7. If analytics is desired, choose a provider and consent/privacy approach before installation. There is currently no analytics ID.

Search rankings, indexing, rich results and customer enquiries are not guaranteed by technical checks. No Lighthouse score or field Core Web Vitals result is claimed.

References: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [local ranking guidance](https://support.google.com/business/answer/7091?hl=en), [Business Profile eligibility](https://support.google.com/business/answer/3038177?hl=en).

## Assets

The owner supplied `assets/founder.png` for public use. Its two optimised JPEG derivatives preserve the same photo without retouching. The original remains available for future exports. Manrope is self-hosted from Google Fonts; its SIL Open Font License is included in `assets/Manrope-LICENSE.txt`. Logos, favicon and social cover are original code-created brand artwork, not copied reference-site assets.
