#!/usr/bin/env python3
"""Zoekvraag ophalen uit Google-autocomplete (NL), per zaadwoord.

Autocomplete geeft geen volumes, maar wel wat mensen werkelijk intypen en in welke
volgorde Google ze rangschikt. Hoe vaker een term terugkomt over varianten heen, hoe
breder de vraag. Dat is het signaal dat we gebruiken tot er een volumebron (Ahrefs)
gekoppeld is.

Gebruik:
  python3 keywords.py "ingegroeide haren" "scheerbultjes" > uit.json
  python3 keywords.py --seeds-file seeds.txt --diep > uit.json

--diep  voegt per zaadwoord de varianten 'zaad a..z' en vraagwoorden toe (trager).
"""
import json, sys, time, urllib.parse, urllib.request, collections, argparse

URL = "https://suggestqueries.google.com/complete/search?client=firefox&hl=nl&gl=nl&q="
VRAAG = ["hoe", "waarom", "wat", "welke", "beste", "tegen", "voorkomen", "vs", "of",
         "na", "bij", "ervaringen"]

def suggest(q):
    for poging in range(3):
        try:
            with urllib.request.urlopen(URL + urllib.parse.quote(q), timeout=10) as r:
                return json.loads(r.read().decode("utf-8", "replace"))[1]
        except Exception:
            time.sleep(1.5 * (poging + 1))
    return []

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("seeds", nargs="*")
    ap.add_argument("--seeds-file")
    ap.add_argument("--diep", action="store_true")
    a = ap.parse_args()
    seeds = list(a.seeds)
    if a.seeds_file:
        seeds += [l.strip() for l in open(a.seeds_file, encoding="utf-8")
                  if l.strip() and not l.startswith("#")]
    uit = {}
    for s in seeds:
        teller = collections.Counter()
        rang = {}
        vragen = [s]
        if a.diep:
            vragen += [f"{s} {c}" for c in "abcdefghijklmnopqrstuvwz"]
            vragen += [f"{v} {s}" for v in VRAAG[:5]] + [f"{s} {v}" for v in VRAAG[5:]]
        for q in vragen:
            for i, t in enumerate(suggest(q)):
                teller[t] += 1
                rang[t] = min(rang.get(t, 99), i)
            time.sleep(0.25)
        uit[s] = sorted(({"term": t, "treffers": n, "beste_rang": rang[t]}
                         for t, n in teller.items()),
                        key=lambda x: (-x["treffers"], x["beste_rang"]))
        print(f"{s}: {len(uit[s])} termen", file=sys.stderr)
    json.dump(uit, sys.stdout, ensure_ascii=False, indent=1)

if __name__ == "__main__":
    main()
