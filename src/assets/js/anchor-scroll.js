(function () {
  var EXTRA_OFFSET = -5;

  function scrollOffset() {
    var header = document.getElementById("site-header");
    return (header ? header.offsetHeight : 80) + EXTRA_OFFSET;
  }

  function scrollToTarget(target, behavior) {
    if (!target) return;
    var top =
      target.getBoundingClientRect().top + window.pageYOffset - scrollOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: behavior || "smooth" });
  }

  function scrollToHash(hash, behavior) {
    if (!hash || hash === "#") return;
    scrollToTarget(document.querySelector(hash), behavior);
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link || link.getAttribute("href") === "#") return;

    var hash = link.getAttribute("href");
    var target = document.querySelector(hash);
    if (!target) return;

    e.preventDefault();
    if (history.pushState) {
      history.pushState(null, "", hash);
    } else {
      location.hash = hash;
    }
    scrollToTarget(target, "smooth");
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
