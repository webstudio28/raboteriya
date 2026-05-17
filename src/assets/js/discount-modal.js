(function () {
  var WEB3FORMS_URL = "https://api.web3forms.com/submit";
  var dialog = document.getElementById("discount-modal");
  var triggers = document.querySelectorAll(".discount-modal-trigger");
  var closeBtn = document.getElementById("discount-modal-close");
  var form = document.getElementById("discount-modal-form");
  var consent = document.getElementById("discount-consent");
  var submitBtn = document.getElementById("discount-modal-submit");
  var errorEl = document.getElementById("discount-form-error");
  var toast = document.getElementById("discount-success-toast");
  var body = document.body;
  var html = document.documentElement;
  var lastFocus = null;
  var toastTimer = null;

  function scrollbarWidth() {
    return Math.max(0, window.innerWidth - html.clientWidth);
  }

  function lockBodyScroll() {
    var w = scrollbarWidth();
    body.style.overflow = "hidden";
    if (w > 0) body.style.paddingRight = w + "px";
  }

  function unlockBodyScroll() {
    body.style.overflow = "";
    body.style.paddingRight = "";
  }

  function syncSubmitDisabled() {
    if (!submitBtn || !consent) return;
    submitBtn.disabled = !consent.checked;
  }

  function hideError() {
    if (!errorEl) return;
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.classList.remove("hidden");
  }

  function randomSuffix(len) {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var s = "";
    for (var i = 0; i < len; i++) {
      s += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return s;
  }

  function discountCodeFromEmail(email) {
    var trimmed = (email || "").trim().toLowerCase();
    var at = trimmed.indexOf("@");
    var local = at > 0 ? trimmed.slice(0, at) : "guest";
    local = local.replace(/[^a-z0-9]/gi, "");
    if (!local) local = "guest";
    if (local.length > 24) local = local.slice(0, 24);
    return local.toUpperCase() + "-" + randomSuffix(5);
  }

  function showToast(msg) {
    if (!toast) return;
    if (toastTimer) {
      window.clearTimeout(toastTimer);
      toastTimer = null;
    }
    toast.textContent = msg;
    toast.classList.remove("hidden");
    toastTimer = window.setTimeout(function () {
      toast.classList.add("hidden");
      toast.textContent = "";
      toastTimer = null;
    }, 8000);
  }

  function openModal() {
    if (!dialog || typeof dialog.showModal !== "function") return;
    lastFocus = document.activeElement;
    hideError();
    dialog.showModal();
    lockBodyScroll();
    var first = form && form.querySelector("input:not([type='checkbox']):not([type='hidden'])");
    if (first) first.focus();
  }

  function closeModal() {
    if (!dialog || typeof dialog.close !== "function") return;
    if (!dialog.open) return;
    dialog.close();
  }

  if (consent) consent.addEventListener("change", syncSubmitDisabled);
  syncSubmitDisabled();

  if (triggers.length && dialog) {
    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openModal();
      });
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  if (dialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeModal();
    });
    dialog.addEventListener("close", function () {
      unlockBodyScroll();
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      lastFocus = null;
    });
  }

  if (form && submitBtn) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideError();
      if (!consent || !consent.checked) return;

      var keyInput = form.querySelector('input[name="access_key"]');
      var key = keyInput && keyInput.value ? keyInput.value.trim() : "";
      if (!key) {
        showError("Could not submit the form. Please refresh and try again.");
        return;
      }

      var nameInput = document.getElementById("discount-name");
      var emailInput = document.getElementById("discount-email");
      var name = nameInput ? nameInput.value.trim() : "";
      var email = emailInput ? emailInput.value.trim() : "";

      if (!name) {
        showError("Please enter your name.");
        return;
      }
      if (!email || email.indexOf("@") < 1) {
        showError("Please enter a valid email address.");
        return;
      }

      var code = discountCodeFromEmail(email);
      var when = new Date().toISOString();
      var adminMessage =
        "Raboteriya — 10% first-month discount request (modal)\n\n" +
        "Name: " +
        name +
        "\n" +
        "Email: " +
        email +
        "\n" +
        "Suggested promo code (for your manual email to them): " +
        code +
        "\n" +
        "Submitted (UTC): " +
        when +
        "\n\n" +
        "Web3Forms uses the email field as reply-to so you can reply directly to the visitor.\n";

      var defaultLabel = "Unlock my 10% off";
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      function parseJsonSafe(res) {
        return res.json().catch(function () {
          return {};
        });
      }

      fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: key,
          name: name,
          email: email,
          subject: "Raboteriya — " + name + " requested 10% discount (" + code + ")",
          message: adminMessage,
        }),
      })
        .then(function (res) {
          return parseJsonSafe(res).then(function (data) {
            return { res: res, data: data };
          });
        })
        .then(function (result) {
          if (!result.res.ok || !result.data.success) {
            var msg =
              (result.data && (result.data.message || result.data.error)) ||
              "Could not send. Please try again or email us directly.";
            throw new Error(msg);
          }
          closeModal();
          form.reset();
          syncSubmitDisabled();
          showToast("Thanks! We'll email you about your discount soon.");
        })
        .catch(function (err) {
          showError(err.message || "Something went wrong. Please try again.");
        })
        .finally(function () {
          submitBtn.textContent = defaultLabel;
          syncSubmitDisabled();
        });
    });
  }
})();

