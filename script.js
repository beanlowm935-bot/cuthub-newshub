/* ===== script.js - Consolidated & Fixed ===== */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize features
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
});

/* ================= Loading Overlay / Splash ================= */
function initLoading() {
  const overlay = document.getElementById("loadingOverlay");
  const splash = document.getElementById("splash-screen");

  // Remove overlay after a short delay
  if (overlay) {
    setTimeout(() => {
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
      overlay.setAttribute("aria-hidden", "true");
      setTimeout(() => overlay.remove?.(), 600);
    }, 900);
  }

  // Splash fade-out
  if (splash) {
    setTimeout(() => {
      splash.style.opacity = "0";
      setTimeout(() => {
        splash.style.display = "none";
      }, 800);
    }, 4000);
  }
}

/* ================= Dark Mode (persisted) ================= */
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
    toggle.setAttribute("aria-pressed", String(isDark));
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

/* ================= Reveal on scroll (IntersectionObserver) ================= */
function initRevealObserver() {
  const revs = document.querySelectorAll(".reveal");
  if (!revs.length) return;
  const obs = new IntersectionObserver(
    (entries, o) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("active");
          // stagger child cards
          const cards = e.target.querySelectorAll(".card");
          if (cards.length) {
            cards.forEach((c, idx) => setTimeout(() => c.classList.add("revealed"), idx * 150));
          }
          o.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revs.forEach((r) => obs.observe(r));
}

/* ================= Live Search (nav) ================= */
function initSearch() {
  const input = document.getElementById("nav-search-input");
  if (!input) return;
  const cards = Array.from(document.querySelectorAll(".card"));
  const slides = Array.from(document.querySelectorAll(".slide"));
  input.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    cards.forEach((c) => {
      const text = (c.textContent + " " + (c.dataset.keywords || "")).toLowerCase();
      c.style.display = !q || text.includes(q) ? "" : "none";
    });
    slides.forEach((s) => {
      const text = (s.textContent || "").toLowerCase();
      s.style.display = !q || text.includes(q) ? "" : "none";
    });
  });
}

/* ================= Carousel (auto + manual) ================= */
function initCarousel() {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  if (!slides.length) return;

  let current = 0;
  let autoInterval = null;

  function show(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
  }

  function next() {
    current = (current + 1) % slides.length;
    show(current);
  }
  function prev() {
    current = (current - 1 + slides.length) % slides.length;
    show(current);
  }
  function startAuto() {
    stopAuto();
    autoInterval = setInterval(next, 5000);
  }
  function stopAuto() {
    if (autoInterval) clearInterval(autoInterval);
  }
  // Buttons
  if (nextBtn) nextBtn.addEventListener("click", () => { next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prev(); startAuto(); });

  // Init
  show(current);
  startAuto();

  // Pause auto when page hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });
}

