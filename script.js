/* === Default Theme: Light Blue === */
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("dark-mode");
  localStorage.setItem("theme", "light");
});

/* ================= INIT ON DOM READY ================= */
document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initDarkMode();
  initRevealObserver();
  initSearch();
  initCarousel();
  initParticles();
  initChatWidget();
  initVoice();
  initScrollTop();
  initContactForm(); // keeps previous placeholder behavior or will connect to backend later
});

/* ================= Loading Overlay ================= */
function initLoading(){
  const overlay = document.getElementById('loadingOverlay');
  // Keep splash for a short time to show effect
  setTimeout(()=> {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    overlay.setAttribute('aria-hidden','true');
    setTimeout(()=> overlay.remove(), 600);
  }, 900);
}

/* ================= Dark Mode (persisted) ================= */
function initDarkMode(){
  const toggle = document.getElementById('darkModeToggle');
  const saved = localStorage.getItem('theme');
  if(saved === 'dark'){ document.body.classList.add('dark'); toggle.textContent='☀️'; toggle.setAttribute('aria-pressed','true'); }
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    toggle.textContent = isDark ? '☀️' : '🌙';
    toggle.setAttribute('aria-pressed', String(isDark));
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

/* ================= Reveal on scroll (IntersectionObserver) ================= */
function initRevealObserver(){
  const revs = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach((e, i) => {
      if(e.isIntersecting){
        e.target.classList.add('active');
        // if element contains child cards, stagger small delay
        const cards = e.target.querySelectorAll('.card');
        if(cards.length){
          cards.forEach((c, idx)=> setTimeout(()=> c.classList.add('revealed'), idx*150));
        }
        o.unobserve(e.target);
      }
    });
  }, {threshold:0.12});
  revs.forEach(r=> obs.observe(r));
}

