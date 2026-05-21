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

  // Watch data so menu/config changes trigger rebuild (no need to run build manually)
  eleventyConfig.addWatchTarget("src/_data");

  // For sitemap lastmod
  eleventyConfig.addGlobalData("buildDate", () => new Date().toISOString().slice(0, 10));
  // Bust stylesheet cache on each build (dev + production)
  eleventyConfig.addGlobalData("stylesheetVersion", () => String(Date.now()));

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
