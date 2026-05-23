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
    var candidates = document.querySelectorAll('[data-scroll-anchor="' + id + '"]');
    var i;
    for (i = 0; i < candidates.length; i++) {
      var localeRoot = candidates[i].closest(".i18n-locale");
      if (!localeRoot || (!localeRoot.classList.contains("i18n-hidden") && !localeRoot.hidden)) {
        return candidates[i];
      }
    }
    var byId = document.getElementById(id);
    if (!byId) return null;
    var byIdLocale = byId.closest(".i18n-locale");
    if (byIdLocale && (byIdLocale.classList.contains("i18n-hidden") || byIdLocale.hidden)) {
      return null;
    }
    return byId;
  }

  function scrollToHash(hash, behavior, link) {
    if (!hash || hash === "#") return;
    scrollToTarget(resolveAnchorTarget(hash), behavior, link);
  }

  window.raboteriyaScrollToHash = function (hash, behavior, link) {
    if (!hash || hash === "#") return;
    var target = resolveAnchorTarget(hash);
    if (!target) return;
    if (history.pushState) {
      history.pushState(null, "", hash);
    } else {
      location.hash = hash;
    }
    scrollToTarget(target, behavior || "smooth", link);
  };

  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link || link.getAttribute("href") === "#") return;

    var hash = link.getAttribute("href");
    if (!resolveAnchorTarget(hash)) return;

    e.preventDefault();
    window.raboteriyaScrollToHash(hash, "smooth", link);
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
