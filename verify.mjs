import { execSync } from 'node:child_process';
// resolve playwright locally, or fall back to a global install
let chromium;
try { ({ chromium } = await import('playwright')); }
catch {
  const root = execSync('npm root -g').toString().trim();
  ({ chromium } = await import(`${root}/playwright/index.mjs`));
}

const BASE = 'http://localhost:4173/';
const pass = [], fail = [];
const check = (name, ok, detail = '') => (ok ? pass : fail).push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

await page.goto(BASE, { waitUntil: 'load' });
await page.waitForTimeout(2500);

/* ── 1. DRAG-TO-SPIN ───────────────────────────────────── */
await page.locator('#spin').scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);

const loaded = await page.evaluate(() => window.__spin.loaded);
check('72 spin frames load', loaded === 72, `${loaded}/72 loaded`);

// auto-spin before any interaction
const a1 = await page.evaluate(() => window.__spin.frame);
await page.waitForTimeout(700);
const a2 = await page.evaluate(() => window.__spin.frame);
check('auto-spins before first touch', a1 !== a2, `frame ${a1} → ${a2}`);

const box = await page.locator('#spinStage').boundingBox();
const cx = box.x + box.width / 2, cy = box.y + box.height / 2;

// drag RIGHT
await page.mouse.move(cx, cy);
await page.mouse.down();
const beforeR = await page.evaluate(() => window.__spin.frame);
for (let i = 1; i <= 12; i++) { await page.mouse.move(cx + i * 20, cy); await page.waitForTimeout(12); }
const afterR = await page.evaluate(() => window.__spin.frame);
await page.mouse.up();

const touched = await page.evaluate(() => window.__spin.touched);
check('auto-spin stops on first touch', touched === true);

const T = 72, fwd = ((afterR - beforeR) % T + T) % T;
check('drag right advances frames', fwd > 3 && fwd < T / 2, `frame ${beforeR} → ${afterR} (+${fwd})`);

// confirm auto-spin really stopped
const s1 = await page.evaluate(() => window.__spin.frame);
await page.waitForTimeout(800);
const s2 = await page.evaluate(() => window.__spin.frame);
check('stays still when not dragged', s1 === s2, `frame held at ${s1}`);

// drag LEFT
await page.mouse.move(cx, cy);
await page.mouse.down();
const beforeL = await page.evaluate(() => window.__spin.frame);
for (let i = 1; i <= 12; i++) { await page.mouse.move(cx - i * 20, cy); await page.waitForTimeout(12); }
const afterL = await page.evaluate(() => window.__spin.frame);
await page.mouse.up();
const back = ((beforeL - afterL) % T + T) % T;
check('drag left rewinds frames', back > 3 && back < T / 2, `frame ${beforeL} → ${afterL} (-${back})`);

// the canvas actually repaints different pixels
const shotA = await page.locator('#spinCanvas').screenshot();
await page.mouse.move(cx, cy); await page.mouse.down();
for (let i = 1; i <= 10; i++) { await page.mouse.move(cx + i * 22, cy); await page.waitForTimeout(12); }
await page.mouse.up();
const shotB = await page.locator('#spinCanvas').screenshot();
check('canvas renders a different frame after drag', !shotA.equals(shotB), `${shotA.length}B vs ${shotB.length}B`);

/* ── 2. SIZE GUARD ─────────────────────────────────────── */
await page.locator('#buy').scrollIntoViewIfNeeded();
await page.waitForTimeout(600);

check('bag starts empty', await page.evaluate(() => window.__store.bag) === 0);
check('no size selected initially', await page.evaluate(() => window.__store.size) === null);

// add-to-bag with no size → must refuse
await page.click('#addBtn');
await page.waitForTimeout(450);
check('add-to-bag refuses without a size',
  await page.evaluate(() => window.__store.bag) === 0,
  `bag = ${await page.evaluate(() => window.__store.bag)}`);
check('warning is visible', await page.locator('#warn').evaluate(el => el.classList.contains('is-visible')));
const warnBox = await page.locator('#warn').boundingBox();
check('warning is actually on screen', !!warnBox && warnBox.height > 4, `height ${warnBox?.height?.toFixed(1)}px`);
check('warning text reads correctly',
  (await page.locator('#warnText').textContent()).toLowerCase().includes('length'),
  await page.locator('#warnText').textContent());

