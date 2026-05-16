(function () {
  var WEB3FORMS_URL = "https://api.web3forms.com/submit";
  var TIME_SLOTS = [];
  var h;
  for (h = 7; h <= 18; h++) {
    TIME_SLOTS.push(String(h).padStart(2, "0") + ":00");
  }

  var dialog = document.getElementById("booking-modal");
  var closeBtn = document.getElementById("booking-modal-close");
  var form = document.getElementById("booking-modal-form");
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

  var body = document.body;
  var html = document.documentElement;
  var lastFocus = null;
  var viewYear = new Date().getFullYear();
  var viewMonth = new Date().getMonth();
  var selectedDate = null;
  var selectedTime = null;
  var openPicker = null;

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

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function formatDateLabel(d) {
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatDateValue(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function minBookableDate() {
    var earliest = startOfDay(new Date());
    earliest.setDate(earliest.getDate() + 1);
    return earliest;
  }

  function isBookableDate(d) {
    return startOfDay(d).getTime() >= minBookableDate().getTime();
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

  function closePickers() {
    if (datePanel) {
      datePanel.classList.add("hidden");
      if (dateTrigger) dateTrigger.setAttribute("aria-expanded", "false");
    }
    if (timePanel) {
      timePanel.classList.add("hidden");
      if (timeTrigger) timeTrigger.setAttribute("aria-expanded", "false");
    }
    openPicker = null;
  }

  function setDateSelection(d) {
    if (d && !isBookableDate(d)) {
      d = null;
    }
    selectedDate = d ? startOfDay(d) : null;
    if (dateInput) dateInput.value = selectedDate ? formatDateValue(selectedDate) : "";
    if (dateLabel) {
      if (selectedDate) {
        dateLabel.textContent = formatDateLabel(selectedDate);
        dateLabel.classList.remove("text-gray-400");
        dateLabel.classList.add("text-gray-900");
      } else {
        dateLabel.textContent = "Select date";
        dateLabel.classList.add("text-gray-400");
        dateLabel.classList.remove("text-gray-900");
      }
    }
  }

  function setTimeSelection(t) {
    selectedTime = t || null;
    if (timeInput) timeInput.value = selectedTime || "";
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
    if (timeList) {
      var items = timeList.querySelectorAll(".booking-time-option");
      for (var i = 0; i < items.length; i++) {
        var selected = items[i].getAttribute("data-time") === selectedTime;
        items[i].classList.toggle("is-selected", selected);
        items[i].setAttribute("aria-selected", selected ? "true" : "false");
      }
    }
  }

  function renderCalendar() {
    if (!calendarGrid || !calendarMonth) return;

    var earliest = minBookableDate();
    var first = new Date(viewYear, viewMonth, 1);
    var startWeekday = (first.getDay() + 6) % 7;
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    calendarMonth.textContent = first.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });

    calendarGrid.innerHTML = "";
    var i;
    for (i = 0; i < startWeekday; i++) {
      var empty = document.createElement("span");
      empty.className = "booking-calendar-day booking-calendar-day--empty";
      empty.setAttribute("aria-hidden", "true");
      calendarGrid.appendChild(empty);
    }

    for (var day = 1; day <= daysInMonth; day++) {
      var cellDate = new Date(viewYear, viewMonth, day);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "booking-calendar-day";
      btn.textContent = String(day);
      btn.setAttribute("role", "gridcell");

      if (!isBookableDate(cellDate)) {
        btn.disabled = true;
        btn.classList.add("booking-calendar-day--disabled");
      } else {
        if (selectedDate && cellDate.getTime() === selectedDate.getTime()) {
          btn.classList.add("is-selected");
          btn.setAttribute("aria-selected", "true");
        }
        btn.addEventListener("click", function (d) {
          return function () {
            setDateSelection(d);
            renderCalendar();
            closePickers();
          };
        }(cellDate));
      }
      calendarGrid.appendChild(btn);
    }
  }

  function buildTimeList() {
    if (!timeList) return;
    timeList.innerHTML = "";
    var padTop = document.createElement("li");
    padTop.className = "booking-time-pad";
    padTop.setAttribute("aria-hidden", "true");
    timeList.appendChild(padTop);
    var padBottom = document.createElement("li");
    padBottom.className = "booking-time-pad";
    padBottom.setAttribute("aria-hidden", "true");

    TIME_SLOTS.forEach(function (slot) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "booking-time-option";
      btn.setAttribute("data-time", slot);
      btn.setAttribute("role", "option");
      btn.textContent = slot;
      btn.addEventListener("click", function () {
        setTimeSelection(slot);
        scrollTimeToSlot(slot, false);
        closePickers();
      });
      li.appendChild(btn);
      timeList.appendChild(li);
    });
    timeList.appendChild(padBottom);
  }

  function scrollTimeToSlot(slot, smooth) {
    if (!timeList) return;
    var btn = timeList.querySelector('[data-time="' + slot + '"]');
    if (!btn) return;
    var top = btn.offsetTop - (timeList.clientHeight - btn.offsetHeight) / 2;
    timeList.scrollTo({ top: top, behavior: smooth ? "smooth" : "auto" });
  }

  function updateTimeWheelStyles() {
    if (!timeList) return;
    var center = timeList.scrollTop + timeList.clientHeight / 2;
    var options = timeList.querySelectorAll(".booking-time-option");
    var closest = null;
    var closestDist = Infinity;
    var i;
    for (i = 0; i < options.length; i++) {
      var opt = options[i];
      var mid = opt.offsetTop + opt.offsetHeight / 2;
      var dist = Math.abs(mid - center);
      if (dist < closestDist) {
        closestDist = dist;
        closest = opt;
      }
    }
    for (i = 0; i < options.length; i++) {
      var item = options[i];
      var isCenter = item === closest;
      item.classList.toggle("is-selected", isCenter);
      item.setAttribute("aria-selected", isCenter ? "true" : "false");
    }
    if (closest) {
      var t = closest.getAttribute("data-time");
      if (t && t !== selectedTime) {
        selectedTime = t;
        if (timeInput) timeInput.value = t;
        if (timeLabel) {
          timeLabel.textContent = t;
          timeLabel.classList.remove("text-gray-400");
          timeLabel.classList.add("text-gray-900");
        }
      }
    }
  }

  function onTimeScroll() {
    updateTimeWheelStyles();
  }

  function togglePicker(which) {
    var isDate = which === "date";
    var panel = isDate ? datePanel : timePanel;
    var trigger = isDate ? dateTrigger : timeTrigger;
    if (!panel || !trigger) return;

    if (openPicker === which) {
      closePickers();
      return;
    }
    closePickers();
    panel.classList.remove("hidden");
    trigger.setAttribute("aria-expanded", "true");
    openPicker = which;
    if (isDate) renderCalendar();
    if (!isDate) {
      if (selectedTime) scrollTimeToSlot(selectedTime, false);
      requestAnimationFrame(updateTimeWheelStyles);
    }
  }

  function showFormView() {
    if (formView) formView.classList.remove("hidden");
    if (successView) {
      successView.classList.add("hidden");
      successView.setAttribute("hidden", "");
    }
  }

  function showSuccessView() {
    if (formView) formView.classList.add("hidden");
    if (successView) {
      successView.classList.remove("hidden");
      successView.removeAttribute("hidden");
    }
  }

  function resetForm() {
    if (form) form.reset();
    selectedDate = null;
    selectedTime = null;
    viewYear = new Date().getFullYear();
    viewMonth = new Date().getMonth();
    setDateSelection(null);
    setTimeSelection(null);
    closePickers();
    hideError();
    showFormView();
    renderCalendar();
  }

  function openModal() {
    if (!dialog || typeof dialog.showModal !== "function") return;
    lastFocus = document.activeElement;
    resetForm();
    dialog.showModal();
    lockBodyScroll();
    var first = form && form.querySelector("#booking-name");
    if (first) first.focus();
  }

  function closeModal() {
    if (!dialog || typeof dialog.close !== "function") return;
    if (!dialog.open) return;
    dialog.close();
  }

  buildTimeList();
  renderCalendar();

  if (timeList) {
    timeList.addEventListener("scroll", onTimeScroll, { passive: true });
  }

  document.querySelectorAll(".js-booking-modal-open").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openModal();
    });
  });

  if (dateTrigger) {
    dateTrigger.addEventListener("click", function () {
      togglePicker("date");
    });
  }
  if (timeTrigger) {
    timeTrigger.addEventListener("click", function () {
      togglePicker("time");
    });
  }

  if (calendarPrev) {
    calendarPrev.addEventListener("click", function () {
      viewMonth -= 1;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear -= 1;
      }
      renderCalendar();
    });
  }
  if (calendarNext) {
    calendarNext.addEventListener("click", function () {
      viewMonth += 1;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear += 1;
      }
      renderCalendar();
    });
  }

  document.addEventListener("click", function (e) {
    if (!openPicker) return;
    var wrap = e.target.closest(".booking-picker-wrap");
    if (!wrap) closePickers();
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (successDone) successDone.addEventListener("click", closeModal);

  if (dialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeModal();
    });
    dialog.addEventListener("close", function () {
      unlockBodyScroll();
      closePickers();
      resetForm();
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      lastFocus = null;
    });
  }

  if (form && submitBtn) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideError();

      var keyInput = form.querySelector('input[name="access_key"]');
      var key = keyInput && keyInput.value ? keyInput.value.trim() : "";
      if (!key) {
        showError("Could not submit the form. Please refresh and try again.");
        return;
      }

      var name = (document.getElementById("booking-name") || {}).value || "";
      var email = (document.getElementById("booking-email") || {}).value || "";
      var phone = (document.getElementById("booking-phone") || {}).value || "";
      name = name.trim();
      email = email.trim();
      phone = phone.trim();

      if (!name) {
        showError("Please enter your name.");
        return;
      }
      if (!email || email.indexOf("@") < 1) {
        showError("Please enter a valid email address.");
        return;
      }
      if (!phone) {
        showError("Please enter your phone number.");
        return;
      }
      if (!selectedDate || !isBookableDate(selectedDate)) {
        showError("Please select a date from tomorrow onwards.");
        return;
      }
      if (!selectedTime) {
        showError("Please select a visit time.");
        return;
      }
      if (selectedTime < "07:00") {
        showError("Visits can be booked from 7:00 AM onwards.");
        return;
      }

      var visitDateStr = formatDateLabel(selectedDate);
      var when = new Date().toISOString();
      var adminMessage =
        "Raboteriya — visit booking request (pricing modal)\n\n" +
        "Name: " +
        name +
        "\n" +
        "Email: " +
        email +
        "\n" +
        "Phone: " +
        phone +
        "\n" +
        "Preferred date: " +
        visitDateStr +
        " (" +
        formatDateValue(selectedDate) +
        ")\n" +
        "Preferred time: " +
        selectedTime +
        "\n" +
        "Submitted (UTC): " +
        when +
        "\n";

      var defaultLabel = "Submit";
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: key,
          name: name,
          email: email,
          phone: phone,
          subject: "Raboteriya — " + name + " booked a visit (" + visitDateStr + " " + selectedTime + ")",
          message: adminMessage,
        }),
      })
        .then(function (res) {
          return res.json().catch(function () {
            return {};
          }).then(function (data) {
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
          showSuccessView();
        })
        .catch(function (err) {
          showError(err.message || "Something went wrong. Please try again.");
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultLabel;
        });
    });
  }
})();
