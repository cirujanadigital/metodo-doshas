// ─────────────────────────────────────────────
// GLOBALS (reutilización = menos reflows)
// ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');
const painCards = document.querySelectorAll('.pain-card--extra');
const ytFacade = document.getElementById('ytFacade');

// ─────────────────────────────────────────────
// NAV MÓVIL
// ─────────────────────────────────────────────
hamburger?.addEventListener('click', () => {
  mobileNav.classList.add('open');
  document.body.style.overflow = 'hidden';
  hamburger.setAttribute('aria-expanded', 'true');
});

mobileClose?.addEventListener('click', closeMobileNav);

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

function closeMobileNav() {
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
  hamburger?.setAttribute('aria-expanded', 'false');
}

// ─────────────────────────────────────────────
// INTERSECTION OBSERVER (optimizado)
// ─────────────────────────────────────────────
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  }
);

function initFadeUp() {
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// Idle load = menos impacto en LCP
if ('requestIdleCallback' in window) {
  requestIdleCallback(initFadeUp, { timeout: 1000 });
} else {
  setTimeout(initFadeUp, 200);
}


const painBtn = document.getElementById('painExpandBtn');

if (painBtn) {
  painBtn.addEventListener('click', expandPain);
}
// ─────────────────────────────────────────────
// PATOLOGÍAS EXPANDIBLES (sin re-query)
// ─────────────────────────────────────────────
function expandPain() {
  const btn = painBtn;
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';

  if (!isExpanded) {
    painCards.forEach(card => {
      card.classList.add('revealed');
      card.removeAttribute('aria-hidden');
      observer.observe(card);
    });

    btn.setAttribute('aria-expanded', 'true');
    btn.querySelector('.pain-expand-icon').textContent = '↑';
    btn.firstChild.textContent = 'Ver menos ';
  } else {
    painCards.forEach(card => {
      card.classList.remove('revealed');
      card.setAttribute('aria-hidden', 'true');
    });

    btn.setAttribute('aria-expanded', 'false');
    btn.querySelector('.pain-expand-icon').textContent = '↓';
    btn.firstChild.textContent = 'Ver más condiciones ';
  }
}

// ─────────────────────────────────────────────
// MODAL PAÍS (con cleanup real)
// ─────────────────────────────────────────────
const ac = new AbortController();

function openCountryModal(e) {
  if (e) e.preventDefault();

  const modal = document.getElementById('countryModal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const firstFocusable = modal.querySelector('button, a, [tabindex]');
  if (firstFocusable) setTimeout(() => firstFocusable.focus(), 100);
}

function closeCountryModal() {
  document.getElementById('countryModal')?.classList.remove('open');
  document.body.style.overflow = '';
}

// Overlay click
document
  .getElementById('countryModal')
  ?.addEventListener('click', function (e) {
    if (e.target === this) closeCountryModal();
  });

// Escape global (OPTIMIZADO)
document.addEventListener(
  'keydown',
  e => {
    if (e.key === 'Escape') {
      closeCountryModal();
      closeMobileNav();
    }
  },
  { signal: ac.signal }
);

// ─────────────────────────────────────────────
// YOUTUBE FACADE (mejorado)
// ─────────────────────────────────────────────
function loadYouTube() {
  if (!ytFacade) return;

  const wrap = document.createElement('div');
  wrap.className = 'youtube-embed-wrap';
  wrap.style.cssText =
    'max-width:800px;margin:0 auto;border-radius:6px;overflow:hidden;box-shadow:0 16px 60px rgba(0,0,0,0.12);position:relative;padding-top:56.25%;';

  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube.com/embed/YNkB1huKLEw?autoplay=1';
  iframe.title = 'YouTube video player';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute(
    'allow',
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
  );
  iframe.setAttribute('allowfullscreen', '');
  iframe.style.cssText =
    'position:absolute;top:0;left:0;width:100%;height:100%;border:none;';

  wrap.appendChild(iframe);
  ytFacade.parentNode.replaceChild(wrap, ytFacade);
}

// Accesibilidad teclado
ytFacade?.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    loadYouTube();
  }
});
