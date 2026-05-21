(function () {
  var dialog = document.getElementById("testimonial-modal");
  var closeBtn = document.getElementById("testimonial-modal-close");
  var modalName = document.getElementById("testimonial-modal-name");
  var modalQuote = document.getElementById("testimonial-modal-quote");
  var modalAvatar = document.getElementById("testimonial-modal-avatar");
  var resizeTimer = null;

  function getActiveLocaleRoot() {
    return (
      document.querySelector("#testimonials .i18n-locale:not(.i18n-hidden)") ||
      document.querySelector("#testimonials [data-locale]")
    );
  }

  function isOverflowing(quoteEl) {
    if (quoteEl.scrollHeight > quoteEl.clientHeight + 2) return true;

    var wrap = quoteEl.parentElement;
    if (!wrap || !wrap.classList.contains("testimonial-card__quote-wrap")) return false;

    var clone = quoteEl.cloneNode(true);
    clone.classList.remove("testimonial-card__quote--clamp");
    clone.style.cssText =
      "position:absolute;left:-9999px;top:0;visibility:hidden;pointer-events:none;" +
      "display:block;max-height:none;overflow:visible;-webkit-line-clamp:unset;width:" +
      quoteEl.offsetWidth +
      "px";
    wrap.appendChild(clone);
    var overflows = clone.offsetHeight > quoteEl.offsetHeight + 2;
    wrap.removeChild(clone);
    return overflows;
  }

  function showMoreButton(moreBtn, visible) {
    if (!moreBtn) return;
    if (visible) {
      moreBtn.hidden = false;
      moreBtn.classList.remove("hidden");
      moreBtn.removeAttribute("aria-hidden");
      moreBtn.removeAttribute("tabindex");
    } else {
      moreBtn.hidden = true;
      moreBtn.classList.add("hidden");
      moreBtn.setAttribute("aria-hidden", "true");
      moreBtn.setAttribute("tabindex", "-1");
    }
  }

  function updateCard(card) {
    var quoteEl = card.querySelector("[data-testimonial-quote]");
    var moreBtn = card.querySelector("[data-testimonial-more]");
    if (!quoteEl || !moreBtn) return;

    showMoreButton(moreBtn, isOverflowing(quoteEl));
  }

  function updateAll(root) {
    var scope = root || getActiveLocaleRoot() || document;
    scope.querySelectorAll(".testimonial-card").forEach(updateCard);
  }

  function openModal(name, quote) {
    if (!dialog || typeof dialog.showModal !== "function") return;
    var initial = (name || "G").charAt(0).toUpperCase();
    if (modalName) modalName.textContent = name || "";
    if (modalQuote) modalQuote.textContent = quote || "";
    if (modalAvatar) modalAvatar.textContent = initial;
    dialog.showModal();
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    if (!dialog || !dialog.open) return;
    dialog.close();
    document.body.classList.remove("modal-open");
  }

  function bindCard(card) {
    if (card.dataset.testimonialBound) return;
    card.dataset.testimonialBound = "1";

    var moreBtn = card.querySelector("[data-testimonial-more]");
    if (!moreBtn) return;

    ["mousedown", "touchstart"].forEach(function (evt) {
      moreBtn.addEventListener(evt, function (e) {
        e.stopPropagation();
      });
    });

    moreBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var quoteEl = card.querySelector("[data-testimonial-quote]");
      var nameEl = card.querySelector("[data-testimonial-name]");
      openModal(
        nameEl ? nameEl.textContent.trim() : "",
        quoteEl ? quoteEl.textContent.trim() : ""
      );
    });
  }

  function init() {
    document.querySelectorAll(".testimonial-card").forEach(bindCard);
    requestAnimationFrame(function () {
      updateAll();
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (dialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeModal();
    });
    dialog.addEventListener("close", function () {
      document.body.classList.remove("modal-open");
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && dialog && dialog.open) closeModal();
  });

  document.addEventListener("raboteriya:localechange", function () {
    requestAnimationFrame(function () {
      var root = getActiveLocaleRoot();
      if (root) updateAll(root);
    });
  });

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      updateAll(getActiveLocaleRoot());
    }, 150);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("load", function () {
    updateAll(getActiveLocaleRoot());
  });
})();
