(function () {
  if (!window.initInfiniteStrip) return;

  window.initInfiniteStrip({
    speed: 0.35,
    setSelector: ".extras-strip-set",
    getActiveStrip: function () {
      return document.querySelector(".i18n-locale:not(.i18n-hidden) .extras-strip") ||
        document.querySelector(".extras-strip");
    }
  });
})();
