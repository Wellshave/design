// Zet een .template.html om naar het publiceerbare bestand door de
// beeldplaceholders te vervangen door inline data-URI's uit audits/assets/.
import { readFileSync, writeFileSync } from 'node:fs';

const ASSETS = {
  __MARK__:      ['assets/mark.png',            'image/png'],
  __USE__:       ['assets/use-neustrimmer.jpg', 'image/jpeg'],
  __BUNDLEBIG__: ['assets/bundel-dark.jpg',     'image/jpeg'],
  __ZONE_LICHAAM__: ['assets/zone-lichaam.jpg', 'image/jpeg'],
  __ZONE_GEZICHT__: ['assets/zone-gezicht.jpg', 'image/jpeg'],
  __ZONE_HOOFD__:   ['assets/zone-hoofd.jpg',   'image/jpeg'],
  __ZONE_NEUS__:    ['assets/zone-neus.jpg',    'image/jpeg'],
  __BEST_LICHAAM__: ['assets/best-lichaam.jpg', 'image/jpeg'],
  __BEST_NEUS__:    ['assets/best-neus.jpg',    'image/jpeg'],
  __BEST_GEZICHT__: ['assets/best-gezicht.jpg', 'image/jpeg'],
  __BEST_HOOFD__:   ['assets/best-hoofd.jpg',   'image/jpeg'],
};

const name = process.argv[2];
if (!name) throw new Error('gebruik: node build.mjs <bestandsnaam-zonder-extensie>');

const dir = new URL('.', import.meta.url).pathname;
let html = readFileSync(`${dir}${name}.template.html`, 'utf8');

for (const [token, [file, mime]] of Object.entries(ASSETS)) {
  const hits = html.split(token).length - 1;
  if (!hits) continue;
  const b64 = readFileSync(`${dir}${file}`).toString('base64');
  html = html.replaceAll(token, `data:${mime};base64,${b64}`);
  console.log(`${token} -> ${file} (${Math.round(b64.length / 1024)} kB b64, ${hits}x)`);
}

const left = html.match(/__[A-Z0-9]+__/g);
if (left) throw new Error(`nog niet ingevulde placeholders: ${[...new Set(left)].join(', ')}`);

writeFileSync(`${dir}${name}.html`, html);
console.log(`geschreven: ${name}.html (${Math.round(html.length / 1024)} kB)`);
