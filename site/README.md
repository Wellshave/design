# WELLSHAVE — SENTINEL PRO

Cinematic product site for a fictional premium razor brand. No build step, no
dependencies — open `index.html` through any static server.

    npx http-server site -p 4173 -c-1

## Media provenance

All assets generated through the Higgsfield MCP.

| Asset | Model | Settings |
|---|---|---|
| `assets/gunmetal.jpg` (hero) | GPT Image 2 | 16:9, 2k, quality high |
| `assets/{obsidian,rose,platinum,copper}.jpg` | GPT Image 2 | hero passed as `image` reference so composition, camera and lighting stay identical across finishes |
| `assets/clip1-hero.*` | Seedance 2.5 | `omni_reference`, 720p, 16:9, 10 s, `generate_audio: false` |
| `assets/clip2-turntable.mp4` | Seedance 2.5 | same, 10 s |
| `assets/clip3-macro.*` | Seedance 2.5 | same, 8 s |

The hero image job id was passed as `start_image` on all three clips, so every
frame of motion is the same physical object as the stills.

### Post-processing

- `clip1-hero` re-encoded **all-intra** (`keyint=1`) so scroll-scrubbing seeks
  to any frame without waiting on a GOP.
- Every clip ships as **MP4 (H.264) + WebM (VP9)**. Chromium builds without
  proprietary codecs fall through to the WebM source.
- `assets/spin/000–071.jpg` — 72 frames sliced from clip 2. The loop point was
  measured rather than assumed: frame 240 matched frame 0 with a mean absolute
  difference of 0.66 (vs 11.32 at mid-rotation), confirming exactly one
  revolution, so the frames are sampled across source frames 0–239.

## Interaction

- **Hero** — clip 1 scrubbed by scroll position; the scrub completes at 90% of
  the pinned range so the final macro frame holds while the section unpins.
- **Spec strip** — counts up once, on first intersection.
- **Colourway switcher** — five finishes; swaps the hero image, product name,
  price and the page accent colour (`--accent` on `:root`, inherited by nav,
  swatch ring, size selection, CTA, sticky bar and spec units).
- **Size selector** — four handle lengths, two `disabled` and unselectable.
- **Size guard** — add-to-bag refuses and shows a visible warning until a
  length is chosen, then increments the nav bag counter.
- **Sticky buy bar** — slides up once the hero is scrolled past, retracts at the footer.
- **Drag-to-spin** — 72-frame canvas viewer; auto-spins gently until the first
  pointer/touch contact, then follows the drag. Arrow keys also work.

## Verification

    node verify.mjs        # requires a server on :4173

32 Playwright assertions covering the drag-spin (frame advance both directions,
auto-spin start/stop, canvas repaint), the size guard (refusal, warning
visibility, sold-out unselectability, then success and increment), the
colourway switcher, count-up, hero scrub and sticky bar.
