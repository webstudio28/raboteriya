# Template composition (Nunjucks best practices)

How to structure layouts, pages, and reusable UI so the landing stays maintainable.

---

## 1) Base layout does “site chrome” + SEO

`src/_layouts/base.njk` is responsible for:

- `<head>` SEO (title resolution, canonical, OG/Twitter)
- loading CSS
- header + nav + footer
- optional layout flags (e.g. `hideFooterCta`)
- setting CSS variables from `site.colors` (see [04-styling-theming.md](./04-styling-theming.md))

Best practice: keep **SEO and chrome** in the layout so pages only set front matter (`title`, `description`, etc.).

---

## 2) Page file is composition-only: `src/index.njk`

Pattern:

- front matter selects layout and page metadata
- page content is mostly:
  - `{% include "sections/home-*.njk" %}`

This is ideal for a landing page because you can:

- reorder sections safely
- reuse sections across templates
- keep diffs small and predictable

---

## 3) Use macros for repeated UI patterns

This repo keeps small reusable UI helpers in `src/_includes/macros/ui.njk` (example: `sectionHeader()`).

Guideline:

- **macros** for small repeatable UI fragments (headers, badges, cards)
- **section partials** for medium/large page blocks (hero, features, FAQ)
