(function () {
  var dialog = document.getElementById("testimonial-modal");
  var closeBtn = document.getElementById("testimonial-modal-close");
  var modalName = document.getElementById("testimonial-modal-name");
  var modalQuote = document.getElementById("testimonial-modal-quote");
  var modalAvatar = document.getElementById("testimonial-modal-avatar");

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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
