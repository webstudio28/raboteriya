(function () {
  var input = document.getElementById("mobile-menu-input");
  var label = document.getElementById("mobile-menu-toggle");
  var overlay = document.getElementById("mobile-menu-overlay");
  var body = document.body;
  var html = document.documentElement;

  if (!input || !label) return;

  function uiPack() {
    var pack = window.__I18N__ && window.__I18N__.ui;
    var locale = html.getAttribute("data-lang") || "en";
    return pack && pack[locale] ? pack[locale] : null;
  }

  function syncA11y() {
    var open = input.checked;
    label.setAttribute("aria-expanded", open ? "true" : "false");
    if (overlay) overlay.setAttribute("aria-hidden", open ? "false" : "true");
    var ui = uiPack();
    if (ui) {
      label.setAttribute("aria-label", open ? ui.closeMenu : ui.openMenu);
    }
  }

  function onChange() {
    if (input.checked) {
      body.style.overflow = "hidden";
      body.style.height = "100vh";
    } else {
      body.style.overflow = "";
      body.style.height = "";
    }
    syncA11y();
  }

  input.addEventListener("change", onChange);

  document.querySelectorAll(".mobile-menu-link").forEach(function (link) {
    link.addEventListener("click", function () {
      input.checked = false;
      onChange();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && input.checked) {
      input.checked = false;
      onChange();
    }
  });

  document.addEventListener("raboteriya:localechange", syncA11y);

  syncA11y();
})();
