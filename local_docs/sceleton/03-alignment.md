# Alignment (mobile + desktop)

Consistent **containment** and **alignment** patterns so content stays on-grid and readable. Section **layout** and **elements** (e.g. two columns, cards, custom blocks) are **not** fixed here—each section can use its own layout; this doc defines the shared rules only.

---

## 1) Page and section containment (required)

Every section must respect the same horizontal bounds and vertical rhythm.

- **Content width**: All main content lives inside `.container-custom`, defined in `src/assets/css/tailwind.css` as:
  - `max-w-screen-xl mx-auto px-4 md:px-6`
- **Effect**: Content is centered with horizontal margins; mobile gets `px-4`, desktop `md:px-6`. No full-bleed text; everything aligns to the same max width.
- **Section spacing**: `.section-padding` = `py-16 md:py-24` — more vertical padding on desktop.

**Rule:** Wrap every section’s content in `<section class="section-padding"><div class="container-custom">...</div></section>`. Full-bleed visuals (e.g. hero background) can sit outside the container; the *content* still uses `container-custom` where appropriate.

---

## 2) Header and footer

- **Header**: `container-custom flex items-center justify-between` — logo and nav/CTA use the same container edges; nav is `hidden lg:flex`, mobile menu is `lg:hidden`. Header aligns with the rest of the site.
- **Footer**: Same `container-custom` for horizontal alignment. Use a responsive grid (e.g. `grid gap-8 sm:grid-cols-2 md:grid-cols-4`) so columns stack on mobile and spread on desktop.
- **Footer CTA strip**: `flex flex-col gap-3 md:flex-row md:items-center md:justify-between` — stacked on mobile, single row with space-between on desktop.

---

## 3) Section headers and text alignment

- **Section titles** (e.g. from `sectionHeader` macro): Use `text-left` so section headings are consistently left-aligned; eyebrow and subtitle follow.
- **Section-level CTAs**: Align with the content (e.g. `flex justify-end` when the CTA should sit at the end of a block).
- **General**: Prefer one consistent text alignment per section (all left, or all center) unless the design explicitly mixes them.

---

## 4) Optional alignment patterns (per section)

Sections can use any layout and elements you need. These are **optional** patterns, not requirements:

- **Centered content**: `flex flex-col items-center text-center` (e.g. hero, narrow blocks).
- **Left-aligned content**: `text-left` with no centering (e.g. text-heavy sections).
- **Responsive centering**: `text-center sm:text-left` and `justify-center sm:justify-start` when you want center on mobile and left on desktop.
- **Narrow, centered blocks** (forms, short messages): `max-w-3xl mx-auto px-4` with or without `text-center`.

Section **layout** (two columns, cards, custom grids, etc.) is up to the project—just keep containment (`section-padding` + `container-custom`) and align to the same horizontal grid.

---

## 5) Summary

| What | Rule |
|------|------|
| **Every section** | `section-padding` + `container-custom` around content |
| **Page content** | Same horizontal bounds: `container-custom` (px-4 mobile, px-6 desktop) |
| **Header / footer** | Same `container-custom`; header flex with space-between; footer responsive grid |
| **Section titles** | `text-left` for consistency |
| **Section layout & elements** | Not prescribed—use any layout (columns, cards, custom) per section |
