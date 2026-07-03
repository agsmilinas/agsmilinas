/* =====================================================================
   Shared behaviour for every page
   ===================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Starfield (particles.js, two layers) ---------- */
  function initParticles() {
    if (typeof particlesJS !== "function" || reduce) return;

    particlesJS("particles-js", {
      particles: {
        number: { value: 90, density: { enable: true, value_area: 900 } },
        color: { value: ["#ffffff", "#22d3ee", "#c9d2ff", "#8b5cf6"] },
        shape: { type: "circle" },
        opacity: { value: 0.65, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.2, sync: false } },
        size: { value: 3.2, random: true, anim: { enable: true, speed: 3, size_min: 0.6, sync: false } },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.45, random: true, out_mode: "out" }
      },
      interactivity: {
        detect_on: "window",
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: { repulse: { distance: 110 }, push: { particles_nb: 3 } }
      },
      retina_detect: true
    });

    particlesJS("galaxy-clusters", {
      particles: {
        number: { value: 16, density: { enable: true, value_area: 1300 } },
        color: { value: ["#663399", "#8b5cf6", "#22d3ee", "#f5b544"] },
        shape: { type: "circle" },
        opacity: { value: 0.16, random: true, anim: { enable: true, speed: 0.4, opacity_min: 0.04, sync: false } },
        size: { value: 90, random: true, anim: { enable: true, speed: 1, size_min: 40, sync: false } },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.1, random: true, out_mode: "out" }
      },
      interactivity: { events: { onhover: { enable: false }, onclick: { enable: false } } },
      retina_detect: true
    });
  }

  /* ---------- 2. Theme toggle (persisted) ---------- */
  function initTheme() {
    var root = document.documentElement;
    var key = "site-theme";
    var btn = document.getElementById("themeToggle");
    var saved = localStorage.getItem(key);
    if (saved) root.setAttribute("data-theme", saved);
    setIcon();

    function setIcon() {
      if (!btn) return;
      var isLight = root.getAttribute("data-theme") === "light";
      btn.innerHTML = isLight
        ? '<i class="bi bi-sun"></i>'
        : '<i class="bi bi-moon-stars"></i>';
      btn.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    }
    if (btn) {
      btn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        root.setAttribute("data-theme", next);
        localStorage.setItem(key, next);
        setIcon();
      });
    }
  }

  /* ---------- 3. Auto "last update" stamp ---------- */
  function initStamp() {
    var d = new Date();
    var el = document.getElementById("lastUpdate");
    if (el) el.textContent = d.toLocaleString("en-US", { month: "long" }) + " " + d.getFullYear();
    var yr = document.getElementById("yr");
    if (yr) yr.textContent = d.getFullYear();
  }

  /* ---------- 4. Scroll-reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = (e.target.dataset.delay || "0") + "ms";
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 5. Mobile drawer ---------- */
  function initDrawer() {
    var sidebar = document.querySelector(".sidebar");
    var toggle = document.getElementById("navToggle");
    var scrim = document.querySelector(".nav-scrim");
    if (!sidebar || !toggle) return;

    function open() { sidebar.classList.add("open"); if (scrim) scrim.classList.add("show"); toggle.setAttribute("aria-expanded", "true"); }
    function close() { sidebar.classList.remove("open"); if (scrim) scrim.classList.remove("show"); toggle.setAttribute("aria-expanded", "false"); }

    toggle.addEventListener("click", function () {
      sidebar.classList.contains("open") ? close() : open();
    });
    if (scrim) scrim.addEventListener("click", close);
    sidebar.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---------- boot ---------- */
  function boot() {
    initParticles();
    initTheme();
    initStamp();
    initReveal();
    initDrawer();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
