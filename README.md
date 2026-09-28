# Clearly Online

Independent web design, local SEO and website care for Sevenoaks and Kent. Original charcoal, ivory and tangerine design with the owner's supplied portrait.

Live: https://clearlyonline.co.uk/

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
- `guides.mjs`: the website planning hub, cost guide and brief checklist. Cost examples use the same package data as the pricing page.
- `styles.css`: responsive layouts and brand tokens. Containers have bounded widths without viewport-derived internal padding, including at 4K.
- `script.js`: menu, pricing switch, cost comparison and local email-draft generation.
- `minify-assets.mjs`: creates the CSS and JavaScript files used by the public pages. The source CSS was already compact, so its extra size reduction is small; the JavaScript reduction is more visible.
- `verify.mjs`: checks page titles/descriptions, H1s, branding, structured-data syntax, canonical targets, local links/anchors and asset budgets.

Pages: home, web design, local SEO, hosting/care, pricing, about, contact and website privacy, plus audience pages for trades, appointment-led businesses and local professional services. A guides hub links to the website cost guide and project brief checklist. A custom 404 is included. There are no fictional client projects, reviews, awards, addresses or ranking claims.

The Websites navigation uses a native disclosure with direct links to design/redesigns and all three audience pages. On phones, the menu opens in the document flow. Escape closes the innermost open disclosure, and focus leaving the header closes it without taking focus back. The skip link targets a focusable main region, and controls use two-colour focus indicators on light and dark sections.

## Publish on GitHub Pages

The repository serves the root of the `main` branch. Build and test, then commit and push to main. Check the Pages deployment completes and inspect the public site. Relative internal links work beneath the repository path. `.nojekyll` preserves the static output.

The repository and GitHub Pages path use the Clearly Online name.

## Contact and privacy

Public email approved by the owner: `clearlyonlineuk@gmail.com`.

The form prepares a `mailto:` draft addressed to that email. It **does not send email**, submit to a backend, store form contents, or prove message delivery. Visitors open their email app and send the message there, or copy the prepared brief into an email. Long `mailto:` URLs can be limited by email clients, so the full brief is always shown as a fallback.

The enquiry form starts with a name, project type and short description. Business, contact, website, hosting and budget details are available in an optional disclosure. Pricing links carry the chosen package and payment model into the form and open that disclosure so the selection is visible. A Copy enquiry button provides a clipboard action, with manual text selection if clipboard access is unavailable. Editing any enquiry field hides the previous prepared draft until it is rebuilt, so the email link cannot silently use outdated details. Existing website addresses can be entered without `https://`.

No external form provider, analytics, advertising scripts, tracking cookies or embedded maps are installed. Images and fonts are served locally. GitHub infrastructure may retain technical access logs under its own policy. The privacy page describes this current setup, not a comprehensive future business policy.

Before introducing a backend form: choose the receiving provider, configure anti-spam protection and delivery credentials privately, update the privacy information with the controller/contact, purpose, retention and provider details, then test real delivery and failure states. Never commit API secrets.

## Pricing model

Owner-approved guide prices are retained:

| Package | One-off build | With 12 months hosting | With 24 months hosting |
| --- | ---: | ---: | ---: |
| Starter | £400 | £988 | £1,576 |
| Business | £500 | £1,088 | £1,676 |
| Growth | from £600 | from £1,188 | from £1,776 |

The service model is a proposal to support quoting, not an executed agreement: website builds use a proposed 50/50 payment schedule, with optional hosting and routine care at £49/month after launch. Content changes, third-party charges and new features are separate unless quoted. Optional SEO support starts at £180/month. The calculator explains that longer-term estimates assume current rates continue, not a rate guarantee.

Confirm capacity and commercial terms with the owner before contracting: VAT status, final scope, third-party costs, licence restrictions, cancellation/notice, early-exit settlement, backup schedules, support hours and handover/migration obligations. These are explicitly subject to a written proposal on the website. There is no checkout or purchase acceptance on this site.

## SEO implemented

- Static, crawlable content with separate substantive service pages and internal links.
- Unique titles, meta descriptions, canonical URLs and one primary heading per page.
- Open Graph/Twitter metadata and a 1200 × 630 original social card.
- Organization, WebSite, WebPage, BreadcrumbList and relevant Service JSON-LD; no invented LocalBusiness address or review/rating markup.
- XML sitemap of the thirteen public marketing and guide pages. The utility privacy page and 404 have `noindex`.
- A project-level `llms.txt` summarises the actual pages and commercial details. Pages link to it with `rel="describedby"`. This is an optional discovery format, not a guarantee of inclusion in assistant answers.
- Public pages use minified CSS and JavaScript with content-based cache versions. Readable source files remain in the repository.
- Responsive layouts, reduced-motion support, explicit image dimensions, a lightweight initial portrait, lazy-loaded large portrait and self-hosted Manrope.
- Local copy reflects actual service areas rather than cloned town landing pages.

The custom domain serves `robots.txt` and `sitemap.xml` at the origin root. HTTP and www URLs redirect to the canonical HTTPS non-www address. Keep the existing `.html` URLs stable; extensionless aliases use canonical metadata rather than a separate sitemap entry.

## Search setup and next improvements

1. The `clearlyonline.co.uk` domain property is verified in Google Search Console. On 27 September 2026 its submitted sitemap showed Success and 10 discovered pages before this guide expansion. Discovery does not prove indexing; inspect key URLs after deployment and use Search Console for actual indexing and query data.
2. Keep canonical URL, public email, visible business facts and prices consistent. `site.config.mjs`, package data and the generated checks centralise those values.
3. Add real, permissioned project case studies and approved business background as evidence becomes available. No owner identity or social-profile URL should be inferred from an account name.
4. Keep Google Business Profile details aligned with the live site where eligible. Use genuine business details and reviews; do not expose a residential address for SEO.
5. If analytics is desired, choose a provider and consent/privacy approach before installation. There is currently no analytics ID.

Search rankings, indexing, rich results and customer enquiries are not guaranteed by technical checks. No Lighthouse score or field Core Web Vitals result is claimed.

References: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [local ranking guidance](https://support.google.com/business/answer/7091?hl=en), [Business Profile eligibility](https://support.google.com/business/answer/3038177?hl=en).

## Assets

The owner supplied `assets/founder.png` for public use. Its two optimised JPEG derivatives preserve the same photo without retouching. The original remains available for future exports. Manrope is self-hosted from Google Fonts; its SIL Open Font License is included in `assets/Manrope-LICENSE.txt`. Logos, favicon and social cover are original code-created brand artwork, not copied reference-site assets.
