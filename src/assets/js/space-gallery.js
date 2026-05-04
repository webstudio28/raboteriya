(function () {
  var root = document.getElementById("space-gallery");
  var img = document.getElementById("space-gallery-img");
  var prevBtn = document.getElementById("space-gallery-prev");
  var nextBtn = document.getElementById("space-gallery-next");
  var triggers = document.querySelectorAll("[data-space-gallery-trigger]");
  var body = document.body;
  var html = document.documentElement;
  var lastFocus = null;
  var images = [];
  var index = 0;
  var frame = root ? root.querySelector(".space-gallery__frame") : null;
  var touchStartX = null;
  var touchStartY = null;
  var SWIPE_MIN = 48;
  var SWIPE_RATIO = 0.75;

  if (!root || !img || !triggers.length) return;

  function scrollbarWidth() {
    return Math.max(0, window.innerWidth - html.clientWidth);
  }

  function lockBodyScroll() {
    var w = scrollbarWidth();
    body.style.overflow = "hidden";
    if (w > 0) body.style.paddingRight = w + "px";
  }

  function unlockBodyScroll() {
    body.style.overflow = "";
    body.style.paddingRight = "";
  }

  function parseImages(raw) {
    return (raw || "")
      .split("|")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
  }

  function isOpen() {
    return root.classList.contains("is-open");
  }

  function showIndex(i) {
    if (!images.length) return;
    index = (i + images.length) % images.length;
    img.src = images[index];
  }

  function updateNav() {
    var multi = images.length > 1;
    if (prevBtn) prevBtn.hidden = !multi;
    if (nextBtn) nextBtn.hidden = !multi;
  }

  function openGallery(title, list) {
    images = list.slice();
    if (!images.length) return;
    index = 0;
    img.alt = title || "Photo";
    showIndex(0);
    updateNav();
    lastFocus = document.activeElement;
    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    lockBodyScroll();
    var closeEl = root.querySelector("[data-space-gallery-close].space-gallery__close");
    if (closeEl) closeEl.focus();
  }

  function closeGallery() {
    if (!isOpen()) return;
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    unlockBodyScroll();
    images = [];
    img.removeAttribute("src");
    img.alt = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    lastFocus = null;
  }

  triggers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var title = btn.getAttribute("data-gallery-title") || "";
      var list = parseImages(btn.getAttribute("data-gallery-images"));
      openGallery(title, list);
    });
  });

  root.querySelectorAll("[data-space-gallery-close]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      closeGallery();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      showIndex(index - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      showIndex(index + 1);
    });
  }

  function onTouchStart(e) {
    if (!isOpen() || images.length < 2) return;
    var t = e.touches && e.touches[0];
    if (!t) return;
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }

  function onTouchEnd(e) {
    if (touchStartX == null || touchStartY == null) return;
    var t = e.changedTouches && e.changedTouches[0];
    if (!t) {
      touchStartX = null;
      touchStartY = null;
      return;
    }
    var dx = t.clientX - touchStartX;
    var dy = t.clientY - touchStartY;
    touchStartX = null;
    touchStartY = null;
    if (Math.abs(dx) < SWIPE_MIN) return;
    if (Math.abs(dy) > Math.abs(dx) * SWIPE_RATIO) return;
    if (dx < 0) showIndex(index + 1);
    else showIndex(index - 1);
  }

  function onTouchCancel() {
    touchStartX = null;
    touchStartY = null;
  }

  if (frame) {
    frame.addEventListener("touchstart", onTouchStart, { passive: true });
    frame.addEventListener("touchend", onTouchEnd, { passive: true });
    frame.addEventListener("touchcancel", onTouchCancel, { passive: true });
  }

  document.addEventListener("keydown", function (e) {
    if (!isOpen()) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeGallery();
    } else if (e.key === "ArrowLeft" && images.length > 1) {
      e.preventDefault();
      showIndex(index - 1);
    } else if (e.key === "ArrowRight" && images.length > 1) {
      e.preventDefault();
      showIndex(index + 1);
    }
  });
})();
