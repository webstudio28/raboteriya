# 11ty landing page template — architecture index

This folder holds the **reusable architectural patterns** for a one-page landing template (not tied to any specific project content). Treat it as the project “bible.”

## Principles (what makes this setup scalable)

- **Data-first content**: keep copy/structure in `src/_data/*.json` (and computed data in `src/_data/*.js`), so templates stay “dumb”.
- **Componentized pages**: the page file (`src/index.njk`) is a thin composition layer that only includes section partials.
- **Single source of truth for brand + SEO**: one config file drives nav, contact details, brand colors, and default SEO.
- **Performance by default**: responsive images (`srcset`/`sizes`), preloading for LCP, and an explicit Tailwind build.

## Reference structure to copy for a new landing template

Recommended minimal structure for a one-page landing (based on this repo’s structure):

```text
.
├─ .eleventy.js
├─ package.json
├─ tailwind.config.js
├─ scripts/
│  ├─ optimize-images.js
│  └─ generate-responsive-images.js
└─ src/
   ├─ index.njk
   ├─ sitemap.xml.njk
   ├─ robots.txt.njk
   ├─ _data/
   │  ├─ site.config.json
   │  ├─ site.js
   │  └─ home.json
   ├─ _layouts/
   │  └─ base.njk
   ├─ _includes/
   │  ├─ macros/
   │  │  └─ ui.njk
   │  └─ sections/
   │     ├─ home-hero.njk
   │     ├─ home-about.njk
   │     └─ ...
   └─ assets/
      ├─ css/
      │  └─ tailwind.css
      ├─ images/
      └─ js/
```

## Document map

| Doc | Content |
|-----|---------|
| [01-data-architecture.md](./01-data-architecture.md) | JSON/JS data: site config, computed data, page content, rich text |
| [02-template-composition.md](./02-template-composition.md) | Base layout, page file, macros (Nunjucks) |
| [03-alignment.md](./03-alignment.md) | Mobile + desktop layout and alignment patterns |
| [04-styling-theming.md](./04-styling-theming.md) | Tailwind build, brand colors, CSS variables |
| [05-assets-performance.md](./05-assets-performance.md) | Passthrough, responsive images, LCP |
| [06-seo-indexability.md](./06-seo-indexability.md) | Canonical, OG/Twitter, sitemap, robots |
| [07-environment-deployment.md](./07-environment-deployment.md) | .env, pathPrefix, secrets |
| [08-recipe-and-checklist.md](./08-recipe-and-checklist.md) | How to build a landing + copy/paste checklist |
