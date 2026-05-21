const path = require("path");
const fs = require("fs");

function loadOptimizedManifest() {
  const manifestPath = path.join(__dirname, "src", "_data", "optimized-images.json");
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch {
    return { images: {} };
  }
}

function assetKeyFromSrc(src) {
  if (!src) return "";
  return src.replace(/^\/assets\//, "").replace(/^\//, "");
}

function getVariants(manifest, src, maxWidth) {
  const key = assetKeyFromSrc(src);
  let list = manifest.images[key];
  if (!list || !list.length) return null;
  list = [...list].sort((a, b) => a.width - b.width);
  if (maxWidth > 0) {
    list = list.filter((v) => v.width <= maxWidth);
    if (!list.length) {
      list = manifest.images[key].slice(-1);
    }
  }
  return list;
}

module.exports = function (eleventyConfig) {
  // Allow access from phone/other devices on same WiFi
  eleventyConfig.setServerOptions({
    showAllHosts: true, // print local network URL for device testing
    watch: ["_site/**/*.css"], // pick up Tailwind rebuilds
  });

  // Passthrough copy: src/assets → _site/assets (exclude Tailwind source; browser uses compiled styles.css)
  eleventyConfig.addPassthroughCopy({
    "src/assets": "assets",
    filter: ["**/*", "!**/css/tailwind.css"],
  });

  // Favicon at site root so browsers and crawlers find it without any path guessing
  eleventyConfig.addPassthroughCopy({ "src/favicon.png": "favicon.png" });
  eleventyConfig.addPassthroughCopy({ "src/.htaccess": ".htaccess" });

  // Watch data so menu/config changes trigger rebuild (no need to run build manually)
  eleventyConfig.addWatchTarget("src/_data");

  // For sitemap lastmod
  eleventyConfig.addGlobalData("buildDate", () => new Date().toISOString().slice(0, 10));
  // Bust stylesheet cache on each build (dev + production)
  eleventyConfig.addGlobalData("stylesheetVersion", () => String(Date.now()));

  const optimizedManifest = loadOptimizedManifest();

  eleventyConfig.addFilter("imgPicture", (src, maxWidth) => {
    const list = getVariants(optimizedManifest, src, Number(maxWidth) || 0);
    if (!list || !list.length) return null;
    const largest = list[list.length - 1];
    const srcset = list.map((v) => `${v.url} ${v.width}w`).join(", ");
    return {
      srcset,
      fallback: largest.url,
      width: largest.width,
      height: largest.height,
    };
  });

  eleventyConfig.addFilter("optImg", (src, maxWidth) => {
    const list = getVariants(optimizedManifest, src, Number(maxWidth) || 520);
    if (!list || !list.length) return src;
    return list[list.length - 1].url;
  });

  eleventyConfig.addFilter("optGalleryUrl", (src) => {
    const list = getVariants(optimizedManifest, src, 1200);
    if (!list || !list.length) return src;
    const best = list[list.length - 1];
    return best.url;
  });

  // pathPrefix from env (for subfolder hosting)
  const pathPrefix = process.env.PATH_PREFIX || "/";

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    pathPrefix,
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
  };
};
