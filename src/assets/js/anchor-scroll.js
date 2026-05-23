(function () {
  var EXTRA_OFFSET = -40;

  function scrollOffset() {
    var header = document.getElementById("site-header");
    return (header ? header.offsetHeight : 80) + EXTRA_OFFSET;
  }

  function scrollToTarget(target, behavior, link) {
    if (!target) return;
    var adjust = link ? pricingScrollAdjust(link) : 0;
    var top =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      scrollOffset() -
      adjust;
    window.scrollTo({ top: Math.max(0, top), behavior: behavior || "smooth" });
  }

  function isHeaderPricingCta(link) {
    return (
      link.classList.contains("header-cta") &&
      link.getAttribute("href") === "#pricing"
    );
  }

  function pricingScrollAdjust(link) {
    if (!isHeaderPricingCta(link)) return 0;

    var isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    var attr = isDesktop
      ? "data-pricing-scroll-adjust"
      : "data-pricing-scroll-adjust-mobile";
    var custom = parseInt(link.getAttribute(attr), 10);
    if (isNaN(custom) && !isDesktop) {
      custom = parseInt(link.getAttribute("data-pricing-scroll-adjust"), 10);
    }
    return isNaN(custom) ? 96 : custom;
  }

  function resolveAnchorTarget(hash) {
    if (!hash || hash === "#") return null;
    var id = hash.charAt(0) === "#" ? hash.slice(1) : hash;
    var inActiveLocale = document.querySelector(
      '.i18n-locale:not(.i18n-hidden) [data-scroll-anchor="' + id + '"]'
    );
    if (inActiveLocale) return inActiveLocale;
    return document.querySelector(hash);
  }

  function scrollToHash(hash, behavior) {
    if (!hash || hash === "#") return;
    scrollToTarget(resolveAnchorTarget(hash), behavior);
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link || link.getAttribute("href") === "#") return;

    var hash = link.getAttribute("href");
    var target = resolveAnchorTarget(hash);
    if (!target) return;

    e.preventDefault();
    if (history.pushState) {
      history.pushState(null, "", hash);
    } else {
      location.hash = hash;
    }
    scrollToTarget(target, "smooth", link);
  });

  window.addEventListener("hashchange", function () {
    scrollToHash(location.hash, "auto");
  });

  if (location.hash) {
    requestAnimationFrame(function () {
      scrollToHash(location.hash, "auto");
    });
  }
})();