/* ================= Hero Particles (lightweight) ================= */
function initParticles() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  let particles = [];
  const max = 40;

  function make() {
    particles = [];
    for (let i = 0; i < max; i++) {
      particles.push({
        x: Math.random() * canvas.clientWidth,
        y: Math.random() * canvas.clientHeight,
        r: 0.6 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: 0.2 + Math.random() * 0.6,
      });
    }
  }

  resize();
  make();
  window.addEventListener("resize", () => { ctx.setTransform(1, 0, 0, 1, 0, 0); resize(); make(); });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = canvas.clientWidth + 10;
      if (p.x > canvas.clientWidth + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.clientHeight + 10;
      if (p.y > canvas.clientHeight + 10) p.y = -10;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ================= Chat widget (front-end only) ================= */
function initChatWidget() {
  const open = document.getElementById("chatOpen");
  const panel = document.getElementById("chatPanel");
  const close = document.getElementById("chatClose");
  const body = document.getElementById("chatBody");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  if (!open || !panel || !close || !form || !body || !input) return;

  open.addEventListener("click", () => {
    panel.setAttribute("aria-hidden", "false");
    panel.style.display = "flex";
    document.getElementById("chatWidget")?.setAttribute("aria-hidden", "false");
  });
  close.addEventListener("click", () => {
    panel.setAttribute("aria-hidden", "true");
    panel.style.display = "none";
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const txt = input.value.trim();
    if (!txt) return;
    pushMessage("You", txt);
    input.value = "";
    setTimeout(() => pushMessage("Assistant", `Thanks — I heard: "${txt}". (Demo reply)`), 700);
  });

  function pushMessage(who, text) {
    const el = document.createElement("div");
    el.className = "msg";
    el.innerHTML = `<strong>${who}:</strong> <span>${escapeHtml(text)}</span>`;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  panel.style.display = "none";
}

/* ================= Voice Commands (Web Speech API) ================= */
function initVoice() {
  const voiceBtn = document.getElementById("voiceBtn");
  if (!voiceBtn) return;
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    voiceBtn.style.display = "none";
    return;
  }
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const r = new Rec();
  r.lang = "en-US";
  r.interimResults = false;
  r.maxAlternatives = 1;

  voiceBtn.addEventListener("click", () => {
    r.start();
    voiceBtn.textContent = "🎧";
  });

  r.onresult = (e) => {
    const txt = e.results[0][0].transcript.toLowerCase().trim();
    voiceBtn.textContent = "🎙️";
    handleVoiceCommand(txt);
  };
  r.onerror = () => (voiceBtn.textContent = "🎙️");

  function handleVoiceCommand(txt) {
    if (txt.includes("dark")) {
      document.getElementById("darkModeToggle")?.click();
      return;
    }
    if (txt.includes("get news") || txt.includes("news")) {
      document.getElementById("learn-more")?.click();
      return;
    }
    if (txt.startsWith("search ")) {
      const q = txt.replace("search ", "");
      const input = document.getElementById("nav-search-input");
      if (input) {
        input.value = q;
        input.dispatchEvent(new Event("input"));
      }
      return;
    }
    if (txt.includes("top") || txt.includes("scroll up")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // fallback: show recognized text in chat
    const chatOpen = document.getElementById("chatOpen");
    if (chatOpen) chatOpen.click();
    setTimeout(() => {
      const chatInput = document.getElementById("chatInput");
      if (chatInput) {
        chatInput.value = txt;
        document.getElementById("chatForm")?.dispatchEvent(new Event("submit", { cancelable: true }));
      }
    }, 300);
  }
}

/* ================= Scroll to top logic ================= */
function initScrollTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;
  window.addEventListener("scroll", () => (btn.style.display = window.scrollY > 200 ? "block" : "none"));
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ================= Contact form (connects to backend) ================= */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const resp = document.getElementById("responseMsg");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resp && (resp.textContent = "Sending...");
    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const message = document.getElementById("message")?.value.trim();

    if (!name || !email || !message) {
      resp && (resp.textContent = "Please fill all fields.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (data.success) {
        resp && (resp.style.color = "green");
        resp && (resp.textContent = "✅ Message sent successfully!");
        form.reset();
      } else {
        resp && (resp.style.color = "red");
        resp && (resp.textContent = "⚠️ " + (data.error || "Failed to send message."));
      }
    } catch (err) {
      console.error("Contact error:", err);
      resp && (resp.style.color = "red");
      resp && (resp.textContent = "❌ Could not send message. Try again.");
    }
  });
}

/* ================= Reveal cards older fallback (keeps behavior) ================= */
function initCardRevealFallback() {
  const cards = Array.from(document.querySelectorAll(".card"));
  if (!cards.length) return;
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;
    cards.forEach((card) => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerBottom) card.classList.add("visible");
    });
  };
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
}
initCardRevealFallback();

/* ================= Mobile menu (with animation) ================= */
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.textContent = navLinks.classList.contains("active") ? "✖" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.textContent = "☰";
    })
  );
}

/* ================= Futuristic cursor (only on desktop) ================= */
function initFuturisticCursor() {
  // Only apply on non-touch devices
  if ("ontouchstart" in window) return;
  const cursor = document.createElement("div");
  cursor.className = "futuristic-cursor";
  // styles via JS so no CSS edits needed (you can move to stylesheet if desired)
  Object.assign(cursor.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    pointerEvents: "none",
    background: "radial-gradient(circle, rgba(0,225,255,0.7), transparent 70%)",
    boxShadow: "0 0 30px rgba(0,225,255,0.4)",
    zIndex: "9999",
    transition: "transform 0.08s ease-out",
  });
  document.body.appendChild(cursor);

  let lastX = 0,
    lastY = 0,
    lastMove = Date.now();

  window.addEventListener("mousemove", (e) => {
    const now = Date.now();
    const speed = Math.min(1, (now - lastMove) / 50);
    lastMove = now;

    const x = e.clientX;
    const y = e.clientY;
    const dx = x - lastX;
    const dy = y - lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    cursor.style.transform = `translate(${x - 12}px, ${y - 12}px) scale(${1 + distance / 150})`;
    cursor.style.boxShadow = `0 0 ${15 + distance / 3}px rgba(0,225,255,0.6)`;
    cursor.style.background = `radial-gradient(circle, rgba(0,225,255,${0.5 + distance / 200}), transparent 70%)`;

    lastX = x;
    lastY = y;
  });
}
// ===== Responsive Hamburger Menu Toggle =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}
