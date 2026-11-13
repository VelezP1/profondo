# Profondo — Casa de Perfumes · Design notes

Living notes on **why the site exists** and **why each part looks and moves the way it does**.
Update this file whenever a design decision changes.

---

## 1. Purpose

**Profondo** is a perfume house in Puebla, México selling 100 % original fragrances in three families
(**Nicho**, **Diseñador**, **Árabes**) and **decants from 5 ml**, so people can try before committing to a full bottle.

The site is a **single-page scrollytelling storefront**. It does not sell in the page. It does three jobs:

1. **Create desire** — make the visitor feel the brand before reading anything (cinematic, dark, gold).
2. **Show the range** — one bottle at a time, then the three families, then the full catalogue.
3. **Move them to WhatsApp** — every call to action opens a pre-filled WhatsApp chat (`+52 221 252 7039`).
   Instagram: `@profondoperfume`, `@profondo_cperfumes`.

**Tone:** quiet luxury. Little text, big images, long pauses. It should feel produced, like a fragrance campaign, not a web shop.

**Tagline:** *"Huele por ti, huele por mí."*
**Brand promise (CTA eyebrow):** *100 % originales · Garantizados*

---

## 2. Design principles (the "Worlds" standard)

The **Worlds** section is the benchmark: one idea per screen, full-bleed photography, huge type, and scroll that changes *state* (not just position). Every section is held to it.

| Principle | What it means in practice |
|---|---|
| **One idea per screen** | A single product / family / page is the hero of any viewport. |
| **Scroll drives the story** | Sections are *pinned* (`position: sticky`) inside a tall wrapper; scroll progress selects which state is shown. |
| **Dwell, then move** | Things hold still long enough to be read, then glide. (Sequence and Catalog snap each item to centre.) |
| **Very little text** | Names, three scent words, one line of copy. No paragraphs, no feature lists. |
| **Colour comes from the product** | The room takes the bottle's colour (red, blue, amber…). The UI itself stays black + gold. |
| **No decoration without a job** | Anything that does not communicate (rings, ghost words, boxes) was removed. |

### Tokens

| Token | Value | Use |
|---|---|---|
| Background | `#000` (catalogue `#060608`) | Everything. Black lets bottles and photos glow. |
| Cream | `#f3ead8` | Headlines, key words. |
| Gold | `#c9a35c` | Eyebrows, hairlines, labels. |
| Light gold | `#e8c96a` | Highlights, dots, emphasis. |
| Bright gold | `#d4af37` | Progress bars, logo. |
| Display font | **Cormorant Garamond** (400 / 500 / 600 / italic) | All headlines and big words. |
| Body / labels | system sans, tiny, `uppercase`, tracking `0.3–0.5em` | Eyebrows and captions only. |
| Easing | ease-out cubic `cubic-bezier(0.22, 1, 0.36, 1)` | Reveals. |

---

## 3. Section by section

Scroll order: **Hero → Sequence → Worlds → Catalog → Decants → Final CTA** (+ floating WhatsApp bubble).

### 3.1 Hero — the cover and the curtain (`#hero`, 420vh)
- **Purpose:** first impression with maximum impact and zero noise. The brand name *is* the design.
- **Cover (first screen):** black, one huge gold **PROFONDO** (~84 % of the screen width) and one line, *"Huele por ti, huele por mí."*, plus a thin scroll-cue line. Nothing else — no logo, frame, particles or corner text (all tried and removed as decoration).
- **Scroll:** a line of light grows from the split between **PROF | ONDO**; the two halves ride the edges of the opening frame while a looping video (perfume in water, `videos/profondo.mp4`) is revealed behind it. The tagline and cue fade within the first 10 % of scroll.
  Then one line of copy rises word by word — *"Un perfume se elige con la piel."* — and the frame fades into black to hand over to the next chapter.
- **Mechanics:** `clip-path: inset()` on `#hero-window`, per-half `translateX`, video `scale` 1.3 → 1. Word size `17vw` mobile / `15.5vw` desktop.

