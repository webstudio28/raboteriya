(function () {
  var root = document.querySelector("[data-faq]");
  if (!root) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var COLLAPSED_PEEK = "5.25rem";

  function activeBlock() {
    return (
      root.querySelector("[data-locale]:not(.i18n-hidden)") ||
      root.querySelector("[data-locale]")
    );
  }

  function collapseExtra(extra, inner) {
    extra.classList.remove("is-expanded");
    if (reducedMotion) {
      inner.style.maxHeight = COLLAPSED_PEEK;
      return;
    }
    var h = inner.scrollHeight;
    inner.style.maxHeight = h + "px";
    inner.getBoundingClientRect();
    inner.style.maxHeight = COLLAPSED_PEEK;
  }

  function expandExtra(extra, inner, btn) {
    extra.classList.add("is-expanded");
    if (reducedMotion) {
      inner.style.maxHeight = "none";
      return;
    }
    var target = inner.scrollHeight;
    inner.style.maxHeight = target + "px";
    inner.addEventListener(
      "transitionend",
      function onEnd(e) {
        if (e.propertyName !== "max-height" || !extra.classList.contains("is-expanded")) return;
        inner.removeEventListener("transitionend", onEnd);
        inner.style.maxHeight = "none";
      },
      { once: false }
    );
  }

  function setButtonState(btn, expanded) {
    var label = btn.querySelector("[data-faq-expand-label]");
    btn.setAttribute("aria-expanded", expanded ? "true" : "false");
    if (label) {
      label.textContent = expanded ? btn.getAttribute("data-label-less") : btn.getAttribute("data-label-more");
    }
  }

  function closeOpenInExtra(extra) {
    extra.querySelectorAll("details.faq-item[open]").forEach(function (d) {
      d.open = false;
      var panel = d.querySelector(".faq-answer");
      if (panel) {
        panel.style.height = "";
        panel.style.transition = "";
      }
      d.removeAttribute("data-faq-busy");
    });
  }

  function bindBlock(block) {
    var extra = block.querySelector("[data-faq-extra]");
    var btn = block.querySelector("[data-faq-expand]");
    if (!extra || !btn || btn.dataset.faqExpandBound) return;

    var inner = extra.querySelector("[data-faq-extra-inner]");
    if (!inner) return;

    btn.dataset.faqExpandBound = "1";
    collapseExtra(extra, inner);

    btn.addEventListener("click", function () {
      var expanded = extra.classList.contains("is-expanded");
      if (expanded) {
        closeOpenInExtra(extra);
        collapseExtra(extra, inner);
        setButtonState(btn, false);
      } else {
        expandExtra(extra, inner, btn);
        setButtonState(btn, true);
      }
    });
  }

  function init() {
    root.querySelectorAll("[data-locale]").forEach(bindBlock);
  }

  init();

  document.addEventListener("raboteriya:localechange", function () {
    var block = activeBlock();
    if (!block) return;
    var extra = block.querySelector("[data-faq-extra]");
    var btn = block.querySelector("[data-faq-expand]");
    var inner = extra && extra.querySelector("[data-faq-extra-inner]");
    if (extra && inner && btn && !extra.classList.contains("is-expanded")) {
      collapseExtra(extra, inner);
      setButtonState(btn, false);
    }
  });
})();
