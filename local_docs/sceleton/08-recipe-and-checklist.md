# Recipe + landing page checklist

How to build a great one-page landing with this architecture, plus a copy/paste checklist.

---

## “Recipe” — how to build a great one-page landing with this architecture

1) **Define the product/story in `src/_data/home.json`**
   - sections, copy, lists, CTA labels, image filenames (not full HTML)

2) **Define brand/SEO/nav in `src/_data/site.config.json`**
   - name, logos, palette, `siteUrl`, default description

3) **Keep `src/index.njk` tiny**
   - only includes section partials in order

4) **Build each section as a partial in `src/_includes/sections/`**
   - read from `home.*` and `site.*`
   - use macros for repeated UI

5) **Make performance non-negotiable**
   - optimize hero + key images
   - generate responsive variants
   - add `srcset`/`sizes`
   - preload the LCP image on the landing route

6) **Ship with SEO complete**
   - canonical, OG/Twitter in layout
   - sitemap + robots templates

---

## Landing page checklist (copy/paste)

- **Architecture**
  - [ ] `site.config.json` holds brand/SEO/nav/contact
  - [ ] `site.js` exports computed `site` data
  - [ ] `home.json` holds landing content model
  - [ ] `index.njk` only composes section partials
  - [ ] UI macros exist for repeated patterns
- **Alignment (mobile + desktop)**
  - [ ] Every section uses `section-padding` + `container-custom`
  - [ ] Hero: center on mobile (`text-center`, `justify-center`), left on desktop (`sm:text-left`, `sm:justify-start`)
  - [ ] Two-column sections: `flex-col` then `lg:grid lg:grid-cols-2`; use `order-*` if content order differs by breakpoint
  - [ ] Card rows: horizontal scroll on mobile (`overflow-x-auto`, `flex`, `min-w-[...]`), `lg:grid lg:grid-cols-3` on desktop
  - [ ] Header/footer use same `container-custom`; footer CTA strip: stack on mobile, `md:flex-row md:justify-between` on desktop
- **Assets**
  - [ ] Tailwind is compiled (no Tailwind CDN in production)
  - [ ] `src/assets` is passthrough-copied
  - [ ] Hero and key images have `srcset`/`sizes`
  - [ ] LCP image is preloaded and not lazy-loaded
- **SEO**
  - [ ] canonical URL
  - [ ] OG/Twitter meta
  - [ ] `/sitemap.xml` and `/robots.txt`
- **Deployment**
  - [ ] links/assets use `| url` (supports `pathPrefix`)
  - [ ] secrets are in `.env`, not committed into templates
