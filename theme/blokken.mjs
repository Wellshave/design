// De zes blokken van Over ons als losse stukken markup.
//
// Eén bron voor preview.mjs en artifact.mjs, zodat die twee niet uit elkaar
// gaan lopen. De copy komt uit templates/page.ws-overons.json en de opmaak uit
// assets/ws-overons.css, allebei ongewijzigd — alleen de markup staat hier een
// tweede keer, want een Liquid-renderer hebben we niet. Verbouw je
// sections/ws-overons.liquid, verbouw dan dit bestand mee.
import { readFileSync } from 'node:fs';

const dir = new URL('.', import.meta.url).pathname;

export const css = readFileSync(`${dir}assets/ws-overons.css`, 'utf8');
export const tpl = JSON.parse(readFileSync(`${dir}templates/page.ws-overons.json`, 'utf8'));

const sec = tpl.sections.ws_overons;
export const s = sec.settings;
const blok = (t) => sec.block_order.map((k) => sec.blocks[k]).filter((b) => b.type === t);

// de eigen merkfotografie, ingebed zodat een los bestand overal werkt
const MIME = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
export function beeld(naam) {
  const ext = naam.split('.').pop();
  return `data:${MIME[ext]};base64,${readFileSync(`${dir}beeld/${naam}`).toString('base64')}`;
}

// |br| is in het thema een instelling-vriendelijk regeleinde; hier hetzelfde
const br = (v) => (v || '').replace(/\|br\|/g, '<br>');
const el = (v, fn) => (v ? fn(v) : '');

const ICO = {
  v1: '<circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.6v5.2M12 16.1v.1" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  v2: '<path d="M3.4 7.2h13l4.2 4.8-4.2 4.8h-13z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.2 12h6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  v3: '<circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4.6" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/>',
};
const CHK = '<circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7.8 12.3l2.9 2.9 5.5-6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>';
const KRS = '<circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 9l6 6M15 9l-6 6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>';
const TEL = '<path d="M17 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M19 8v6M22 11h-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="7" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/>';
const svg = (p) => `<svg viewBox="0 0 24 24">${p}</svg>`;

const punten = (voor, klas, pad) =>
  [1, 2, 3, 4]
    .map((i) => s[`${voor}_punt_${i}`])
    .filter(Boolean)
    .map((p) => `<li><svg class="${klas}" viewBox="0 0 24 24">${pad}</svg><span>${p}</span></li>`)
    .join('');

const hero = () => `<header class="ws-ov__hero" style="--ws-ov-hero-h:${s.hero_hoogte}px">
  <div class="ws-ov__media">
    <img class="ws-ov__foto" src="${beeld('founder-magazijn.jpg')}" alt="${s.foto_alt}">
    <div class="ws-ov__scrim"></div>
  </div>
  <img class="ws-ov__merk" src="${beeld('hero-logo.png')}" alt="">
  <div class="ws-ov__streep"></div>
  <div class="ws-ov__heroin"><div class="ws-ov__heroblok">
    ${el(s.hero_eyebrow, (v) => `<p class="ws-ov__eyebrow">${v}</p>`)}
    ${el(s.hero_kop, (v) => `<h1 class="ws-ov__h1">${br(v)}</h1>`)}
    ${el(s.hero_lead, (v) => `<p class="ws-ov__lead">${v}</p>`)}
    ${el(s.tel_getal, (v) => `<p class="ws-ov__teller">${svg(TEL)}<span><b>${v}</b><em>${s.tel_label}</em></span></p>`)}
  </div></div>
</header>`;