// sold-out sizes must be unselectable
const soldOut = page.locator('.size[data-soldout="true"]');
check('exactly two sizes are sold out', await soldOut.count() === 2, `${await soldOut.count()} found`);
check('sold-out sizes are disabled', await soldOut.evaluateAll(els => els.every(e => e.disabled)));
await soldOut.first().click({ force: true });
await page.waitForTimeout(200);
check('clicking a sold-out size selects nothing', await page.evaluate(() => window.__store.size) === null);
await page.click('#addBtn');
await page.waitForTimeout(300);
check('still refuses after a sold-out click', await page.evaluate(() => window.__store.bag) === 0);

// select an available size → guard lifts
await page.locator('.size:not([disabled])').first().click();
await page.waitForTimeout(350);
check('available size selects', await page.evaluate(() => window.__store.size) === '70');
check('warning clears on selection', !(await page.locator('#warn').evaluate(el => el.classList.contains('is-visible'))));

await page.click('#addBtn');
await page.waitForTimeout(400);
check('add-to-bag now succeeds', await page.evaluate(() => window.__store.bag) === 1);
check('nav bag counter shows 1', (await page.locator('#bagCount').textContent()).trim() === '1');
await page.click('#addBtn');
await page.waitForTimeout(400);
check('counter increments again', (await page.locator('#bagCount').textContent()).trim() === '2');

/* ── 3. COLOURWAY SWITCHER ─────────────────────────────── */
check('five swatches render', await page.locator('.swatch').count() === 5);
const before = await page.evaluate(() => ({
  img: document.querySelector('#shotImg').getAttribute('src'),
  name: document.querySelector('#prodName').textContent,
  price: document.querySelector('#prodPrice').textContent,
  accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
}));
await page.locator('.swatch[data-id="copper"]').click();
await page.waitForTimeout(700);
const after = await page.evaluate(() => ({
  img: document.querySelector('#shotImg').getAttribute('src'),
  name: document.querySelector('#prodName').textContent,
  price: document.querySelector('#prodPrice').textContent,
  accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
}));
check('swatch swaps hero image', before.img !== after.img, `${before.img} → ${after.img}`);
check('swatch swaps name', before.name !== after.name, after.name.replace(/\s+/g, ' ').trim());
check('swatch swaps price', before.price !== after.price, `${before.price} → ${after.price}`);
check('swatch swaps page accent', before.accent !== after.accent, `${before.accent} → ${after.accent}`);

/* ── 4. SPEC COUNT-UP ──────────────────────────────────── */
await page.locator('#specs').scrollIntoViewIfNeeded();
await page.waitForTimeout(2200);
const nums = await page.locator('.count').allTextContents();
check('spec strip counted up', nums.join(',') === '0.42,41,86,100', nums.join(' / '));

/* ── 5. HERO SCROLL-SCRUB ──────────────────────────────── */
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1200);
const t0 = await page.evaluate(() => document.querySelector('#heroVideo').currentTime);
await page.evaluate(() => window.scrollTo(0, document.querySelector('.hero').offsetHeight * 0.55));
await page.waitForTimeout(1600);
const t1 = await page.evaluate(() => document.querySelector('#heroVideo').currentTime);
check('scrolling scrubs the hero clip', t1 > t0 + 0.5, `currentTime ${t0.toFixed(2)}s → ${t1.toFixed(2)}s`);

/* ── 6. STICKY BUY BAR ─────────────────────────────────── */
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
check('sticky bar hidden over the hero', !(await page.locator('#stickybar').evaluate(el => el.classList.contains('is-up'))));
await page.locator('#buy').scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
check('sticky bar slides up past the hero', await page.locator('#stickybar').evaluate(el => el.classList.contains('is-up')));

check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));

console.log('\n' + pass.join('\n'));
if (fail.length) console.log('\n' + fail.join('\n'));
console.log(`\n${pass.length} passed, ${fail.length} failed\n`);
await browser.close();
process.exit(fail.length ? 1 : 0);
