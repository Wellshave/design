#!/usr/bin/env python3
"""Leidt de twee statische Montserrat-gewichten af uit het themabestand van wellshave.com.

Draai dit alleen als het merkfont op de site verandert; normaal staan de bestanden
al klaar in assets/fonts/.

Waarom dit nodig is: het thema serveert een variabel Montserrat met de as wght van
100 tot 900 en standaardinstantie 100. libass kan variabele assen niet aansturen en
zou dus Thin renderen — op video onleesbaar. Bovendien heet het bestand .ttf maar is
het in werkelijkheid WOFF2.

    python3 maak-fonts.py [--url URL] [--uit MAP]

Vereist: fonttools en brotli  (pip install fonttools brotli)
"""
import argparse
import pathlib
import sys
import urllib.request

STANDAARD_URL = "https://wellshave.com/cdn/shop/t/77/assets/Montserrat.ttf"
GEWICHTEN = [(500, "WS Mont Medium", "WSMontMedium.ttf"),
             (600, "WS Mont SemiBold", "WSMontSemiBold.ttf")]


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--url", default=STANDAARD_URL, help="bron van het variabele merkfont")
    p.add_argument("--uit", default=str(pathlib.Path(__file__).parent.parent / "assets" / "fonts"),
                   help="doelmap voor de statische gewichten")
    a = p.parse_args()

    try:
        from fontTools.ttLib import TTFont
        from fontTools.varLib import instancer
    except ImportError:
        print("fonttools en brotli ontbreken:  pip install fonttools brotli", file=sys.stderr)
        return 1

    uit = pathlib.Path(a.uit)
    uit.mkdir(parents=True, exist_ok=True)
    bron = uit / "_bron-variabel.woff2"

    print(f"Ophalen {a.url}")
    try:
        with urllib.request.urlopen(a.url, timeout=60) as r:
            bron.write_bytes(r.read())
    except Exception as e:
        print(f"Ophalen mislukt: {e}", file=sys.stderr)
        return 1

    f = TTFont(bron)
    if "fvar" not in f:
        print("Dit is geen variabel font meer. Controleer of het thema is gewijzigd "
              "en pas zo nodig deze werkwijze aan.", file=sys.stderr)
        return 1
    assen = {x.axisTag: (x.minValue, x.maxValue) for x in f["fvar"].axes}
    print(f"Variabele assen: {assen}")

    for gewicht, familie, naam in GEWICHTEN:
        f = TTFont(bron)
        f.flavor = None                       # WOFF2 uitpakken naar kale TTF
        inst = instancer.instantiateVariableFont(f, {"wght": gewicht}, inplace=False)
        nt = inst["name"]
        # Elk gewicht een eigen familienaam, anders kan libass ze niet uit elkaar houden.
        for nid, waarde in ((1, familie), (2, "Regular"), (4, familie),
                            (6, familie.replace(" ", "")), (16, familie), (17, "Regular")):
            nt.setName(waarde, nid, 3, 1, 0x409)
            nt.setName(waarde, nid, 1, 0, 0)
        inst.save(uit / naam)
        print(f"  {naam}  ->  {familie} (wght {gewicht})")

    bron.unlink(missing_ok=True)
    print(f"\nKlaar. Verwijs in het ASS-bestand naar deze familienamen en geef ffmpeg "
          f"fontsdir={uit}")
    print("De licentie in LICENSE-Montserrat.txt blijft van toepassing en moet meereizen.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
