(function () {
  var toggle = document.getElementById("mobile-menu-toggle");
  var menu = document.getElementById("mobile-menu");
  var backdrop = document.getElementById("mobile-menu-backdrop");
  var body = document.body;
  var links = document.querySelectorAll(".mobile-menu-link");
  var closeTimer = null;

  function openMenu() {
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
    toggle.classList.add("active");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    menu.removeAttribute("hidden");
    menu.classList.add("translate-x-full");
    menu.classList.remove("translate-x-0");
    menu.setAttribute("aria-hidden", "false");
    if (backdrop) {
      backdrop.removeAttribute("hidden");
      backdrop.setAttribute("aria-hidden", "false");
    }
    body.style.overflow = "hidden";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        menu.classList.remove("translate-x-full");
        menu.classList.add("translate-x-0");
        if (backdrop) {
          backdrop.classList.remove("opacity-0", "pointer-events-none");
          backdrop.classList.add("opacity-100", "pointer-events-auto");
        }
      });
    });
  }

  function closeMenu() {
    toggle.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.classList.add("translate-x-full");
    menu.classList.remove("translate-x-0");
    menu.setAttribute("aria-hidden", "true");
    if (backdrop) {
      backdrop.classList.add("opacity-0", "pointer-events-none");
      backdrop.classList.remove("opacity-100", "pointer-events-auto");
      backdrop.setAttribute("aria-hidden", "true");
    }
    body.style.overflow = "";

    closeTimer = window.setTimeout(function () {
      menu.setAttribute("hidden", "");
      if (backdrop) backdrop.setAttribute("hidden", "");
      closeTimer = null;
    }, 320);
  }

  var closeBtn = document.getElementById("mobile-menu-close");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      if (menu.classList.contains("translate-x-full")) openMenu();
      else closeMenu();
    });
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (backdrop) backdrop.addEventListener("click", closeMenu);
    links.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.classList.contains("translate-x-full")) closeMenu();
    });
  }
})();
