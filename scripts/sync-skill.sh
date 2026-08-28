#!/usr/bin/env bash
# Spiegelt de landingspagina-skill van de design-repo naar de plekken waar hij gelezen wordt.
# De design-repo is altijd de bron.
#
#   1. wellshave-marketing        leeskopie in de andere repo
#   2. dist/<skill>.zip           uploadbundel voor de skill op claude.ai
#   3. driftcontrole              vergelijkt de bron met de claude.ai-kopie die in een
#                                 sessie geladen wordt
#
# Stap 3 bestaat omdat die kopie stil kan achterlopen. De skill op claude.ai is een eigen
# kopie met een eigen skillId; niets werkt hem bij als je hier commit. Loopt hij achter, dan
# leest Claude in een sessie een oudere versie van je systeem zonder dat iemand dat merkt.
# Er is geen API om te uploaden, dus dat blijft handwerk: claude.ai -> Settings -> Skills ->
# de skill vervangen door dist/<skill>.zip.
set -euo pipefail

SKILL="sanwarwala-landing-pages"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRON="$REPO/.claude/skills/$SKILL"
MARKETING="$HOME/Documents/GitHub/wellshave-marketing/.claude/skills/$SKILL"
GELADEN="$HOME/.claude/skills/synced/$SKILL"
BUNDEL="$REPO/dist/$SKILL.zip"

STRIKT=0
[ "${1:-}" = "--strikt" ] && STRIKT=1

KOP='> **Spiegel — niet hier bewerken.** De bron staat in Wellshave/design onder
> `.claude/skills/sanwarwala-landing-pages/`. Wijzigingen daar maken en daarna
> `scripts/sync-skill.sh` draaien.
'

# ---------------------------------------------------------------- 1. marketing-repo
if [ -d "$(dirname "$MARKETING")" ]; then
  rm -rf "$MARKETING"
  mkdir -p "$MARKETING/references"

  # SKILL.md: frontmatter moet bovenaan blijven, dus de kop komt eronder
  python3 - "$BRON/SKILL.md" "$MARKETING/SKILL.md" "$KOP" <<'PY'
import sys, pathlib
bron, doel, kop = sys.argv[1], sys.argv[2], sys.argv[3]
s = pathlib.Path(bron).read_text(encoding="utf-8")
if s.startswith("---"):
    eind = s.index("\n---", 3) + 4
    s = s[:eind] + "\n" + kop + s[eind:]
else:
    s = kop + "\n" + s
pathlib.Path(doel).write_text(s, encoding="utf-8")
PY

  for f in "$BRON"/references/*; do
    case "$f" in
      *.md)  { printf '%s\n' "$KOP"; cat "$f"; } > "$MARKETING/references/$(basename "$f")" ;;
      *)     cp "$f" "$MARKETING/references/$(basename "$f")" ;;   # o.a. de startbestanden
    esac
  done
  echo "Gespiegeld naar $MARKETING"
else
  echo "Overgeslagen: wellshave-marketing niet gevonden op deze machine."
fi

# ---------------------------------------------------------------- 2. uploadbundel
mkdir -p "$REPO/dist"
rm -f "$BUNDEL"
( cd "$REPO/.claude/skills" && zip -qr "$BUNDEL" "$SKILL" -x '*.DS_Store' )
echo "Bundel klaar: ${BUNDEL#"$REPO"/}  ($(du -h "$BUNDEL" | cut -f1))"

# ---------------------------------------------------------------- 3. driftcontrole
echo
echo "Driftcontrole tegen de kopie die Claude in een sessie laadt"
echo "  $GELADEN"

if [ ! -d "$GELADEN" ]; then
  echo "  Niet aanwezig op deze machine, niets te vergelijken."
  exit 0
fi

DRIFT=0
while IFS= read -r pad; do
  rel="${pad#"$BRON"/}"
  if [ ! -e "$GELADEN/$rel" ]; then
    echo "  ONTBREEKT  $rel"
    DRIFT=1
  elif ! cmp -s "$pad" "$GELADEN/$rel"; then
    echo "  VERSCHILT  $rel"
    DRIFT=1
  fi
done < <(find "$BRON" -type f | sort)

# bestanden die alleen in de geladen kopie zitten, wijzen op een verwijderd bronbestand
while IFS= read -r pad; do
  rel="${pad#"$GELADEN"/}"
  [ -e "$BRON/$rel" ] || { echo "  ALLEEN DAAR  $rel"; DRIFT=1; }
done < <(find "$GELADEN" -type f | sort)

if [ "$DRIFT" -eq 0 ]; then
  echo "  Gelijk. De geladen skill is die van deze repo."
  exit 0
fi

cat <<EOF

  De geladen skill loopt achter op deze repo. Zolang dat zo is, werkt Claude in een
  sessie met een ouder systeem: verouderde regels, en referentiebestanden die er
  simpelweg niet zijn.

  Bijwerken: claude.ai -> Settings -> Skills -> "$SKILL" vervangen door
  ${BUNDEL#"$REPO"/}, daarna een nieuwe sessie starten.
EOF

[ "$STRIKT" -eq 1 ] && exit 1
exit 0
