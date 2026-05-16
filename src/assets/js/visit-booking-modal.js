(function () {
  var WEB3FORMS_URL = "https://api.web3forms.com/submit";
  var TIME_SLOTS = [];
  for (var h = 7; h <= 18; h++) TIME_SLOTS.push(String(h).padStart(2, "0") + ":00");
  var dialog = document.getElementById("booking-modal");
  var form = document.getElementById("booking-modal-form");
  if (!dialog || !form) return;
  var closeBtn = document.getElementById("booking-modal-close");
  var formView = document.getElementById("booking-modal-form-view");
  var successView = document.getElementById("booking-modal-success-view");
  var successDone = document.getElementById("booking-success-done");
  var submitBtn = document.getElementById("booking-modal-submit");
  var errorEl = document.getElementById("booking-form-error");
  var dateInput = document.getElementById("booking-visit-date");
  var timeInput = document.getElementById("booking-visit-time");
  var dateTrigger = document.getElementById("booking-date-trigger");
  var timeTrigger = document.getElementById("booking-time-trigger");
  var dateLabel = document.getElementById("booking-date-label");
  var timeLabel = document.getElementById("booking-time-label");
  var datePanel = document.getElementById("booking-date-panel");
  var timePanel = document.getElementById("booking-time-panel");
  var calendarMonth = document.getElementById("booking-calendar-month");
  var calendarGrid = document.getElementById("booking-calendar-grid");
  var calendarPrev = document.querySelector(".booking-calendar-prev");
  var calendarNext = document.querySelector(".booking-calendar-next");
  var timeList = document.getElementById("booking-time-list");
  var body = document.body, html = document.documentElement, lastFocus = null;
  var viewYear = new Date().getFullYear(), viewMonth = new Date().getMonth();
  var selectedDate = null, selectedTime = null, openPicker = null;
  var selectedMembershipPlan = "", selectedMembershipPrice = "";
  var membershipPlanInput = document.getElementById("booking-membership-plan");
  var membershipPriceInput = document.getElementById("booking-membership-price");
  function pad(n) { return String(n).padStart(2, "0"); }
  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function minBookableDate() { var e = startOfDay(new Date()); e.setDate(e.getDate() + 1); return e; }
  function isBookableDate(d) { return startOfDay(d).getTime() >= minBookableDate().getTime(); }
  function formatDateLabel(d) { return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" }); }
  function formatDateValue(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fieldValue(id) { var el = document.getElementById(id); return el && el.value ? el.value.trim() : ""; }
  function lockBodyScroll() { var w = Math.max(0, window.innerWidth - html.clientWidth); body.style.overflow = "hidden"; if (w) body.style.paddingRight = w + "px"; }
  function unlockBodyScroll() { body.style.overflow = ""; body.style.paddingRight = ""; }
  function hideError() { if (errorEl) { errorEl.textContent = ""; errorEl.classList.add("hidden"); } }
  function showError(msg) { if (errorEl) { errorEl.textContent = msg; errorEl.classList.remove("hidden"); } }
  function closePickers() {
    if (datePanel) { datePanel.classList.add("hidden"); if (dateTrigger) dateTrigger.setAttribute("aria-expanded", "false"); }
    if (timePanel) { timePanel.classList.add("hidden"); if (timeTrigger) timeTrigger.setAttribute("aria-expanded", "false"); }
    openPicker = null;
  }
  function setDateSelection(d) {
    if (d && !isBookableDate(d)) d = null;
    selectedDate = d ? startOfDay(d) : null;
    if (dateInput) dateInput.value = selectedDate ? formatDateValue(selectedDate) : "";
    if (dateLabel) {
      if (selectedDate) { dateLabel.textContent = formatDateLabel(selectedDate); dateLabel.classList.remove("text-gray-400"); dateLabel.classList.add("text-gray-900"); }
      else { dateLabel.textContent = "Select date"; dateLabel.classList.add("text-gray-400"); dateLabel.classList.remove("text-gray-900"); }
    }
  }
  function setTimeSelection(t) {
    selectedTime = t || null;
    if (timeInput) timeInput.value = selectedTime || "";
    if (timeLabel) {
      if (selectedTime) { timeLabel.textContent = selectedTime; timeLabel.classList.remove("text-gray-400"); timeLabel.classList.add("text-gray-900"); }
      else { timeLabel.textContent = "Select time"; timeLabel.classList.add("text-gray-400"); timeLabel.classList.remove("text-gray-900"); }
    }
  }
  function renderCalendar() {
    if (!calendarGrid || !calendarMonth) return;
    var first = new Date(viewYear, viewMonth, 1), startWeekday = (first.getDay() + 6) % 7;
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    calendarMonth.textContent = first.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    calendarGrid.innerHTML = "";
    for (var i = 0; i < startWeekday; i++) { var e = document.createElement("span"); e.className = "booking-calendar-day booking-calendar-day--empty"; calendarGrid.appendChild(e); }
    for (var day = 1; day <= daysInMonth; day++) {
      var cellDate = new Date(viewYear, viewMonth, day), btn = document.createElement("button");
      btn.type = "button"; btn.className = "booking-calendar-day"; btn.textContent = String(day);
      if (!isBookableDate(cellDate)) { btn.disabled = true; btn.classList.add("booking-calendar-day--disabled"); }
      else {
        if (selectedDate && cellDate.getTime() === selectedDate.getTime()) btn.classList.add("is-selected");
        btn.addEventListener("click", (function (d) { return function () { setDateSelection(d); renderCalendar(); closePickers(); }; })(cellDate));
      }
      calendarGrid.appendChild(btn);
    }
  }
  function buildTimeList() {
    if (!timeList) return;
    timeList.innerHTML = "";
    var p1 = document.createElement("li"); p1.className = "booking-time-pad"; timeList.appendChild(p1);
    TIME_SLOTS.forEach(function (slot) {
      var li = document.createElement("li"), btn = document.createElement("button");
      btn.type = "button"; btn.className = "booking-time-option"; btn.setAttribute("data-time", slot); btn.textContent = slot;
      btn.addEventListener("click", function () { setTimeSelection(slot); scrollTimeToSlot(slot, false); closePickers(); });
      li.appendChild(btn); timeList.appendChild(li);
    });
    var p2 = document.createElement("li"); p2.className = "booking-time-pad"; timeList.appendChild(p2);
  }
  function scrollTimeToSlot(slot, smooth) {
    var btn = timeList && timeList.querySelector('[data-time="' + slot + '"]');
    if (!btn) return;
    timeList.scrollTo({ top: btn.offsetTop - (timeList.clientHeight - btn.offsetHeight) / 2, behavior: smooth ? "smooth" : "auto" });
  }
  function updateTimeWheelStyles() {
    if (!timeList) return;
    var center = timeList.scrollTop + timeList.clientHeight / 2, options = timeList.querySelectorAll(".booking-time-option");
    var closest = null, closestDist = Infinity;
    for (var i = 0; i < options.length; i++) {
      var mid = options[i].offsetTop + options[i].offsetHeight / 2, dist = Math.abs(mid - center);
      if (dist < closestDist) { closestDist = dist; closest = options[i]; }
    }
    for (var j = 0; j < options.length; j++) options[j].classList.toggle("is-selected", options[j] === closest);
    if (closest) { var t = closest.getAttribute("data-time"); if (t && t !== selectedTime) setTimeSelection(t); }
  }
  function togglePicker(which) {
    var isDate = which === "date", panel = isDate ? datePanel : timePanel, trigger = isDate ? dateTrigger : timeTrigger;
    if (!panel || !trigger) return;
    if (openPicker === which) { closePickers(); return; }
    closePickers(); panel.classList.remove("hidden"); trigger.setAttribute("aria-expanded", "true"); openPicker = which;
    if (isDate) renderCalendar(); else { if (selectedTime) scrollTimeToSlot(selectedTime, false); requestAnimationFrame(updateTimeWheelStyles); }
  }
  function showFormView() { if (formView) formView.classList.remove("hidden"); if (successView) successView.classList.add("hidden"); }
  function showSuccessView() { if (formView) formView.classList.add("hidden"); if (successView) successView.classList.remove("hidden"); }
  function setMembership(plan, price) {
    selectedMembershipPlan = plan || "";
    selectedMembershipPrice = price || "";
    if (membershipPlanInput) membershipPlanInput.value = selectedMembershipPlan;
    if (membershipPriceInput) membershipPriceInput.value = selectedMembershipPrice;
  }
  function syncStateFromForm() {
    selectedMembershipPlan = membershipPlanInput ? membershipPlanInput.value : "";
    selectedMembershipPrice = membershipPriceInput ? membershipPriceInput.value : "";
    var dateVal = dateInput ? dateInput.value : "";
    if (dateVal) {
      var parts = dateVal.split("-");
      var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      if (!isNaN(d.getTime()) && isBookableDate(d)) {
        selectedDate = startOfDay(d);
        viewYear = selectedDate.getFullYear();
        viewMonth = selectedDate.getMonth();
        if (dateLabel) {
          dateLabel.textContent = formatDateLabel(selectedDate);
          dateLabel.classList.remove("text-gray-400");
          dateLabel.classList.add("text-gray-900");
        }
      }
    } else {
      selectedDate = null;
      if (dateLabel) {
        dateLabel.textContent = "Select date";
        dateLabel.classList.add("text-gray-400");
        dateLabel.classList.remove("text-gray-900");
      }
    }
    var timeVal = timeInput ? timeInput.value : "";
    selectedTime = timeVal || null;
    if (timeLabel) {
      if (selectedTime) {
        timeLabel.textContent = selectedTime;
        timeLabel.classList.remove("text-gray-400");
        timeLabel.classList.add("text-gray-900");
      } else {
        timeLabel.textContent = "Select time";
        timeLabel.classList.add("text-gray-400");
        timeLabel.classList.remove("text-gray-900");
      }
    }
    renderCalendar();
    if (selectedTime && timeList) scrollTimeToSlot(selectedTime, false);
  }
  function resetForm() {
    form.reset();
    selectedDate = null;
    selectedTime = null;
    setMembership("", "");
    viewYear = new Date().getFullYear();
    viewMonth = new Date().getMonth();
    setDateSelection(null);
    setTimeSelection(null);
    closePickers();
    hideError();
    showFormView();
    renderCalendar();
  }
  function openModal(trigger) {
    lastFocus = document.activeElement;
    if (trigger) {
      setMembership(trigger.getAttribute("data-membership-plan"), trigger.getAttribute("data-membership-price"));
    }
    if (!successView || successView.classList.contains("hidden")) {
      syncStateFromForm();
    }
    closePickers();
    hideError();
    dialog.showModal();
    lockBodyScroll();
    var f = document.getElementById("booking-name");
    if (f) f.focus();
  }
  function closeModal() { if (dialog.open) dialog.close(); }
  buildTimeList(); renderCalendar();
  if (timeList) timeList.addEventListener("scroll", updateTimeWheelStyles, { passive: true });
  document.querySelectorAll(".js-booking-modal-open").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); openModal(el); });
  });
  if (dateTrigger) dateTrigger.addEventListener("click", function () { togglePicker("date"); });
  if (timeTrigger) timeTrigger.addEventListener("click", function () { togglePicker("time"); });
  if (calendarPrev) calendarPrev.addEventListener("click", function () { viewMonth -= 1; if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; } renderCalendar(); });
  if (calendarNext) calendarNext.addEventListener("click", function () { viewMonth += 1; if (viewMonth > 11) { viewMonth = 0; viewYear += 1; } renderCalendar(); });
  document.addEventListener("click", function (e) { if (openPicker && !e.target.closest(".booking-picker-wrap")) closePickers(); });
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (successDone) {
    successDone.addEventListener("click", function () {
      resetForm();
      closeModal();
    });
  }
  dialog.addEventListener("click", function (e) { if (e.target === dialog) closeModal(); });
  dialog.addEventListener("close", function () {
    unlockBodyScroll();
    closePickers();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  });
  if (submitBtn) form.addEventListener("submit", function (e) {
    e.preventDefault(); hideError();
    var key = (form.querySelector('input[name="access_key"]') || {}).value;
    key = key ? key.trim() : "";
    if (!key) { showError("Could not submit the form. Please refresh and try again."); return; }
    var name = fieldValue("booking-name"), email = fieldValue("booking-email"), phone = fieldValue("booking-phone");
    if (!name) { showError("Please enter your name."); return; }
    if (!email || email.indexOf("@") < 1) { showError("Please enter a valid email address."); return; }
    if (!phone) { showError("Please enter your phone number."); return; }
    if (!selectedDate || !isBookableDate(selectedDate)) { showError("Please select a date from tomorrow onwards."); return; }
    if (!selectedTime) { showError("Please select a visit time."); return; }
    var visitDateStr = formatDateLabel(selectedDate), visitDateIso = formatDateValue(selectedDate);
    var subjectLine =
      "Raboteriya — " +
      name +
      " — " +
      (selectedMembershipPlan || "Visit") +
      " (" +
      visitDateStr +
      " " +
      selectedTime +
      ")";
    var adminMessage =
      "Raboteriya — visit booking request (pricing modal)\n\n" +
      "Membership: " + (selectedMembershipPlan || "—") + "\n" +
      "Price: " + (selectedMembershipPrice || "—") + "\n\n" +
      "Name: " + name + "\n" +
      "Email: " + email + "\n" +
      "Phone: " + phone + "\n" +
      "Preferred date: " + visitDateStr + " (" + visitDateIso + ")\n" +
      "Preferred time: " + selectedTime + "\n" +
      "Submitted (UTC): " + new Date().toISOString() + "\n";
    if (dateInput) dateInput.value = visitDateIso;
    if (timeInput) timeInput.value = selectedTime;
    if (membershipPlanInput) membershipPlanInput.value = selectedMembershipPlan;
    if (membershipPriceInput) membershipPriceInput.value = selectedMembershipPrice;
    var subjectField = document.getElementById("booking-form-subject"), messageField = document.getElementById("booking-form-message");
    if (subjectField) subjectField.value = subjectLine;
    if (messageField) messageField.value = adminMessage;
    var formData = new FormData(form);
    formData.set("access_key", key); formData.set("name", name); formData.set("email", email); formData.set("phone", phone);
    formData.set("visit_date", visitDateIso); formData.set("visit_time", selectedTime);
    formData.set("membership_plan", selectedMembershipPlan);
    formData.set("membership_price", selectedMembershipPrice);
    formData.set("subject", subjectLine); formData.set("message", adminMessage);
    var defaultLabel = "Submit";
    submitBtn.disabled = true; submitBtn.textContent = "Sending…";
    fetch(WEB3FORMS_URL, { method: "POST", headers: { Accept: "application/json" }, body: formData })
      .then(function (res) { return res.json().catch(function () { return {}; }).then(function (data) { return { res: res, data: data }; }); })
      .then(function (result) {
        if (!result.res.ok || !result.data.success) throw new Error((result.data && (result.data.message || result.data.error)) || "Could not send. Please try again or email us directly.");
        showSuccessView();
      })
      .catch(function (err) { showError(err.message || "Something went wrong. Please try again."); })
      .finally(function () {
        if (successView && successView.classList.contains("hidden")) { submitBtn.disabled = false; submitBtn.textContent = defaultLabel; }
      });
  });
})();