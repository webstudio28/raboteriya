(function () {
  var root = document.querySelector("[data-faq]");
  if (!root) return;

  var items = Array.prototype.slice.call(root.querySelectorAll("details.faq-item"));
  if (!items.length) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DURATION = reducedMotion ? "0.001ms" : "0.45s";
  var EASING = "cubic-bezier(0.33, 1, 0.68, 1)";

  function panelOf(d) {
    return d.querySelector(".faq-answer");
  }

  function innerOf(d) {
    return d.querySelector(".faq-answer-inner");
  }

  function finishHeightTransition(panel, onDone) {
    var done = false;
    function run() {
      if (done) return;
      done = true;
      panel.removeEventListener("transitionend", onEnd);
      clearTimeout(fallback);
      onDone();
    }
    function onEnd(e) {
      if (e.target !== panel || e.propertyName !== "height") return;
      run();
    }
    panel.addEventListener("transitionend", onEnd);
    var fallback = setTimeout(run, reducedMotion ? 50 : 550);
  }

  function setBusy(d, v) {
    if (v) d.setAttribute("data-faq-busy", "true");
    else d.removeAttribute("data-faq-busy");
  }

  function isBusy(d) {
    return d.hasAttribute("data-faq-busy");
  }

  function openItem(details) {
    var panel = panelOf(details);
    var inner = innerOf(details);
    if (!panel || !inner) return;
    if (isBusy(details)) return;

    setBusy(details, true);
    panel.style.overflow = "hidden";
    panel.style.transition = "";
    panel.style.height = "0px";
    details.open = true;

    panel.getBoundingClientRect();

    var target = inner.scrollHeight;
    panel.style.transition = "height " + DURATION + " " + EASING;
    panel.style.height = target + "px";

    finishHeightTransition(panel, function () {
      if (!details.open) {
        panel.style.transition = "";
        panel.style.height = "";
        setBusy(details, false);
        return;
      }
      panel.style.transition = "";
      panel.style.height = "auto";
      setBusy(details, false);
    });
  }

  function closeItem(details) {
    if (!details.open || isBusy(details)) return;

    var panel = panelOf(details);
    var inner = innerOf(details);
    if (!panel || !inner) {
      details.open = false;
      return;
    }

    setBusy(details, true);
    var h = inner.scrollHeight;
    panel.style.overflow = "hidden";
    panel.style.transition = "";
    panel.style.height = h + "px";

    panel.getBoundingClientRect();

    panel.style.transition = "height " + DURATION + " " + EASING;
    panel.style.height = "0px";

    finishHeightTransition(panel, function () {
      details.open = false;
      panel.style.transition = "";
      panel.style.height = "";
      setBusy(details, false);
    });
  }

  items.forEach(function (details) {
    var summary = details.querySelector("summary");
    if (!summary) return;

    summary.addEventListener("click", function (e) {
      e.preventDefault();

      if (reducedMotion) {
        if (details.open) {
          details.open = false;
        } else {
          items.forEach(function (other) {
            if (other !== details) other.open = false;
          });
          details.open = true;
        }
        return;
      }

      if (isBusy(details)) return;

      var willOpen = !details.open;

      if (willOpen) {
        items.forEach(function (other) {
          if (other !== details && other.open && !isBusy(other)) {
            closeItem(other);
          }
        });
        openItem(details);
      } else {
        closeItem(details);
      }
    });
  });
})();
