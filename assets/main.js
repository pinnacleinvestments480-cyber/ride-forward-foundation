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

// Donate amount selection + one-time/monthly toggle (smart routing to Stripe)
(function () {
  const grid = document.querySelector('[data-amount-grid]');
  const toggles = document.querySelectorAll('[data-give-toggle] button');
  const donateLink = document.querySelector('[data-donate-link]');
  const note = document.querySelector('[data-give-note]');
  if (!grid || !toggles.length || !donateLink) return;

  // One-time: a single Stripe link where the donor enters/confirms any amount.
  const ONE_TIME_LINK = 'https://buy.stripe.com/aFa8wQ1fm9Fib2U5YB7Re06';

  const PLANS = {
    'one-time': {
      label: 'Donate Now',
      note: 'You can enter or confirm your exact amount securely on the next screen.',
      amounts: [
        { amt: '$50',    desc: 'A jersey number plate',               link: ONE_TIME_LINK },
        { amt: '$100',   desc: 'A season membership',                 link: ONE_TIME_LINK },
        { amt: '$200',   desc: 'Local race fees',                     link: ONE_TIME_LINK },
        { amt: '$500',   desc: 'Helmet & gear',                       link: ONE_TIME_LINK },
        { amt: '$1,000', desc: 'A season of national race entry fees', link: ONE_TIME_LINK },
        { amt: 'Other',  desc: 'You choose',                          link: ONE_TIME_LINK }
      ]
    },
    'monthly': {
      label: 'Become a Monthly Member',
      note: 'Your monthly membership starts on the next screen — cancel anytime.',
      amounts: [
        { amt: '$10',  desc: 'Supporter \u2014 fund a rider all year',  link: 'https://buy.stripe.com/cNi6oIcY48Beef65YB7Re07' },
        { amt: '$25',  desc: "Rider's Circle \u2014 stories & reports", link: 'https://buy.stripe.com/4gM6oI7DKbNqgne9aN7Re0b' },
        { amt: '$50',  desc: "Mentor's Circle \u2014 event invites",    link: 'https://buy.stripe.com/4gMcN63nu8Be2wo72F7Re0c' },
        { amt: '$100', desc: "Champion's Circle \u2014 top tier",       link: 'https://buy.stripe.com/aFabJ2f6cbNqfjaaeR7Re0a' }
      ]
    }
  };

  // Default selected index per mode (start on the 2nd card, like the original).
  const DEFAULT_INDEX = { 'one-time': 1, 'monthly': 1 };

  function render(mode) {
    const plan = PLANS[mode];
    grid.innerHTML = '';
    plan.amounts.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'amount' + (i === DEFAULT_INDEX[mode] ? ' selected' : '');
      card.setAttribute('data-amount', '');
      card.setAttribute('data-link', item.link);
      card.innerHTML = '<div class="amt">' + item.amt + '</div><div class="desc">' + item.desc + '</div>';
      card.addEventListener('click', () => {
        grid.querySelectorAll('[data-amount]').forEach(x => x.classList.remove('selected'));
        card.classList.add('selected');
        donateLink.setAttribute('href', card.getAttribute('data-link'));
      });
      grid.appendChild(card);
    });
    // Point the button at the default selected card's link + update label/note.
    donateLink.setAttribute('href', plan.amounts[DEFAULT_INDEX[mode]].link);
    donateLink.textContent = plan.label;
    if (note) note.textContent = plan.note;
  }

  toggles.forEach(b => b.addEventListener('click', () => {
    toggles.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const mode = /month/i.test(b.textContent) ? 'monthly' : 'one-time';
    render(mode);
  }));

  // Initial render based on whichever toggle starts active.
  const startActive = document.querySelector('[data-give-toggle] button.active');
  render(startActive && /month/i.test(startActive.textContent) ? 'monthly' : 'one-time');
})();
