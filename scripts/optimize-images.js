/**
 * Generates WebP variants under src/assets/optimized/ and a manifest for Eleventy.
 * Run: node scripts/optimize-images.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src", "assets", "images");
const OUT_DIR = path.join(ROOT, "src", "assets", "optimized");
const MANIFEST_PATH = path.join(ROOT, "src", "_data", "optimized-images.json");

/** @type {{ file: string, widths: number[] }[]} */
const JOBS = [
  { file: "hero-bg-mobile.jpg", widths: [640, 828] },
  { file: "hero-bg.jpg", widths: [1280, 1920] },
  { file: "about-mobile.jpg", widths: [400, 800] },
  { file: "about.jpg", widths: [800, 1200] },
  { file: "andton.jpg", widths: [384, 480] },
  { file: "logo.png", widths: [140, 280] },
  { file: "the-space-default.png", widths: [400, 520] },
  { file: "phonebooth.JPG", widths: [400, 520] },
  { file: "qr1.jpg", widths: [400, 520, 1200] },
  { file: "qr2.jpg", widths: [400, 520, 1200] },
  { file: "qr3.jpg", widths: [400, 520, 1200] },
  { file: "cs1.jpg", widths: [400, 520, 1200] },
  { file: "cs2.jpg", widths: [400, 520, 1200] },
  { file: "cs3.png", widths: [400, 520, 1200] },
  { file: "cs4.jpg", widths: [400, 520, 1200] },
  { file: "cs5.png", widths: [400, 520, 1200] },
  { file: "cs6.jpg", widths: [400, 520, 1200] },
  { file: "cs7.png", widths: [400, 520, 1200] },
  { file: "og-image.png", widths: [1200] },
];

function assetKey(file) {
  return `images/${file.replace(/\\/g, "/")}`;
}

function outBaseName(file) {
  return path.basename(file, path.extname(file));
}

async function main() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error("Missing sharp. Run: npm install --save-dev sharp");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  /** @type {Record<string, { width: number, height: number, url: string }[]>} */
  const manifest = { images: {} };

  for (const job of JOBS) {
    const inputPath = path.join(SRC_DIR, job.file);
    if (!fs.existsSync(inputPath)) {
      console.warn(`skip (missing): ${job.file}`);
      continue;
    }

    const base = outBaseName(job.file);
    const key = assetKey(job.file);
    manifest.images[key] = [];

    for (const width of job.widths) {
      const outName = `${base}-${width}w.webp`;
      const outPath = path.join(OUT_DIR, outName);
      const pipeline = sharp(inputPath).rotate().resize({
        width,
        withoutEnlargement: true,
      });
      const { width: w, height: h } = await pipeline
        .webp({ quality: 82, effort: 4 })
        .toFile(outPath);

      const url = `/assets/optimized/${outName}`;
      manifest.images[key].push({ width: w, height: h, url });
      const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
      console.log(`  ${outName} (${kb} KiB)`);
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nWrote ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
