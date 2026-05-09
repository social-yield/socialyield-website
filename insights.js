'use strict';

// ─── GOOGLE ANALYTICS ────────────────────────────────────────────────────────
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-GWD0JQLDQW');

// ─── EMAIL OBFUSCATION ───────────────────────────────────────────────────────
document.querySelectorAll('.obf-email').forEach(el => {
  const email = el.dataset.eu + '@' + el.dataset.ed;
  el.href = 'mailto:' + email;
  if (el.classList.contains('obf-email--show')) el.textContent = email;
});

// ─── NAV ─────────────────────────────────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ─── CATEGORY FILTER ─────────────────────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const cards      = document.querySelectorAll('.ins-card');
const noResults  = document.getElementById('no-results');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    let visible = 0;
    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) visible++;
    });
    noResults.style.display = visible === 0 ? 'block' : 'none';
  });
});

document.querySelectorAll('[data-filter="all"]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('.filter-btn[data-filter="all"]').click();
  });
});

// ─── NEWSLETTER FORM ─────────────────────────────────────────────────────────
const form    = document.getElementById('newsletter-form');
const success = document.getElementById('nl-success');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('nl-email').value.trim();
    if (!email) return;

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
    .then(() => {
      form.style.display = 'none';
      success.style.display = 'flex';
    })
    .catch(() => {
      form.style.display = 'none';
      success.style.display = 'flex';
    });
  });
}
