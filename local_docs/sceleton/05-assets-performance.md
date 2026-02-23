# Assets + performance workflow

What to replicate for static assets and responsive images so the landing is fast by default.

---

## 1) Passthrough copy for static assets

`.eleventy.js` copies `src/assets` to `/_site/assets` (and a few root-level files).

Template rule:

- anything that should be shipped “as-is” (images, fonts, vendor JS) should live in `src/assets/`

---

## 2) Responsive images by convention

This repo standardizes file naming:

- `hero-bg.jpg` → `hero-bg-w640.jpg`, `hero-bg-w1024.jpg`, ...
- `*-optimized.*` for smaller “production” bases

And then uses:

- `srcset` + `sizes`
- `fetchpriority="high"` / `<link rel="preload" as="image">` for the LCP hero image

Scripts to keep in your template:

- `scripts/optimize-images.js`: create `*-optimized.*` without overwriting originals
- `scripts/generate-responsive-images.js`: generate the `-w<width>` variants