### 3.2 Sequence — the collection, one bottle at a time (`#sequence`, 800vh)
- **Purpose:** show five flagship perfumes (Layton, Baccarat Rouge 540, Eros, Khamrah Qahwa, Oud for Glory — spanning Nicho, Diseñador and Árabes) and *how each one smells*.
- **Look: a poster per perfume.** The *whole screen* becomes the bottle's colour (navy, deep red, blue, amber, gold-brown) as a flat, slightly darkening gradient — no glows, rings, ghost words or callouts. Huge bottle (78vh) on the right, huge name on the left, the three scent words as **one italic line** under it (e.g. *Azafrán · Jazmín · Cedro*), a tiny eyebrow (family · house) above, counter and progress line.
- **Motion:** the bottle arrives as a dark silhouette, rotates/slides in, lights up at centre, **holds still**, then leaves. A name is never on screen with another name; colours cross-fade.
- **Mechanics:** `raw = progress × (N−1+2·0.3) − 0.3` (0.3 rest before the first / after the last); position uses a smoothstep dwell (`pos = base + smoothstep((frac−0.35)/0.3)`).
- **Mobile:** bottle on top, name + scent line below.
- **Content to verify:** the scent words were chosen from general knowledge of these fragrances — confirm against what is actually sold (least sure: Baccarat Rouge 540, Oud for Glory).

### 3.3 Worlds — the three families (`#worlds`, 320vh) — *the benchmark*
- **Purpose:** simple mental model: *Nicho / Diseñador / Árabes*.
- **Scroll:** three full-bleed photo panels; scroll decides which one **opens** (flex-grow 1 → 4), the others dim to slivers. Title grows in the open panel; gold ring appears on it.
- **Heading:** *"Elige tu firma."* with counter `02/03`.

### 3.4 Catalog — scroll turns the pages (`#catalogo`, 520vh)
- **Purpose:** let people browse the real catalogue (18 pages Nicho, 18 pages Diseñador) without leaving the page, and download the PDF.
- **Design:** coverflow. The current page is large and lit at centre; neighbours are tilted (`rotateY`), pushed back in Z and dimmed.
  Each page **dwells** at centre, then glides to the next. Click a side page to jump to it.
- **UI:** big tab words **Nicho / Diseñador** top-right, page counter top-left (`07 / 18`), small **PDF** link, progress line. No arrow buttons, no heading.
- **Performance:** only pages within ±3 of the current one load (`data-src` → `src`).
- **Assets:** `catalog/nicho-01…18.jpg`, `catalog/diseniador-01…18.jpg`, two PDFs. Nicho pages are 1238×2200 (tall), Diseñador 935×1210 (wider) — the layout handles both aspect ratios.

### 3.5 Decants — try before you buy (`#decants`, 140vh)
- **Purpose:** the low-risk entry point (from 5 ml) and the main conversion for new customers.
- **Design:** full-bleed photo of six decant vials; the picture opens like a window as you scroll (`clip-path` + scale 1.4 → 1), then the headline and button fade in over it.
- **Copy:** *"Prueba antes. **Enamórate** después."* → button **Pedir un decant** (WhatsApp).
- **Known weak spot:** the headline sits over the vial labels. Candidates: crop the photo differently or move the text.

### 3.6 Final CTA (`#cta`)
- **Purpose:** close. One sentence, one button.
- **Design:** dark photo at 15 % opacity slowly pushing in, gold radial glow, *"Tu perfume te está esperando."* → **Pedir por WhatsApp**, then the two Instagram handles.

### 3.7 WhatsApp bubble
Fixed bottom-right on every screen. Same pre-filled message as the buttons (*"¡Hola Profondo! Vi su página y quiero info de un perfume 🌊"*).
Anything placed bottom-right must keep clear of it .

---

## 4. Scroll engine (shared)

- Native scrolling; **layout never moves**. Everything animated reads `smoothY`, a damped copy of `scrollY` (`smoothY += (scrollY − smoothY) × 0.12`), so motion glides to a stop instead of snapping with the wheel. This is what makes it feel "produced".
- `progressOf(el)`: 0 when the section's top reaches the viewport top, 1 when its bottom reaches the viewport bottom. Used by all pinned sections.
- `viewProgress(el)`: 0 as an element enters at the bottom, 1 when it has left through the top. Used by free-flowing parallax.
- Headlines marked `data-split` are split into masked words that rise in when they enter the view.

---

## 5. Project structure & how to edit

