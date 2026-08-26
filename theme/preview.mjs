// Zet de Over ons-sectie om naar één los HTML-bestand om naar te kijken.
// De markup komt uit blokken.mjs; die is de enige plek waar hij staat.
//
//   node theme/preview.mjs
import { writeFileSync } from 'node:fs';
import { BLOKKEN, document_ } from './blokken.mjs';

const dir = new URL('.', import.meta.url).pathname;
writeFileSync(`${dir}over-ons.preview.html`, document_(BLOKKEN.map((b) => b.html()).join('\n')));
console.log('geschreven: theme/over-ons.preview.html');
