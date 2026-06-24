/* ==========================================================================
   Yavuzlar Aksesuar — main.js
   i18n · nav · reveal · counters · filters · form · marquee
   ========================================================================== */
(function () {
  "use strict";

  const STORAGE_KEY = "ya-lang";
  const supported = ["tr", "en"];

  /* ---------- i18n ---------- */
  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && supported.includes(saved)) return saved;
    const nav = (navigator.language || "tr").slice(0, 2);
    return supported.includes(nav) ? nav : "tr";
  }

  function applyLang(lang) {
    const dict = translations[lang] || translations.tr;
    document.documentElement.setAttribute("lang", lang);

    // text content
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.innerHTML = dict[key];
    });

    // attributes:  data-i18n-attr="placeholder:key,aria-label:key"
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.getAttribute("data-i18n-attr").split(",").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key && dict[key] != null) el.setAttribute(attr, dict[key]);
      });
    });

    // toggle buttons
    document.querySelectorAll(".lang__btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.lang === lang);
    });

    localStorage.setItem(STORAGE_KEY, lang);
  }

  function initLang() {
    let lang = getLang();
    applyLang(lang);
    document.querySelectorAll(".lang__btn").forEach((btn) => {
      btn.addEventListener("click", () => applyLang(btn.dataset.lang));
    });
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    const nav = document.querySelector(".nav");
    const toggle = document.querySelector(".nav__toggle");
    if (!nav || !toggle) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav__link").forEach((l) =>
      l.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  /* ---------- Header scroll state ---------- */
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    const nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const sep = el.dataset.sep === "true";
      if (reduce) { el.textContent = format(target, sep) + suffix; return; }
      const dur = 1500; const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = format(Math.round(target * eased), sep) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const format = (n, sep) => sep ? n.toLocaleString("tr-TR") : String(n);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach((n) => io.observe(n));
  }

  /* ---------- Product filters ---------- */
  function initFilters() {
    const bar = document.querySelector(".filters");
    if (!bar) return;
    const items = document.querySelectorAll("[data-cat]");
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter");
      if (!btn) return;
      bar.querySelectorAll(".filter").forEach((f) => f.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      items.forEach((it) => {
        const show = cat === "all" || it.dataset.cat === cat;
        it.classList.toggle("is-hidden", !show);
      });
    });
  }

  /* ---------- Contact form ---------- */
  function initForm() {
    const form = document.querySelector(".form");
    if (!form) return;
    const msg = form.querySelector(".form__msg:not(.form__msg--err)");
    const errMsg = form.querySelector(".form__msg--err");
    const submitBtn = form.querySelector('[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.innerHTML : "";

    const setInvalid = (field, bad) => field.classList.toggle("invalid", bad);
    const showMsg = (el) => {
      [msg, errMsg].forEach((m) => m && m.classList.remove("show"));
      if (!el) return;
      el.classList.add("show");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => el.classList.remove("show"), 7000);
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let ok = true;
      const name = form.querySelector('[name="name"]');
      const email = form.querySelector('[name="email"]');
      const message = form.querySelector('[name="message"]');

      const nameBad = !name.value.trim();
      const emailBad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      const msgBad = !message.value.trim();

      setInvalid(name.closest(".field"), nameBad);
      setInvalid(email.closest(".field"), emailBad);
      setInvalid(message.closest(".field"), msgBad);

      if (nameBad || emailBad || msgBad) {
        ok = false;
        const firstBad = form.querySelector(".field.invalid input, .field.invalid textarea");
        if (firstBad) firstBad.focus();
      }
      if (!ok) return;

      const endpoint = form.getAttribute("action") || "";
      // Formspree henüz bağlı değilse (placeholder) yerel başarı mesajı göster
      if (!endpoint || endpoint.indexOf("YOUR_FORM_ID") !== -1) {
        form.reset();
        showMsg(msg);
        return;
      }

      const lang = document.documentElement.getAttribute("lang") || "tr";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = lang === "en" ? "Sending…" : "Gönderiliyor…";
      }
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (res.ok) { form.reset(); showMsg(msg); }
        else { showMsg(errMsg); }
      } catch (_) {
        showMsg(errMsg);
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
      }
    });

    // clear invalid state on input
    form.querySelectorAll("input, textarea").forEach((el) => {
      el.addEventListener("input", () => el.closest(".field").classList.remove("invalid"));
    });
  }

  /* ---------- Active nav link ---------- */
  function initActiveLink() {
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav__menu .nav__link").forEach((l) => {
      const href = (l.getAttribute("href") || "").toLowerCase();
      if (href === path || (path === "" && href === "index.html")) l.classList.add("active");
    });
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq() {
    const items = document.querySelectorAll(".faq__item");
    if (!items.length) return;
    items.forEach((item) => {
      const q = item.querySelector(".faq__q");
      const a = item.querySelector(".faq__a");
      if (!q || !a) return;
      q.setAttribute("aria-expanded", "false");
      q.addEventListener("click", () => {
        const open = item.classList.toggle("open");
        q.setAttribute("aria-expanded", open ? "true" : "false");
        a.style.maxHeight = open ? a.scrollHeight + "px" : null;
      });
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    const y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- GSAP scroll animations (premium) ---------- */
  function initGsap() {
    const gsap = window.gsap;
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("gsap"); // CSS disables the .reveal transition

    const mm = gsap.matchMedia();

    /* full motion */
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ease = "power3.out";

      /* hero entrance timeline (on load) */
      const heroCopy = document.querySelector(".hero__copy");
      if (heroCopy) {
        gsap.set(".hero__copy, .hero__visual", { opacity: 1, y: 0 });
        const kids = gsap.utils.toArray(".hero__copy > *");
        const tl = gsap.timeline({ defaults: { ease, duration: 0.85 } });
        tl.from(kids, { opacity: 0, y: 30, stagger: 0.1 })
          .from(".hero__visual", { opacity: 0, y: 48, duration: 1 }, "-=0.7")
          .from(".hero__badge", { opacity: 0, y: 22, duration: 0.6 }, "-=0.45");
      }

      /* scroll reveal — batched, everything outside the hero */
      const batchEls = gsap.utils.toArray(".reveal").filter((el) => !el.closest(".hero"));
      ScrollTrigger.batch(batchEls, {
        start: "top 86%",
        onEnter: (b) =>
          gsap.to(b, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease, overwrite: true }),
      });

      /* subtle parallax on large feature images (scaled to avoid edge gaps) */
      gsap.utils.toArray(".hero__media img, .split__media img").forEach((img) => {
        const box = img.closest(".hero__media, .split__media");
        gsap.fromTo(
          img,
          { yPercent: -6, scale: 1.12 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      /* recalc once fonts/images settle */
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
      window.addEventListener("load", () => ScrollTrigger.refresh());

      return () => {}; // matchMedia auto-reverts on cleanup
    });

    /* reduced motion — show everything, no animation */
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".reveal, .hero__copy, .hero__visual", { opacity: 1, y: 0 });
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initLang();
    initNav();
    initHeader();
    initActiveLink();
    if (window.gsap) initGsap();   // GSAP-driven reveals + hero + parallax
    else initReveal();             // graceful fallback (IntersectionObserver)
    initCounters();
    initFilters();
    initForm();
    initFaq();
    initYear();
  });
})();
