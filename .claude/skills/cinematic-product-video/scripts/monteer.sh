#!/usr/bin/env bash
# Plakt de shots van een cinematische productvideo aan elkaar en brandt de
# annotatielaag in. Levert H.264 8-bit, omdat Seedance HEVC 10-bit teruggeeft
# en dat lang niet overal afspeelt.
#
#   monteer.sh --uit film.mp4 [--ass annotaties.ass] [--fonts MAP]
#              [--muziek track.mp3 [--muziek-start SEC] [--muziek-lufs N]]
#              shot1.mp4 shot2.mp4:2.3 ...
#
# Achter een shot mag ":seconden" staan om hem vanaf het begin af te kappen.
# Dat is de manier om een shot te redden waarvan alleen de staart misgaat —
# zie references/seedance-prompts.md over kantelende tekst.
#
# --muziek legt één track onder de hele film: op maat geknipt, met een korte
# infade en een uitfade over de laatste seconden. --muziek-start kiest waar in
# de track je begint, zodat je de opbouw op de montage kunt leggen in plaats van
# andersom.
#
# Het niveau gaat in LUFS en niet in dB, omdat een vaste verlaging het resultaat
# laat afhangen van hoe hard de aangeleverde track gemasterd is: tussen twee
# tracks uit dezelfde bibliotheek zit zo tien dB verschil. --muziek-lufs mikt op
# een doelluidheid (standaard -16, gangbaar voor een muziekbed op web) en komt
# dus altijd op hetzelfde niveau uit.
set -euo pipefail

HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UIT=""; ASS=""; FONTS="$HIER/../assets/fonts"; CRF=16; SHOTS=()
MUZIEK=""; MSTART=0; MLUFS=-16; UITFADE=1.6; INFADE=0.6

hulp() { sed -n '2,22p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0; }

while [ $# -gt 0 ]; do
  case "$1" in
    --uit)   UIT="$2"; shift 2 ;;
    --ass)   ASS="$2"; shift 2 ;;
    --fonts) FONTS="$2"; shift 2 ;;
    --crf)   CRF="$2"; shift 2 ;;
    --muziek)       MUZIEK="$2"; shift 2 ;;
    --muziek-start) MSTART="$2"; shift 2 ;;
    --muziek-lufs)  MLUFS="$2"; shift 2 ;;
    -h|--help) hulp ;;
    -*) echo "Onbekende optie: $1" >&2; exit 2 ;;
    *)  SHOTS+=("$1"); shift ;;
  esac
done

[ -n "$UIT" ]        || { echo "Geef een uitvoerbestand met --uit" >&2; exit 2; }
[ ${#SHOTS[@]} -gt 0 ] || { echo "Geef minstens één shot" >&2; exit 2; }
command -v ffmpeg >/dev/null || { echo "ffmpeg niet gevonden" >&2; exit 1; }

INVOER=(); FILTER=""; LABELS=""; TOTAAL=0
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
    lengte="$duur"
  else
    LABELS+="[${i}:v]"
    # De werkelijke duur uitlezen en niet 5 seconden aannemen: Seedance levert
    # 121 frames op 24 fps, dus 5,04 s per shot. Over zes shots is dat een
    # kwart seconde verschil, genoeg om een uitfade te vroeg te laten beginnen.
    lengte="$(ffprobe -v error -select_streams v -show_entries format=duration \
              -of csv=p=0 "$bestand")"
  fi
  TOTAAL="$(awk -v a="$TOTAAL" -v b="$lengte" 'BEGIN{printf "%.4f", a+b}')"
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

AUDIOKAART=(); AUDIOCODEC=()
if [ -n "$MUZIEK" ]; then
  [ -f "$MUZIEK" ] || { echo "Muziekbestand bestaat niet: $MUZIEK" >&2; exit 1; }
  INVOER+=(-i "$MUZIEK")
  FADESTART="$(awk -v t="$TOTAAL" -v f="$UITFADE" 'BEGIN{printf "%.4f", t-f}')"
  # apad vóór atrim: is de track korter dan de film, dan vult stilte de staart
  # aan in plaats van dat ffmpeg de audio vroeg laat ophouden.
  FILTER+=";[${i}:a]atrim=start=${MSTART},asetpts=PTS-STARTPTS,apad,"
  # loudnorm vóór de fades: anders normaliseert hij de fades weg en komt de
  # uitfade er weer bovenop.
  FILTER+="atrim=0:${TOTAAL},loudnorm=I=${MLUFS}:TP=-1.5:LRA=11,"
  FILTER+="afade=t=in:st=0:d=${INFADE},"
  FILTER+="afade=t=out:st=${FADESTART}:d=${UITFADE}[aud]"
  AUDIOKAART=(-map "[aud]")
  AUDIOCODEC=(-c:a aac -b:a 192k -ar 48000)
fi

ffmpeg -y -loglevel error "${INVOER[@]}" \
  -filter_complex "$FILTER" -map "$KAART" "${AUDIOKAART[@]}" \
  -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -r 24 -movflags +faststart \
  "${AUDIOCODEC[@]}" \
  "$UIT"

echo "Gemonteerd: $UIT"
# `ffmpeg -i` zonder uitvoerbestand eindigt met exitcode 1; zonder de vangnetten
# hieronder zou pipefail plus set -e het script hier laten struikelen op succes.
{ ffmpeg -i "$UIT" 2>&1 || true; } | grep -E "Duration|Stream #0:0" | sed 's/^ */  /' || true
if [ -n "$ASS" ]; then
  echo "  Controleer nu één frame per annotatie — een fontterugval meldt zichzelf niet."
fi
exit 0