const verhaal = () => `<section class="ws-ov__verhaal"><div class="ws-ov__verhaalin">
  <figure class="ws-ov__beeld">
    <div class="ws-ov__beeld--een"><img src="${beeld('verhaal-1.jpg')}" alt="${s.vh_foto1_alt}" loading="lazy"></div>
    <div class="ws-ov__beeld--twee"><img src="${beeld('verhaal-2.jpg')}" alt="${s.vh_foto2_alt}" loading="lazy"></div>
    ${el(s.vh_bijschrift, (v) => `<figcaption class="ws-ov__bijschrift">${v}</figcaption>`)}
  </figure>
  <div class="ws-ov__verhaalt">
    ${el(s.vh_eyebrow, (v) => `<p class="ws-ov__eyebrow">${v}</p>`)}
    ${el(s.vh_kop, (v) => `<h2 class="ws-ov__h2 ws-ov__h2--klein">${br(v)}</h2>`)}
    ${[1, 2, 3]
      .map((i) => s[`vh_p${i}`])
      .filter(Boolean)
      .map((v) => `<p class="ws-ov__vtekst">${v}</p>`)
      .join('')}
    ${el(s.vh_les, (v) => `<blockquote class="ws-ov__les">${v}</blockquote>`)}
    ${el(
      s.vh_naam,
      (v) => `<div class="ws-ov__hand">
      <i style="background-image:url(${beeld('founder-magazijn.jpg')})"></i>
      <span><b>${v}</b><em>${s.vh_naam_bij || ''}</em></span>
    </div>`
    )}
  </div>
</div></section>`;

const vragen = () => `<section class="ws-ov__vragen"><div class="ws-ov__rand">
  <img class="ws-ov__randmerk" src="${beeld('hero-logo.png')}" alt="">
  <div class="ws-ov__randin">
    <div class="ws-ov__kop">
      ${el(s.vr_eyebrow, (v) => `<p class="ws-ov__eyebrow">${v}</p>`)}
      ${el(s.vr_kop, (v) => `<h2 class="ws-ov__h2">${br(v)}</h2>`)}
      ${el(s.vr_sub, (v) => `<p class="ws-ov__sub">${v}</p>`)}
    </div>
    <div class="ws-ov__drie" style="--ws-kol:${Math.min(3, blok('vraag').length)}">
      ${blok('vraag')
        .map(
          (b) => `<article class="ws-ov__vraag">
        <span class="ws-ov__zegel">${svg(ICO[b.settings.icoon] || ICO.v1)}</span>
        ${el(b.settings.nr, (v) => `<p class="ws-ov__vraagnr">${v}</p>`)}
        ${el(b.settings.kop, (v) => `<h3 class="ws-ov__vraagh">${v}</h3>`)}
        ${el(b.settings.tekst, (v) => `<p class="ws-ov__vraagt">${v}</p>`)}
      </article>`
        )
        .join('')}
    </div>
    ${el(s.vr_slot, (v) => `<p class="ws-ov__vraagslot">${svg(CHK)}<span>${v}</span></p>`)}
  </div>
</div></section>`;

const werk = () => `<section class="ws-ov__werk"><div class="ws-ov__werkin">
  <div class="ws-ov__werkkop">
    ${el(s.wk_eyebrow, (v) => `<p class="ws-ov__eyebrow">${v}</p>`)}
    ${el(s.wk_kop, (v) => `<h2 class="ws-ov__h2--dark">${br(v)}</h2>`)}
    ${el(s.wk_sub, (v) => `<p class="ws-ov__sub--dark">${v}</p>`)}
  </div>
  <div class="ws-ov__stappen" style="--ws-kol:${Math.min(3, blok('stap').length)}">
    ${blok('stap')
      .map(
        (b) => `<div class="ws-ov__stap">
      <p class="ws-ov__cijfer">${b.settings.cijfer}</p>
      ${el(b.settings.label, (v) => `<p class="ws-ov__staplabel">${v}</p>`)}
      ${el(b.settings.tekst, (v) => `<p class="ws-ov__staptekst">${v}</p>`)}
      ${el(
        b.settings.citaat,
        (v) =>
          `<blockquote class="ws-ov__stem">${v}${b.settings.citaat_bron ? `<b>${b.settings.citaat_bron}</b>` : ''}</blockquote>`
      )}
    </div>`
      )
      .join('')}
  </div>
</div></section>`;

