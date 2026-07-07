# Handoff: `.des` Case-Study Windows (abir_os portfolio)

## Overview
This bundle contains four **case-study "windows"** from a retro-OS personal portfolio ("abir_os"). Each `.des` file presents one project inside a shared skeuomorphic desktop-window chrome (title bar, menu bar, status bar) with a bespoke, animated "hero" body: a cascade of app screenshots/cards, a role/metadata card, and a design-language card.

The four case studies:
- **SavRe.des** — food-waste tracking app (Princeton Hacks F25)
- **Leastudo.des** — moving-out/moving-in marketplace
- **Recall.des** — face-recognition companion for dementia patients
- **Sol.des** — UMD course scheduler (with a live WebGL shader background)

## About the Design Files
The files in this bundle are **design references created in HTML** — self-contained prototypes showing the intended look, layout, and motion. **They are not production code to ship directly.** The task is to **recreate these designs inside the target codebase's existing environment** (React, Vue, Svelte, etc.), using its established component patterns, tokens, and animation utilities. If there is no existing environment yet, pick the framework that best fits the project and implement there.

Each HTML file is a "window exploration" canvas that may show **multiple variants** of the same window laid out side-by-side (this is `design_doc_mode="canvas"`). The **final, chosen variant** for each is the one wired into the live site — see "Chosen variants" below.

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, radii, shadows, and motion are final. Recreate pixel-for-pixel using the codebase's existing libraries. All exact values are documented under Design Tokens.

---

## Shared window chrome (applies to all four)
Every case study lives in the same retro-OS window shell. Rebuild this once as a reusable `<Window>` component.

- **Outer window** (`.win`): background `#c8c4b8`; border `2px solid #1a1a1a`; bevel via `box-shadow: inset 2px 2px 0 #ebe7db, inset -2px -2px 0 #7a7668, 6px 6px 0 rgba(0,0,0,.45)`; flex column; font `'Trebuchet MS', Verdana, sans-serif`.
- **Title bar** (`.win-title`): height `26px`; gradient `linear-gradient(180deg, #ff8c3a 0%, #c4590e 100%)`; white text; font `'JetBrains Mono'`, `11px`, weight `700`, `letter-spacing:.04em`, `text-transform:uppercase`; `cursor:move`; bottom border `2px solid #1a1a1a`. Right-aligned buttons `_ ▢ ✕` (`.wbtn`, 18×16, same bevel as window).
- **Menu bar** (`.win-menu`): height `20px`, `#c8c4b8`, items `File Edit View Help` (first letter underlined), mono `11px`.
- **Body** (`.win-body`): `margin:4px`, `border:2px inset #9a9688`, `position:relative`, `overflow:auto`. Each case study overrides the body **background** (see per-project tokens) and sets `padding:0`.
- **Status bar** (`.win-status`): height `18px`, `#c8c4b8`, top border `1px solid #7a7668`, mono `10px`, space-between; left text `ready`, right text `<Project>.des`.

**Fonts:** `Inter` (sans, weights 400–900), `JetBrains Mono` (mono), `Roboto` (used inside app screenshots only). Sol additionally uses `Fraunces` (serif, italic) and `Clash Display` (display, self-hosted `assets/ClashDisplay-Variable.woff2`, weight range 200–700).

### Shared content atoms (same class vocabulary in every file)
- `.ls-headline.red` / `.ls-headline.ink` — `Inter` weight 800, `letter-spacing:-.02em`, `line-height:1.05`; `.red` uses the project accent, `.ink` uses `#2A211E`.
- `.ls-sub` — Inter 12px, `line-height:1.4`; bold spans in accent color.
- `.ls-card` — the metadata/notes card: `font-family:'Trebuchet MS'`, `11px`, `line-height:1.5`, color `#1a1a1a`; background `#efece0`; border `2px solid #1a1a1a`; padding `10px 12px`; hard shadow `4px 4px 0 rgba(0,0,0,.35)`. On hover `translate:0 -3px` (transition `.35s cubic-bezier(.34,1.6,.64,1)`).
  - `.meta` grid: `grid-template-columns:auto 1fr; gap:2px 8px`. `.k` = uppercase label, `9px`, `letter-spacing:.06em`, `#5a5a5a`.
  - `.tag` — mono 9px uppercase chip, white bg, `1px solid #1a1a1a`, `2px 2px 0` shadow; hover `scale:1.14`.
  - `.link` — mono 10px, color `#0055aa`, underlined; hover `scale:1.12`.
