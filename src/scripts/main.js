/**
 * Site-wide client-side script.
 * Bundled by Astro/Vite via `<script>import '...'</script>` in Layout.astro.
 */

function init() {
  initYearStamp();
  initHeaderScroll();
  initMenu();
  initHeroTilt();
  initRevealOnScroll();
  initCountUp();
  initPortfolioFilter();
  initContactForm();

  console.info('[iris-web] main.js initialized');
}

/* ----------------------------------------------------------------- */

function initYearStamp() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

/* ----------------------------------------------------------------- */

function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ----------------------------------------------------------------- */

function initMenu() {
  const trigger = document.querySelector('[data-menu-trigger]');
  const closeBtn = document.querySelector('[data-menu-close]');
  const menu = document.querySelector('[data-menu]');
  if (!trigger || !menu) return;

  const links = menu.querySelectorAll('[data-menu-link]');

  function open() {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  function close() {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  trigger.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  links.forEach((link) => link.addEventListener('click', close));

  // Click on backdrop to close
  menu.querySelector('.menu-backdrop')?.addEventListener('click', close);

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
  });
}

/* ----------------------------------------------------------------- */

function initHeroTilt() {
  const hero = document.getElementById('hero');
  const logoWrap = document.querySelector('[data-tilt]');
  if (!hero || !logoWrap) return;

  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let frame = null;
  let mouseX = 0;
  let mouseY = 0;

  function update() {
    const rotateY = mouseX * 12; // horizontal rotation
    const rotateX = -mouseY * 8; // vertical rotation
    const logoEl = logoWrap.querySelector('.hero-logo');
    if (logoEl) {
      logoEl.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    frame = null;
  }

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    if (!frame) frame = requestAnimationFrame(update);
  });

  hero.addEventListener('mouseleave', () => {
    const logoEl = logoWrap.querySelector('.hero-logo');
    if (logoEl) {
      logoEl.style.transform = 'perspective(1400px) rotateX(0) rotateY(0)';
    }
  });
}

/* ----------------------------------------------------------------- */

function initRevealOnScroll() {
  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reveals.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    reveals.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.revealDelay || '0', 10);
          setTimeout(() => entry.target.classList.add('is-revealed'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ----------------------------------------------------------------- */

function initCountUp() {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach((el) => {
      el.textContent = el.dataset.countTo + (el.dataset.countSuffix || '');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}

function countUp(el) {
  const target = parseFloat(el.dataset.countTo);
  const suffix = el.dataset.countSuffix || '';
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.round(target * eased);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

/* ----------------------------------------------------------------- */

function initPortfolioFilter() {
  const filterRoot = document.querySelector('[data-portfolio-filters]');
  const grid = document.querySelector('[data-portfolio-grid]');
  if (!filterRoot || !grid) return;

  filterRoot.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    const filter = btn.dataset.filter;

    filterRoot
      .querySelectorAll('.filter-btn')
      .forEach((b) => b.classList.toggle('is-active', b === btn));

    grid.querySelectorAll('.portfolio-item').forEach((item) => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('is-hidden', !match);
    });
  });
}

/* ----------------------------------------------------------------- */

function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  const note = document.querySelector('[data-form-note]');
  if (!form || !note) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'contact_form_submit',
        formName: 'main_contact',
        name: data.name,
        email: data.email,
      });
    }

    note.textContent =
      "Thanks! Hook this form up to a backend, Formspree, or Netlify Forms to receive submissions.";
    note.className = 'form-note is-success';
    form.reset();
  });
}

/* ----------------------------------------------------------------- */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
