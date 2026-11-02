# robertcking.com — visual refresh & expansion plan

Status: **DRAFT, 2026-11-01, revised after plan review.** **What** to build lives here.
**Where files go and when work happens** lives in [`IMPLEMENTATION.md`](./IMPLEMENTATION.md),
which wins wherever the two disagree. Items marked
**[OPEN]** need a decision from Rob before the work package that depends on
them starts. Items marked *(proposed)* are recommendations that stand unless
overridden.

Agents start from `IMPLEMENTATION.md`, which says which phase is next and which parts of
this file it needs. This file describes the design and the content model, not file
locations or schedule.

---

## 0. Where things stand

- `main` (live): Astro 7 scaffold, GitHub Actions → Pages deploy, splash page
  in the legacy black/white style. Custom domain via `public/CNAME`, no `base`
  path (see comment in `astro.config.mjs` — do not change).
- `experimental` (`db8b982`, now also on `origin/redesign`): "Phase 2" — `projects` content
  collection (`src/content.config.ts`), project grid + `/project/[slug]` pages,
  4 of 10 legacy projects migrated, two-column homepage restored. Still in the
  legacy visual style. No Vue islands used (vanilla JS/CSS only).
- Remaining legacy projects (aihack19, impvis, procterrain, sciart, snooker,
  timetable) live on `origin/page-src` under `content/projects/`.

This refresh **supersedes the visual layer** of the original Nuxt→Astro
roadmap but **keeps its architecture** (static Astro, content collections,
islands only where needed). Unlike the original roadmap, the redesign is built on a
local branch, and the live site changes only at switchover (IMPLEMENTATION.md §1).

---

## 1. Goals

1. A bright, colourful identity built from flat "block/toon" colour.
2. A persistent **left bar**: short bio and the site's navigation. Main
   content sits in the centre and right of the screen.
3. **Writing** (blog), with interactive UI elements inside posts.
4. **Research**: a publications list, each optionally linked to a companion
   post.
5. **Projects**: current projects, plus old ones only after Rob reviews them.
6. **Photography** portfolio.
7. Good Unicode coverage in the type, Greek at minimum, so prose can say
   "β ≈ 0.3" without a fallback-font seam.

Non-goals for now: comments, analytics, search, i18n, CMS.

---

## 2. Reading the drafts

Drafts are in `docs/redesign/refs/`. They are **samples, not specs**. The
generated text is gibberish, so they tell us nothing about typography beyond
"slab/serif headings plus a sturdy sans for UI".

| Draft | Keep | Drop / change |
|---|---|---|
| `draft-1-components.png` | Palette (below); chunky rounded buttons; pill filter chips ("All / Papers / Code·Demos"); coloured slider tracks; pill toggles; serif essay heading | Soft grey drop shadows, which go hard-offset to read as "toon" (§5.3); white text on light fills (fails contrast, §5.1) |
| `draft-2-post-no-sidebar.png` | Solid colour **header band** on a post; pull-quote; "widget panel" (dashed frame with controls + Start/Reset) | No left bar, which conflicts with goal 2; "Related posts" as a permanent right rail |
| `draft-3-post-with-sidebar.png` | **Closest to the target.** Tinted left bar with avatar, name, one-line role, colour-coded nav icons (Home / Research / Essays / Code·Demos / CV), social icons; cream article column | The third column for related posts. The right side should belong to the content (sidenotes, wide figures), with related posts moved to the end of the post (§4) |

### Palette sampled from draft 1 (pixel-averaged)

| Role in draft | Hex | White text | Ink `#1d232f` text | On cream bg |
|---|---|---|---|---|
| cream background | `#f7f3e5` | — | 14.2 | — |
| teal | `#2ea6b1` | **2.9 ✗** | 5.4 ✓ | 2.6 (fill only) |
| navy | `#2c4d6e` | 8.8 ✓ | 1.8 ✗ | 7.9 ✓ (usable as text) |
| coral | `#de4d45` | 4.0 (large only) | 3.9 (large only) | 3.6 |
| green | `#7bba3d` | **2.4 ✗** | 6.7 ✓ | 2.1 (fill only) |
| yellow | `#f4bc38` | **1.7 ✗** | 9.1 ✓ | 1.6 (fill only) |
| pale blue → **sky** | `#c1d9e9` → **`#8fd3f7`** | 1.6 ✗ | 9.6 ✓ | 1.5 (tint only) |
| slider blue | `#3375a9` | 4.9 ✓ | 3.2 | 4.4 |

Mood board of these 8 colours (4×2, with passing text colour per card):
https://claude.ai/artifact/99Se2iJB3nYDFhnyjL3xuN (private to Rob). The
proposed section roles in §3 come from this board.

Rob's feedback on board v1 (2026-11-01): make the sky bluer (draft colour was
too grey), so it is now `#8fd3f7`. Rob also asked for auxiliary purples and
oranges (§5.1a).

WCAG 2.x AA: 4.5:1 for body text, 3:1 for large/bold text and UI component
boundaries. Takeaways in §5.1.

---

## 3. Information architecture *(proposed)*

| Section | URL | Contents | Section colour (decided 2026-11-01, may be revisited) |
|---|---|---|---|
| Home | `/` | Short intro and a mixed feed: latest posts, featured projects, recent papers | ink/neutral |
| Writing | `/writing/`, `/writing/[slug]/` | Blog posts (`.md`; `.mdx` when interactive) | coral |
| Research | `/research/` | Publications list, filter chips (paper / talk / preprint), link to companion post | navy |
| Projects | `/projects/`, `/projects/[slug]/` | Current and legacy projects; "Archive" view for the GitHub repo list (old Phase 4) | teal |
| Photography | `/photos/`, `/photos/[album]/` | Albums → grid → lightbox | yellow |
| About / CV | `/about/` | Longer bio, CV PDF link, contact | green |

- **Section colour coding** comes from draft 3's coloured nav icons. Each
  section owns one hue, used for its nav icon, its page header band
  (draft 2), its chips and its card accents. This turns the palette into a
  wayfinding system as well as decoration.