- `.ls-wordmark` — Inter weight 900, 44px, centered, project accent color.

### Shared motion
- **Entrance** (`.ls-enter`): `@keyframes lsEnter { from{ opacity:0; translate:0 46px; scale:.92 } to{ opacity:1; translate:0 0; scale:1 } }` — `animation: lsEnter .62s cubic-bezier(.34,1.56,.64,1) both`. Each hero element sets its own `animation-delay` (staggered ~0 → .5s) for a cascade-in.
- **Window open** (Recall/SavRe use `.win-slidein`): `@keyframes winSlideIn { from{ opacity:0; transform:translateY(56px) scale(.95) } to{ opacity:1; transform:translateY(0) scale(1) } }` — `.5s cubic-bezier(.22,.9,.3,1) both`.
- **Bubbly float** (SavRe, Sol): a gentle continuous bob applied to an *inner* wrapper so it composes with the entrance on the outer element:
  ```css
  @keyframes srFloat { 0%{translate:0 0} 50%{translate:0 var(--amp,-9px)} 100%{translate:0 0} }
  .sr-float { transform-origin:center; }
  @media (prefers-reduced-motion: no-preference){
    .sr-float{ animation: srFloat var(--dur,8s) ease-in-out infinite; animation-delay:var(--delay,0s); }
  }
  ```
  Sol's equivalent is `.sol-float` / `@keyframes solFloat` (adds a small rotate). Per-element `--amp`, `--dur`, `--delay` vary for organic drift. **Always gate the float behind `prefers-reduced-motion: no-preference`.**

---

## Screens / Views

### 1. SavRe.des — "Signal Stack" (chosen variant: **variant 4**)
- **Purpose:** Portfolio case-study card for a food-waste tracking app.
- **Layout:** Fixed hero canvas `684 × 640` (scaled to fit the window body). Left column of stacked cards; right side a diagonal cascade of three real app screenshots.
- **Body background:** layered radial gradients over cream — 
  ```
  radial-gradient(440px 400px at 2% -10%, rgba(53,74,51,.6) 0%, rgba(53,74,51,.6) 22%, transparent 56%),
  radial-gradient(380px 340px at 100% 106%, rgba(203,223,201,.9) 0%, rgba(203,223,201,.9) 20%, transparent 54%),
  radial-gradient(280px 260px at 85% 6%, rgba(111,163,106,.4) 0%, transparent 58%),
  radial-gradient(320px 280px at -8% 96%, rgba(230,242,228,.85) 0%, transparent 54%),
  radial-gradient(260px 240px at 55% 45%, rgba(53,74,51,.14) 0%, transparent 60%),
  #FAF6ED
  ```
- **Components:**
  - **Headline block** — top:26 left:26 w:236; `.sr-float`(--amp:-7px,--dur:8.4s,--delay:.2s). "Three Screens," (`.ls-headline.red`, 25px, color `#354A33`) / "One Pantry System" (`.ls-headline.ink`, 20px) / sub "Submission for Princeton Hacks F25!" (bold, color `#2E402C`).
  - **Role card** (`.ls-card`) — top:150 left:20 w:236, `rotate(-1deg)`; float(--amp:-9,--dur:9.2s,--delay:.4s). role: Full-Stack Developer · year: 2026— · stack: Next.js · FastAPI · Gemini AI. tags: food-waste / ocr / ai. link: github.com/RibaDiba/SaveRe →
  - **Design-language card** (`.ls-card`, flex row) — top:360 left:25 w:236, `rotate(1deg)`; float(--amp:-8,--dur:10s,--delay:.6s). Three 15px swatches `#354A33`, `#95C590`, `#FAF6ED`; body: "Forest green on mint-into-cream, pill buttons, color-coded urgency — a pantry that reads calm, not alarming."
  - **Screenshot cascade** — left:238 top:6; float(--amp:-13,--dur:9.6s,--delay:.5s). `img` `assets/savre-signal-stack-real.png` at width 440 (native 814×1118 → ~604 tall), `border-radius:18px`, hover `scale:1.05; translate:0 -6px`. This single PNG already composites the Profile / Calendar / Home phones in a diagonal fan.
