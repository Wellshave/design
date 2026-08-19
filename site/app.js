/* ============================================================
   WELLSHAVE — SENTINEL PRO
   ============================================================ */
(() => {
'use strict';
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

/* ---------- catalogue ---------- */
const FINISHES = [
  { id:'gunmetal', name:'Gunmetal Titanium', img:'assets/gunmetal.jpg', price:189, was:240, accent:'#FF4A1C', ink:'#0A0A0A', swatch:'linear-gradient(145deg,#8A9096,#4A5055 55%,#6E757B)' },
  { id:'obsidian', name:'Obsidian PVD',      img:'assets/obsidian.jpg', price:209, was:265, accent:'#3D7BFF', ink:'#04060C', swatch:'linear-gradient(145deg,#3A3D42,#0C0D0F 55%,#26282C)' },
  { id:'rose',     name:'Rose Titanium',     img:'assets/rose.jpg',     price:219, was:275, accent:'#FF5C8A', ink:'#12040A', swatch:'linear-gradient(145deg,#E8B49E,#B57960 55%,#D79B84)' },
  { id:'platinum', name:'Platinum Mirror',   img:'assets/platinum.jpg', price:199, was:250, accent:'#00E3C4', ink:'#02120F', swatch:'linear-gradient(145deg,#FFFFFF,#B9BFC6 55%,#E6EAEE)' },
  { id:'copper',   name:'Burnished Copper',  img:'assets/copper.jpg',   price:229, was:290, accent:'#FFA51F', ink:'#140A00', swatch:'linear-gradient(145deg,#D98B54,#8A4A24 55%,#B96A38)' },
];
const SIZES = [
  { id:'70',  label:'70 mm',  sub:'Travel',   soldOut:false },
  { id:'85',  label:'85 mm',  sub:'Standard', soldOut:false },
  { id:'95',  label:'95 mm',  sub:'Long',     soldOut:true  },
  { id:'110', label:'110 mm', sub:'Barber',   soldOut:true  },
];

const state = { finish: FINISHES[0], size: null, bag: 0 };
const money = n => '€' + n;

/* ---------- shared refs ---------- */
const root      = document.documentElement;
const warnEl    = $('#warn');
const warnText  = $('#warnText');
const addBtn    = $('#addBtn');
const barBtn    = $('#barBtn');
const bagCount  = $('#bagCount');

/* ---------- render ---------- */
function paintFinish() {
  const f = state.finish;
  root.style.setProperty('--accent', f.accent);
  root.style.setProperty('--accent-ink', f.ink);

  const img = $('#shotImg');
  img.classList.add('is-swapping');
  setTimeout(() => {
    img.src = f.img;
    img.alt = 'SENTINEL PRO in ' + f.name;
    img.classList.remove('is-swapping');
  }, 180);

  $('#shotTag').textContent   = f.name;
  $('#finishVal').textContent = f.name;
  $('#prodName').innerHTML    = 'Sentinel Pro<br>' + f.name;
  $('#prodPrice').textContent = money(f.price);
  $('#prodWas').textContent   = money(f.was);
  $('#heroPoster').src        = f.img;
  $('#barThumb').src          = f.img;
  $('#barName').textContent   = 'Sentinel Pro — ' + f.name;
  $('#barPrice').textContent  = money(f.price);
  $('#addLabel').textContent  = 'Add to bag — ' + money(f.price);

  $$('#swatches .swatch').forEach(b =>
    b.setAttribute('aria-checked', String(b.dataset.id === f.id)));
}

function paintSize() {
  const s = state.size;
  $('#sizeVal').textContent = s ? s.label + ' · ' + s.sub : 'Not selected';
  $('#barSub').textContent  = s ? s.label + ' selected'   : 'No length selected';
  $$('#sizes .size').forEach(b =>
    b.setAttribute('aria-checked', String(!!s && b.dataset.id === s.id)));
  if (s) hideWarn();
}

function paintBag() {
  bagCount.textContent = String(state.bag);
  bagCount.dataset.count = String(state.bag);
  bagCount.classList.toggle('is-live', state.bag > 0);
  bagCount.classList.add('is-pop');
  setTimeout(() => bagCount.classList.remove('is-pop'), 260);
}

/* ---------- build controls ---------- */
$('#swatches').innerHTML = FINISHES.map(f => `
  <button class="swatch" type="button" role="radio" aria-checked="false"
          data-id="${f.id}" title="${f.name}" aria-label="${f.name}">
    <span class="swatch__disc" style="background:${f.swatch}"></span>
  </button>`).join('');

$('#swatches').addEventListener('click', e => {
  const btn = e.target.closest('.swatch');
  if (!btn) return;
  state.finish = FINISHES.find(f => f.id === btn.dataset.id);
  paintFinish();
});

$('#sizes').innerHTML = SIZES.map(s => `
  <button class="size" type="button" role="radio" aria-checked="false"
          data-id="${s.id}" data-soldout="${s.soldOut}"
          ${s.soldOut ? 'disabled aria-disabled="true" tabindex="-1"' : ''}>
    ${s.label}<span class="size__sub">${s.soldOut ? 'Sold out' : s.sub}</span>
  </button>`).join('');

$('#sizes').addEventListener('click', e => {
  const btn = e.target.closest('.size');
  if (!btn) return;
  const s = SIZES.find(x => x.id === btn.dataset.id);
  if (!s || s.soldOut) return;           // sold-out sizes are unselectable
  state.size = s;
  paintSize();
});

/* ---------- the size guard ---------- */
function showWarn(msg) {
  warnText.textContent = msg;
  warnEl.classList.add('is-visible');
}
function hideWarn() { warnEl.classList.remove('is-visible'); }

function addToBag(sourceBtn) {
  if (!state.size) {
    showWarn('Select a handle length first');
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
paintFinish();
paintSize();
paintBag();

window.__store = {
  get finish() { return state.finish.id; },
  get size()   { return state.size ? state.size.id : null; },
  get bag()    { return state.bag; },
  get warned() { return warnEl.classList.contains('is-visible'); },
};
})();
