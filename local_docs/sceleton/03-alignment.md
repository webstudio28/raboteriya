# Alignment (mobile + desktop)

Consistent alignment patterns so content stays readable and on-grid on all viewports.

---

## 1) Page and section containment

- **Content width**: All main content lives inside `.container-custom`, defined in `src/assets/css/tailwind.css` as:
  - `max-w-screen-xl mx-auto px-4 md:px-6`
- **Effect**: Content is centered with horizontal margins; mobile gets `px-4`, desktop `md:px-6`. No full-bleed text; everything aligns to the same max width.
- **Section spacing**: `.section-padding` = `py-16 md:py-24` — more vertical padding on desktop.

Use this on every section: wrap section content in `<section class="section-padding"><div class="container-custom">...</div></section>`.

---

## 2) Hero: center on mobile, left on desktop

Hero (`home-hero.njk`) switches alignment by breakpoint:

- **Section**: `flex items-start lg:items-center` — content starts at top on mobile, vertically centered on large screens.
- **Inner layout**: `flex flex-col sm:flex-row items-center` — single column on mobile, side‑by‑side from `sm` up; cross-axis centered.
- **Text block**: `text-center sm:text-left` — headings and copy centered on small screens, left-aligned from `sm` up.
- **Eyebrow and CTAs**: `justify-center sm:justify-start` and `items-center sm:items-start` so they follow the same center → left transition.

Pattern: **mobile = centered; desktop = left-aligned** for hero copy and actions.

---

## 3) Two-column sections (e.g. About): stack then grid, optional order

About-style sections use:

- **Wrapper**: `flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:items-center`
  - Mobile: stacked (column), natural source order.
  - Desktop: two equal columns, items vertically centered.
- **Order swap**: Image `order-2 lg:order-1`, text `order-1 lg:order-2` so on mobile the text block appears first, then the image; on desktop the order can match design (e.g. image left, text right).
- **CTA**: `flex justify-end` keeps the section CTA aligned to the end of the text column (right on desktop).

---

## 4) Card grids: horizontal scroll on mobile, real grid on desktop

Sections with cards (practice areas, court practice, articles) use:

- **Desktop**: `lg:grid lg:grid-cols-3 lg:gap-4` (or `sm:grid-cols-2 lg:grid-cols-3`) so cards sit in a proper grid.
- **Mobile**: `overflow-x-auto scrollbar-hide` + inner `flex gap-4` with cards having `min-w-[280px]` so the row scrolls horizontally and doesn’t squash cards.
- **Grid participation on desktop**: Inner wrapper uses `flex gap-4 lg:contents` so on `lg` the card elements become direct grid children; on smaller screens they stay in a flex row.

Result: one row of scrollable cards on mobile, aligned multi-column grid on desktop.

---

## 5) Header and footer

- **Header**: `container-custom flex items-center justify-between` — logo and nav/CTA aligned to the same container edges; nav is `hidden lg:flex`, mobile menu is `lg:hidden`.
- **Footer**: `grid gap-8 sm:grid-cols-2 md:grid-cols-4` — columns stack on mobile, then 2 then 4 columns. Footer content uses the same `container-custom` for horizontal alignment with the rest of the site.
- **Footer CTA strip**: `flex flex-col gap-3 md:flex-row md:items-center md:justify-between` — stacked on mobile, single row with space-between on desktop.

---

## 6) Section headers and CTAs

- **Section titles** (macro `sectionHeader`): `text-left` — section headings are consistently left-aligned; eyebrow and subtitle follow.
- **Section-level CTA**: Often `flex justify-end` in the text column so the button aligns to the end (right in LTR).

---

## 7) Narrow, centered content (forms, thank-you)

For forms or short messages (e.g. thank-you page):

- **Wrapper**: `max-w-3xl mx-auto px-4 text-center` (or without `text-center` for form layout).
- Content stays within a readable line length and is centered in the viewport.

---

## Summary table

| Context              | Mobile                          | Desktop / large                |
|----------------------|----------------------------------|--------------------------------|
| Page content         | `container-custom` (px-4)        | Same container (px-6)          |
| Hero text + CTAs     | Center (text-center, justify-center) | Left (text-left, justify-start) |
| Two-column sections  | Stacked (flex-col), optional order   | Grid 2 cols, items-center      |
| Card sections       | Horizontal scroll (flex, min-width)  | Grid 2–3 cols                  |
| Footer               | 1 column                         | 2–4 columns (sm/md breakpoints) |
| Narrow blocks        | max-w-3xl mx-auto                 | Same                           |