const belofte = () => `<section class="ws-ov__belofte"><div class="ws-ov__duo" style="--ws-kol:2">
  <div class="ws-ov__paneel">
    <img class="ws-ov__paneelmerk" src="${beeld('hero-logo.png')}" alt="">
    ${el(s.wel_eyebrow, (v) => `<p class="ws-ov__paneelkop">${v}</p>`)}
    ${el(s.wel_kop, (v) => `<h3 class="ws-ov__paneelh">${br(v)}</h3>`)}
    <ul class="ws-ov__lijst">${punten('wel', 'ws-ov__vink', CHK)}</ul>
    ${el(
      s.team_titel,
      (v) => `<div class="ws-ov__team">
      <span class="ws-ov__koppen">${[1, 2, 3]
        .map((i) => `<i><img src="${beeld(`team-${i}.webp`)}" alt=""></i>`)
        .join('')}</span>
      <span><b>${v}</b><em>${s.team_tekst || ''}</em></span>
    </div>`
    )}
  </div>
  <div class="ws-ov__paneel ws-ov__paneel--licht">
    <img class="ws-ov__paneelmerk" src="${beeld('hero-logo.png')}" alt="">
    ${el(s.niet_eyebrow, (v) => `<p class="ws-ov__paneelkop">${v}</p>`)}
    ${el(s.niet_kop, (v) => `<h3 class="ws-ov__paneelh">${br(v)}</h3>`)}
    <ul class="ws-ov__lijst">${punten('niet', 'ws-ov__kruis', KRS)}</ul>
  </div>
</div></section>`;

const afsluiter = () => `<section class="ws-ov__af"><div class="ws-ov__afin">
  ${el(s.af_eyebrow, (v) => `<p class="ws-ov__eyebrow">${v}</p>`)}
  ${el(s.af_kop, (v) => `<h2 class="ws-ov__h2--dark">${br(v)}</h2>`)}
  ${el(s.af_sub, (v) => `<p class="ws-ov__sub--dark">${v}</p>`)}
  <div class="ws-ov__knoppen">
    ${el(
      s.cta1_label,
      (v) =>
        `<a class="ws-ov__cta" href="${s.cta1_link || '/collections/all'}">${v}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg></a>`
    )}
    ${el(s.cta2_label, (v) => `<a class="ws-ov__cta ws-ov__cta--rand" href="${s.cta2_link || '/pages/quiz'}">${v}</a>`)}
  </div>
  ${el(s.af_reden, (v) => `<p class="ws-ov__afreden">${v}</p>`)}
</div></section>`;

export const BLOKKEN = [
  { id: 'hero', naam: '1 — Hero', bij: 'Wie het over moet hebben, staat er meteen: jij.', html: hero },
  { id: 'verhaal', naam: '2 — Het verhaal', bij: 'Waar het begon, meteen omgedraaid naar wat het voor jou betekent.', html: verhaal },
  { id: 'vragen', naam: '3 — De drie vragen', bij: 'Zijn probleem, wat hij al probeerde, waar hij uit wil komen.', html: vragen },
  { id: 'werk', naam: '4 — De werkwijze', bij: 'Van zijn probleem naar zijn resultaat, in drie stappen.', html: werk },
  { id: 'belofte', naam: '5 — Wel en niet beloven', bij: 'Twee panelen: wat we waarmaken, en wat we bewust niet claimen.', html: belofte },
  { id: 'af', naam: '6 — Afsluiter', bij: 'Terug naar de keuze, met de risiconemers eronder.', html: afsluiter },
];

// het kale document waar één of alle blokken in gerenderd worden
export const document_ = (inhoud) => `<!DOCTYPE html>
<html lang="nl"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Over ons &mdash; Wellshave</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0}
body{background:#F7F2E9;font-family:"Montserrat",sans-serif}
img{max-width:100%;height:auto;display:block}
${css}
</style>
</head><body><div class="ws-ov">${inhoud}</div></body></html>`;
