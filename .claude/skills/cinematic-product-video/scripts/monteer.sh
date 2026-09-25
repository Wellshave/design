#!/usr/bin/env bash
# Plakt de shots van een cinematische productvideo aan elkaar en brandt de
# annotatielaag in. Levert H.264 8-bit, omdat Seedance HEVC 10-bit teruggeeft
# en dat lang niet overal afspeelt.
#
#   monteer.sh --uit film.mp4 [--ass annotaties.ass] [--fonts MAP] shot1.mp4 shot2.mp4:2.3 ...
#
# Achter een shot mag ":seconden" staan om hem vanaf het begin af te kappen.
# Dat is de manier om een shot te redden waarvan alleen de staart misgaat —
# zie references/seedance-prompts.md over kantelende tekst.
set -euo pipefail

HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UIT=""; ASS=""; FONTS="$HIER/../assets/fonts"; CRF=16; SHOTS=()

hulp() { sed -n '2,10p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0; }

while [ $# -gt 0 ]; do
  case "$1" in
    --uit)   UIT="$2"; shift 2 ;;
    --ass)   ASS="$2"; shift 2 ;;
    --fonts) FONTS="$2"; shift 2 ;;
    --crf)   CRF="$2"; shift 2 ;;
    -h|--help) hulp ;;
    -*) echo "Onbekende optie: $1" >&2; exit 2 ;;
    *)  SHOTS+=("$1"); shift ;;
  esac
done

[ -n "$UIT" ]        || { echo "Geef een uitvoerbestand met --uit" >&2; exit 2; }
[ ${#SHOTS[@]} -gt 0 ] || { echo "Geef minstens één shot" >&2; exit 2; }
command -v ffmpeg >/dev/null || { echo "ffmpeg niet gevonden" >&2; exit 1; }

INVOER=(); FILTER=""; LABELS=""
i=0
for s in "${SHOTS[@]}"; do
  bestand="${s%%:*}"
  duur=""
  [ "$bestand" != "$s" ] && duur="${s##*:}"
  [ -f "$bestand" ] || { echo "Shot bestaat niet: $bestand" >&2; exit 1; }
  INVOER+=(-i "$bestand")
  if [ -n "$duur" ]; then
    FILTER+="[${i}:v]trim=0:${duur},setpts=PTS-STARTPTS[v${i}];"
    LABELS+="[v${i}]"
  else
    LABELS+="[${i}:v]"
  fi
  i=$((i+1))
done

FILTER+="${LABELS}concat=n=${#SHOTS[@]}:v=1:a=0[cat]"
if [ -n "$ASS" ]; then
  [ -f "$ASS" ] || { echo "Annotatiebestand bestaat niet: $ASS" >&2; exit 1; }
  [ -d "$FONTS" ] || { echo "Fontmap bestaat niet: $FONTS" >&2; exit 1; }
  # fontsdir is niet optioneel: zonder verwijzing valt libass stil terug op een
  # systeemfont, en dat geeft geen foutmelding.
  FILTER+=";[cat]subtitles=${ASS}:fontsdir=${FONTS}[uit]"
  KAART="[uit]"
else
  KAART="[cat]"
fi

ffmpeg -y -loglevel error "${INVOER[@]}" \
  -filter_complex "$FILTER" -map "$KAART" \
  -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -r 24 -movflags +faststart \
  "$UIT"

echo "Gemonteerd: $UIT"
# `ffmpeg -i` zonder uitvoerbestand eindigt met exitcode 1; zonder de vangnetten
# hieronder zou pipefail plus set -e het script hier laten struikelen op succes.
{ ffmpeg -i "$UIT" 2>&1 || true; } | grep -E "Duration|Stream #0:0" | sed 's/^ */  /' || true
if [ -n "$ASS" ]; then
  echo "  Controleer nu één frame per annotatie — een fontterugval meldt zichzelf niet."
fi
exit 0