```
profondo-static/
├─ index.html        all markup (Tailwind utility classes)
├─ style.css         compiled Tailwind + custom CSS (generated — don't hand-edit)
├─ main.js           scroll engine + every section's animation (plain JS, no build)
├─ images/ videos/ catalog/   assets
├─ _css/             source for style.css (input.css + tailwind.config.js)
└─ notes/PROFONDO.md this file
```

- **No build step to run the site.** Open `index.html` directly, or upload the folder to any static host.
- **Only when you add a new Tailwind class** to the HTML/JS, recompile the CSS from inside `_css/`:
  `npx tailwindcss@3.4.19 -c tailwind.config.js -i input.css -o ../style.css --minify`
- Fonts load from Google Fonts (needs internet; falls back to Georgia).
- Deploy: GitHub `VelezP1/profondo`. The live site (`https://velezp1.github.io/profondo/`) is served from the **`gh-pages`** branch; `main` holds the source.

---

## 6. History of decisions (why things are the way they are)

- **Vite + Tailwind removed.** The project started from a React/Vite template; React was already gone, so the build tooling only existed to compile Tailwind. Converted to plain files so it opens by double-click and deploys anywhere.
- **Sequence v1 → v4.** v1: bottle + name on black (too empty). v2: ghost outlined words, rings, nine small notes (cluttered; ghost words overlapped mid-transition). v3: scent "pyramid" callouts with dots and hairlines at three heights (still reads as effects). v4 (current): clean poster — flat colour room, huge bottle, huge name, one scent line.
- **Catalog v1 → v2.** v1: heading + tabs + boxed page viewer with arrow buttons (generic). v2: pinned coverflow driven by scroll, like Worlds.
- **Decants v1 → v2.** v1: small square photo beside text. v2: full-bleed, window-opening.
- **Hero cover.** v1: small gold word + logo on black (flat). v2: frame, gold dust, glow, four corner phrases (decoration, rejected as "shitty effects"). v3 (current): one huge gold word + one line. Lesson: impact comes from scale and restraint, not from added effects.

## 7. Open items / ideas
- Verify scent notes with the real product data.
- Decants: reposition the headline so it clears the vial labels.
- Optional: self-host Cormorant Garamond so the site works offline.
- Push `gh-pages` (or switch Pages to serve `main`) so the live site matches.

## 8. Performance (keep it smooth)

Rules the code follows — keep them when editing:

- **Animate only `transform` and `opacity`.** Those run on the GPU compositor. Never animate `filter`, `clip-path`, `box-shadow`, `backdrop-filter` or `background-position` on large elements.
  - Hero curtain = two black panels sliding with `translate3d` (not an animated `clip-path` on the video).
  - Worlds photos dim with an overlay's opacity (not `filter: brightness`).
  - Catalog pages dim with opacity (the background is near-black); no big shadows.
  - Bottles use `filter: brightness()` only *while* dimmed and `none` once fully lit.
  - Gold letters on the cover are static (an infinite `background-clip: text` animation repaints huge text every frame).
- **No layout reads per frame.** Section positions are measured once (load, resize, fonts) into a cache; scroll code does arithmetic only. Reading `getBoundingClientRect()` between style writes forces a reflow each time.
- **Only update what is near the viewport.** `updateAll()` skips sections that are more than ~1.5 screens away.
- **Video:** 1280×720, 24 fps, H.264 CRF 31, no audio, `faststart` → 4.1 MB (was 11.2 MB, 1080p). It pauses when the hero leaves the screen. Poster image shows while loading.
- **Catalogue pages** resized to 820 px wide (≈ 2.1 MB for 36 pages, was 3.3 MB, and ~60 % less GPU texture memory). Only pages within ±3 of the current one are loaded.
- **Fonts** load without blocking the first paint (`media=print` swap); `font-display: swap`.
- `will-change` is set only on the few layers that move every frame (see "Perf hints" in `_css/input.css`) — too many promoted layers costs memory.

Measured with a Chrome trace while scrolling the whole page (software-rendered headless Chrome, so use it for relative comparison only): paint 418 → 59 ms, raster 127 → 22 ms, total GPU task time 1999 → 249 ms versus the previous commit. Transfer: ~14.5 MB → ~6.3 MB of media.
