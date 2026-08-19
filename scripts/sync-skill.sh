#!/usr/bin/env bash
# Spiegelt de landingspagina-skill van de design-repo naar wellshave-marketing.
# De design-repo is de bron; de kopie in marketing is alleen om te lezen.
set -euo pipefail

BRON="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.claude/skills/sanwarwala-landing-pages"
DOEL="$HOME/Documents/GitHub/wellshave-marketing/.claude/skills/sanwarwala-landing-pages"

if [ ! -d "$DOEL" ]; then
  echo "Doelmap bestaat niet: $DOEL" >&2
  echo "Is wellshave-marketing gekloond?" >&2
  exit 1
fi

KOP='> **Spiegel — niet hier bewerken.** De bron staat in Wellshave/design onder
> `.claude/skills/sanwarwala-landing-pages/`. Wijzigingen daar maken en daarna
> `scripts/sync-skill.sh` draaien.
'

rm -rf "$DOEL"
mkdir -p "$DOEL/references"

# SKILL.md: frontmatter moet bovenaan blijven, dus de kop komt eronder
python3 - "$BRON/SKILL.md" "$DOEL/SKILL.md" "$KOP" <<'PY'
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
    *.md)  { printf '%s\n' "$KOP"; cat "$f"; } > "$DOEL/references/$(basename "$f")" ;;
    *)     cp "$f" "$DOEL/references/$(basename "$f")" ;;   # o.a. het startbestand, ongewijzigd
  esac
done

echo "Gespiegeld naar $DOEL"
ls -1 "$DOEL" "$DOEL/references" | sed 's/^/  /'
echo
echo "Vergeet niet in beide repo's te committen."