- **Accent:** `--sr-deep:#354A33`.

### 2. Leastudo.des (chosen variant on live site: centered wordmark + pill buttons + fanned photo cards)
- **Purpose:** Case study for a moving-out/moving-in housing marketplace.
- **Hero canvas:** `684 × 660`.
- **Body background:** same 5-radial recipe but maroon/cream — top-left `rgba(122,27,27,.52)`, other stops use maroon/cream tones over `#FAF6ED` (see `.win.win-des .win-body` in the file). Accent maroon `--ls-maroon:#7A1B1B`, ink `#2A211E`.
- **Components:** centered `.ls-wordmark` "Leastudo"; two pill buttons `.ls-btn` ("List Your Place" primary / "Find Your Lease" secondary) with small `.ico` glyphs; a right-aligned headline ("Moving Out? / Someone's Moving In"); a role `.ls-card`; four photo cards `.ls-photo` (`assets/leastudo-card-{day1,day2,hub,tempo}.png`) fanned with rotations `-13°…13°` and staggered `.ls-enter` delays; a wide design-language `.ls-card`.
- `.ls-photo` = rounded photo with drop shadow; hover lifts.

### 3. Recall.des (chosen variant: **v2 hero** — centered wordmark, two action buttons, full-bleed hero image)
- **Purpose:** Case study for a face-recognition companion app for dementia patients.
- **Hero canvas:** `684 × 540`.
- **Body background:** green/cream 5-radial recipe over `#FAF6ED`. Accent `--rc-green:#21622D`, `--rc-deep:#163F1C`, `--rc-cream:#FAF6ED`, `--rc-forest:#435D47`.
- **Components:** centered `.ls-wordmark` "Recall" (green); two `.rc-app-btn` buttons — "Use Camera" (inline camera SVG) and "Call for Help" (inline phone SVG), each a cream pill with a `28px` green circular badge holding a white 14px icon, `1.5px solid #ddd6c8`, radius `14px`, hover `scale:1.06; translate:0 -3px`. Full-width hero image `assets/recall-v2-hero-full.png` (width 668). Role `.ls-card` and design-language `.ls-card`. (The exploration file also contains earlier variants using `assets/recall-phone-{1..4}.png` and `assets/recall-hero-full.png`.)

### 4. Sol.des (chosen variant on live site: filmstrip step-cards + floating course-card fan over a live shader)
- **Purpose:** Case study for a UMD course scheduler ("Schedule of Classes, Simplified").
- **Hero canvas:** `684 × 660`.
- **Body:** solid `--sol-cream:#fff5e8` with a **live WebGL shader** canvas (`.sol-shader-bg`, mounted by `assets/sol-shader.js` → `window.mountSolShader(canvas)`) filling the body behind content. `overflow:hidden`.
- **Components:** four `.sol-panel` step cards (brown/teal) fanned across the top with `.ls-enter`, each containing a `.sol-stepper` progress control (mounted by `assets/sol-components.js` → `window.mountSolComponents(root)`); a row of `.sol-course-card.sol-float` course cards (data via `data-course/-professor/-rating` attrs) that bob continuously; a role `.ls-card` and a design-language `.ls-card`, each wrapped in `.sol-float`. Typography uses `Clash Display` (headings, `.sol-word`) and `Fraunces` italic (`.sol-sub`, panel text). Accents: `--sol-gold:#ffefa9`, `--sol-coral:#f1948c`, `--sol-espresso:#3d1f1f`, `--sol-teal:#3f6966`, `--sol-cocoa:#6b4226`.
- **Note:** `sol-showcase.css` holds all Sol-specific styles; `assets/sol-shader.js` and `assets/sol-components.js` are plain JS that must run after the DOM exists. Reimplement the shader as a WebGL/`<canvas>` component (or a static gradient fallback if WebGL is out of scope).

---

