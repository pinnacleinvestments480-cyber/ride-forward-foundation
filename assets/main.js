// Mark JS as active so reveal animations apply (content stays visible if JS fails)
document.documentElement.classList.add('js');

// Theme toggle (no localStorage — sandbox-safe)
(function () {
  const t = document.querySelector('[data-theme-toggle]'),
    r = document.documentElement;
  let d = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  r.setAttribute('data-theme', d);
  const sun = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  const moon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  if (t) {
    t.innerHTML = d === 'dark' ? sun : moon;
    t.addEventListener('click', () => {
      d = d === 'dark' ? 'light' : 'dark';
      r.setAttribute('data-theme', d);
      t.innerHTML = d === 'dark' ? sun : moon;
      t.setAttribute('aria-label', 'Switch to ' + (d === 'dark' ? 'light' : 'dark') + ' mode');
    });
  }
})();

// Mobile menu
(function () {
  const btn = document.querySelector('[data-menu-btn]'),
    links = document.querySelector('[data-nav-links]');
  if (btn && links) btn.addEventListener('click', () => links.classList.toggle('open'));
})();

// Scroll reveal (fail-safe: never leaves content permanently hidden)
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  els.forEach(e => io.observe(e));
  // Safety net: reveal anything still hidden after load (e.g. observer edge cases)
  window.addEventListener('load', () => {
    setTimeout(() => {
      els.forEach(e => {
        const r = e.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.1) e.classList.add('in');
      });
    }, 400);
  });
})();

// Animate progress bar when visible
(function () {
  const fill = document.querySelector('[data-progress-fill]');
  if (!fill) return;
  const pct = fill.getAttribute('data-pct') || '0';
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { fill.style.width = pct + '%'; io.disconnect(); } });
  }, { threshold: 0.4 });
  io.observe(fill);
})();

// Donate amount selection + one-time/monthly toggle
(function () {
  const amounts = document.querySelectorAll('[data-amount]');
  amounts.forEach(a => a.addEventListener('click', () => {
    amounts.forEach(x => x.classList.remove('selected'));
    a.classList.add('selected');
  }));
  const toggles = document.querySelectorAll('[data-give-toggle] button');
  toggles.forEach(b => b.addEventListener('click', () => {
    toggles.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
  }));
})();
