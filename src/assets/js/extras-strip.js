(function () {
  var position = 0;
  var dragging = false;
  var startX = 0;
  var startPos = 0;
  var speed = 0.35;
  var strip = null;
  var setEl = null;
  var setWidth = 0;
  var rafId = null;

  function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function getActiveStrip() {
    return document.querySelector(".i18n-locale:not(.i18n-hidden) .extras-strip") ||
           document.querySelector(".extras-strip");
  }

  function tick() {
    if (!dragging) {
      position -= speed;
      if (setWidth > 0) {
        if (position < -setWidth) position += setWidth;
        if (position > 0) position -= setWidth;
      }
    }
    if (strip) strip.style.transform = "translateX(" + position + "px)";
    rafId = requestAnimationFrame(tick);
  }

  function onDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true;
    startX = getClientX(e);
    startPos = position;
    if (strip) strip.style.cursor = "grabbing";
    if (e.cancelable) e.preventDefault();
  }

  function onMove(e) {
    if (!dragging) return;
    if (e.cancelable) e.preventDefault();
    var x = getClientX(e);
    position = startPos + (x - startX);
  }

  function onUp() {
    dragging = false;
    if (strip) strip.style.cursor = "grab";
    if (setWidth > 0) {
      while (position < -setWidth) position += setWidth;
      while (position > 0) position -= setWidth;
    }
  }

  function attachToStrip(newStrip) {
    if (!newStrip || newStrip === strip) return;

    if (strip) {
      strip.removeEventListener("mousedown", onDown);
      strip.removeEventListener("touchstart", onDown);
      strip.removeEventListener("dragstart", preventDrag);
    }

    strip = newStrip;
    setEl = strip.querySelector(".extras-strip-set");
    setWidth = setEl ? setEl.offsetWidth : 0;

    strip.style.cursor = "grab";
    strip.style.willChange = "transform";
    position = 0;

    strip.addEventListener("dragstart", preventDrag);
    strip.addEventListener("mousedown", onDown);
    strip.addEventListener("touchstart", onDown, { passive: false });
  }

  function preventDrag(e) { e.preventDefault(); }

  function init() {
    var active = getActiveStrip();
    if (!active) return;
    attachToStrip(active);
    if (setWidth === 0) {
      window.addEventListener("load", function () {
        setWidth = setEl ? setEl.offsetWidth : 0;
      });
    }
  }

  window.addEventListener("mousemove", onMove);
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("mouseup", onUp);
  window.addEventListener("touchend", onUp);

  document.addEventListener("raboteriya:localechange", function () {
    var active = getActiveStrip();
    if (active && active !== strip) {
      attachToStrip(active);
    }
  });

  init();
  if (!rafId) rafId = requestAnimationFrame(tick);
})();
