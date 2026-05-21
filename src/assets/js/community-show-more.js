(function () {
  var section = document.querySelector("[data-community-section]");
  if (!section) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktopMq = window.matchMedia("(min-width: 1024px)");

  function activeBlock() {
    return (
      section.querySelector("[data-locale]:not(.i18n-hidden)") ||
      section.querySelector("[data-locale]")
    );
  }

  function setButtonState(btn, expanded) {
    var label = btn.querySelector("[data-community-expand-label]");
    btn.setAttribute("aria-expanded", expanded ? "true" : "false");
    if (label) {
      label.textContent = expanded
        ? btn.getAttribute("data-label-less")
        : btn.getAttribute("data-label-more");
    }
  }

  function collapseMore(more, inner) {
    more.classList.remove("is-expanded");
    if (reducedMotion || desktopMq.matches) {
      inner.style.maxHeight = desktopMq.matches ? "" : "0px";
      return;
    }
    var h = inner.scrollHeight;
    inner.style.maxHeight = h + "px";
    inner.getBoundingClientRect();
    inner.style.maxHeight = "0px";
  }

  function expandMore(more, inner) {
    more.classList.add("is-expanded");
    if (reducedMotion) {
      inner.style.maxHeight = "none";
      return;
    }
    var target = inner.scrollHeight;
    inner.style.maxHeight = target + "px";
    inner.addEventListener(
      "transitionend",
      function onEnd(e) {
        if (e.propertyName !== "max-height" || !more.classList.contains("is-expanded")) return;
        inner.removeEventListener("transitionend", onEnd);
        inner.style.maxHeight = "none";
      },
      { once: false }
    );
  }

  function bindBlock(block) {
    var more = block.querySelector("[data-community-more]");
    var btn = block.querySelector("[data-community-expand]");
    if (!more || !btn || btn.dataset.communityExpandBound) return;

    var inner = more.querySelector("[data-community-more-inner]");
    if (!inner) return;

    btn.dataset.communityExpandBound = "1";
    collapseMore(more, inner);
    setButtonState(btn, false);

    btn.addEventListener("click", function () {
      if (desktopMq.matches) return;
      var expanded = more.classList.contains("is-expanded");
      if (expanded) {
        collapseMore(more, inner);
        setButtonState(btn, false);
      } else {
        expandMore(more, inner);
        setButtonState(btn, true);
      }
    });
  }

  function init() {
    section.querySelectorAll("[data-locale]").forEach(bindBlock);
  }

  function resetForViewport() {
    section.querySelectorAll("[data-locale]").forEach(function (block) {
      var more = block.querySelector("[data-community-more]");
      var inner = more && more.querySelector("[data-community-more-inner]");
      var btn = block.querySelector("[data-community-expand]");
      if (!more || !inner || !btn) return;
      if (desktopMq.matches) {
        more.classList.add("is-expanded");
        inner.style.maxHeight = "";
      } else if (!more.classList.contains("is-expanded")) {
        collapseMore(more, inner);
        setButtonState(btn, false);
      }
    });
  }

  init();

  desktopMq.addEventListener("change", resetForViewport);

  document.addEventListener("raboteriya:localechange", function () {
    var block = activeBlock();
    if (!block) return;
    var more = block.querySelector("[data-community-more]");
    var inner = more && more.querySelector("[data-community-more-inner]");
    var btn = block.querySelector("[data-community-expand]");
    if (more && inner && btn && !more.classList.contains("is-expanded") && !desktopMq.matches) {
      collapseMore(more, inner);
      setButtonState(btn, false);
    }
  });
})();
