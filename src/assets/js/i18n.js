(function () {
  var STORAGE_KEY = "raboteriya-lang";
  var html = document.documentElement;
  var defaultLocale =
    (window.__I18N__ && window.__I18N__.defaultLocale) || "en";

  function getStoredLocale() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "bg") return stored;
    } catch (e) {
      /* ignore */
    }
    return defaultLocale;
  }

  function setStoredLocale(locale) {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch (e) {
      /* ignore */
    }
  }

  function applyLocale(locale) {
    if (locale !== "en" && locale !== "bg") locale = defaultLocale;

    html.lang = locale;
    html.setAttribute("data-lang", locale);

    document.querySelectorAll(".i18n-locale").forEach(function (el) {
      var elLocale = el.getAttribute("data-locale");
      if (!elLocale) return;
      el.classList.toggle("i18n-hidden", elLocale !== locale);
    });

    document.querySelectorAll(".lang-toggle__btn").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === locale;
      btn.classList.toggle("is-active", active);
      btn.classList.remove("bg-gray-900");
      btn.classList.toggle("bg-brown-900", active);
      btn.classList.toggle("text-white", active);
      btn.classList.toggle("text-gray-600", !active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    var pack = window.__I18N__;
    var modals = pack && pack.modals;
    var ui = pack && pack.ui;

    function applyStrings(map, attr) {
      if (!map || !map[locale]) return;
      document.querySelectorAll("[" + attr + "]").forEach(function (el) {
        var key = el.getAttribute(attr);
        var val = map[locale][key];
        if (val == null) return;

        if (el.id === "booking-date-label" && !el.classList.contains("text-gray-400")) {
          return;
        }
        if (el.id === "booking-time-label" && !el.classList.contains("text-gray-400")) {
          return;
        }

        if (el.tagName === "INPUT" && el.type === "hidden") {
          el.value = val;
          return;
        }
        if (el.hasAttribute("data-i18n-placeholder")) {
          el.placeholder = val;
          return;
        }
        if (
          el.hasAttribute("data-i18n-aria") ||
          el.hasAttribute("data-i18n-ui") ||
          (el.tagName === "BUTTON" && el.querySelector("svg") && attr === "data-i18n-modal")
        ) {
          el.setAttribute("aria-label", val);
          return;
        }
        if (el.hasAttribute("aria-label") && el.getAttribute("role")) {
          el.setAttribute("aria-label", val);
          return;
        }
        el.textContent = val;
      });
    }

    applyStrings(modals, "data-i18n-modal");
    applyStrings(ui, "data-i18n-ui");

    document.dispatchEvent(
      new CustomEvent("raboteriya:localechange", { detail: { locale: locale } })
    );
  }

  document.querySelectorAll(".lang-toggle__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var locale = btn.getAttribute("data-lang");
      if (!locale) return;
      setStoredLocale(locale);
      applyLocale(locale);
    });
  });

  applyLocale(getStoredLocale());
})();
