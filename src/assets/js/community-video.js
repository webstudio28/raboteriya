(function () {
  var section = document.querySelector("[data-community-section]");
  var modal = document.getElementById("community-video-modal");
  if (!section || !modal) return;

  var trigger = section.querySelector("[data-community-video-trigger]");
  var player = modal.querySelector("[data-community-video-player]");
  var closeBtns = modal.querySelectorAll("[data-community-video-close]");

  if (!trigger || !player) return;

  function videoSrc() {
    return trigger.getAttribute("data-community-video-src") || "";
  }

  function pausePlayer() {
    player.pause();
    player.removeAttribute("src");
    try {
      player.load();
    } catch (e) {
      /* ignore */
    }
  }

  function openModal() {
    var src = videoSrc();
    if (!src) return;
    player.src = src;
    player.setAttribute(
      "aria-label",
      trigger.getAttribute("data-community-video-label") || "Community video"
    );
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    try {
      player.play();
    } catch (e) {
      /* ignore autoplay restrictions */
    }
  }

  function closeModal() {
    pausePlayer();
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  trigger.addEventListener("click", openModal);
  trigger.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal();
    }
  });

  closeBtns.forEach(function (btn) {
    btn.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
})();
