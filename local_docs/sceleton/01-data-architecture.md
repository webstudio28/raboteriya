# Data architecture

How JSON/JS data should be used so templates stay “dumb” and content has a single source of truth.

---

## 1) Global site config: `src/_data/site.config.json`

Use this as the **only** place for:

- **Brand**: name, logos, language
- **Theme tokens**: brand colors
- **SEO defaults**: `siteUrl`, default title/description, OpenGraph/Twitter defaults
- **Navigation**: header/footer links
- **Contact**: phone(s), email, address, map embed

This repo then layers computed values on top (next section).

---

## 2) Computed global data: `src/_data/site.js`

Pattern used here:

- Import the JSON config.
- Export the merged object plus computed values (e.g. `currentYear`).

Why it’s good:

- Templates can rely on a single `site` object everywhere.
- You keep “logic” out of templates.

---

## 3) Page-specific content model: `src/_data/home.json`

For a landing page, put **section content** in one file:

- `hero`: headline pieces, CTA labels/URLs, hero images, small structured items (e.g. contact chips, benefits list)
- `about`, `features`, `socialProof`, `faq`, `cta`, etc.

Then in templates:

- `site.*` is global (brand, SEO defaults, nav, footer, contact)
- `home.*` is landing-specific (section copy and per-section data)

This keeps `src/index.njk` very small and readable.

---

## 4) Rich text: prefer Markdown files, keep metadata in JSON

This repo uses a useful hybrid for articles:

- JSON holds structure and metadata (title, slug, hero image, `contentPath`)
- Markdown lives in `src/_content/...`
- A template loads the markdown via a filter and renders it through `markdown-it`

Even for a landing page, this pattern is great for:

- long “story” sections
- legal disclaimers
- pricing details
