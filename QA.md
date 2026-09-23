# Release checks — Made Proper

Checked on 23 September 2026 against the local static build.

- `npm test`: passed. Eight content pages, 210 local links/assets, unique titles/descriptions, one H1 per page, canonical URLs, parseable JSON-LD, sitemap membership and image/font budgets.
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

Not claimed: a complete WCAG audit, guaranteed Google indexing or rankings, live field Core Web Vitals, a Lighthouse score, or a tested server-side form delivery service. Search Console and a purchased domain remain owner follow-ups.
