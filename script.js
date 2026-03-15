/* ===================================================
   MEHMET TUNBUL BARBER'S CLUB — Main Script
   =================================================== */

(function () {
  "use strict";

  /* ---------- FORCE HERO VIDEO AUTOPLAY (iOS) ---------- */
  var heroVid = document.querySelector(".hero__video");
  if (heroVid) {
    heroVid.muted = true;
    heroVid.play().catch(function () {});
    document.addEventListener("touchstart", function iosUnlock() {
      heroVid.play().catch(function () {});
      document.removeEventListener("touchstart", iosUnlock);
    }, { once: true });
  }

  /* ---------- HEADER SCROLL ---------- */
  const header = document.getElementById("header");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- ACTIVE NAV HIGHLIGHT ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".header__link");

  function highlightNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach((section) => {
      const id = section.getAttribute("id");
      const link = document.querySelector('.header__link[href="#' + id + '"]');
      if (link) {
        const active = scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight;
        link.style.color = active ? "#fff" : "";
      }
    });
  }
  window.addEventListener("scroll", highlightNav, { passive: true });

  /* ---------- MOBILE MENU ---------- */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");

  burger.addEventListener("click", () => {
    const open = burger.classList.toggle("is-open");
    mobileMenu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      burger.classList.remove("is-open");
      mobileMenu.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });

  /* ---------- SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 8;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ---------- REVEAL ON SCROLL ---------- */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    const reveals = document.querySelectorAll(".reveal, .reveal-left");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal, .reveal-left").forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- HERO PARALLAX ---------- */
  if (!prefersReducedMotion) {
    const heroContent = document.querySelector(".hero__content");
    if (heroContent) {
      window.addEventListener("scroll", () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroContent.style.transform = "translateY(-" + (y * 0.08) + "px)";
          heroContent.style.opacity = Math.max(1 - y / (window.innerHeight * 0.65), 0);
        }
      }, { passive: true });
    }
  }

  /* ---------- LAZY-PLAY GALLERY VIDEOS ---------- */
  const galleryVideos = document.querySelectorAll(".gallery__video");
  if (galleryVideos.length) {
    const vidObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.play().catch(() => {});
          } else {
            entry.target.pause();
          }
        });
      },
      { threshold: 0.15 }
    );
    galleryVideos.forEach((v) => vidObserver.observe(v));
  }

  /* ---------- 3D LOGO (Canvas) — MT Monogram ---------- */
  const canvas = document.getElementById("logo3dCanvas");
  if (canvas && !prefersReducedMotion) {
    initLogo3D(canvas);
  }

  function initLogo3D(cvs) {
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const logo = new Image();
    logo.src = "Logos/mt-monogram-hd.png";

    let mouseX = 0, mouseY = 0;
    let rotX = 0, rotY = 0;
    let time = 0;
    let dpr, w, h;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cvs.clientWidth;
      h = cvs.clientHeight;
      cvs.width = w * dpr;
      cvs.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    document.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const isMobile = window.innerWidth < 1024;

    function draw() {
      time += 0.005;
      ctx.clearRect(0, 0, w, h);

      if (!logo.complete || !logo.naturalWidth) {
        requestAnimationFrame(draw);
        return;
      }

      // Smooth mouse follow
      const tx = isMobile ? 0 : mouseY * 0.04;
      const ty = isMobile ? 0 : mouseX * 0.04;
      rotX += (tx - rotX) * 0.018;
      rotY += (ty - rotY) * 0.018;

      // Gentle float
      const floatY = Math.sin(time * 0.45) * 4;
      const floatX = Math.cos(time * 0.3) * 2;

      // Size — the monogram is a circle, looks great bigger
      const size = Math.min(w * 0.2, h * 0.25, 240);
      const cx = w / 2 + floatX;
      const cy = h / 2 + floatY;

      // Perspective
      const sx = 1 - Math.abs(rotY) * 0.1;
      const sy = 1 - Math.abs(rotX) * 0.1;

      ctx.save();
      ctx.globalAlpha = 0.055;
      ctx.translate(cx, cy);
      ctx.scale(sx, sy);
      ctx.transform(1, rotX * 0.05, rotY * 0.05, 1, 0, 0);
      ctx.drawImage(logo, -size / 2, -size / 2, size, size);
      ctx.restore();

      requestAnimationFrame(draw);
    }

    logo.onload = () => requestAnimationFrame(draw);
    if (logo.complete) requestAnimationFrame(draw);
  }

})();
