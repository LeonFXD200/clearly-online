# Release checks: Clearly Online

Checked on 23 September 2026 against the local static build.

- `npm test`: passed. Eleven content pages, 318 local links/assets, unique titles/descriptions, one H1 per page, canonical URLs, parseable JSON-LD, sitemap membership and image/font budgets.
- `git diff --check`: passed.
- Browser layouts: all eight pages have no document-level horizontal overflow at 320px and 390px. The cost table has its own intentional scroll region on narrow screens.
- Desktop visual review: homepage, portrait section and price comparison at 1280px.
- Full-screen regression: at 3840px, content remains 1500px wide; each service card is 740px; portrait stays 520 × 585px with a consistent 50% 30% crop. No full-page horizontal overflow.
- Mobile navigation opens and links to Pricing correctly.
- Managed price switch displays all three correct setup fees and first-year totals.
- Cost calculator: all 12 combinations (3 packages × 2 periods × care on/off) matched expected totals.
- Contact query-string plan selection: Business preselected correctly.
- Email brief: local test details generated the expected draft addressed to the approved public address. No email was opened or sent as part of testing. Actual email delivery is the visitor's email application's responsibility.
- Browser console: no errors or warnings during the tested pricing interactions.
- The 240px portrait is 18,870 bytes, large portrait 125,100 bytes and self-hosted variable font 24,836 bytes. No third-party font request is required.
- Audience pages cover trades, appointment-led businesses and local professional services with page-specific titles, descriptions, questions and links. The About page includes the one-sentence mission and an explanation of how it affects client work.
- HTML references `styles.min.css` and `script.min.js`. The readable source files remain for editing. The existing CSS was already compact, so minification saves only 33 bytes; JavaScript drops from 4,930 to 4,196 bytes.
- The project `robots.txt` returns 200 under its project path, but the origin-root `/robots.txt` returns 404 on the shared GitHub Pages domain. A custom domain or separately controlled account-root site is needed to fix that scanner finding at the expected location.
- This update: desktop visual review of the trades use case and About mission block; browser checks at 390px and 320px found no overflow on the three use case pages or About. All six sampled pages at 390px had one H1 and a distinct 145 to 161 character description. The minified pricing script switched all three packages to the expected monthly amounts; contact preselected Business from the URL. No browser console errors appeared.
- The reported Flow Ninja score of 69 is the owner's observation. The report URL or account was not supplied, so a new score was not measured here.

Not claimed: a complete WCAG audit, guaranteed Google indexing or rankings, live field Core Web Vitals, a Lighthouse score, or a tested server-side form delivery service. Search Console and a purchased domain remain owner follow-ups.
