# WELLSHAVE — Flex Guard™ 3-in-1

Cinematic product site for the Flex Guard™ 3-in-1 bodygroomer. Dutch copy,
no build step, no dependencies.

    npx http-server site -p 5180 -c-1   # any free port

## Sources

Product data comes from the live PDP
(`wellshave.com/products/wellshave-flex-guard™`) — name, prices, bundle
contents, specs, trial and warranty terms are all taken from that page. The
reference packshot came from the "Flex Guard Content" Drive folder.

Nothing on this page is an invented product claim. Where the PDP gave no
number, the page says nothing rather than filling the gap.

## Media provenance

All generated through the Higgsfield MCP, from one real product photo.

| Asset | Model | Settings |
|---|---|---|
| `assets/flexguard.jpg` (hero) | GPT Image 2 | 16:9, 2k, high — real packshot passed as `image` reference |
| `assets/bundle.jpg` | GPT Image 2 | same, hero passed as reference so lighting and floor match |
| `assets/clip1-hero.*` | Seedance 2.5 | `omni_reference`, 720p, 16:9, 10 s, `generate_audio: false` |
| `assets/clip2-turntable.mp4` | Seedance 2.5 | same, 10 s |
| `assets/clip3-macro.*` | Seedance 2.5 | same, 8 s |

The hero image job id was passed as `start_image` on all three clips, so the
motion is the same object as the stills.

### Post-processing

- `clip1-hero` re-encoded **all-intra** (`keyint=1`) so scroll-scrubbing seeks
  to any frame without waiting on a GOP.
- Every clip ships **MP4 (H.264) + WebM (VP9)**; Chromium builds without
  proprietary codecs fall through to WebM.
- `assets/spin/000–071.jpg` — 72 frames sliced from clip 2 at a **measured**
  loop point: frame 240 matched frame 0 at a mean absolute difference of 0.75,
  against 5.41 at mid-rotation, confirming exactly one revolution. Frames are
  sampled across source frames 0–239 so the viewer wraps without a jump.

## Interaction

- **Hero** — clip 1 scrubbed by scroll; completes at 90% of the pinned range so
  the final macro frame holds while the section unpins.
- **Spec strip** — counts up once on first intersection. All four figures are
  from the PDP: 7000 tpm, 90 min, 100 dagen, 2 jaar.
- **Bundle selector** — two real bundles. Swaps the hero image, name, price and
  the "wat je krijgt" list. Nothing is preselected.
- **Buy guard** — add-to-bag refuses with a visible warning ("Kies eerst je
  bundel") until a bundle is chosen, then increments the nav counter.
- **Sticky buy bar** — slides up past the hero, retracts at the footer.
- **Drag-to-spin** — 72-frame canvas viewer; auto-spins gently until first
  pointer/touch contact. Arrow keys work.

The product has one colourway, so the page carries a single brand accent
(`#FFBE2E`) sampled from the gold emblem and LED display, rather than the
per-colourway accent swapping of the earlier build.

## Verification

    node verify.mjs                     # defaults to :5180
    SITE_URL=https://… node verify.mjs  # routes through HTTPS_PROXY if set

30 Playwright assertions covering the drag-spin, the buy guard, the bundle
switcher (including that the two prices match the live PDP), the count-up,
the hero scrub and the sticky bar.