/* ================= Live Search (nav) ================= */
function initSearch(){
  const input = document.getElementById('nav-search-input');
  const cards = Array.from(document.querySelectorAll('.card'));
  const slides = Array.from(document.querySelectorAll('.slide'));
  input.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    // filter cards
    cards.forEach(c => {
      const text = (c.textContent + ' ' + (c.dataset.keywords||'')).toLowerCase();
      c.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
    // highlight slides that match
    slides.forEach(s => {
      const text = (s.textContent || '').toLowerCase();
      s.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
  });
}

/* ================= Carousel (auto + controls) ================= */
function initCarousel(){
  const slides = Array.from(document.querySelectorAll('.slide'));
  if(!slides.length) return;
  let idx = 0;
  const show = i => {
    slides.forEach(s=> s.classList.remove('active'));
    if(slides[i]) slides[i].classList.add('active');
  };
  show(idx);
  const next = ()=> { idx = (idx+1)%slides.length; show(idx); };
  const prev = ()=> { idx = (idx-1+slides.length)%slides.length; show(idx); };
  let timer = setInterval(next, 4500);
  document.getElementById('nextSlide').addEventListener('click', ()=> { next(); reset(); });
  document.getElementById('prevSlide').addEventListener('click', ()=> { prev(); reset(); });
  function reset(){ clearInterval(timer); timer = setInterval(next, 4500); }
}

/* ================= Hero Particles (lightweight) ================= */
function initParticles(){
  const canvas = document.getElementById('heroCanvas');
  if(!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const resize = ()=> {
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);
  };
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  const ctx = canvas.getContext('2d');
  let particles = [];
  const max = 40;

  function make(){
    particles = [];
    for(let i=0;i<max;i++){
      particles.push({
        x: Math.random()*canvas.clientWidth,
        y: Math.random()*canvas.clientHeight,
        r: 0.6 + Math.random()*2.2,
        vx: (Math.random()-0.5)*0.4,
        vy: (Math.random()-0.5)*0.4,
        alpha: 0.2 + Math.random()*0.6
      });
    }
  }
  resize();
  make();
  window.addEventListener('resize', ()=> { ctx.setTransform(1,0,0,1,0,0); resize(); make(); });

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const p of particles){
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if(p.x < -10) p.x = canvas.clientWidth + 10;
      if(p.x > canvas.clientWidth + 10) p.x = -10;
      if(p.y < -10) p.y = canvas.clientHeight + 10;
      if(p.y > canvas.clientHeight + 10) p.y = -10;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ================= Chat widget (front-end only) ================= */
function initChatWidget(){
  const open = document.getElementById('chatOpen');
  const panel = document.getElementById('chatPanel');
  const close = document.getElementById('chatClose');
  const body = document.getElementById('chatBody');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');

  open.addEventListener('click', ()=> {
    panel.setAttribute('aria-hidden','false'); panel.style.display='flex';
    document.getElementById('chatWidget').setAttribute('aria-hidden','false');
  });
  close.addEventListener('click', ()=> {
    panel.setAttribute('aria-hidden','true'); panel.style.display='none';
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const txt = input.value.trim();
    if(!txt) return;
    pushMessage('You', txt);
    input.value='';
    // simple canned reply (simulate AI)
    setTimeout(()=> pushMessage('Assistant', `Thanks — I heard: "${txt}". (Demo reply)`), 700);
  });

  function pushMessage(who, text){
    const el = document.createElement('div');
    el.className = 'msg';
    el.innerHTML = `<strong>${who}:</strong> <span>${escapeHtml(text)}</span>`;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }
  function escapeHtml(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // hide panel by default
  panel.style.display='none';
}

/* ================= Voice Commands (Web Speech API) ================= */
function initVoice(){
  const voiceBtn = document.getElementById('voiceBtn');
  if(!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    voiceBtn.style.display='none';
    return;
  }
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const r = new Rec();
  r.lang = 'en-US';
  r.interimResults = false;
  r.maxAlternatives = 1;

  voiceBtn.addEventListener('click', ()=> {
    r.start();
    voiceBtn.textContent = '🎧';
  });

  r.onresult = (e) => {
    const txt = e.results[0][0].transcript.toLowerCase().trim();
    voiceBtn.textContent = '🎙️';
    handleVoiceCommand(txt);
  };
  r.onerror = ()=> voiceBtn.textContent = '🎙️';

  function handleVoiceCommand(txt){
    // commands: dark mode, get news, search <term>, top
    if(txt.includes('dark')) {
      document.getElementById('darkModeToggle').click();
      return;
    }
    if(txt.includes('get news') || txt.includes('news')) {
      document.getElementById('learn-more').click();
      return;
    }
    if(txt.startsWith('search ')) {
      const q = txt.replace('search ','');
      const input = document.getElementById('nav-search-input');
      input.value = q; input.dispatchEvent(new Event('input'));
      return;
    }
    if(txt.includes('top') || txt.includes('scroll up')) {
      window.scrollTo({top:0,behavior:'smooth'}); return;
    }
    // fallback: show recognized text in chat stub
    const chatOpen = document.getElementById('chatOpen'); chatOpen.click();
    setTimeout(()=> {
      document.getElementById('chatInput').value = txt;
      document.getElementById('chatForm').dispatchEvent(new Event('submit',{cancelable:true}));
    }, 300);
  }
}

/* ================= Scroll to top logic ================= */
function initScrollTop(){
  const btn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', ()=> btn.style.display = window.scrollY > 200 ? 'block' : 'none');
  btn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
}

/* ================= Contact form placeholder handler ================= */
function initContactForm(){
  const form = document.getElementById('contactForm');
  const resp = document.getElementById('responseMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    resp.textContent = 'Sending...';
    const name = document.getElementById('name').value.trim();
    setTimeout(()=> {
      resp.textContent = `✅ Thanks ${name || ''}, we received your message (demo).`;
      form.reset();
    }, 900);
  });
}
// Reveal cards when they scroll into view
const cards = document.querySelectorAll('.card');

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;

  cards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < triggerBottom) {
      card.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// Dark mode toggle
const toggleBtn = document.createElement('button');
toggleBtn.id = 'toggle-dark';
toggleBtn.innerText = '☾ Dark Mode';
document.querySelector('nav').appendChild(toggleBtn);

// Apply saved mode
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  toggleBtn.innerText = '☀ Light Mode';
}

// Toggle on click
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  toggleBtn.innerText = isDark ? '☀ Light Mode' : '☾ Dark Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
/* === Futuristic Glowing Cursor Effect === */
const cursor = document.createElement('div');
cursor.style.position = 'fixed';
cursor.style.top = '0';
cursor.style.left = '0';
cursor.style.width = '25px';
cursor.style.height = '25px';
cursor.style.borderRadius = '50%';
cursor.style.pointerEvents = 'none';
cursor.style.background = 'radial-gradient(circle, rgba(0,225,255,0.7), transparent 70%)';
cursor.style.boxShadow = '0 0 30px rgba(0,225,255,0.4)';
cursor.style.zIndex = '9999';
cursor.style.transition = 'transform 0.08s ease-out';
document.body.appendChild(cursor);

let lastX = 0, lastY = 0;
let lastMove = Date.now();

window.addEventListener('mousemove', e => {
  const now = Date.now();
  const speed = Math.min(1, (now - lastMove) / 50);
  lastMove = now;

  const x = e.clientX;
  const y = e.clientY;

  const dx = x - lastX;
  const dy = y - lastY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Position smoothing
  cursor.style.transform = `translate(${x - 12}px, ${y - 12}px) scale(${1 + distance / 150})`;

  // Glow intensity changes with movement speed
  cursor.style.boxShadow = `0 0 ${15 + distance / 3}px rgba(0,225,255,0.6)`;
  cursor.style.background = `radial-gradient(circle, rgba(0,225,255,${0.5 + distance / 200}), transparent 70%)`;

  lastX = x;
  lastY = y;
});
// Splash Screen Animation
window.addEventListener("load", () => {
  const splash = document.getElementById("splash-screen");
  setTimeout(() => {
    splash.style.display = "none";
  }, 4000); // 4 seconds then fade out
});
// Splash Screen Animation
window.addEventListener("load", () => {
  const splash = document.getElementById("splash-screen");
  setTimeout(() => {
    splash.style.opacity = "0";
    setTimeout(() => splash.style.display = "none", 800);
  }, 4000); // stays visible for 4s total
});
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const res = await fetch('/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  });

  const data = await res.json();
  alert(data.message);
});
