/* ============================================================
   DOSHAS — main.js
   [4c] JS externalizado del HTML
============================================================ */

// ── NAV MÓVIL ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
  mobileNav.classList.add('open');
  document.body.style.overflow = 'hidden';
  hamburger.setAttribute('aria-expanded', 'true');
});

mobileClose.addEventListener('click', closeMobileNav);

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

function closeMobileNav() {
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
  hamburger.setAttribute('aria-expanded', 'false');
}

// ── FADE-UP SCROLL ANIMATIONS ──────────────────────────────
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── PATOLOGÍAS EXPANDIBLES [2g] ────────────────────────────
function expandPain() {
  const btn = document.getElementById('painExpandBtn');
  const extra = document.querySelectorAll('.pain-card--extra');
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';

  if (!isExpanded) {
    extra.forEach(card => {
      card.classList.add('revealed');
      card.removeAttribute('aria-hidden');
      observer.observe(card);
    });
    btn.setAttribute('aria-expanded', 'true');
    btn.querySelector('.pain-expand-icon').textContent = '↑';
    btn.firstChild.textContent = 'Ver menos ';
  } else {
    extra.forEach(card => {
      card.classList.remove('revealed');
      card.setAttribute('aria-hidden', 'true');
    });
    btn.setAttribute('aria-expanded', 'false');
    btn.querySelector('.pain-expand-icon').textContent = '↓';
    btn.firstChild.textContent = 'Ver más condiciones ';
  }
}

// ── MODAL PAÍS ─────────────────────────────────────────────
function openCountryModal(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('countryModal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Focus trap básico: focus al primer elemento interactivo del modal
  const firstFocusable = modal.querySelector('button, a, [tabindex]');
  if (firstFocusable) setTimeout(() => firstFocusable.focus(), 100);
}

function closeCountryModal() {
  document.getElementById('countryModal').classList.remove('open');
  document.body.style.overflow = '';
}

// Cerrar modal al hacer click en overlay
document.getElementById('countryModal').addEventListener('click', function (e) {
  if (e.target === this) closeCountryModal();
});

// Cerrar modal con Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeCountryModal();
    closeMobileNav();
  }
});

// ── YOUTUBE FACADE [4b] ────────────────────────────────────
function loadYouTube() {
  const facade = document.getElementById('ytFacade');
  if (!facade) return;

  const wrap = document.createElement('div');
  wrap.className = 'youtube-embed-wrap';
  wrap.style.cssText =
    'max-width:800px;margin:0 auto;border-radius:6px;overflow:hidden;box-shadow:0 16px 60px rgba(0,0,0,0.12);position:relative;padding-top:56.25%;';

  const iframe = document.createElement('iframe');
  iframe.src =
    'https://www.youtube.com/embed/YNkB1huKLEw?si=o0yMR6I06XCMkRDA&autoplay=1';
  iframe.title = 'YouTube video player';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute(
    'allow',
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
  );
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  iframe.setAttribute('allowfullscreen', '');
  iframe.style.cssText =
    'position:absolute;top:0;left:0;width:100%;height:100%;border:none;';

  wrap.appendChild(iframe);
  facade.parentNode.replaceChild(wrap, facade);
}

// Teclado en facade de YouTube
document.getElementById('ytFacade') &&
  document.getElementById('ytFacade').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      loadYouTube();
    }
  });
