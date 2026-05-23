/**
 * Concatenates site JS into one deferred bundle (order preserved).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const JS_DIR = path.join(ROOT, "src", "assets", "js");
const OUT = path.join(JS_DIR, "site.bundle.js");

const FILES = [
  "i18n.js",
  "header-scroll.js",
  "anchor-scroll.js",
  "mobile-menu.js",
  "strip-scroll.js",
  "extras-strip.js",
  "testimonials-strip.js",
  "testimonials.js",
  "faq-accordion.js",
  "faq-show-more.js",
  "discount-modal.js",
  "visit-booking-modal.js",
  "space-gallery.js",
  "community-video.js",
  "community-show-more.js",
  "contact-widget.js",
];

const parts = FILES.map((name) => {
  const file = path.join(JS_DIR, name);
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
  return `/* === ${name} === */\n${fs.readFileSync(file, "utf8")}`;
});

fs.writeFileSync(OUT, parts.join("\n\n"));
console.log(`Wrote ${OUT} (${FILES.length} files)`);
