/* ===== CUT NewsHub - Optimized script.js ===== */
document.addEventListener("DOMContentLoaded", () => {
  initLoading();
  initDarkMode();
  initRevealObserver();
  initSearch();
  initCarousel();
  initParticles();
  initChatWidget();
  initVoice();
  initScrollTop();
  initContactForm();
  initMobileMenu();
  initFuturisticCursor();
  enableTouchCarousel();
});

/* ================= Loading / Splash ================= */
function initLoading() {
  const overlay = document.getElementById("loadingOverlay");
  const splash = document.getElementById("splash-screen");

  if (overlay) {
    setTimeout(() => {
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
      setTimeout(() => overlay.remove?.(), 600);
    }, 900);
  }

  if (splash) {
    setTimeout(() => {
      splash.style.opacity = "0";
      setTimeout(() => (splash.style.display = "none"), 800);
    }, 4000);
  }
}

/* ================= Dark Mode ================= */
function initDarkMode() {
  const toggle = document.getElementById("darkModeToggle");
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    if (toggle) {
      toggle.textContent = "☀️";
      toggle.setAttribute("aria-pressed", "true");
    }
  }
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

/* ================= Reveal Animations ================= */
function initRevealObserver() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;
  const obs = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          const cards = entry.target.querySelectorAll(".card");
          cards.forEach((c, i) => setTimeout(() => c.classList.add("revealed"), i * 150));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  elements.forEach((el) => obs.observe(el));
}

/* ================= Search ================= */
function initSearch() {
  const input = document.getElementById("nav-search-input");
  if (!input) return;
  const items = document.querySelectorAll(".card, .slide");
  input.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    items.forEach((el) => {
      el.style.display = !q || el.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });
}

/* ================= Carousel ================= */
function initCarousel() {
  const slides = document.querySelectorAll(".slide");
  const prev = document.getElementById("prevSlide");
  const next = document.getElementById("nextSlide");
  if (!slides.length) return;

  let index = 0, interval;

  const show = (i) => slides.forEach((s, n) => s.classList.toggle("active", n === i));
  const nextSlide = () => show((index = (index + 1) % slides.length));
  const prevSlide = () => show((index = (index - 1 + slides.length) % slides.length));

  const startAuto = () => (interval = setInterval(nextSlide, 5000));
  const resetAuto = () => { clearInterval(interval); startAuto(); };

  next?.addEventListener("click", () => { nextSlide(); resetAuto(); });
  prev?.addEventListener("click", () => { prevSlide(); resetAuto(); });

  show(index);
  startAuto();
  document.addEventListener("visibilitychange", () => document.hidden ? clearInterval(interval) : startAuto());
}

/* ================= Hero Particles ================= */
function initParticles() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const max = 40;
  let particles = [];

  function resize() {
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function create() {
    particles = Array.from({ length: max }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      r: 0.6 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: 0.2 + Math.random() * 0.6,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.x = (p.x + p.vx + canvas.clientWidth + 20) % (canvas.clientWidth + 20);
      p.y = (p.y + p.vy + canvas.clientHeight + 20) % (canvas.clientHeight + 20);
    });
    requestAnimationFrame(draw);
  }

  resize(); create(); draw();
  window.addEventListener("resize", () => { resize(); create(); });
}

/* ================= Chat Widget ================= */
function initChatWidget() {
  const open = document.getElementById("chatOpen");
  const panel = document.getElementById("chatPanel");
  const close = document.getElementById("chatClose");
  const body = document.getElementById("chatBody");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  if (!open || !panel || !close || !form || !body || !input) return;

  const pushMessage = (who, text) => {
    const msg = document.createElement("div");
    msg.className = "msg";
    msg.innerHTML = `<strong>${who}:</strong> <span>${text}</span>`;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  };

  open.addEventListener("click", () => (panel.style.display = "flex"));
  close.addEventListener("click", () => (panel.style.display = "none"));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const txt = input.value.trim();
    if (!txt) return;
    pushMessage("You", txt);
    input.value = "";
    setTimeout(() => pushMessage("Assistant", `You said: "${txt}"`), 700);
  });

  panel.style.display = "none";
}

/* ================= Voice Commands ================= */
function initVoice() {
  const btn = document.getElementById("voiceBtn");
  if (!btn || !("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) return;

  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const r = new Rec();
  r.lang = "en-US";

  btn.addEventListener("click", () => { r.start(); btn.textContent = "🎧"; });
  r.onresult = (e) => {
    const txt = e.results[0][0].transcript.toLowerCase();
    btn.textContent = "🎙️";
    if (txt.includes("dark")) document.getElementById("darkModeToggle")?.click();
    else if (txt.includes("top")) window.scrollTo({ top: 0, behavior: "smooth" });
    else if (txt.startsWith("search ")) {
      const q = txt.replace("search ", "");
      const input = document.getElementById("nav-search-input");
      if (input) input.value = q, input.dispatchEvent(new Event("input"));
    }
  };
}

/* ================= Scroll To Top ================= */
function initScrollTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;
  window.addEventListener("scroll", () => (btn.style.display = window.scrollY > 200 ? "block" : "none"));
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ================= Contact Form ================= */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const resp = document.getElementById("responseMsg");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: form.name?.value.trim(),
      email: form.email?.value.trim(),
      message: form.message?.value.trim(),
    };
    if (!data.name || !data.email || !data.message) {
      resp.textContent = "Please fill all fields.";
      return;
    }

    resp.textContent = "Sending...";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const out = await res.json();
      resp.textContent = out.success ? "✅ Message sent!" : "❌ Failed to send message.";
      resp.style.color = out.success ? "green" : "red";
      if (out.success) form.reset();
    } catch {
      resp.textContent = "❌ Network error.";
      resp.style.color = "red";
    }
  });
}

/* ================= Mobile Menu ================= */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav-links");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    toggle.textContent = nav.classList.contains("active") ? "✖" : "☰";
    document.body.style.overflow = nav.classList.contains("active") ? "hidden" : "";
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("active");
    toggle.textContent = "☰";
  }));
}

/* ================= Futuristic Cursor ================= */
function initFuturisticCursor() {
  if ("ontouchstart" in window) return;
  const cursor = document.createElement("div");
  Object.assign(cursor.style, {
    position: "fixed", width: "25px", height: "25px", borderRadius: "50%",
    pointerEvents: "none", background: "radial-gradient(circle, rgba(0,225,255,0.7), transparent 70%)",
    boxShadow: "0 0 30px rgba(0,225,255,0.4)", zIndex: "9999", transition: "transform 0.08s ease-out",
  });
  document.body.appendChild(cursor);

  window.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
  });
}

/* ================= Touch Swipe (Carousel) ================= */
function enableTouchCarousel() {
  const carousel = document.querySelector(".carousel");
  const slides = document.querySelectorAll(".slide");
  if (!carousel || !slides.length) return;

  let startX = 0, endX = 0;
  carousel.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
  carousel.addEventListener("touchmove", (e) => (endX = e.touches[0].clientX));
  carousel.addEventListener("touchend", () => {
    const diff = endX - startX;
    if (Math.abs(diff) < 50) return;
    const next = diff < 0;
    const active = [...slides].findIndex((s) => s.classList.contains("active"));
    const newIndex = next ? (active + 1) % slides.length : (active - 1 + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active", i === newIndex));
  });
}