- **URL change:** `/project/[slug]` (Phase 2) becomes `/projects/[slug]/`.
  The old Nuxt site served 10 project slugs (aihack19, impvis, ising, masters,
  perlin, predatorprey, procterrain, sciart, snooker, timetable), and the CV may
  link to them. Use an **explicit redirect map** for all 10: to
  `/projects/<slug>/` if the project is kept, otherwise to `/projects/`. A
  dynamic `[slug]` redirect generates nothing for draft or dropped projects
  (verified on Astro 7.0.7).
- **Existing public files keep their URLs.** Files under `public/` that already
  have a URL (e.g. `/masters/MSci_Report.pdf`, `/ising/IROP_Report.pdf`) are
  never moved or deleted without Rob's OK.
- **URL policy** *(decided 2026-11-01)*: `trailingSlash: 'always'`. One folder
  per post (`posts/<slug>/index.mdx`, with its assets beside it); the folder name is
  the permanent slug and is never renamed. No dates in URLs. The same rule applies
  to publication files and photo albums. The RSS feed is at `/rss.xml`, summaries
  only, and each item's GUID is its canonical URL.
- Nav entries for sections that don't exist yet stay **hidden** until their
  phase ships, so the site never has dead links.
- **Shared URL space with Rob's other sites.** Rob's other GitHub Pages repos are served
  from this same domain at `/<RepoName>/` (EFMLWorkshopWebsite, GW-SciArt, mythosdemo,
  PerlinNoise, …). So the site's top-level section names (`writing`, `research`,
  `projects`, `photos`, `about`, `styleguide`, plus `rss.xml`) are **reserved**: no
  Pages repo may use one, and no new section may take an existing repo's name. The
  design package's repo, if it ever moves out, must not turn Pages on under a clashing name.

---

## 4. Layout system *(proposed)*

```
≥ 1200px
┌───────────┬──────────────────────────────────────────────┐
│ LEFT BAR  │  MAIN                                        │
│ (sticky)  │  ┌──────── header band (section colour) ────┐│
│ avatar    │  │ title / meta                             ││
│ name      │  └──────────────────────────────────────────┘│
│ 1-line bio│  ┌───── text column ≤ 68ch ─────┐ ┌ margin ┐ │
│ nav ●     │  │ prose …                      │ │sidenote│ │
│ nav ●     │  │ ┌── .wide figure / widget ────┴─┴──────┐ │ │
│ socials   │  │ └──────────────────────────────────────┘ │ │
│           │  └──────────────────────────────┘ └────────┘ │
└───────────┴──────────────────────────────────────────────┘
```

- **Left bar**: ~280px, sticky, tinted (draft 3). Holds avatar, name, a
  one-line role, nav and socials. The full bio moves to `/about/`, and the
  left bar keeps one or two lines.
- **Main**: a CSS grid with named lines (the "breakout grid" pattern):
  `full | wide | text | wide | full`. Prose sits in `text` (≤ 68ch).
  Sidenotes and captions go in the right margin. Widgets and figures can
  opt into `.wide` (text + margin) or `.full`. This is what "content in the
  centre *and rightward side*" means in practice.
- **Index pages** (Writing, Projects, Photos) use the whole main area for
  card grids. Grids use `auto-fill/minmax`, not the legacy fixed pixel
  breakpoints.