(function () {
  var forms = document.querySelectorAll(".js-contact-form");
  var dialog = document.getElementById("contact-success-modal");
  if (!forms.length) return;
  var closeBtn = document.getElementById("contact-success-close");
  var doneBtn = document.getElementById("contact-success-done");
  var body = document.body, html = document.documentElement, lastFocus = null;
  function lockBodyScroll() {
    var w = Math.max(0, window.innerWidth - html.clientWidth);
    body.style.overflow = "hidden";
    if (w) body.style.paddingRight = w + "px";
  }
  function unlockBodyScroll() { body.style.overflow = ""; body.style.paddingRight = ""; }
  function hideError(form) {
    var el = form.querySelector(".contact-form-error");
    if (el) { el.textContent = ""; el.classList.add("hidden"); }
  }
  function showError(form, msg) {
    var el = form.querySelector(".contact-form-error");
    if (el) { el.textContent = msg; el.classList.remove("hidden"); }
  }
  function openSuccessModal() {
    if (!dialog || typeof dialog.showModal !== "function") return;
    lastFocus = document.activeElement;
    dialog.showModal();
    lockBodyScroll();
    if (doneBtn) doneBtn.focus();
  }
  function closeSuccessModal() {
    if (!dialog || typeof dialog.close !== "function" || !dialog.open) return;
    dialog.close();
  }
  if (closeBtn) closeBtn.addEventListener("click", closeSuccessModal);
  if (doneBtn) doneBtn.addEventListener("click", closeSuccessModal);
  if (dialog) {
    dialog.addEventListener("click", function (e) { if (e.target === dialog) closeSuccessModal(); });
    dialog.addEventListener("close", function () {
      unlockBodyScroll();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      lastFocus = null;
    });
  }
  forms.forEach(function (form) {
    var submitBtn = form.querySelector(".js-contact-submit");
    if (!submitBtn) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideError(form);
      var key = ((form.querySelector('input[name="access_key"]') || {}).value || "").trim();
      if (!key) { showError(form, "Could not submit the form. Please refresh and try again."); return; }
      var nameEl = form.querySelector('[name="name"]');
      var emailEl = form.querySelector('[name="email"]');
      var name = nameEl && nameEl.value ? nameEl.value.trim() : "";
      var email = emailEl && emailEl.value ? emailEl.value.trim() : "";
      var phoneEl = form.querySelector('[name="phone"]');
      var msgEl = form.querySelector('[name="enquiry"]');
      var phone = phoneEl && phoneEl.value ? phoneEl.value.trim() : "";
      var messageText = msgEl && msgEl.value ? msgEl.value.trim() : "";
      if (!name) { showError(form, "Please enter your name."); return; }
      if (!email || email.indexOf("@") < 1) { showError(form, "Please enter a valid email address."); return; }
      var subjectLine = "Raboteriya — " + name + " — contact enquiry";
      var adminMessage =
        "Raboteriya — contact form enquiry\n\nName: " + name + "\nEmail: " + email +
        "\nPhone: " + (phone || "—") + "\nMessage:\n" + (messageText || "—") +
        "\n\nSubmitted (UTC): " + new Date().toISOString() + "\n";
      var subjectField = form.querySelector(".js-contact-subject");
      var messageField = form.querySelector(".js-contact-message");
      if (subjectField) subjectField.value = subjectLine;
      if (messageField) messageField.value = adminMessage;
      var formData = new FormData(form);
      formData.set("access_key", key);
      formData.set("name", name);
      formData.set("email", email);
      formData.set("phone", phone);
      formData.set("subject", subjectLine);
      formData.set("message", adminMessage);
      var defaultLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      fetch("https://api.web3forms.com/submit", { method: "POST", headers: { Accept: "application/json" }, body: formData })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) { return { res: res, data: data }; });
        })
        .then(function (result) {
          if (!result.res.ok || !result.data.success) {
            throw new Error((result.data && (result.data.message || result.data.error)) || "Could not send. Please try again or email us directly.");
          }
          form.reset();
          hideError(form);
          openSuccessModal();
        })
        .catch(function (err) { showError(form, err.message || "Something went wrong. Please try again."); })
        .finally(function () { submitBtn.disabled = false; submitBtn.textContent = defaultLabel; });
    });
  });
})();