(function () {
  var root = document.querySelector("[data-contact-widget]");
  if (!root) return;

  var trigger = document.getElementById("contact-widget-trigger");
  var panel = document.getElementById("contact-widget-panel");
  if (!trigger || !panel) return;

  var channelItems = panel.querySelectorAll(".contact-widget__channels > li");
  var STAGGER_MS = 140;
  var ANIM_MS = 380;

  function updateAriaLabel(open) {
    var pack = window.__I18N__ && window.__I18N__.ui;
    var locale = document.documentElement.getAttribute("data-lang") || "en";
    var labels = pack && pack[locale];
    if (!labels) return;
    trigger.setAttribute(
      "aria-label",
      open ? labels.contactWidgetClose : labels.contactWidgetOpen
    );
  }

  function hideChannels() {
    channelItems.forEach(function (li) {
      li.classList.remove("is-visible");
    });
  }

  function showChannels() {
    hideChannels();
    var total = channelItems.length;
    channelItems.forEach(function (li, index) {
      var fromBottom = total - 1 - index;
      window.setTimeout(function () {
        li.classList.add("is-visible");
      }, fromBottom * STAGGER_MS);
    });
  }

  function setOpen(open) {
    if (open) {
      panel.hidden = false;
      root.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      updateAriaLabel(true);
      requestAnimationFrame(function () {
        requestAnimationFrame(showChannels);
      });
      return;
    }

    hideChannels();
    root.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    updateAriaLabel(false);
    window.setTimeout(function () {
      if (!root.classList.contains("is-open")) panel.hidden = true;
    }, channelItems.length * STAGGER_MS + ANIM_MS);
  }

  function isOpen() {
    return root.classList.contains("is-open");
  }

  trigger.addEventListener("click", function () {
    setOpen(!isOpen());
  });

  document.addEventListener("click", function (e) {
    if (!isOpen()) return;
    if (root.contains(e.target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) setOpen(false);
  });

  document.addEventListener("raboteriya:localechange", function () {
    updateAriaLabel(isOpen());
  });
})();
