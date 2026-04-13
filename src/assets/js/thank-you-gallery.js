(function () {
  var root = document.querySelector("[data-thank-you-gallery]");
  if (!root) return;

  var main = root.querySelector("[data-gallery-main]");
  var thumbs = root.querySelectorAll("[data-gallery-thumb]");
  var prevBtn = root.querySelector("[data-gallery-prev]");
  var nextBtn = root.querySelector("[data-gallery-next]");

  if (!main || !thumbs.length) return;

  function getActiveIndex() {
    for (var i = 0; i < thumbs.length; i++) {
      if (thumbs[i].classList.contains("is-active")) return i;
    }
    return 0;
  }

  function setActive(thumb) {
    thumbs.forEach(function (t) {
      t.classList.remove("is-active", "ring-2", "ring-gray-900");
      t.setAttribute("aria-current", "false");
    });
    thumb.classList.add("is-active", "ring-2", "ring-gray-900");
    thumb.setAttribute("aria-current", "true");
    var src = thumb.getAttribute("data-src");
    if (src) main.setAttribute("src", src);
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      setActive(thumb);
    });
  });

  function go(delta) {
    var n = thumbs.length;
    if (!n) return;
    var i = getActiveIndex();
    var next = (i + delta + n) % n;
    setActive(thumbs[next]);
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { go(1); });
})();
