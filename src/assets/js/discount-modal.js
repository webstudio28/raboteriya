(function () {
  var dialog = document.getElementById("discount-modal");
  var trigger = document.getElementById("discount-modal-trigger");
  var closeBtn = document.getElementById("discount-modal-close");
  var form = document.getElementById("discount-modal-form");
  var consent = document.getElementById("discount-consent");
  var submitBtn = document.getElementById("discount-modal-submit");
  var body = document.body;
  var lastFocus = null;

  function syncSubmitDisabled() {
    if (!submitBtn || !consent) return;
    submitBtn.disabled = !consent.checked;
  }

  function openModal() {
    if (!dialog || typeof dialog.showModal !== "function") return;
    lastFocus = document.activeElement;
    dialog.showModal();
    body.style.overflow = "hidden";
    var first = form && form.querySelector("input:not([type='checkbox'])");
    if (first) first.focus();
  }

  function closeModal() {
    if (!dialog || typeof dialog.close !== "function") return;
    if (!dialog.open) return;
    dialog.close();
  }

  if (consent) consent.addEventListener("change", syncSubmitDisabled);
  syncSubmitDisabled();

  if (trigger && dialog) {
    trigger.addEventListener("click", function () {
      openModal();
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  if (dialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeModal();
    });
    dialog.addEventListener("close", function () {
      body.style.overflow = "";
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      lastFocus = null;
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!consent || !consent.checked) return;
      closeModal();
      form.reset();
      syncSubmitDisabled();
    });
  }
})();
