// Rendert de gebouwde blokken en meldt drie soorten fouten die op het oog
// lastig te zien zijn: elementen die buiten hun container vallen, tekst die
// buiten haar eigen kader schildert, en beelden die vervormd worden weergegeven.
//
//   node verify-layout.mjs                 alle blok-*.html
//   node verify-layout.mjs blok-03-...html alleen dit bestand
//
// Afsluitcode 1 zodra er iets gevonden is, zodat dit in een controle past.
import { chromium } from 'playwright';
import { readdirSync } from 'node:fs';

const dir = new URL('.', import.meta.url).pathname;
const args = process.argv.slice(2);
const files = args.length ? args
  : readdirSync(dir).filter(f => /^blok-\d+-[a-z]+\.html$/.test(f)).sort();

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await (await browser.newContext({ viewport: { width: 1400, height: 1200 } })).newPage();

let stuk = 0;
for (const file of files) {
  await page.goto(`file://${dir}${file}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1200);

  const out = await page.evaluate(() => {
    // de mockups zelf opzoeken in plaats van hun klassen opsommen: elk blok
    // staat in een .scaler > .inner, dus een nieuw blok valt er nooit buiten
    const wortels = [...document.querySelectorAll('.scaler > .inner > *')];
    const binnen = (sel) => wortels.flatMap(w => [...w.querySelectorAll(sel)]);
    // deze lopen bewust buiten hun kader; de ouder knipt ze af
    const DECORATIEF = /gcard-mark|revtrack|bs-mark|az-mark/;

    const buiten = [];
    [...wortels, ...binnen('*')].forEach(el => {
      const par = el.parentElement;
      if (!par || DECORATIEF.test(el.className || '')) return;
      const r = el.getBoundingClientRect(), pr = par.getBoundingClientRect();
      if (r.width === 0) return;
      const rechts = Math.round(r.right - pr.right), onder = Math.round(r.bottom - pr.bottom);
      if (rechts > 2 || onder > 2)
        buiten.push({ el: el.className || el.tagName, ouder: par.className || par.tagName, rechts, onder });
    });

    const tekst = [];
    binnen('*').forEach(el => {
      if (el.children.length) return;
      if (el.scrollWidth - el.clientWidth > 1 && getComputedStyle(el).overflow === 'visible')
        tekst.push({ el: el.className || el.tagName, over: el.scrollWidth - el.clientWidth,
                     txt: (el.textContent || '').trim().slice(0, 26) });
    });

    const beelden = binnen('img').map(i => {
      const r = i.getBoundingClientRect();
      const nat = i.naturalWidth / i.naturalHeight, box = r.width / r.height;
      return { alt: i.alt.slice(0, 30), nat: +nat.toFixed(3), box: +box.toFixed(3),
               fit: getComputedStyle(i).objectFit,
               vervormd: getComputedStyle(i).objectFit === 'fill' && Math.abs(nat - box) > 0.02 };
    });

    return { buiten: buiten.slice(0, 15), tekst: tekst.slice(0, 10), beelden };
  });

  const scheef = out.beelden.filter(b => b.vervormd);
  const aantal = out.buiten.length + out.tekst.length + scheef.length;
  if (aantal) {
    stuk++;
    console.log(`\n${file} — ${aantal} punt(en)`);
    if (out.buiten.length) console.log('  buiten container:  ', JSON.stringify(out.buiten));
    if (out.tekst.length)  console.log('  tekst buiten kader:', JSON.stringify(out.tekst));
    if (scheef.length)     console.log('  vervormd beeld:    ', JSON.stringify(scheef));
  } else {
    console.log(`${file} — schoon (${out.beelden.length} beelden gemeten)`);
  }
}

await browser.close();
process.exit(stuk ? 1 : 0);
