/* =========================================================
   Portfolio · interactions
   1. nav shadow + active state
   2. reveal on scroll
   3. chart bar animation
   4. lazy video mounting (no autoplay, click to play)
   ========================================================= */
(function () {
  "use strict";

  /* 标记 JS 可用：reveal 动画只在此时启用，无 JS 环境不隐藏内容 */
  document.documentElement.classList.add("js");

  /* ---------- 1. Nav ---------- */
  var nav = document.querySelector(".nav");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

  var onScroll = function () {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var setActive = function (id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  };

  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    document.querySelectorAll("section[id]").forEach(function (s) {
      navObserver.observe(s);
    });
  }

  /* ---------- 2. Reveal ---------- */
  var revealTargets = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* 兜底：首屏内容必须显示，不依赖观察器是否触发 */
  var showAboveFold = function () {
    revealTargets.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("is-in");
      }
    });
  };
  setTimeout(showAboveFold, 700);
  window.addEventListener("load", showAboveFold);

  /* ---------- 3. Video: lazy mount on click ---------- */
  var mountVideo = function (card) {
    var src = card.getAttribute("data-src");
    var stage = card.querySelector(".video-stage");
    if (!src || !stage || card.classList.contains("is-playing")) return;

    var video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("controlsList", "nodownload");

    var poster = card.getAttribute("data-poster");
    if (poster) video.poster = poster;

    video.addEventListener("error", function () {
      card.classList.add("is-error");
      var hint = card.querySelector(".video-hint");
      if (hint && !hint.textContent) {
        hint.textContent = "视频文件未找到：" + src;
      }
    });

    video.src = src;
    stage.replaceChildren(video);
    card.classList.add("is-playing");

    var p = video.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
  };

  document.querySelectorAll(".video").forEach(function (card) {
    var btn = card.querySelector(".video-play");
    if (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        mountVideo(card);
      });
    }
  });
})();
