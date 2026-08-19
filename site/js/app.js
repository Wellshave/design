/* ========== WELLSHAVE — GROOM GUARD PRO ==========
   Scroll-scrubbed canvas sequence + RPM HUD + chapter rail + configurator.
   Vanilla JS, no dependencies.
================================================== */

(() => {
  'use strict';

  const MAX_RPM = 6600;
  const CHAPTERS = [
    { t: 0.00, no: '01', title: 'DE TRIM',           txt: 'Droog trimmen — 6600 RPM door de dikste haren.' },
    { t: 0.34, no: '02', title: 'ONDER DE DOUCHE',   txt: 'IPX7 — de hele body mag gewoon onder water.' },
    { t: 0.68, no: '03', title: 'SKINSAFE',          txt: 'Foil shaver kop werkt af. Geen sneetjes, geen ingegroeide haren.' }
  ];

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease  = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  /* ---------- 1. FRAME SEQUENCE ---------- */

  const canvas = $('#seq');
  const ctx    = canvas.getContext('2d', { alpha: false });
  const frames = [];
  let manifest = null, loaded = 0, ready = false, currentFrame = -1;

  function fitCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.round(window.innerWidth  * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    currentFrame = -1;
    if (ready) draw(progress());
  }

  function drawFrame(img) {
    if (!img || !img.naturalWidth) return;
    const cw = canvas.width, ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight); // cover
    const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  function loadSequence() {
    return fetch('frames/manifest.json')
      .then(r => r.json())
      .then(m => {
        manifest = m;
        return Promise.all(m.frames.map((src, i) => new Promise(res => {
          const img = new Image();
          img.decoding = 'async';
          img.onload = img.onerror = () => {
            loaded++;
            const pct = Math.round(loaded / m.frames.length * 100);
            $('#loaderFill').style.width = pct + '%';
            $('#loaderPct').textContent = pct;
            res();
          };
          img.src = 'frames/' + src;
          frames[i] = img;
        })));
      });
  }

  /* ---------- 2. SCROLL PROGRESS ---------- */

  const scrub = $('#scrub');

  function progress() {
    const rect = scrub.getBoundingClientRect();
    const total = scrub.offsetHeight - window.innerHeight;
    return total <= 0 ? 0 : clamp(-rect.top / total);
  }

  /* ---------- 3. HUD + RAIL ---------- */

  const rpmEl    = $('#rpm');
  const rpmFill  = $('#rpmFill');
  const hudPct   = $('#hudPct');
  const railItems = $$('.rail__item');
  const chapCard = $('#chapCard');
  const chapNo   = $('.chapcard__no');
  const chapTxt  = $('.chapcard__txt');
  const heroTitle = $('#scrubTitle');
  let activeChapter = -1;

  function setChapter(p) {
    let idx = 0;
    for (let i = 0; i < CHAPTERS.length; i++) if (p >= CHAPTERS[i].t) idx = i;
    if (idx === activeChapter) return;
    activeChapter = idx;
    railItems.forEach((el, i) => el.classList.toggle('is-active', i === idx));
    chapNo.textContent  = CHAPTERS[idx].no;
    chapTxt.textContent = CHAPTERS[idx].txt;
  }

  function draw(p) {
    if (!ready) return;
    const n = frames.length;
    const idx = clamp(Math.round(ease(p) * (n - 1)), 0, n - 1);
    if (idx !== currentFrame) { drawFrame(frames[idx]); currentFrame = idx; }

    // HUD — RPM climbs with scroll progress through the pass
    const rpm = Math.round(p * MAX_RPM / 10) * 10;
    rpmEl.textContent  = rpm.toLocaleString('nl-NL');
    rpmFill.style.width = (p * 100).toFixed(1) + '%';
    hudPct.textContent = Math.round(p * 100);

    setChapter(p);
    heroTitle.classList.toggle('is-hidden', p > 0.06);
    chapCard.classList.toggle('is-on', p > 0.06);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { draw(progress()); ticking = false; });
  }

  railItems.forEach(btn => btn.addEventListener('click', () => {
    const t = parseFloat(btn.dataset.t);
    const total = scrub.offsetHeight - window.innerHeight;
    window.scrollTo({ top: scrub.offsetTop + t * total + 4, behavior: 'smooth' });
  }));

  /* ---------- 4. MOTION-BLUR SECTION TRANSITIONS ---------- */

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.16 });
  $$('.blur-in').forEach(el => io.observe(el));

  /* ---------- 5. STAT COUNTERS ---------- */

  function runCounter(el) {
    const to = parseInt(el.dataset.to, 10);
    const prefix = el.dataset.prefix || '';
    const dur = 1500, t0 = performance.now();
    (function step(now) {
      const p = clamp((now - t0) / dur);
      el.textContent = prefix + Math.round(ease(p) * to).toLocaleString('nl-NL');
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  const statIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); statIO.unobserve(e.target); } });
  }, { threshold: 0.5 });
  $$('.stat__num').forEach(el => statIO.observe(el));

  /* ---------- 6. DESIGN MACRO STILLS ---------- */

  const MACROS = [
    { file: 'macro-head.jpg',  t: 'DE KERAMISCHE KOP', s: 'SkinSafe mesjes die je huid nooit blootleggen.' },
    { file: 'macro-led.jpg',   t: 'DE LED-RING',       s: 'Laat elk haartje zien, ook in de schaduw.' },
    { file: 'macro-foil.jpg',  t: 'DE FOIL SHAVER',    s: 'Werkt af tot strak glad, zonder mesje op je huid.' }
  ];
  $('#designGrid').innerHTML = MACROS.map(m => `
    <figure class="macro">
      <img src="assets/${m.file}" alt="${m.t}" loading="lazy">
      <figcaption class="macro__tag"><b>${m.t}</b><span>${m.s}</span></figcaption>
    </figure>`).join('');

  /* ---------- 7. CONFIGURATOR ---------- */

  const HEADS = {
    trimmer:  {
      img: 'assets/config-trimmer.jpg', accent: '#00e5ff',
      desc: 'De standaardkop. Trimt lichaams- en schaamhaar op lengte, zonder je huid bloot te leggen.',
      spec: { 'KOP': 'SkinSafe keramisch', 'GEBRUIK': 'Lichaam en schaamstreek', 'RESULTAAT': 'Kort getrimd, geen irritatie' }
    },
    foil: {
      img: 'assets/config-foil.jpg', accent: '#c9f24a',
      desc: 'De upgrade van de Groom Guard. Werkt na het trimmen af tot strak glad — zonder de sneetjes van een gewoon mesje.',
      spec: { 'KOP': 'Foil shaver', 'GEBRUIK': 'Afwerken na de trim', 'RESULTAAT': 'Glad, geen ingegroeide haren' }
    },
    precisie: {
      img: 'assets/config-precisie.jpg', accent: '#ff7a45',
      desc: 'Smalle kop voor randen en kleine zones. Voor waar de grote kop niet bij komt.',
      spec: { 'KOP': 'Precisie', 'GEBRUIK': 'Randen en details', 'RESULTAAT': 'Strakke lijnen' }
    }
  };

  const configImg  = $('#configImg');
  const configDesc = $('#configDesc');
  const configSpec = $('#configSpec');
  const configStage = $('.config__stage');

  function setHead(key) {
    const h = HEADS[key];
    if (!h) return;
    $$('#configOpts .opt').forEach(b => b.classList.toggle('is-active', b.dataset.key === key));
    document.documentElement.style.setProperty('--accent', h.accent);
    document.documentElement.style.setProperty('--accent-soft', hexA(h.accent, .14));
    document.documentElement.style.setProperty('--accent-line', hexA(h.accent, .35));
    configDesc.textContent = h.desc;
    configSpec.innerHTML = Object.entries(h.spec).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
    configStage.classList.add('is-swapping');
    setTimeout(() => { configImg.src = h.img; configStage.classList.remove('is-swapping'); }, 220);
  }
  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
  }
  $$('#configOpts .opt').forEach(b => b.addEventListener('click', () => setHead(b.dataset.key)));

  /* ---------- 8. RESERVERING (lokaal) ---------- */

  const KEY = 'wellshave.groomguardpro.reservering';
  const form = $('#orderForm'), done = $('#orderDone'), err = $('#orderErr');

  function showDone(mail) {
    form.hidden = true; done.hidden = false;
    $('#orderDoneMail').textContent = `Bevestiging staat klaar voor ${mail}. Je betaalt pas bij verzending.`;
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const mail = $('#orderEmail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) { err.hidden = false; return; }
    err.hidden = true;
    try { localStorage.setItem(KEY, JSON.stringify({ mail, at: new Date().toISOString() })); } catch (_) {}
    showDone(mail);
  });
  $('#orderReset').addEventListener('click', () => {
    try { localStorage.removeItem(KEY); } catch (_) {}
    done.hidden = true; form.hidden = false; $('#orderEmail').value = '';
  });
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && saved.mail) showDone(saved.mail);
  } catch (_) {}

  /* ---------- 9. BOOT ---------- */

  setHead('trimmer');
  fitCanvas();
  window.addEventListener('resize', fitCanvas);
  window.addEventListener('scroll', onScroll, { passive: true });

  loadSequence().then(() => {
    ready = true;
    fitCanvas();
    draw(progress());
    $('#loader').classList.add('is-gone');
    window.__wellshave = {
      frames: frames.length,
      progress,
      rpm: () => parseInt(rpmEl.textContent.replace(/\D/g, ''), 10),
      frameIndex: () => currentFrame,
      chapter: () => CHAPTERS[activeChapter] && CHAPTERS[activeChapter].title
    };
  });
})();
