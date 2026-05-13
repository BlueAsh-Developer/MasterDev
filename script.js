// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link, .mobile-btn').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ===== PARTICLES =====
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const delay = Math.random() * 8;
    const dur = Math.random() * 10 + 8;
    Object.assign(p.style, {
      position: 'absolute',
      left: x + '%',
      bottom: '-10px',
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      background: Math.random() > 0.5 ? 'rgba(168,85,247,0.6)' : 'rgba(6,182,212,0.6)',
      boxShadow: '0 0 6px currentColor',
      animation: `particleRise ${dur}s ${delay}s linear infinite`,
      opacity: Math.random() * 0.7 + 0.3,
    });
    container.appendChild(p);
  }
  // inject keyframe
  const style = document.createElement('style');
  style.textContent = `@keyframes particleRise {
    0%   { transform: translateY(0) translateX(0); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.5; }
    100% { transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}40px); opacity: 0; }
  }`;
  document.head.appendChild(style);
})();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.service-card, .why-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  this.reset();
  setTimeout(() => toast.classList.remove('show'), 3500);
});

// ===== CARD TILT EFFECT =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) scale(1.02) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== AUTH PAGE =====
(function initAuth() {
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  if (!loginTab) return;

  function switchTab(tab) {
    if (tab === 'login') {
      loginTab.classList.add('active'); signupTab.classList.remove('active');
      loginForm.classList.add('active'); signupForm.classList.remove('active');
    } else {
      signupTab.classList.add('active'); loginTab.classList.remove('active');
      signupForm.classList.add('active'); loginForm.classList.remove('active');
    }
  }

  loginTab.addEventListener('click', () => switchTab('login'));
  signupTab.addEventListener('click', () => switchTab('signup'));
  document.getElementById('toSignup')?.addEventListener('click', e => { e.preventDefault(); switchTab('signup'); });
  document.getElementById('toLogin')?.addEventListener('click', e => { e.preventDefault(); switchTab('login'); });

  // Check URL param
  if (new URLSearchParams(location.search).get('tab') === 'signup') switchTab('signup');

  // Password toggle
  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁' : '🙈';
    });
  });

  // Password strength
  const pwInput = document.getElementById('signupPassword');
  const fill = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  if (pwInput && fill && label) {
    pwInput.addEventListener('input', () => {
      const v = pwInput.value;
      let score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v)) score++;
      if (/[0-9]/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      const pct = (score / 4) * 100;
      const colors = ['#ef4444','#f97316','#eab308','#22c55e'];
      const labels = ['Weak','Fair','Good','Strong'];
      fill.style.width = pct + '%';
      fill.style.background = colors[score - 1] || '#ef4444';
      label.textContent = labels[score - 1] || 'Too short';
    });
  }

  // Form submit → redirect to profile
  loginForm?.addEventListener('submit', e => {
    e.preventDefault();
    window.location.href = 'profile.html';
  });
  signupForm?.addEventListener('submit', e => {
    e.preventDefault();
    window.location.href = 'profile.html';
  });
})();

// ===== CHECKOUT PAGE =====
(function initCheckout() {
  if (!document.querySelector('.checkout-page')) return;

  // Pre-select service from URL param
  const params = new URLSearchParams(location.search);
  const svc = params.get('service');
  const sel = document.getElementById('serviceSelect');
  if (sel && svc) {
    const opt = [...sel.options].find(o => o.value === svc);
    if (opt) sel.value = svc;
  }

  const servicePrices = {
    'website': ['Website Development', 'PKR 15,000'],
    'app': ['App Development', 'PKR 25,000'],
    'discord-bot': ['Discord Bot Development', 'PKR 8,000'],
    'telegram-bot': ['Telegram Bot Development', 'PKR 6,000'],
    'backend': ['Backend & API Development', 'PKR 20,000'],
    'vps': ['VPS Setup & Management', 'PKR 5,000'],
    'minecraft': ['Minecraft Server Dev', 'PKR 10,000'],
    'ai': ['AI-Powered Development', 'PKR 30,000'],
    'saas': ['SaaS Product Development', 'PKR 50,000'],
    'automation': ['Workflow Automation', 'PKR 12,000'],
    'security': ['Security Audit & Hardening', 'PKR 18,000'],
  };

  function updateSummary() {
    const v = sel?.value;
    const data = servicePrices[v] || ['Website Development', 'PKR 15,000'];
    const nameEl = document.getElementById('summaryServiceName');
    const baseEl = document.getElementById('summaryBase');
    const totalEl = document.getElementById('summaryTotal');
    if (nameEl) nameEl.textContent = data[0];
    if (baseEl) baseEl.textContent = data[1];
    if (totalEl) totalEl.textContent = data[1];
  }
  sel?.addEventListener('change', updateSummary);
  updateSummary();

  // Payment tabs
  document.querySelectorAll('.pay-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.pay-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.tab)?.classList.add('active');
    });
  });

  // Bank sub-options
  document.querySelectorAll('.bank-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.bank-option').forEach(o => o.classList.remove('active'));
      document.querySelectorAll('.bank-details').forEach(d => d.classList.add('hidden'));
      opt.classList.add('active');
      document.getElementById('details-' + opt.dataset.method)?.classList.remove('hidden');
    });
  });

  // Card number formatting
  const cardNum = document.getElementById('cardNumber');
  cardNum?.addEventListener('input', () => {
    let v = cardNum.value.replace(/\D/g, '').slice(0, 16);
    cardNum.value = v.replace(/(.{4})/g, '$1 ').trim();
    const display = document.getElementById('cardNumDisplay');
    if (display) display.textContent = cardNum.value || '•••• •••• •••• ••••';
  });
  document.getElementById('cardName')?.addEventListener('input', e => {
    const d = document.getElementById('cardNameDisplay');
    if (d) d.textContent = e.target.value.toUpperCase() || 'CARDHOLDER NAME';
  });
  document.getElementById('cardExp')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
    e.target.value = v;
    const d = document.getElementById('cardExpDisplay');
    if (d) d.textContent = v || 'MM/YY';
  });

  // File upload label
  document.getElementById('receiptFile')?.addEventListener('change', e => {
    const label = document.getElementById('fileLabel');
    if (label && e.target.files[0]) label.textContent = e.target.files[0].name;
  });

  // Place order
  document.getElementById('placeOrderBtn')?.addEventListener('click', () => {
    document.getElementById('orderModal')?.classList.add('show');
  });
})();

// ===== DASHBOARD =====
(function initDashboard() {
  if (!document.querySelector('.dashboard-body')) return;

  // Sidebar navigation
  document.querySelectorAll('.sidebar-link[data-panel]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const panel = link.dataset.panel;
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
      link.classList.add('active');
      document.getElementById('panel-' + panel)?.classList.add('active');
      const title = document.getElementById('topbarTitle');
      if (title) title.textContent = link.textContent.trim();
      // Close sidebar on mobile
      document.getElementById('sidebar')?.classList.remove('open');
    });
  });

  // Sidebar toggle (mobile)
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
  });
})();

// ===== COPY CRYPTO ADDRESS =====
function copyAddr() {
  const addr = document.getElementById('cryptoAddr')?.textContent;
  if (addr) navigator.clipboard.writeText(addr).then(() => {
    const btn = document.querySelector('.copy-btn');
    if (btn) { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy', 2000); }
  });
}
