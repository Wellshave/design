/* ============================================================
   WELLSHAVE — SENTINEL PRO
   ============================================================ */
(() => {
'use strict';
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

/* ---------- catalogue — real data from the Flex Guard PDP ---------- */
const BASE_INCL = [
  'Trimmer met Skin Safe-mes',
  'Foil shaver-opzetstuk',
  'Neus- & oorhaartrimmer',
  'Opzetkam 1,5 – 4,5 mm',
  'Sierstandaard',
  'USB-C oplaadkabel',
];
const BUNDLES = [
  {
    id:'solo', name:'Flex Guard™ 3-in-1', short:'Flex Guard™ 3-in-1',
    note:'De complete 3-in-1 met standaard en alle opzetstukken.',
    price:'€54,95', was:'€85,65', save:'-36%',
    img:'assets/flexguard.jpg', incl:BASE_INCL,
  },
  {
    id:'essential', name:'Essential Flex Bundel', short:'Essential Flex Bundel',
    note:'Alles uit de 3-in-1, plus een extra mes, hard case en toilettas.',
    price:'€79,95', was:'€133,25', save:'-40%',
    img:'assets/bundle.jpg',
    incl:[...BASE_INCL, 'Extra Skin Safe-mes', 'Hard case', 'Toilettas'],
  },
];

const state = { bundle: null, bag: 0 };

/* ---------- shared refs ---------- */
const warnEl   = $('#warn');
const warnText = $('#warnText');
const addBtn   = $('#addBtn');
const barBtn   = $('#barBtn');
const bagCount = $('#bagCount');

/* ---------- render ---------- */
function paintBundle() {
  const b = state.bundle;

  $$('#bundles .bundle').forEach(el =>
    el.setAttribute('aria-checked', String(!!b && el.dataset.id === b.id)));

  $('#bundleVal').textContent = b ? b.short : 'Nog niets gekozen';
  $('#barSub').textContent    = b ? 'Bundel gekozen' : 'Geen bundel gekozen';

  // until a bundle is picked the page shows the base product
  const shown = b || BUNDLES[0];

  const img = $('#shotImg');
  if (img.getAttribute('src') !== shown.img) {
    img.classList.add('is-swapping');
    setTimeout(() => {
      img.src = shown.img;
      img.alt = shown.name;
      img.classList.remove('is-swapping');
    }, 180);
  }

  $('#shotTag').textContent   = shown.name;
  $('#prodName').innerHTML    = shown.name.replace('™ ', '™<br>').replace('Essential ', 'Essential<br>');
  $('#prodPrice').textContent = shown.price;
  $('#prodWas').textContent   = shown.was;
  $('#heroPoster').src        = shown.img;
  $('#barThumb').src          = shown.img;
  $('#barName').textContent   = shown.name;
  $('#barPrice').textContent  = shown.price;
  $('#addLabel').textContent  = b ? 'In de mand — ' + b.price : 'In de mand';

  $('#incl').innerHTML = shown.incl.map(i => `<li>${i}</li>`).join('');

  if (b) hideWarn();
}

function paintBag() {
  bagCount.textContent = String(state.bag);
  bagCount.dataset.count = String(state.bag);
  bagCount.classList.toggle('is-live', state.bag > 0);
  bagCount.classList.add('is-pop');
  setTimeout(() => bagCount.classList.remove('is-pop'), 260);
}

/* ---------- build controls ---------- */
$('#bundles').innerHTML = BUNDLES.map(b => `
  <button class="bundle" type="button" role="radio" aria-checked="false" data-id="${b.id}">
    <span class="bundle__save">${b.save}</span>
    <span class="bundle__tick"></span>
    <span class="bundle__body">
      <span class="bundle__name">${b.name}</span>
      <span class="bundle__note">${b.note}</span>
    </span>
    <span class="bundle__cost">
      <span class="bundle__now">${b.price}</span>
      <span class="bundle__was">${b.was}</span>
    </span>
  </button>`).join('');

$('#bundles').addEventListener('click', e => {
  const btn = e.target.closest('.bundle');
  if (!btn) return;
  state.bundle = BUNDLES.find(b => b.id === btn.dataset.id);
  paintBundle();
});

/* ---------- the buy guard ---------- */
function showWarn(msg) {
  warnText.textContent = msg;
  warnEl.classList.add('is-visible');
}
function hideWarn() { warnEl.classList.remove('is-visible'); }

function addToBag(sourceBtn) {
  if (!state.bundle) {
    showWarn('Kies eerst je bundel');
    sourceBtn.classList.remove('is-blocked');
    void sourceBtn.offsetWidth;          // restart the refusal animation
    sourceBtn.classList.add('is-blocked');
    document.body.dataset.lastAction = 'blocked';
    return false;
  }
  hideWarn();
  state.bag += 1;
  paintBag();
  document.body.dataset.lastAction = 'added';
  return true;
}
addBtn.addEventListener('click', () => addToBag(addBtn));
barBtn.addEventListener('click', () => {
  if (!addToBag(barBtn)) $('#buy').scrollIntoView({ behavior:'smooth', block:'center' });
});

/* ---------- HERO: scroll-scrubbed video ---------- */
(() => {
  const hero  = $('.hero');
  const video = $('#heroVideo');
  const fill  = $('#heroFill');
  const deg   = $('#heroDeg');
  const poster= $('#heroPoster');
  let target = 0, current = 0, ready = false, raf = null;

  function markReady() {
    if (ready) return;
    ready = true;
    poster.style.transition = 'opacity .6s ease';
    poster.style.opacity = '0';
    onScroll();
  }
  video.addEventListener('loadedmetadata', markReady);
  video.addEventListener('loadeddata', markReady);
  video.addEventListener('canplay', markReady);
  // metadata may already be in before the listeners attach
  if (video.readyState >= 1) markReady();
  video.load();

  function progress() {
    const r = hero.getBoundingClientRect();
    const total = hero.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    // finish the scrub just before the stage unpins, so the final
    // macro frame holds while the hero leaves the screen
    return clamp(-r.top / (total * 0.9), 0, 1);
  }

  function onScroll() {
    const p = progress();
    fill.style.transform = `scaleX(${p})`;
    deg.textContent = String(Math.round(p * 360)).padStart(3, '0') + '°';
    if (!ready) return;
    const d = video.duration || 1;
    target = clamp(p * d, 0, Math.max(0, d - 0.05));
    if (!raf) tick();
  }

  function tick() {
    if (!ready) return;
    current += (target - current) * 0.16;             // eased seek
    if (Math.abs(target - current) < 0.004) current = target;
    if (video.readyState >= 1) {
      try { video.currentTime = current; } catch (_) {}
    }
    raf = Math.abs(target - current) > 0.001 ? requestAnimationFrame(tick) : null;
  }

  addEventListener('scroll', onScroll, { passive:true });
  addEventListener('resize', onScroll);
  onScroll();
})();

/* ---------- NAV + STICKY BAR ---------- */
(() => {
  const nav = $('#nav');
  const bar = $('#stickybar');
  const hero = $('.hero');
  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('is-stuck', y > 40);
    // slides up once the hero has been scrolled past
    const past = y > hero.offsetHeight - window.innerHeight * 0.55;
    const beforeFooter = y + window.innerHeight < document.body.scrollHeight - 60;
    bar.classList.toggle('is-up', past && beforeFooter);
  };
  addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();

/* ---------- SPEC COUNT-UP ---------- */
(() => {
  const els = $$('.count');
  const run = el => {
    const to  = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || '0', 10);
    const dur = 1500;
    const t0  = performance.now();
    const step = now => {
      const p = clamp((now - t0) / dur, 0, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = to.toFixed(dec);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting && !en.target.dataset.done) {
        en.target.dataset.done = '1';
        run(en.target);
      }
    });
  }, { threshold: 0.6 });
  els.forEach(el => io.observe(el));
})();

