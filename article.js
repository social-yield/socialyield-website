'use strict';

// ─── GOOGLE ANALYTICS ────────────────────────────────────────────────────────
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-GWD0JQLDQW');

// Email obfuscation
document.querySelectorAll('.obf-email').forEach(el => {
  const email = el.dataset.eu + '@' + el.dataset.ed;
  el.href = 'mailto:' + email;
  if (el.classList.contains('obf-email--show')) el.textContent = email;
});

// Reading progress bar
const progress = document.getElementById('read-progress');
const artBody = document.getElementById('art-body');

window.addEventListener('scroll', () => {
  if (!artBody) return;
  const rect = artBody.getBoundingClientRect();
  const total = artBody.offsetHeight - window.innerHeight;
  const scrolled = -rect.top;
  const pct = Math.min(Math.max((scrolled / total) * 100, 0), 100);
  progress.style.width = pct + '%';
}, { passive: true });

// Active TOC link on scroll
const tocLinks = document.querySelectorAll('.toc-link');
const headings = document.querySelectorAll('.art-body h2[id]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      tocLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });

headings.forEach(h => observer.observe(h));

// Copy link button
const copyBtn = document.getElementById('copy-link');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const orig = copyBtn.innerHTML;
      copyBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
      setTimeout(() => { copyBtn.innerHTML = orig; }, 2000);
    });
  });
}

// Mobile nav (re-use from main.js via nav-toggle/nav-links already on page)
