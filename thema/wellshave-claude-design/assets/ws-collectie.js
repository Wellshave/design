/* Wellshave — collectiepagina.
   Bindt de keuzehulp uit ws-collectie-kop aan het raster uit ws-collectie-raster.
   De beslistabel komt uit <script type="application/json" id="ws-collectie-keuze">. */
(function () {
  'use strict';

  var bron = document.getElementById('ws-collectie-keuze');
  var CFG = { tabel: [], woord: {}, standaard: '' };
  if (bron) { try { CFG = JSON.parse(bron.textContent) || CFG; } catch (e) {} }

  /* ── de keuzehulp ── */
  function kies() {
    var rijen = document.querySelectorAll('.wsc .keuzes');
    if (!rijen.length) return;
    var nu = {};
    rijen.forEach(function (rij) {
      var b = rij.querySelector('.keuze[aria-pressed="true"]');
      if (b) nu[rij.dataset.groep] = b.dataset.v;
    });

    var id = CFG.standaard;
    for (var i = 0; i < CFG.tabel.length; i++) {
      var r = CFG.tabel[i], raak = true;
      for (var k in r.w) {
        if (r.w[k] !== '*' && nu[k] !== r.w[k]) { raak = false; break; }
      }
      if (raak) { id = r.id; break; }
    }

    document.querySelectorAll('.wsc .matchpaneel').forEach(function (p) {
      p.classList.toggle('aan', p.dataset.id === id);
    });

    var woorden = [];
    for (var g in nu) { if (CFG.woord[g] && CFG.woord[g][nu[g]]) woorden.push(CFG.woord[g][nu[g]]); }
    chips(nu);
    document.dispatchEvent(new CustomEvent('ws:keuze', {
      detail: { id: id, regel: woorden.join(' · ') }
    }));
  }

  // Eén chip per beantwoorde vraag, met een kruisje dat alleen díe vraag wist.
  // De tekst komt uit dezelfde woordenlijst als de regel eronder, met een hoofdletter.
  function chips(nu) {
    var bak = document.querySelector('.wsc .fb-chips');
    if (!bak) return;
    var wis = document.querySelector('.wsc .fb-wis');
    bak.textContent = '';
    var aantal = 0;
    for (var g in nu) {
      var w = CFG.woord[g] && CFG.woord[g][nu[g]];
      if (!w) continue;
      aantal++;
      var chip = document.createElement('span');
      chip.className = 'fb-chip';
      var t = document.createElement('span');
      t.textContent = w.charAt(0).toUpperCase() + w.slice(1);
      var k = document.createElement('button');
      k.type = 'button';
      k.className = 'fb-chip-uit';
      k.setAttribute('aria-label', 'Wis de keuze ' + t.textContent);
      k.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#wsr-kruis"/></svg>';
      k.dataset.groep = g;
      k.addEventListener('click', function () { wisGroep(this.dataset.groep); });
      chip.appendChild(t); chip.appendChild(k);
      bak.appendChild(chip);
    }
    if (!aantal) {
      var leeg = document.createElement('span');
      leeg.className = 'fb-chips-leeg';
      leeg.textContent = bak.dataset.leeg || '';
      bak.appendChild(leeg);
    }
    if (wis) wis.hidden = aantal === 0;
  }

  // Een vraag wissen betekent: geen enkel antwoord meer ingedrukt. De beslistabel
  // valt dan terug op een regel met een sterretje, of op de standaardmatch.
  function wisGroep(groep) {
    var rij = document.querySelector('.wsc .keuzes[data-groep="' + groep + '"]');
    if (!rij) return;
    rij.querySelectorAll('.keuze').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
    kies();
  }

  /* ── het raster ── */
  function tel() {
    var actief = document.querySelector('.wsc [data-groep="cat"] .filter[aria-pressed="true"]');
    var cat = actief ? actief.dataset.cat : 'alles', n = 0;
    document.querySelectorAll('.wsc .groep').forEach(function (g) {
      var uit = cat !== 'alles' && g.dataset.cat !== cat;
      g.classList.toggle('uit', uit);
      if (!uit) n += g.querySelectorAll('.wsk').length;
    });
    var t = document.querySelector('.wsc .telling');
    if (t) t.textContent = n + ' artikel' + (n === 1 ? '' : 'en');
    var f = document.querySelector('.wsc .fb-telling');
    if (f) f.textContent = n;
  }

  function vgltel() {
    var aan = [].slice.call(document.querySelectorAll('.wsc .wsk-vgl input:checked'));
    document.querySelectorAll('.wsc .wsk-vgl input').forEach(function (i) {
      i.disabled = !i.checked && aan.length >= 3;
    });
    document.querySelectorAll('.wsc .fb-knop.vgl-open, .wsc .vgl-knop').forEach(function (b) {
      b.disabled = aan.length < 2;
    });
    var t = document.querySelector('.wsc .vgl-tel');
    if (t) t.textContent = aan.length ? '(' + aan.length + ')' : '';
  }

  function toonVergelijking() {
    var aan = [].slice.call(document.querySelectorAll('.wsc .wsk-vgl input:checked'))
      .map(function (i) { return i.closest('.wsk').dataset.id; });
    document.querySelectorAll('.wsc .vgl').forEach(function (v) {
      v.classList.toggle('uit', aan.length > 0 && aan.indexOf(v.dataset.id) < 0);
    });
    var u = document.querySelector('.wsc .vgl-uit');
    if (u) { u.classList.add('open'); u.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  }

  function zetMatch(id, regel) {
    document.querySelectorAll('.wsc .wsk').forEach(function (k) {
      var isMatch = k.dataset.id && k.dataset.id === id;
      k.classList.toggle('match', isMatch);
      var t = k.querySelector('.wsk-tag.matchtag');
      if (isMatch && !t) {
        t = document.createElement('span');
        t.className = 'wsk-tag matchtag';
        t.textContent = k.dataset.matchlabel || 'Beste match';
        var shot = k.querySelector('.wsk-shot');
        shot.insertBefore(t, shot.firstChild);
      }
      if (t) t.style.display = isMatch ? '' : 'none';
      var eigen = k.querySelector('.wsk-tag:not(.matchtag)');
      if (eigen) eigen.style.display = isMatch ? 'none' : '';
    });
    var r = document.querySelector('.wsc .keuzeregel');
    if (r && regel) r.textContent = regel;
  }

  /* ── bedrading ── */
  function wire() {
    document.querySelectorAll('.wsc .zones').forEach(function (rij) {
      rij.querySelectorAll('.zone').forEach(function (b) {
        b.addEventListener('click', function (e) {
          if (b.tagName === 'A') return;            /* een echte link laat je met rust */
          e.preventDefault();
          rij.querySelectorAll('.zone').forEach(function (x) { x.removeAttribute('aria-current'); });
          b.setAttribute('aria-current', 'true');
          var zn = document.querySelector('.wsc .zn'), za = document.querySelector('.wsc .za');
          if (zn) zn.textContent = b.dataset.zone || '';
          if (za) za.textContent = b.dataset.app || '';
        });
      });
    });

    document.querySelectorAll('.wsc .filters').forEach(function (rij) {
      rij.querySelectorAll('.filter').forEach(function (b) {
        b.addEventListener('click', function () {
          rij.querySelectorAll('.filter').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          if (rij.dataset.groep === 'cat') tel();
        });
      });
    });

    document.querySelectorAll('.wsc .keuzes').forEach(function (rij) {
      rij.querySelectorAll('.keuze').forEach(function (b) {
        b.addEventListener('click', function () {
          rij.querySelectorAll('.keuze').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          kies();
        });
      });
    });

    document.querySelectorAll('.wsc .vknop').forEach(function (b) {
      b.addEventListener('click', function () {
        var item = b.parentElement, open = item.classList.toggle('open');
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    document.querySelectorAll('.wsc .wsk-oog').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        b.closest('.wsk').classList.toggle('blik');
      });
    });
    document.querySelectorAll('.wsc .wsk-blik').forEach(function (p) {
      p.addEventListener('click', function () { p.closest('.wsk').classList.remove('blik'); });
    });

    document.querySelectorAll('.wsc .wsk-vgl input').forEach(function (i) {
      i.addEventListener('change', vgltel);
    });
    document.querySelectorAll('.wsc .vgl-open, .wsc .vgl-knop').forEach(function (b) {
      b.addEventListener('click', toonVergelijking);
    });
    document.querySelectorAll('.wsc .vgl-sluit').forEach(function (b) {
      b.addEventListener('click', function () {
        var u = document.querySelector('.wsc .vgl-uit'); if (u) u.classList.remove('open');
      });
    });

    // Sorteren. De oorspronkelijke volgorde is de redactionele volgorde uit het
    // sjabloon; die leggen we één keer vast zodat "Meest relevant" er altijd naar
    // terug kan. Er wordt per groep gesorteerd, want een groep is een keuze van de
    // redactie en die willen we niet door elkaar husselen.
    document.querySelectorAll('.wsc .kaarten').forEach(function (raster) {
      [].slice.call(raster.children).forEach(function (k, i) {
        if (!k.dataset.volgorde) k.dataset.volgorde = i;
      });
    });

    function sorteer(sleutel) {
      document.querySelectorAll('.wsc .kaarten').forEach(function (raster) {
        var kaarten = [].slice.call(raster.children);
        kaarten.sort(function (a, b) {
          var av, bv;
          if (sleutel === 'prijs-op' || sleutel === 'prijs-af') {
            av = parseInt(a.dataset.prijs || '0', 10);
            bv = parseInt(b.dataset.prijs || '0', 10);
            if (av !== bv) return sleutel === 'prijs-op' ? av - bv : bv - av;
          } else if (sleutel === 'score') {
            av = parseFloat(a.dataset.score || '0');
            bv = parseFloat(b.dataset.score || '0');
            // zonder beoordeling achteraan: een leeg vakje is geen slechte score
            if (av !== bv) return bv - av;
          }
          return parseInt(a.dataset.volgorde, 10) - parseInt(b.dataset.volgorde, 10);
        });
        kaarten.forEach(function (k) { raster.appendChild(k); });
      });
    }

    document.querySelectorAll('.wsc [data-sorteer]').forEach(function (kiezer) {
      kiezer.addEventListener('change', function () {
        sorteer(kiezer.value);
        var t = kiezer.closest('.fb-sorteer');
        t = t && t.querySelector('.fb-sorteer-tekst');
        if (t) t.textContent = kiezer.options[kiezer.selectedIndex].textContent;
      });
    });

    document.querySelectorAll('.wsc .fb-wis').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.wsc .keuzes .keuze').forEach(function (x) {
          x.setAttribute('aria-pressed', 'false');
        });
        kies();
      });
    });

    // Op een typepagina staat geen keuzehulp; dan heeft de regel "Jouw keuzes"
    // niets te melden en verdwijnt hij, tenzij er nog een tip in staat.
    if (!document.querySelector('.wsc .keuzes')) {
      document.querySelectorAll('.wsc .fb-onder').forEach(function (r) {
        r.classList.add('zonder-keuzes');
        if (!r.querySelector('.fb-tip')) r.hidden = true;
      });
    }

    if (document.querySelector('.wsc [data-groep="cat"]')) tel();
    if (document.querySelector('.wsc .wsk-vgl')) vgltel();
    if (document.querySelector('.wsc .wsk')) {
      document.addEventListener('ws:keuze', function (e) { zetMatch(e.detail.id, e.detail.regel); });
    }
    kies();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  /* de theme-editor bouwt secties opnieuw op */
  document.addEventListener('shopify:section:load', wire);
})();