- **Projects index layout is open** *(Rob, 2026-11-01)*. Rob doesn't want the legacy project
  grid (Phase 2's `ProjectGrid`) carried over. P2 shows two mock-ups, a card grid and a
  stacked list of cards, and Rob picks at Gate 2. The Phase 2 grid code is not a starting point.
- **Narrower than ~1200px**: the margin column folds in, so sidenotes become
  inline expandable notes and `.wide` equals `text`.
- **Narrower than ~800px**: the left bar becomes a top bar (avatar, name,
  menu button opening the nav as a disclosure panel). This replaces the
  legacy "mini-left-bar" toggle.
- Related posts, prev/next and the "companion paper" box go **at the end of
  the post**, not in a permanent rail.

---

## 5. Design system

All of this lives as CSS custom properties in the design package's tokens file (§5.6), using
**semantic names** (`--surface`, `--ink`, `--accent-writing` …) rather than
raw hues, so dark mode is a token swap.

### 5.1 Colour rules *(proposed, from the contrast table in §2)*

1. **Text on bright fills is ink, not white.** Teal, green and yellow
   buttons and chips carry `--ink` labels, which is also the "toon" look
   (dark outline and dark lettering). Only navy, and a deepened red,
   carry white text.
2. **Coral is deepened by about 10–15% lightness** for any fill that
   carries text, so it passes 4.5:1 with white. *Decided at Gate 1a:* `--coral-deep` is
   `#c8322a` (4.79:1 as text on cream, 5.32:1 under white); PLAN's first candidate `#da382f`
   only reached 4.12:1 as text. Coral fills with small text use `--coral-solid` (coral-deep in
   light mode, vivid coral with ink labels in dark). The bright coral stays for large display
   blocks and header bands with no small text.
3. **Bright hues are never used for small text on cream.** Each hue gets
   a `-deep` variant for text and links, and a `-tint` variant for panel
   backgrounds (like the pale-blue/teal sidebar tints in draft 3). *Decided at Gate 1a:* Rob
   kept the proposed value of every `-deep` and `-tint` over both alternates; the values are in
   the tokens file. Sky, lilac and apricot stay vivid in both themes, and their panel
   versions that flip in dark mode are `--sky-tint`, `--lilac-tint` and `--apricot-tint`.
4. Every token pair can be checked with a small local script
   (`npm run contrast`), so palette tweaks don't silently fail contrast.
5. Charts in posts use the same hues in a fixed order, checked for
   colour-blind separability (use the `dataviz` skill's validator). *Checked at Gate 1a:* the
   order **teal, yellow, navy, green, sky, coral, grape, tangerine** keeps every adjacent pair
   apart for protan/deutan viewers in both themes (worst ΔE 19.2; the old order put green next
   to yellow, ΔE 2.6 in dark). In light mode yellow, sky, teal, green and tangerine marks are
   under 3:1 on cream, so chart marks need the ink outline or direct labels.

### 5.1a Auxiliary colours *(approved direction 2026-11-01)*

These are for specific jobs only. They are **never section colours**, and
are not used as general decoration.

| Name | Hex | Text on it | Use |
|---|---|---|---|
| Grape | `#7b4fc9` | white 5.5:1; also usable *as* text on cream (5.0:1) | "Interactive" badge on posts with demos, accents inside widgets, code/maths highlights |
| Lilac | `#d4c4f5` | ink 9.8:1 | Widget frame and code-block backgrounds |
| Tangerine | `#f58a2a` | ink 6.4:1 | Warnings, "work in progress" / draft status |
| Apricot | `#ffd2a6` | ink 11.3:1 | `<mark>` highlights, callout backgrounds |

These four also extend the chart series order after the core hues. Check
them for colour-blind separability at Gate 1a.

### 5.1b Dark mode *(DECIDED 2026-11-01: ships with the new look)*

Dark mode is built into the tokens in P1 and goes live with the new shell at
switchover. It follows `prefers-color-scheme` by default, with a three-way Light /
Dark / System toggle in the left bar. The choice is remembered per browser.
To avoid a flash of the wrong theme, set the theme with a tiny inline script
in `<head>` before first paint.

Rules (shown on the mood board, theme switch at the top):
- The page goes to a deep night blue (not black). **Fills stay vivid, and
  labels on fills stay ink.** Outlines and hard shadows become near-black,
  so toon edges still read as depth. *Gate 1b (provisional default):* a near-black shadow is
  hard to see on the night-blue page, so every hard shadow sits on a copy widened by the outline
  width in `--shadow-edge` (cream in dark mode, transparent in light), the "outlined slab"
  (option B). Rob is still weighing it against option D, own-colour extrusion, which the
  styleguide keeps as `.rk-shadow-d` for comparison.
- **Tints flip to deep versions** with cream text (sky, lilac, apricot are
  panel backgrounds and would glare in dark mode).
- Hue-text variants (`--navy-deep` etc.) get lighter values for dark mode.
- **Mechanism (decided at Gate 1a):** each colour token is `light-dark(<light>, <dark>)` and
  follows `color-scheme`. `:root` is `light dark` (follows the system), and `data-theme` on
  `<html>` forces one. Any container can show the other theme by setting `color-scheme` on
  it, which is how `/styleguide/` shows both side by side. Tokens stay unregistered (no
  `@property`), or that breaks. Browsers without `light-dark()` (before mid-2024) get a
  light-only fallback block, which the contrast script checks against the light values.
- **Page palettes (Gate 1b):** `data-palette="slate"` (cool grey) or `"greige"` (warm grey) on
  `<html>` or any container swaps the cream page for a grey one, alongside `data-theme`; cream
  is the default (*DECIDED 2026-11-02: the site ships cream*; slate and greige stay available
  as opt-ins) and `data-palette="cream"` switches back inside another palette. A palette
  redeclares only `--surface` and `--raised` (as `light-dark()` pairs), plus `--div-mid`, the one
  `:root` token mixed from the page colour (custom properties resolve their `var()`s where they
  are declared, so it must be redeclared on every palette container). The values come from the
  code slates (sRGB mixes): the light page is 60% slate (or greige) and 40% white, raised 25%
  slate; the dark page is 70% slate and 30% black, raised 90% slate. Code panels keep the cool slate under every
  palette: on the slate page they sit the same luminance step from it as on cream (1.08:1 light,
  1.22:1 dark, against 1.08 and 1.28 on cream), and on greige they also differ in hue.
  `.rk-slate-greige` still opts into greige code anywhere. Browsers without `light-dark()` get
  cream light everywhere: the fallback block also applies to `[data-palette]`. `npm run contrast`
  checks every pair under each palette in both themes. The styleguide has a palette switch next
  to the theme toggle (stored under `rk-palette`) and shows the three palettes side by side.

| Palette | surface (light / dark) | raised (light / dark) |
|---|---|---|
| cream | `#f7f3e5` / `#1a1f2b` | `#fffaf0` / `#232a39` |
| slate | `#f1f3f8` / `#1f232b` | `#f9fafc` / `#282d37` |
| greige | `#f2f1ee` / `#252420` | `#faf9f8` / `#302e29` |

| Token | Light | Dark | Text on it (dark) |
|---|---|---|---|
| bg / surface | `#f7f3e5` | `#1a1f2b` | cream `#f2eee2` 14.2:1 |
| raised | `#fffaf0` | `#232a39` | cream 12.4:1 |
| fg | `#1d232f` | `#f2eee2` | — |
| muted | `#5b6070` | `#a3a8b6` | 6.9:1 on bg |
| line (outline + shadow) | `#1d232f` | `#05070b` | — |
| navy | `#2c4d6e` | `#4a78ad` | white 4.6:1 |
| teal | `#2ea6b1` | `#3bb4bf` | ink 6.4:1 |
| coral | `#de4d45` | `#e8625a` | **ink** 4.7:1 (white in light mode) |
| yellow | `#f4bc38` | same | ink 9.1:1 |
| green | `#7bba3d` | `#86c44a` | ink 7.5:1 |
| sky (tint) | `#8fd3f7` | `#1e3a50` | cream 10.2:1 |
| grape | `#7b4fc9` | `#a584e6` | **ink** 5.3:1 (white in light mode) |
| lilac (tint) | `#d4c4f5` | `#342c55` | cream 11.1:1 |
| tangerine | `#f58a2a` | `#f5923a` | ink 6.8:1 |
| apricot (tint) | `#ffd2a6` | `#4a3324` | cream 10.1:1 |
| text: navy / grape / coral | — | `#8fb3e0` / `#b89cf0` / `#f08a83` | 7.6 / 7.1 / 6.8 on bg |

Known gap: in dark mode the near-black outline on a dark page is only
about 1.2–1.4:1. That's fine for filled components, where the fill provides
the 3:1 boundary. Outline-only components (e.g. a Reset button with no fill)
must use the `fg` colour for their border in dark mode. The contrast
script checks both themes.

### 5.2 Typography — research so far

Pulled from Google Fonts' own metadata (`fonts.google.com/metadata/fonts`,
fetched 2026-11-01):

| Family | Class | Greek? | Weights | Italics | Notes |
|---|---|---|---|---|---|
| **Xmind** | sans | ✓ (+Cyrillic) | 100–900 variable | ✓ | XMind's open-source "NeverMind" family; landed on Google Fonts **2026-10-20** (very new, so watch for v1 bugs) |
| **Roboto Slab** | slab | ✓ + greek-ext | 100–900 variable | **✗ none** | Great headings; faux italics only, so unsuitable for body text |
| Instrument Serif | serif | ✗ | 400 only | ✓ | Display only. **There's no "Instrument Slab"** on Google Fonts (only Instrument Sans/Serif, both Latin-only) |
| Literata | serif | ✓ + greek-ext | 200–900, opsz | ✓ | Built for long-form reading; strong body-text candidate |
| Source Serif 4 | serif | ✓ | 200–900, opsz | ✓ | Alternative serif body |
| Zilla Slab / Hepta Slab / Montagu Slab / Epunda Slab | slab | ✗ | — | varies | Ruled out by goal 7 |

Shortlisted pairings *(proposed; to be judged on a real specimen page)*:

- **A. Roboto Slab (headings) + Xmind (body and UI).** Both have Greek and
  are variable. Slab headings give character, and the sans body keeps
  widgets and prose in the same voice. *Current front-runner.*
- **B. Xmind only.** One family, simplest, fully consistent Greek. Has less
  personality in headings.
- **C. Roboto Slab (headings) + Literata (body) + Xmind (UI and widgets).**
  Most "essay" feeling (matches draft 1's serif essay text), but three
  families means more weight and more pairing risk.

Supporting decisions *(proposed)*:
- **Math** is rendered with KaTeX at build time. Astro 7 defaults to the Sätteri
  Markdown processor, which has no KaTeX renderer. So the site sets
  `markdown.processor` to `unified()` from `@astrojs/markdown-remark` with
  `remark-math` + `rehype-katex`, and MDX inherits it. Maths syntax in posts is
  `$…$` inline and `$$…$$` for display (a literal dollar sign in prose is `\$`). KaTeX
  uses its own math fonts, so the body font only needs Greek for *inline prose*. No runtime JS.
  `unified()` is a maintained, first-class processor option in Astro 7
  (`@astrojs/markdown-remark` 7.3.5); only the old top-level `markdown.remarkPlugins`
  keys are legacy. Site-wide TeX macros (e.g. `\R`, `\dd`) live in one shared macros
  file passed to KaTeX.
- **Equation references** *(decided 2026-11-01; Rob wants clickable references)*. Authoring is
  standard LaTeX: `\label{lorenz}` inside a display equation, and `\eqref{lorenz}` anywhere in
  inline or display maths. The result: labelled equations are numbered in order (1), (2), …;
  each gets an anchor `#eq-lorenz`; every reference renders as a link that jumps to it, and
  forward references work. An unknown or duplicate label **fails the build**.
  - Neither off-the-shelf option does this (spike, 2026-11-01): `rehype-mathjax` 7.1.0 with
    `tags: 'ams'` renders each reference as "(???)" linking to `#`, because each equation is
    typeset on its own; `rehype-katex` 7.0.1 produces no anchors or links.
  - So a small rehype plugin (about 50 lines in the spike) runs **before** KaTeX. It numbers
    labels, replaces `\label` with `\tag{n}`, inserts the anchor, and rewrites references:
    - a bare reference in prose (`$\eqref{k}$`, the whole of an inline maths span) becomes
      `<a class="rk-eqref" href="#eq-k"><span>(</span>n<span>)</span></a>`. The brackets stay
      in spans, so it reads "(n)" to screen readers and without CSS;
    - a reference that starts or carries a sentence (`$\Cref{k}$`, cleveref's spelling,
      *proposed*) becomes `<a class="rk-eqref" href="#eq-k"><svg class="rk-icon" aria-hidden="true">…</svg>Equation <span>(</span>n<span>)</span></a>`,
      with Phosphor's `function` icon before the word;
    - `\eqref{k}` inside larger maths becomes `\href{#eq-k}{(n)}`, KaTeX's own link, unstyled:
      KaTeX puts the next operator's spacing inside the link, so a pill there would be lopsided.

    KaTeX's `trust` option allows `\href` for `#` links only.
  - Decided at Gate 1b (Rob): equation numbers and bare references are lilac pills; a long pill
    (the `function` icon and "Equation n") for references that lead a sentence.
  - Implementation must also handle several `\label`s in one `align` block (one per row).
  - Scrolling uses CSS `scroll-behavior: smooth`, off under reduced motion. The target equation
    gets a brief `:target` highlight from the tokens.
- **Monospace** (code, widget readouts): **JetBrains Mono** (OFL), with its ligatures on
  (decided at Gate 1a).
- Fonts are **self-hosted** from woff2 files vendored once into the design
  package, with our own `@font-face` rules. Xmind is OFL (no Reserved Font Name, so subsetting
  is fine) and Roboto Slab is **Apache-2.0**. Both allow redistribution, and each licence file
  ships beside its fonts. Each
  file is subset by `unicode-range` (latin, greek), so the Greek file only
  downloads when a page uses Greek. A third small "symbols" subset per family carries the
  maths symbols it has (≈ ≠ ≤ ≥ ∞ ∂ ∑ ∫ √ …), so prose like "β ≈ 0.3" has no fallback
  seam. Xmind and Roboto Slab have no ← →, and none of the three has ∝, so those fall back.
  Woff2 files are never inlined into CSS, so each subset stays a separate download. Why vendored: Xmind isn't on Fontsource (npm 404,
  checked 2026-11-01), plain files also work on Rob's vanilla-JS sites, and pinning
  protects against changes to this very new font. The site may serve the same files
  through Astro 7's stable `fonts` config (`local` provider) for preload hints.
- A modular **type scale** with ratio **1.3** (Rob's pick at Gate 1a, after comparing 1.25
  and 1.28), body at 1rem, and `rem` units replace the legacy `pt` sizes. Small text (step −1) is
  the exception: fixed at 0.8rem, the 1.25 size, because 1 ÷ 1.3 (12.3px) was too small.

**DECIDED (2026-11-01): pairing A**, Roboto Slab headings with Xmind body
and UI. Rob approved it after seeing it on the mood board. The Gate 1a specimen
settles the type scale, the monospace face and the weights actually used.

### 5.3 The "toon" treatment *(proposed)*

- **Outline**: 2px `--ink` border on interactive things (buttons, chips,
  cards, widget frames, slider thumbs). Static content panels have no
  outline.
- **Shadow**: hard offset, `4px 4px 0 var(--ink)`, no blur. This is the
  single biggest "toon" signal and replaces the drafts' soft grey shadows.
  On press, the element moves `2px 2px` and the shadow shrinks to `2px 2px`.
- **Radius**: about 10px for buttons, cards and panels; full pill for chips,
  toggles and slider tracks.
- **Flat fills only**: no gradients. Illustrations follow the same rule.
- **Motion**: short (120–200ms), springy only on press and toggle. Everything
  respects `prefers-reduced-motion`.
- **"Pop" on hover and press** *(Rob, 2026-11-01: keep the mood board's feel throughout)*.
  Every clickable component in the package (button, chip, card, switch, slider thumb, nav
  item) shares one interaction, defined once from tokens rather than per component:
  - press sinks into the shadow: the move plus the pressed shadow equals the resting shadow,
    so the shadow's outer edge stays put (mood board: 3px move onto a 2px shadow from 5px);
  - hover lifts: a 1px rise with the shadow growing (mood board cards: 5px to 7px);
  - 120ms, plain `ease` as on the mood board. A springy overshoot is a Gate 1b option, not
    the default.
  - Under reduced motion, the shadow still changes but nothing moves.
- **Unfilled (outline-only) buttons are discouraged** *(Rob, 2026-11-01)*. Use a filled button
  wherever possible. Where an unfilled one is unavoidable, it sits flush (no resting shadow), and
  on press it gets an **inset** shadow and doesn't move, so it reads as pushed into the page.
  *Decided at Gate 1b (Rob):* every inset shadow is near-black `--line` in both themes, not the
  cream outline colour; a pressed unfilled button takes `--raised` behind it so the inset shows in
  dark mode.
- **Focus** *(decided at Gate 1a)*: the **highlighter**, a 6px **tangerine** band
  (`--focus`) hugging the ink outline (no offset), with the hard shadow turned off while
  focused. Never removed.
  - Its 3:1 edge is against the ink outline (6.41:1 light, 8.69:1 dark). Tangerine on cream
    alone is only about 2.2:1, so elements with no outline, such as text links, use a
    marker-pen version instead: a tangerine background behind the ink text.
  - `--focus` is overridable. Where tangerine surrounds the focused element (tangerine fills,
    apricot panels), set `--focus: var(--focus-alt)` (yellow). Components with such a fill
    variant do this themselves.

### 5.4 Component inventory

| Layer | Components |
|---|---|
| Primitives (CSS on native elements) | `button`, `input[type=range]`, checkbox, radio, checkbox styled as switch, `select`, text input, `textarea`, links. All built in P1 step 7 so they share one look; each shows rest, hover, pressed, focused, disabled and (for inputs) error states |
| Astro components | `Button`, `Chip`/`ChipGroup` (filter), `Card` (post / project / paper / album variants), `HeaderBand`, `Callout` (note / warning), `PullQuote`, `Sidenote`, `Figure`, `WidgetFrame` |
| Layouts | `BaseLayout` (left bar + main), `PostLayout` (header band, breakout grid, end matter), `IndexLayout` (card grid + chips) |

A `/styleguide/` page renders every token and component. It is where Rob
reviews design work.

**Options instead of one-offs** *(Rob, Gate 1b)*: where more than one treatment is good, the
package keeps them as opt-in classes rather than picking one. Text fields' hover cue is the
first: the background sinks by default, and `.rk-hover-ring`, `.rk-hover-underline` or
`.rk-hover-none` on a field or any ancestor swaps it. Options stay CSS classes (or attributes),
so the plain-HTML sites and any later framework wrapper (e.g. a Vue `hover` prop) share them.

**Dashed grouping panel** *(Rob, Gate 1b)*: the widget frame's dashed outline is liked as a
general way to group content, not only for widgets. Generalise it into a grouping panel (dashed
outline, flat) with a raised option (dashed outline plus the hard shadow), and build it with the
P2 card work so the widget frame becomes one use of it.

**Overflow** *(decided at Gate 1b, Rob)*: D by default (dots + toon scrollbar on hover/focus),
A always-visible bar as the alternative; C dropped. A folder's tab strip puts its scrollbar
above the tabs, so it never comes between them and the sheet.
*Pending Rob's pick:* scrollbar shadow options A `.rk-scrollbar-raised`, B `.rk-scrollbar-sunken`
and C `.rk-scrollbar-slider` ("Scrollbar shadow" on `/styleguide/`); the flat bar stays the default.

**More loading options** *(Gate 1b, pending Rob's picks)*: on `/styleguide/` under "More loading
options", beside spinners A–C and progress bars A–B.
- Toon water (`water.css`, `.rk-water`, level from `--water-level`): spinners D (flask filling)
  and E (flask sloshing); a busy filled button that fills with its own colour
  (`aria-busy="true"` + `aria-disabled="true"`, looping or set); pending panels A (filling) and
  B (sloshing along the bottom).
- Dot spinners (`spinner-dots.css`): F in a circle, G in a triangle, H squash and stretch.
- Loaders, indeterminate bars (`loader.css`): A inchworm, B bouncing block, C hopping ball,
  D candy stripes.


### 5.5 Iconography *(approved 2026-11-01, after Rob saw the icons on the mood board)*

Full report: `docs/redesign/research/icons.md` (ranked sets, coverage matrix, licences, SVG/CSS template, sources).

- **Base set: Phosphor duotone (MIT), vendored from the GitHub `raw/duotone/` sources.** Each icon
  keeps its fill as a separate shape from its round-capped outline strokes. A one-off script
  rewrites stroke → `currentColor` and fill → `var(--icon-fill)`, so the fill takes the section
  colour or any token, in either theme. It covers 42 of 43 non-brand needs. Don't use the npm or
  Iconify builds: they are pre-flattened, so stroke width can't be adjusted.
- **Gaps:** Tabler (MIT) as the fallback set. Satellite: adapt Tabler's (~30 min).
- **Brands:** Simple Icons (CC0) plus `logos:jax`. Use LinkedIn's and ORCID's own official assets
  (Simple Icons dropped LinkedIn). **Brand marks stay single flat black or white.** Brand
  guidelines (GitHub, LinkedIn, ORCID) forbid recolouring them, so the colour, ink outline and
  shadow go on the *button* around the mark. Brand marks are trademarks, so they live in the
  **site**, not in the MIT-licensed design package, with a trademark note in the notices file.
- **Tech-stack chips:** Simple Icons in one colour, replacing the old devicon font.
- **Avoid:** Remix Icon (own restrictive licence since Jan 2026), Solar and Streamline (visible
  credit required), OpenMoji (share-alike), IconPark (archived).
- **Pipeline:** vendored, recoloured SVGs in the design package's icon folder, plus one
  `sprite.svg` built from them. The hooks (`currentColor`, `var(--icon-fill)`) only work on
  **inline** SVG or `<use>`, never on `<img>` or CSS backgrounds. So this site inlines them with
  Astro's built-in SVG imports, and vanilla sites use `<svg><use href="…/sprite.svg#flask"/></svg>`
  (same origin, or a copy in `vendor/`). SVGO `preset-default` keeps the hook. `astro-icon` is
  untested for it, so don't use it.
- **Custom drawing (optional, 2–5 icons):** a gravity-wave "signature" mark (1–3 h), and perhaps
  a climate-model icon and a monogram/favicon. Drawing the whole set by hand isn't worthwhile
  (40–100+ h for a non-designer, adds nothing the sets lack).
- Prototype render (light and dark, nav, subject, brand and tech chips):
  `docs/redesign/research/icons-prototype.png`.

### 5.6 Reusable design package *(proposed 2026-11-01; Rob wants to reuse the design on other sites)*

**The site is Astro, not Vue.** `@astrojs/vue` is installed, but Phase 2 deliberately used no Vue
components. Reuse doesn't need Vue. The most portable layers of a design system are the ones
that need no framework at all:

| Layer | Form | Reusable in |
|---|---|---|
| 1. Tokens | `tokens.css` (custom properties, light and dark), with a `tokens.json` source if a 2nd format is ever needed | anything with CSS |
| 2. Fonts and base | Self-hosted font CSS, reset, type scale | anything with CSS |
| 3. Primitives and components | **CSS classes on plain HTML** (`.rk-button`, `.rk-chip`, `.rk-card`, `.rk-switch`, `.rk-widget-frame` ...), with documented markup | any framework, or plain HTML |
| 4. Icons | Vendored SVG files + licences, `--icon-fill` hook | anything |
| 5. Behaviour | Small **vanilla JS custom elements (JSDoc types)** for components that need JS (`<rk-theme-toggle>`, `<rk-lightbox>`, sliders with readouts, the Lorenz widget) | any framework, or plain HTML |
| 6. Framework wrappers | Thin `.astro` components that write layer-3 markup. Rob's other sites are vanilla JS, so they use layers 1–5 directly. No Vue wrappers for now | that framework only |

- **Where it lives:** a folder in this repo (path in IMPLEMENTATION.md) that the site consumes like
  any other package. It may move to its own repo later; the boundary stays the same.
- **Boundary rules for agents:** the package never imports from `src/`, holds no site copy or
  section names, and is themeable only through tokens. Site-specific choices (which hue is
  "Writing") live in the site, mapped onto `--section`.
- **Naming (DECIDED 2026-11-01, Gate 0):** the package is **`rk-ui`** (`packages/rk-ui/`) and the
  class/element prefix is **`rk-`**. The prefix appears in every post's MDX and every other site's
  HTML, and it's also the namespace for browser storage keys (`rk-theme`), so it's hard to change
  later.
- **Distribution (decided 2026-11-01):** Rob's other sites are a mix: plain HTML, ES modules with
  esbuild, Parcel, Vue CLI. So the package must work with **no build step**: plain JS (JSDoc for
  types), one stylesheet whose `@font-face` URLs point at the vendored fonts by relative path, the
  icon files and sprite, and one classic `theme-init.js`. Other sites **copy a tagged release into
  their own `vendor/` folder** (mythosdemo already uses that pattern). There are no hosted or CDN
  versions, so there's no third-party request and no permanent public URLs to maintain.
- **Theme contract:** the theme lives in a `data-theme` attribute on `<html>` plus one namespaced
  storage key (`<prefix>-theme`). Every site on the domain shares browser storage, so one choice
  applies everywhere. `theme-init.js` is a tiny classic script that is **inlined in `<head>`**
  (in Astro via a `?raw` import). Module scripts run too late and would flash the wrong theme. The
  toggle element only changes the attribute and the key.
- **Why not "everything in Vue":** Vue components only work in Vue sites, or in Astro via an
  integration, and they don't fit plain HTML. CSS + custom elements cover every case, and thin
  wrappers keep authoring pleasant in each framework.
- **Consolidation (decided 2026-11-02, done after the core gates):** everything that is really
  library code moves into the package, so it all lives in one place. That means the `.astro`
  wrappers (under `astro/`), ThemeToggle, CodeBlock, the specimen layout, the styleguide (under
  `styleguide/`) and `parseTokens`. The package gains a `package.json` with `exports`, the repo
  uses npm workspaces, and an optional Astro integration (`rk-ui/integration`) inlines
  theme-init, loads the stylesheet, sets the font inline limit and Shiki's `css-variables`
  theme, and can serve the styleguide. The framework-free core is unchanged, so non-Astro sites
  still copy a tagged release. Trademark logos stay in the site and are passed in as props. Vue
  wrappers are not planned. A fresh builder does the move as pure `git mv` commits, then a
  reviewer checks it; the styleguide's built HTML should differ only in asset hashes.
---

## 6. Content model *(proposed)*

All collections are defined in `src/content.config.ts` (Zod-validated, as
in Phase 2).

| Collection | Loader | Key fields |
|---|---|---|
| `posts` | `glob('**/*.{md,mdx}', base: src/content/posts)` | `title`, `date`, `updated?`, `summary`, `tags[]`, `hero?` (image), `draft`, `publication?: reference('publications')`, `project?: reference('projects')` |
| `projects` | existing (Phase 2) | add `featured`, `status` (active / archived), `draft` |
| `publications` | `glob('**/*.md', base: src/content/publications)`, one file per paper, hand-written (§6a). The **file name is the ID** (no `id` field, so DOIs never end up in URLs) | `title`, `authors[]`, `venue`, `year`, `type` (article / preprint / software / abstract / talk / thesis), `doi?`, `preprint?`, `pdf?`, `code?`, `figure?`, `figureCredit?`, `featured`, `draft` |
| `photos` | `glob` of album folders, each an `index.md` with images beside it; `draft` | album `title`, `date`, `location?`, `cover`, `images[]` via the `image()` schema helper (astro:assets optimisation) |

- **Cross-links** use `reference()` and are stored **on the post only**
  (`publication`, `project`). Paper and project pages compute their backlinks
  at build time, so the two sides can't disagree.
- **Drafts, one rule for every collection:** `draft: true` entries render in
  `astro dev` and are left out of `astro build`. Astro has no global draft filter, and
  `reference()` resolves drafts too. So there is **one content helper** (`getPublished(name)`,
  `resolvePublished(ref)`, which returns nothing for a draft in a production build), and pages
  never call `getCollection`/`getEntry` directly. Otherwise a fixture leaks into the RSS feed, or
  a live post links to a draft paper and 404s. Rob can see his drafts and
  the legacy projects under review locally, and none of them reach the live site.
- **Placeholder entries** *(decided 2026-11-01)*: agents may add obviously fake
  entries (lorem ipsum, named `_fixture-*`, always `draft: true`) so layouts can be
  built and reviewed before Rob's content exists. They never reach the live site,
  and Rob's real entries replace them.
- **Every committed image goes through one strip-and-resize step** (album photos, post heroes,
  publication figures, the profile photo). It strips **all** EXIF, since keeping some fields is
  fiddly and nothing needs them. The repo is public and history is permanent.
- **Projects: no automatic inheritance (DECIDED 2026-11-01).** Legacy
  projects come back only after Rob reviews each one: keep, rewrite or drop.
  That includes the 4 already migrated on `experimental`. The schema gains
  `draft: boolean` (default `true` for anything migrated), and follows the
  draft rule above.
- **Content:** Rob writes **all** content (copy, posts, publication summaries, captions) and
  supplies all photography as it comes in. Agents never draft final copy or source stand-in photos.

### 6a. Publications *(DECIDED 2026-11-01: entered by hand)*

Rob will add publications **by hand**. He isn't sure BibTeX carries everything he
wants to show (plain-language summary, figure, slides, code, companion post), so
each paper is **one Markdown file** rather than a row in a data file:

```
src/content/publications/2024-bayesian-history-matching.md
---
title: Bayesian History Matching Applied to the Calibration of a Gravity Wave Parameterization
authors: [Robert C. King, …]      # Rob's name gets highlighted automatically
venue: Journal of Advances in Modeling Earth Systems
year: 2024
type: article                     # article | preprint | software | abstract | talk | thesis
doi: 10.1029/2023MS004163
preprint: 10.22541/essoar.170365299.96491153/v1
links: { pdf: …, code: …, slides: … }
figure: ./bhm-figure.png          # optional, optimised via astro:assets
featured: true
---
Optional plain-language summary in Markdown, shown on the research page.
```

- Uses the `glob` loader like `posts` and `projects`. The schema is the field list in §6, plus `figure` and a Markdown body.
- A companion post links to its paper from the post side (`publication: <file name>`). The research page shows the backlink.
- **Optional one-off starter, not a pipeline:** `npm run pubs:new -- <doi | file.bib>` writes a
  pre-filled draft file (fields from Crossref/OpenAlex for a DOI, or from a BibTeX entry, e.g. a
  Scholar export) for Rob to edit and finish. There's no cron, no sync and no network access during the build.
- Rob's ORCID is **`0009-0006-1944-7787`** (confirmed). OpenAlex author `A5102816069`. Both are useful
  as the checklist of what exists (as of 2026-11-01: JAMES 2024 and GRL 2026 papers with
  ESSOAr preprints; MiMA v1.2.1 and ad99py on Zenodo; EGU25 abstract; 2026 arXiv preprint on AI
  precipitation forecasts). Rob decides which of these appear.
- Google Scholar has no API and redirects scripted requests to its login page (tested 2026-11-01). It
  only comes in as a BibTeX export fed to `pubs:new`.
- The ORCID iD gets an icon in the left-bar socials and on the research page.

---

### 6b. Site profile and page text: editable as Markdown *(DECIDED 2026-11-01)*

Rob should be able to change his bio, photo, links or page intros by editing one obvious file,
with no layout or component code involved. That editing is one of the main reasons for choosing
Astro (content collections). All of it lives in `src/content/site/`:

```
src/content/site/
  profile.md     # frontmatter: name, role (left-bar line), photo, email, cv, socials[]
                 # body: the long bio shown on /about/
  home.md        # body: home-page intro
  photo.jpg      # the profile photo, referenced from profile.md; swap the file to change it
```

```markdown
---
name: Robert C. King
role: Climate models · Stanford
photo: ./photo.jpg               # image() helper → optimised by astro:assets
email: robertcking98@gmail.com
cv: /files/Robert_King_CV.pdf
socials:
  - { kind: github,   url: https://github.com/OneOneFour }
  - { kind: orcid,    url: https://orcid.org/0009-0006-1944-7787 }
  - { kind: linkedin, url: https://www.linkedin.com/in/… }
---
Longer bio in plain Markdown…
```

- Two collections, because one collection has only one schema. `profile` is
  `glob({ pattern: 'profile.md', base: './src/content/site' })`, with required name, role, photo
  and socials. `pages` is `glob({ pattern: ['*.md', '!profile.md'], … })`. (Astro's `file()`
  loader only reads JSON/YAML/TOML, so it can't hold a Markdown bio.) A typo or a missing profile
  field fails the build with a clear message, and never produces a broken page.
- If a `_fixture` profile and the real one both exist, the real one wins. A production build with
  no real profile fails.
- `socials[].kind` picks the icon, and the order in the file is the order shown. Adding or
  removing a link is a one-line edit.
- Layouts read these files. Nothing personal is hard-coded in components, which also keeps the
  design package (§5.6) free of site content.
- The same rule covers every section's intro text: a section index page takes its blurb from
  Markdown, not from the template.

## 7. Interactive posts *(proposed)*

- Interactive posts are `.mdx`. Plain posts stay `.md`.
- **Widgets are framework-agnostic at the frame level.** `WidgetFrame`
  (Astro) gives the draft-2 look: dashed or outlined panel, title, a canvas
  or SVG slot, a controls row and Start/Reset. Controls are the *native*
  styled primitives from §5.4, so they look right whatever drives them.
- **What drives the widget is decided per widget:**
  - Simulations and visualisations (most cases): vanilla JS module or a
    custom element on a `<canvas>`/SVG, consistent with the Phase 2
    "vanilla first" decision.
  - Genuinely stateful UIs: a Vue island (`client:visible`). Vue is already
    installed.
- **Load only on view**: `client:visible` only works on framework components, and
  fails the build on a custom element (verified on Astro 7.0.7). So `<rk-widget>` is
  defined up front (it's tiny), and uses `IntersectionObserver` to `import()` its
  simulation module the first time it scrolls into view. A post with five widgets doesn't
  load five sims up front. `client:visible` is kept for the rare Vue island.
- Every widget gets a **static fallback** (its light-DOM children: a poster image or
  caption), so the post reads correctly with JS off. RSS is summary-only, so widgets
  never need to render in feed readers.
- **Exemplar to build alongside the post template:** a Lorenz-system
  "butterfly effect" widget (two trajectories, a slider for the initial-
  condition offset, Start/Reset). It's the draft-2 concept, it exercises
  every primitive and it fits the research area.
- Code blocks use Shiki (built into Astro), themed from the tokens.

---

## 8–9. Roadmap and work packages

These moved to [`IMPLEMENTATION.md`](./IMPLEMENTATION.md) §4 (phases P0–P4 with tasks and gates),
the single source for order, file locations and acceptance.

---

## 10. Decisions

**Decided (2026-11-01):**
- Font pairing A, Roboto Slab + Xmind (§5.2).
- Dark mode ships with the new look (§5.1b).
- Publications entered by hand, one `.md` per paper (§6a).
- Real photo for the avatar.
- Per-section colours, "for now", behind `--section` tokens (§3).
- Icons: Phosphor duotone + Simple Icons; brand marks stay in the site (§5.5).
- Old Phase 2 deploy (R0) dropped; its code is carried into the redesign with projects as drafts.
- Design package distribution: no build step, copied into each site's `vendor/` (§5.6).
- URL policy, draft rule, content helper (§3, §6).
- Clickable equation references via a small plugin before KaTeX (§5.2).
- Photo storage: Cloudflare R2 behind `photos.robertcking.com` (IMPLEMENTATION.md §8).
- Licences: MIT for code, CC BY-NC 4.0 for content except where credited otherwise
  (IMPLEMENTATION.md §1).
- Design package `rk-ui`, prefix `rk-` (§5.6).

**Open:** none.

**Ideas for later (not scheduled):**
- ~~A warm "greige" alternate mode for the whole site, built from the greige slate Rob liked at
  Gate 1b.~~ *Built at Gate 1b* as the `data-palette` attribute, with a cool slate palette too
  (§5.1b). The site ships cream (decided 2026-11-02).
- A "How this site was made" section with a credits page listing every third-party asset and
  its author/licence (icons, fonts, logos), generated from or kept in step with
  `THIRD_PARTY_NOTICES.md`. Some assets need visible credit there (e.g. the Julia logo,
  CC BY-NC-SA).
- A PowerPoint template in the toon style, generated from `tokens.css` so it stays in step: a
  `.thmx` theme (theme colours with the chart order as accents 1–6, Roboto Slab/Xmind theme
  fonts, a default shape with a 2pt ink outline and a hard zero-blur shadow), light and dark
  masters, and an icon export with token colours baked in (PowerPoint can't read CSS
  variables). Best done after the package consolidation (§5.6).

## Sources

- Google Fonts family metadata (subsets, axes, styles, date added):
  https://fonts.google.com/metadata/fonts
- Xmind on Google Fonts: https://fonts.google.com/specimen/Xmind
- NeverMind (Xmind) source and licence (OFL): https://github.com/xmindltd/nevermind
- Google Fonts sources and licences: `ofl/xmind`, `apache/robotoslab` in https://github.com/google/fonts
- ORCID public API v3.0 (works for `0009-0006-1944-7787`):
  https://pub.orcid.org/v3.0/0009-0006-1944-7787/works
- OpenAlex author and works API: https://api.openalex.org/authors/orcid:0009-0006-1944-7787
- WCAG 2.2 contrast minimum (1.4.3) and non-text contrast (1.4.11):
  https://www.w3.org/TR/WCAG22/