## Interactions & Behavior
- **Window chrome:** title bar is draggable; `_ ▢ ✕` minimize/maximize/close. In the live portfolio these are real window-manager behaviors — in a static case-study page they can be decorative.
- **Entrance cascade:** on mount, hero elements animate in via `.ls-enter` with staggered `animation-delay` (~0 → .5s). Recall & SavRe windows additionally play `.win-slidein` on open.
- **Continuous float:** SavRe (`.sr-float`) and Sol (`.sol-float`) elements bob forever via infinite keyframes — **only under `prefers-reduced-motion: no-preference`**.
- **Hover states:** cards lift (`translate:0 -3px`), tags/links scale up, screenshots scale `1.05` + lift `6px`, pill buttons scale `1.06` + lift.
- **Reduced motion / print:** the visible end-state is the base style; only the *from*-hidden entrance and the infinite float are gated. Ensure content is fully visible with motion disabled.

## State Management
These are presentational case-study views — **no app state**. The only dynamic pieces:
- Sol shader animation loop (rAF inside `sol-shader.js`).
- Sol steppers/course cards read static `data-*` attributes at mount (`mountSolComponents`).
- Window open/focus/drag state belongs to the host window manager (out of scope for a single case-study embed).

## Design Tokens

**Window chrome**
- Chrome fill `#c8c4b8`; bevel light `#ebe7db`, bevel dark `#7a7668`; outline `#1a1a1a`.
- Title gradient `#ff8c3a → #c4590e`; title text `#ffffff`.
- Body inset border `#9a9688`; default body fill `#efece0`.
- Hard shadow `6px 6px 0 rgba(0,0,0,.45)` (window), `4px 4px 0 rgba(0,0,0,.35)` (cards).

**Accents**
- SavRe `#354A33` (deep) · `#95C590` (grad) · `#FAF6ED` (cream) · headline sub `#2E402C`.
- Leastudo `#7A1B1B` (maroon) · ink `#2A211E`.
- Recall `#21622D` (green) · `#163F1C` (deep) · `#FAF6ED` (cream) · `#435D47` (forest).
- Sol `#fff5e8` (cream) · `#ffefa9` (gold) · `#f1948c` (coral) · `#3d1f1f` (espresso) · `#3f6966` (teal) · `#6b4226` (cocoa).
- Shared ink `#1a1a1a`/`#2A211E`; muted label `#5a5a5a`; link `#0055aa`.

**Typography** — Inter (400–900), JetBrains Mono (400/500/700), Roboto (in-screenshot only), Fraunces (Sol, italic), Clash Display (Sol display).

**Radii** — cards square (2px border, no radius); screenshots/photos `18px`; Recall pills `14px`; SavRe app pills `999px`.

**Easing** — entrance `cubic-bezier(.34,1.56,.64,1)`; hover spring `cubic-bezier(.34,1.6,.64,1)` / `cubic-bezier(.34,1.8,.64,1)`; window open `cubic-bezier(.22,.9,.3,1)`; float `ease-in-out`.

## Assets
All in `designs/assets/` (paths are relative to each HTML file):
- `savre-signal-stack-real.png` — SavRe three-phone composite (814×1118, transparent).
- `leastudo-card-{day1,day2,hub,tempo}.png` — Leastudo photo cards.
- `recall-v2-hero-full.png` (chosen), `recall-hero-full.png`, `recall-phone-{1,2,3,4}.png` — Recall hero/phones.
- `sol-shader.js`, `sol-components.js`, `sol-icon.png` — Sol shader + component mounters.
- `ClashDisplay-Variable.woff2` — Sol display font (self-hosted).
- Inter / JetBrains Mono / Roboto / Fraunces load from Google Fonts (see each file's `<head>`).

Icons in Recall are **inline SVG** (camera, phone) — no external files.

## Files
- `designs/SavRe.des.html` — SavRe explorations (chosen = variant 4, "Signal Stack").
- `designs/Leastudo.des.html` — Leastudo explorations.
- `designs/Recall.des.html` — Recall explorations (chosen = v2 hero).
- `designs/Sol.des.html` — Sol showcase (needs `sol-showcase.css` + the two Sol JS files).
- `designs/sol-showcase.css` — Sol-specific styles + `@font-face` for Clash Display.
- `designs/assets/…` — images, fonts, and Sol JS listed above.

**In the live portfolio**, these windows are generated by `desktop.js` (functions `openSavreWin` / `openLeastudoWin` / `openRecallWin` / `openSolWin`) and their CSS lives in `Personal Website.html`. Those two files are the authoritative "as-shipped" source if you want the exact chosen-variant markup rather than the multi-variant exploration canvases — request them if needed.
