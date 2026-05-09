'use strict';

// ─── COOKIE CONSENT + GOOGLE ANALYTICS ───────────────────────────────────────
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

(function () {
  const banner  = document.getElementById('cookie-banner');
  const accept  = document.getElementById('cookie-accept');
  const decline = document.getElementById('cookie-decline');
  const consent = localStorage.getItem('sy_cookie_consent');

  function enableGA() {
    gtag('js', new Date());
    gtag('config', 'G-GWD0JQLDQW');
  }

  function showBanner() {
    if (!banner) return;
    banner.classList.remove('hidden');
    requestAnimationFrame(() => banner.classList.add('visible'));
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.remove('visible');
    setTimeout(() => banner.classList.add('hidden'), 400);
  }

  if (consent === 'accepted') {
    enableGA();
  } else if (consent === 'declined') {
    // GA stays off
  } else {
    showBanner();
  }

  if (accept) {
    accept.addEventListener('click', () => {
      localStorage.setItem('sy_cookie_consent', 'accepted');
      hideBanner();
      enableGA();
    });
  }

  if (decline) {
    decline.addEventListener('click', () => {
      localStorage.setItem('sy_cookie_consent', 'declined');
      hideBanner();
    });
  }
}());

// ─── EMAIL OBFUSCATION ───────────────────────────────────────────────────────
document.querySelectorAll('.obf-email').forEach(el => {
  const email = el.dataset.eu + '@' + el.dataset.ed;
  el.href = 'mailto:' + email;
  if (el.classList.contains('obf-email--show')) el.textContent = email;
});

// ─── NAV ─────────────────────────────────────────────────────────────────────
const nav      = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  }, { passive: true });
}
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ─── CALCULATOR TABS ─────────────────────────────────────────────────────────
document.querySelectorAll('.calc-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.calc-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.calc-panel').forEach(p => p.classList.add('hidden'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.remove('hidden');
  });
});

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmt(n) {
  return '£' + new Intl.NumberFormat('en-GB').format(Math.round(Math.abs(n)));
}
function pct(n) {
  return n.toFixed(2) + '%';
}
function getVal(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

// ─── YIELD CALCULATOR ────────────────────────────────────────────────────────
const yieldBtn         = document.getElementById('yield-calc-btn');
const yieldPlaceholder = document.getElementById('yield-placeholder');
const yieldResultsInner = document.getElementById('yield-results-inner');
const yieldResultsGrid  = document.getElementById('yield-results-grid');
const yieldEmailGate    = document.getElementById('yield-email-gate');
const yieldGateForm     = document.getElementById('yield-gate-form');
const yieldGateEmail    = document.getElementById('yield-gate-email');

let pendingYield = null;

if (yieldBtn) {
  yieldBtn.addEventListener('click', () => {
    const propValue   = getVal('y-prop-value');
    const monthlyRent = getVal('y-monthly-rent');
    const costsPct    = getVal('y-costs') || 15;

    if (!propValue || propValue <= 0) { alert('Please enter a valid property purchase price.'); return; }
    if (!monthlyRent || monthlyRent <= 0) { alert('Please enter a valid monthly rent.'); return; }

    const annualGross = monthlyRent * 12;
    const grossYield  = (annualGross / propValue) * 100;
    const annualNet   = annualGross * (1 - costsPct / 100);
    const netYield    = (annualNet / propValue) * 100;

    pendingYield = {
      grossYield:  pct(grossYield),
      netYield:    pct(netYield),
      annualGross: fmt(annualGross),
      annualNet:   fmt(annualNet),
    };

    // Write to hidden form fields
    document.getElementById('f-gross-yield').value  = pendingYield.grossYield;
    document.getElementById('f-net-yield').value    = pendingYield.netYield;
    document.getElementById('f-annual-gross').value = pendingYield.annualGross;
    document.getElementById('f-annual-net').value   = pendingYield.annualNet;

    // Show blurred results with gate
    yieldPlaceholder.classList.add('hidden');
    yieldResultsInner.classList.remove('hidden');

    // Write visible-but-blurred preview values
    document.getElementById('y-gross-yield').textContent  = pendingYield.grossYield;
    document.getElementById('y-net-yield').textContent    = pendingYield.netYield;
    document.getElementById('y-annual-gross').textContent = pendingYield.annualGross;
    document.getElementById('y-annual-net').textContent   = pendingYield.annualNet;

    yieldResultsInner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

function revealYieldResults() {
  yieldEmailGate.classList.add('hidden');
  yieldResultsGrid.classList.add('revealed');
}

if (yieldGateForm) {
  yieldGateForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = yieldGateEmail ? yieldGateEmail.value.trim() : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (yieldGateEmail) {
        yieldGateEmail.style.borderColor = '#e57373';
        setTimeout(() => { yieldGateEmail.style.borderColor = ''; }, 1200);
      }
      return;
    }
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(yieldGateForm)).toString(),
    })
    .finally(() => revealYieldResults());
  });
  if (yieldGateEmail) {
    yieldGateEmail.addEventListener('input', () => { yieldGateEmail.style.borderColor = ''; });
  }
}

// ─── SCROLL REVEAL ───────────────────────────────────────────────────────────
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
}());

// ─── MORTGAGE CALCULATOR ─────────────────────────────────────────────────────
const mortgageBtn         = document.getElementById('mortgage-calc-btn');
const mortgagePlaceholder = document.getElementById('mortgage-placeholder');
const mortgageResultsInner = document.getElementById('mortgage-results-inner');

if (mortgageBtn) {
  mortgageBtn.addEventListener('click', () => {
    const propValue  = getVal('m-prop-value');
    const depositPct = getVal('m-deposit');
    const rate       = getVal('m-rate');
    const term       = getVal('m-term') || 25;

    if (!propValue || propValue <= 0)                    { alert('Please enter a valid property value.'); return; }
    if (!depositPct || depositPct <= 0 || depositPct >= 100) { alert('Please enter a valid deposit %.'); return; }
    if (!rate || rate <= 0)                               { alert('Please enter a valid interest rate.'); return; }

    const depositAmt = propValue * (depositPct / 100);
    const loan       = propValue - depositAmt;
    const mr         = rate / 100 / 12;
    const n          = term * 12;
    const monthly    = loan * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
    const totalRepaid  = monthly * n;
    const totalInterest = totalRepaid - loan;
    const ltv          = (loan / propValue) * 100;

    document.getElementById('m-monthly').textContent     = fmt(monthly) + '/mo';
    document.getElementById('m-loan').textContent        = fmt(loan);
    document.getElementById('m-total').textContent       = fmt(totalRepaid);
    document.getElementById('m-interest').textContent    = fmt(totalInterest);
    document.getElementById('m-ltv').textContent         = pct(ltv);
    document.getElementById('m-deposit-amt').textContent = fmt(depositAmt);

    mortgagePlaceholder.classList.add('hidden');
    mortgageResultsInner.classList.remove('hidden');
    mortgageResultsInner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
