/* Verificatie: HUD-synchronisatie met scrollpositie + interacties.
   Gebruik: node scripts/verify.mjs [baseUrl] */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:8080';
const OUT = 'scripts/shots';
fs.mkdirSync(OUT, { recursive: true });

const fail = [];
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
  if (!ok) fail.push(name);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(BASE, { waitUntil: 'load' });
await page.waitForFunction(() => window.__wellshave, null, { timeout: 60000 });

const frames = await page.evaluate(() => window.__wellshave.frames);
check('frame sequence geladen', frames > 100, `${frames} frames`);
check('loader verdwenen', await page.locator('#loader.is-gone').count() === 1);

// --- HUD sync over de hele scrub ---
const scrubTop = await page.evaluate(() => document.querySelector('#scrub').offsetTop);
const total = await page.evaluate(() => document.querySelector('#scrub').offsetHeight - window.innerHeight);

// scroll zonder smooth-animatie, anders meet je de HUD midden in de beweging
const jump = (p, y) => p.evaluate(async yy => {
  const prev = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, yy);
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  document.documentElement.style.scrollBehavior = prev;
}, y);

const samples = [0, 0.1, 0.25, 0.34, 0.5, 0.68, 0.75, 0.9, 1];
const rows = [];
for (const t of samples) {
  await jump(page, scrubTop + Math.round(t * total));
  await page.waitForTimeout(120);
  rows.push(await page.evaluate(() => ({
    p: window.__wellshave.progress(),
    rpm: window.__wellshave.rpm(),
    frame: window.__wellshave.frameIndex(),
    chapter: window.__wellshave.chapter(),
    hudPct: +document.querySelector('#hudPct').textContent
  })));
}
console.table(rows);

const maxRpmErr = Math.max(...rows.map(r => Math.abs(r.rpm - r.p * 6600)));
check('HUD RPM volgt scrollpositie', maxRpmErr <= 12, `max afwijking ${maxRpmErr.toFixed(1)} RPM`);
check('HUD percentage volgt scroll', rows.every(r => Math.abs(r.hudPct - r.p * 100) <= 1));
check('RPM start op 0 en eindigt op 6600', rows[0].rpm === 0 && rows.at(-1).rpm === 6600,
  `${rows[0].rpm} → ${rows.at(-1).rpm}`);
check('framewissel loopt monotoon mee', rows.every((r, i) => i === 0 || r.frame >= rows[i - 1].frame),
  `${rows[0].frame} → ${rows.at(-1).frame}`);
check('frame 0 bij start, laatste frame bij einde',
  rows[0].frame === 0 && rows.at(-1).frame === frames - 1);
// de drie hoofdstukken zijn de drie 12-secondensegmenten van de 36s drive
const expectChapter = p => p < 1 / 3 ? 'DE TRIM' : p < 2 / 3 ? 'ONDER DE DOUCHE' : 'LED PRECISIE';
check('hoofdstukrail volgt de segmentgrenzen',
  rows.every(r => r.chapter === expectChapter(r.p)),
  rows.map(r => r.chapter).join(' / '));
check('hoofdstuk komt overeen met het getoonde beeld',
  rows.every(r => expectChapter(r.frame / (frames - 1)) === r.chapter),
  'frame-positie vs hoofdstuklabel');

// canvas mag niet zwart zijn
const nonBlack = await page.evaluate(() => {
  const c = document.querySelector('#seq');
  const t = document.createElement('canvas'); t.width = 60; t.height = 34;
  t.getContext('2d').drawImage(c, 0, 0, 60, 34);
  const d = t.getContext('2d').getImageData(0, 0, 60, 34).data;
  let lit = 0;
  for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] > 40) lit++;
  return lit;
});
check('canvas rendert beeld', nonBlack > 30, `${nonBlack} verlichte pixels`);
await page.screenshot({ path: `${OUT}/01-scrub.png` });

// --- rail klik ---
await jump(page, scrubTop);
await page.locator('.rail__item').nth(1).click();
await page.waitForFunction(() => window.__wellshave.progress() > 0.3, null, { timeout: 8000 }).catch(() => {});
await page.waitForTimeout(400);
check('rail-klik springt naar hoofdstuk 2',
  (await page.evaluate(() => window.__wellshave.chapter())) === 'ONDER DE DOUCHE');

// --- stats ---
await page.locator('#stats').scrollIntoViewIfNeeded();
await page.waitForTimeout(2200);
const stats = await page.locator('.stat__num').allTextContents();
check('statistieken tellen op', stats[0] === '6.600' && stats[1] === '120' && stats[2] === 'IPX7',
  stats.join(' | '));
check('motion-blur transitie geactiveerd',
  await page.locator('#stats.is-in').count() === 1);
await page.screenshot({ path: `${OUT}/02-stats.png` });

// --- design ---
await page.locator('#design').scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
check('macro stills geladen', await page.evaluate(() =>
  [...document.querySelectorAll('.macro img')].every(i => i.naturalWidth > 400)));
await page.screenshot({ path: `${OUT}/03-design.png` });

// --- configurator ---
await page.locator('#config').scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
const accent0 = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
const img0 = await page.getAttribute('#configImg', 'src');
await page.locator('.opt[data-key="foil"]').click();
await page.waitForTimeout(700);
const accent1 = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
const img1 = await page.getAttribute('#configImg', 'src');
check('configurator wisselt hero-still', img0 !== img1, `${img0} → ${img1}`);
check('configurator verschuift accentkleur', accent0 !== accent1, `${accent0} → ${accent1}`);
check('configurator-still is echt geladen',
  await page.evaluate(() => document.querySelector('#configImg').naturalWidth > 800));
await page.screenshot({ path: `${OUT}/04-config.png` });

// --- bestellen ---
await page.locator('#bestel').scrollIntoViewIfNeeded();
await page.fill('#orderEmail', 'nietgeldig');
await page.click('#orderBtn');
check('ongeldige e-mail wordt geweigerd', await page.locator('#orderErr').isVisible());
await page.fill('#orderEmail', 'dustin@wellshave.com');
await page.click('#orderBtn');
await page.waitForTimeout(400);
check('reservering bevestigt lokaal', await page.locator('#orderDone').isVisible());
const stored = await page.evaluate(() => localStorage.getItem('wellshave.groomguardpro.reservering'));
check('reservering bewaard in localStorage', !!stored && stored.includes('dustin@wellshave.com'));
await page.reload({ waitUntil: 'load' });
await page.waitForFunction(() => window.__wellshave, null, { timeout: 60000 });
await page.locator('#bestel').scrollIntoViewIfNeeded();
check('reservering overleeft herladen', await page.locator('#orderDone').isVisible());
await page.screenshot({ path: `${OUT}/05-order.png` });

// --- mobiel ---
const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.goto(BASE, { waitUntil: 'load' });
await m.waitForFunction(() => window.__wellshave, null, { timeout: 60000 });
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
check('geen horizontale overflow op mobiel', overflow <= 0, `${overflow}px`);
await m.screenshot({ path: `${OUT}/06-mobile.png` });

check('geen JS-fouten', errors.length === 0, errors.join(' | '));

await browser.close();
console.log(fail.length ? `\n${fail.length} CHECK(S) GEFAALD: ${fail.join(', ')}` : '\nALLE CHECKS GESLAAGD');
process.exit(fail.length ? 1 : 0);
