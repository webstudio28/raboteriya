(function () {
  if (!window.initInfiniteStrip) return;

  window.initInfiniteStrip({
    speed: 0.15,
    setSelector: ".testimonials-strip-set",
    getActiveStrip: function () {
      return document.querySelector(".i18n-locale:not(.i18n-hidden) .testimonials-strip") ||
        document.querySelector(".testimonials-strip");
    }
  });
})();
