# Styling + theming (Tailwind + CSS variables)

How to compile Tailwind and drive brand colors from config so palette changes don’t require template edits.

---

## 1) Compile Tailwind (don’t rely on CDN)

This repo uses:

- Tailwind entry: `src/assets/css/tailwind.css`
- Build output: `_site/assets/css/styles.css` via `npm run css:build`
- Dev workflow: `npm run dev` runs `css:watch` + `eleventy --serve` in parallel

---

## 2) Brand colors as runtime tokens

The layout writes CSS variables from config:

- `--color-brand-primary`
- `--color-brand-secondary`
- `--color-brand-accent`

Tailwind is configured to map `colors.brand.*` to those CSS variables.

Why this is great for templates:

- switching brand palette = edit JSON only
- no Tailwind rebuild is required for simple palette tweaks (still recommended for full release flow)
