const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const T = require('/tmp/hdr/seo/teksten.json');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.setContent('<body></body>');
  const uit = await p.evaluate((T) => {
    const c = document.createElement('canvas').getContext('2d');
    // Google rendert de titel in ~20px Arial en de description in ~14px Arial
    const meet = (tekst, font) => { c.font = font; return Math.round(c.measureText(tekst).width); };
    const r = [];
    for (const [h, v] of Object.entries(T)) {
      r.push({ handle: h,
        tPx: meet(v.title, '20px Arial'), tLen: v.title.length,
        dPx: meet(v.desc, '14px Arial'),  dLen: v.desc.length });
    }
    return r;
  }, T);
  // Google kapt de titel rond 580 px af en de description rond 920 px
  const TMAX = 580, DMIN = 700, DMAX = 920;
  let fout = 0;
  console.log('pagina'.padEnd(32), 'titel', ' ', 'description');
  for (const x of uit) {
    const tOk = x.tPx <= TMAX, dOk = x.dPx >= DMIN && x.dPx <= DMAX;
    if (!tOk || !dOk) fout++;
    console.log(
      x.handle.padEnd(32),
      String(x.tPx).padStart(3) + 'px/' + String(x.tLen).padStart(2) + (tOk ? ' ok ' : ' TE LANG '),
      String(x.dPx).padStart(3) + 'px/' + String(x.dLen).padStart(3) + (dOk ? ' ok' : (x.dPx > DMAX ? ' TE LANG' : ' TE KORT')));
  }
  console.log(`\n${uit.length - fout}/${uit.length} binnen de afkapgrens (titel <=${TMAX}px, description ${DMIN}-${DMAX}px)`);
  await b.close();
})();
