# SEO + indexability (built-in, data-driven)

How to keep SEO metadata, canonical URLs, and indexability templates correct and data-driven.

---

## 1) Page-level metadata via front matter

For the landing page, use front matter like:

- `title`
- `description`
- (optional) flags like `hideFooterCta`

Keep the “how titles are composed” logic in the base layout (as in this repo).

---

## 2) Canonical + OpenGraph/Twitter are layout concerns

The layout can compute canonical from:

- `site.seo.siteUrl` + `page.url`

And set global OG/Twitter defaults from `site.config.json`.

---

## 3) `sitemap.xml` and `robots.txt` are templates

This repo generates:

- `src/sitemap.xml.njk` (permalinked to `/sitemap.xml`)
- `src/robots.txt.njk` (permalinked to `/robots.txt`)

Best practice:

- keep these as templates so they stay correct as routes/data change
- exclude from collections via `eleventyExcludeFromCollections: true`
