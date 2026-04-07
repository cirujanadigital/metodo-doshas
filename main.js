// ─────────────────────────────────────────────
// GLOBALS
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
  document.documentElement.classList.add('no-scroll');
  hamburger.setAttribute('aria-expanded', 'true');
});
mobileClose?.addEventListener('click', closeMobileNav);
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});
function closeMobileNav() {
  mobileNav.classList.remove('open');
  document.documentElement.classList.remove('no-scroll');
  hamburger?.setAttribute('aria-expanded', 'false');
}

// ─────────────────────────────────────────────
// INTERSECTION OBSERVER
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
  { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
);

function initFadeUp() {
  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.willChange = 'auto';
    observer.observe(el);
  });
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(initFadeUp, { timeout: 1000 });
} else {
  setTimeout(initFadeUp, 200);
}

// ─────────────────────────────────────────────
// SCROLLBAR COMPENSATION — después del load completo
// ─────────────────────────────────────────────
window.addEventListener('load', () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(
      () => {
        const sw = window.innerWidth - document.documentElement.clientWidth;
        document.documentElement.style.setProperty(
          '--scrollbar-comp',
          sw + 'px'
        );
      },
      { timeout: 2000 }
    );
  } else {
    setTimeout(() => {
      const sw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-comp', sw + 'px');
    }, 500);
  }
});

// ─────────────────────────────────────────────
// PATOLOGÍAS EXPANDIBLES
// ─────────────────────────────────────────────
const painBtn = document.getElementById('painExpandBtn');
if (painBtn) {
  painBtn.addEventListener('click', expandPain);
}

function expandPain() {
  const isExpanded = painBtn.getAttribute('aria-expanded') === 'true';
  if (!isExpanded) {
    painCards.forEach(card => {
      card.classList.add('revealed');
      card.removeAttribute('aria-hidden');
      observer.observe(card);
    });
    painBtn.setAttribute('aria-expanded', 'true');
    painBtn.querySelector('.pain-expand-icon').textContent = '↑';
    painBtn.firstChild.textContent = 'Ver menos ';
  } else {
    painCards.forEach(card => {
      card.classList.remove('revealed');
      card.setAttribute('aria-hidden', 'true');
    });
    painBtn.setAttribute('aria-expanded', 'false');
    painBtn.querySelector('.pain-expand-icon').textContent = '↓';
    painBtn.firstChild.textContent = 'Ver más condiciones ';
  }
}

// ─────────────────────────────────────────────
// MODAL PAÍS
// ─────────────────────────────────────────────
const ac = new AbortController();

function openCountryModal(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('countryModal');
  if (!modal) return;
  document.documentElement.classList.add('no-scroll');
  modal.classList.add('open');
  const firstFocusable = modal.querySelector('button, a, [tabindex]');
  if (firstFocusable) requestAnimationFrame(() => firstFocusable.focus());
}

function closeCountryModal() {
  const modal = document.getElementById('countryModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.documentElement.classList.remove('no-scroll');
}

document
  .getElementById('countryModal')
  ?.addEventListener('click', function (e) {
    if (e.target === this) closeCountryModal();
  });

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
// YOUTUBE FACADE
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

ytFacade?.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    loadYouTube();
  }
});