/* ---------- REVEALS ---------- */
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  $$('.reveal').forEach(el => io.observe(el));
})();

/* ---------- DRAG-TO-SPIN (72 frames from clip 2) ---------- */
(() => {
  const TOTAL  = 72;
  const stage  = $('#spinStage');
  const canvas = $('#spinCanvas');
  const ctx    = canvas.getContext('2d');
  const hint   = $('#spinHint');
  const degEl  = $('#spinDeg');
  const meter  = $('#spinMeter');

  const frames = [];
  let loaded = 0, frame = 0, touched = false, dragging = false;
  let startX = 0, startFrame = 0, autoRaf = null, lastAuto = 0;

  const src = i => `assets/spin/${String(i).padStart(3, '0')}.jpg`;

  for (let i = 0; i < TOTAL; i++) {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => { loaded++; if (loaded === 1) draw(); };
    img.src = src(i);
    frames[i] = img;
  }

  function draw() {
    const img = frames[frame];
    if (!img || !img.complete || !img.naturalWidth) return;
    if (canvas.width !== img.naturalWidth) {
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const deg = Math.round(frame / TOTAL * 360);
    degEl.textContent = String(deg).padStart(3, '0') + '°';
    meter.style.width = (frame / (TOTAL - 1) * 100) + '%';
    stage.dataset.frame = String(frame);
    stage.dataset.deg = String(deg);
  }

  function setFrame(n) {
    frame = ((n % TOTAL) + TOTAL) % TOTAL;
    draw();
  }

  /* gentle auto-spin until the visitor first touches it */
  function auto(now) {
    if (touched) return;
    if (!lastAuto) lastAuto = now;
    if (now - lastAuto > 110) { lastAuto = now; setFrame(frame + 1); }
    autoRaf = requestAnimationFrame(auto);
  }
  autoRaf = requestAnimationFrame(auto);

  function stopAuto() {
    if (touched) return;
    touched = true;
    if (autoRaf) cancelAnimationFrame(autoRaf);
    autoRaf = null;
    hint.classList.add('is-gone');
    stage.dataset.touched = 'true';
  }

  function down(x) {
    stopAuto();
    dragging = true;
    startX = x;
    startFrame = frame;
    stage.classList.add('is-dragging');
  }
  function move(x) {
    if (!dragging) return;
    const w = stage.clientWidth || 1;
    // one full stage width of drag ≈ 1.25 revolutions
    const delta = (x - startX) / w * TOTAL * 1.25;
    setFrame(Math.round(startFrame + delta));
  }
  function up() { dragging = false; stage.classList.remove('is-dragging'); }

  stage.addEventListener('pointerdown', e => {
    down(e.clientX);
    stage.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  stage.addEventListener('pointermove', e => move(e.clientX));
  addEventListener('pointerup', up);
  addEventListener('pointercancel', up);

  // mouse fallback for drivers without pointer events
  stage.addEventListener('mousedown', e => { if (!window.PointerEvent) { down(e.clientX); e.preventDefault(); } });
  stage.addEventListener('mousemove', e => { if (!window.PointerEvent) move(e.clientX); });
  addEventListener('mouseup', () => { if (!window.PointerEvent) up(); });

  stage.addEventListener('touchstart', e => { stopAuto(); down(e.touches[0].clientX); }, { passive:true });
  stage.addEventListener('touchmove',  e => move(e.touches[0].clientX), { passive:true });
  addEventListener('touchend', up);

  stage.tabIndex = 0;
  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { stopAuto(); setFrame(frame - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { stopAuto(); setFrame(frame + 1); e.preventDefault(); }
  });

  // test surface
  window.__spin = {
    get frame() { return frame; },
    get touched() { return touched; },
    total: TOTAL,
    get loaded() { return loaded; },
  };
})();

/* ---------- MACRO: play only while on screen ---------- */
(() => {
  const v = $('#macroVideo');
  if (!v) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => en.isIntersecting ? v.play().catch(() => {}) : v.pause());
  }, { threshold: 0.25 });
  io.observe(v);
})();

/* ---------- boot ---------- */
paintBundle();
paintBag();

window.__store = {
  get bundle() { return state.bundle ? state.bundle.id : null; },
  get bag()    { return state.bag; },
  get warned() { return warnEl.classList.contains('is-visible'); },
};
})();
