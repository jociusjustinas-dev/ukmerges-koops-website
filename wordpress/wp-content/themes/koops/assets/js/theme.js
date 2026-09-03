(function () {
  const body = document.body;
  const header = document.querySelector('[data-site-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-menu-panel]');

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const closeMenu = () => {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Atverti meniu');
    panel.classList.remove('is-open');
    body.classList.remove('menu-open');
  };

  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Uždaryti meniu' : 'Atverti meniu');
    panel?.classList.toggle('is-open', open);
    body.classList.toggle('menu-open', open);
  });
  panel?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((element) => observer.observe(element));
  }

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('.edge-carousel-track');
    const cards = Array.from(carousel.querySelectorAll('.store-card'));
    const progress = carousel.querySelector('.carousel-progress span');
    if (!track || cards.length === 0) return;
    const step = () => cards[0].getBoundingClientRect().width + 26;
    const update = () => {
      const max = Math.max(1, track.scrollWidth - track.clientWidth);
      const ratio = Math.max(0, Math.min(1, track.scrollLeft / max));
      if (progress) progress.style.transform = `translateX(${ratio * 400}%)`;
    };
    carousel.querySelector('[data-carousel-prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    carousel.querySelector('[data-carousel-next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    track.addEventListener('scroll', update, { passive: true });
    update();
  });
})();

