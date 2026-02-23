(function () {
  var header = document.getElementById("site-header");
  if (!header) return;
  function update() {
    header.classList.toggle("is-scrolled", window.scrollY > 0);
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
})();
