# robertcking.com — visual refresh & expansion plan

Status: **DRAFT, 2026-11-01, revised after plan review.** **What** to build lives here.
**Where files go and when work happens** lives in [`IMPLEMENTATION.md`](./IMPLEMENTATION.md),
which wins wherever the two disagree. Items marked
**[OPEN]** need a decision from Rob before the work package that depends on
them starts. Items marked *(proposed)* are recommendations that stand unless
overridden.

This file is the handoff document for future conversations and subagents.
Each work package (§9) is meant to be picked up cold: read this file, then the
files the package lists, then do the work.

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
islands only where needed, every phase deployable).

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
- **Narrower than ~1200px**: the margin column folds in, so sidenotes become
  inline expandable notes and `.wide` equals `text`.
- **Narrower than ~800px**: the left bar becomes a top bar (avatar, name,
  menu button opening the nav as a disclosure panel). This replaces the
  legacy "mini-left-bar" toggle.
- Related posts, prev/next and the "companion paper" box go **at the end of
  the post**, not in a permanent rail.

---

## 5. Design system

All of this lives as CSS custom properties in `src/styles/tokens.css`, using
**semantic names** (`--surface`, `--ink`, `--accent-writing` …) rather than
raw hues, so dark mode is a token swap.

### 5.1 Colour rules *(proposed, from the contrast table in §2)*

1. **Text on bright fills is ink, not white.** Teal, green and yellow
   buttons and chips carry `--ink` labels, which is also the "toon" look
   (dark outline and dark lettering). Only navy, and a deepened red,
   carry white text.
2. **Coral is deepened by about 10–15% lightness** for any fill that
   carries text, so it passes 4.5:1 with white. First candidate
   `#da382f` = 4.6:1 (HLS lightness −5%, computed 2026-11-01); WP-2 may push
   it further for margin. The bright coral stays for large display blocks
   and header bands with no small text.
3. **Bright hues are never used for small text on cream.** Each hue gets
   a `-deep` variant for text and links, and a `-tint` variant for panel
   backgrounds (like the pale-blue/teal sidebar tints in draft 3).
4. Every token pair can be checked with a small local script
   (`npm run contrast`), so palette tweaks don't silently fail contrast.
5. Charts in posts use the same hues in a fixed order, checked for
   colour-blind separability (use the `dataviz` skill's validator).

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
them for colour-blind separability in WP-2.

### 5.1b Dark mode *(DECIDED 2026-11-01: ships with the new look)*

Dark mode is built into the tokens in R2 and goes live with the new shell in
R3. It follows `prefers-color-scheme` by default, with a three-way Light /
Dark / System toggle in the left bar. The choice is remembered per browser.
To avoid a flash of the wrong theme, set the theme with a tiny inline script
in `<head>` before first paint.

Rules (shown on the mood board, theme switch at the top):
- The page goes to a deep night blue (not black). **Fills stay vivid, and
  labels on fills stay ink.** Outlines and hard shadows become near-black,
  so toon edges still read as depth.
- **Tints flip to deep versions** with cream text (sky, lilac, apricot are
  panel backgrounds and would glare in dark mode).
- Hue-text variants (`--navy-text` etc.) get lighter values for dark mode.

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
must use the `fg` colour for their border in dark mode. WP-2's contrast
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

Shortlisted pairings *(proposed; to be judged on a real specimen page, WP-1)*:

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
  `$…$` inline and `$$…$$` for display. KaTeX uses its own math fonts, so the body
  font only needs Greek for *inline prose*. No runtime JS.
- **Monospace** (code, widget readouts): pick one with Greek, decided in WP-1.
- Fonts are **self-hosted** from woff2 files vendored once into the design
  package (OFL allows redistribution), with our own `@font-face` rules. Each
  file is subset by `unicode-range` (latin, greek), so the Greek file only
  downloads when a page uses Greek. Why vendored: Xmind isn't on Fontsource (npm 404,
  checked 2026-11-01), plain files also work on Rob's vanilla-JS sites, and pinning
  protects against changes to this very new font. The site may serve the same files
  through Astro 7's stable `fonts` config (`local` provider) for preload hints.
- A modular **type scale** (≈1.25 ratio) and `rem` units replace the legacy
  `pt` sizes.

**DECIDED (2026-11-01): pairing A**, Roboto Slab headings with Xmind body
and UI. Rob approved it after seeing it on the mood board. WP-1 no longer
compares pairings. It settles the type scale, the monospace face and the
weights actually used.

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
- **Focus**: a visible 3px `--focus` ring offset from the outline, never
  removed.

### 5.4 Component inventory

| Layer | Components |
|---|---|
| Primitives (CSS on native elements) | `button`, `input[type=range]`, checkbox styled as switch, `select`, text input, links |
| Astro components | `Button`, `Chip`/`ChipGroup` (filter), `Card` (post / project / paper / album variants), `HeaderBand`, `Callout` (note / warning), `PullQuote`, `Sidenote`, `Figure`, `WidgetFrame` |
| Layouts | `BaseLayout` (left bar + main), `PostLayout` (header band, breakout grid, end matter), `IndexLayout` (card grid + chips) |

A `/styleguide/` page renders every token and component. It is where Rob
reviews design work.


### 5.5 Iconography *(recommended 2026-11-01; awaiting Rob's OK)*

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
  shadow go on the *button* around the mark.
- **Tech-stack chips:** Simple Icons in one colour, replacing the old devicon font.
- **Avoid:** Remix Icon (own restrictive licence since Jan 2026), Solar and Streamline (visible
  credit required), OpenMoji (share-alike), IconPark (archived).
- **Pipeline:** vendored SVGs in `src/icons/`, imported as Astro's built-in SVG components
  (inlined at build, no dependency). SVGO `preset-default` keeps the `var(--icon-fill)` hook;
  `astro-icon` is untested for that, so don't use it.
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
| 3. Primitives and components | **CSS classes on plain HTML** (`.tu-button`, `.tu-chip`, `.tu-card`, `.tu-switch`, `.tu-widget-frame` ...), with documented markup | any framework, or plain HTML |
| 4. Icons | Vendored SVG files + licences, `--icon-fill` hook | anything |
| 5. Behaviour | Small **vanilla TS custom elements** for components that need JS (`<tu-theme-toggle>`, `<tu-lightbox>`, sliders with readouts, the Lorenz widget) | any framework, or plain HTML |
| 6. Framework wrappers | Thin `.astro` components that write layer-3 markup. Rob's other sites are vanilla JS, so they use layers 1–5 directly. No Vue wrappers for now | that framework only |

- **Where it lives:** `packages/toon-ui/` as an npm workspace inside this repo. The site depends on
  it like any other package. Move it to its own repo (or GitHub Packages) once a second site
  needs it. Nothing about the boundary changes at that point.
- **Boundary rules for agents:** the package never imports from `src/`, holds no site copy or
  section names, and is themeable only through tokens. Site-specific choices (which hue is
  "Writing") live in the site, mapped onto `--section`.
- **Naming [OPEN, decide before P1]:** `toon-ui` and the `tu-` prefix are working names. The
  prefix appears in every post's MDX and every other site's HTML, so it's hard to change later.
  Pick it independently of the package name.
- **Distribution:** the package must work from a plain `<link rel="stylesheet">` plus
  `<script type="module">`, with no build step: plain JS (JSDoc for types), one `toon-ui.css`
  whose `@font-face` URLs point at vendored fonts by relative path, and raw `icons/*.svg`. npm can't
  install a subfolder of another git repo, so other sites load a tagged version through jsDelivr
  (`cdn.jsdelivr.net/gh/OneOneFour/<repo>@<tag>/packages/toon-ui/…`) or copy the folder.
  **[OPEN]** Do Rob's other sites have a build step? If they do, a published npm package becomes an
  option later.
- **Why not "everything in Vue":** Vue components only work in Vue sites, or in Astro via an
  integration, and they don't fit plain HTML. CSS + custom elements cover every case, and thin
  wrappers keep authoring pleasant in each framework.
---

## 6. Content model *(proposed)*

All collections are defined in `src/content.config.ts` (Zod-validated, as
in Phase 2).

| Collection | Loader | Key fields |
|---|---|---|
| `posts` | `glob('**/*.{md,mdx}', base: src/content/posts)` | `title`, `date`, `updated?`, `summary`, `tags[]`, `hero?` (image), `draft`, `publication?: reference('publications')`, `project?: reference('projects')` |
| `projects` | existing (Phase 2) | add `featured`, `status` (active / archived), `draft` |
| `publications` | `glob('**/*.md', base: src/content/publications)`, one file per paper, hand-written (§6a) | `id` (DOI or slug), `title`, `authors[]`, `venue`, `year`, `type` (article / preprint / software / abstract / talk / thesis), `doi?`, `preprint?`, `pdf?`, `code?`, `featured`, `draft` |
| `photos` | `glob` of album folders, each an `index.md` with images beside it; `draft` | album `title`, `date`, `location?`, `cover`, `images[]` via the `image()` schema helper (astro:assets optimisation) |

- **Cross-links** use `reference()` and are stored **on the post only**
  (`publication`, `project`). Paper and project pages compute their backlinks
  at build time, so the two sides can't disagree.
- **Drafts, one rule for every collection:** `draft: true` entries render in
  `astro dev` and are left out of `astro build`. Rob can see his drafts and
  the legacy projects under review locally, and none of them reach the live site.
- **Placeholder entries** *(decided 2026-11-01)*: agents may add obviously fake
  entries (lorem ipsum, named `_fixture-*`, always `draft: true`) so layouts can be
  built and reviewed before Rob's content exists. They never reach the live site,
  and Rob's real entries replace them.
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

- Two collections, because one collection has only one schema: `profile` (a single-entry
  `file()`-style loader with required name, role, photo and socials) and `pages` (body-text
  files like `home.md`). A typo or a missing profile field fails the build with a clear message,
  and never produces a broken page.
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
  - Simulations and visualisations (most cases): vanilla TS module or a
    custom element on a `<canvas>`/SVG, consistent with the Phase 2
    "vanilla first" decision.
  - Genuinely stateful UIs: a Vue island (`client:visible`). Vue is already
    installed.
- **Load only on view**: `client:visible` only works on framework components, and
  fails the build on a custom element (verified on Astro 7.0.7). So `<tu-widget>` is
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

## 8. Roadmap (every phase ends deployable)

| # | Phase | Ships to live site | Depends on |
|---|---|---|---|
| R0 | ~~Land Phase 2 in legacy look~~. *Proposed:* **drop as a separate deploy**. The `experimental` code (schema, components, `/project/[slug]`) is carried into R3, with its 4 legacy projects set to `draft: true` pending Rob's review. The live splash page stays as it is until R3. | — | — |
| R1 | **Design decisions**: font/palette specimen, contrast script, settle the [OPEN]s | `/styleguide/` (unlinked) | — |
| R2 | **Foundation**: tokens, type, primitives, Astro components on the styleguide | `/styleguide/` (unlinked) | R1 |
| R3 | **New shell, identity goes live**: BaseLayout with left bar and nav, Home and Projects restyled, `/project/*` → `/projects/*` redirects, About page | whole site in the new look | R0, R2 |
| R4 | **Writing**: `posts` collection, PostLayout (breakout grid, sidenotes, end matter), MDX, KaTeX, Shiki, WidgetFrame, Lorenz exemplar post, RSS | `/writing/` | R3 |
| R5 | **Research**: `publications` collection, chips filter, paper ↔ post links | `/research/` | R3 (R4 for links) |
| R6 | **Photography**: `photos` collection, astro:assets, grid and lightbox | `/photos/` | R3 |
| R7 | **Projects review and archive**: Rob-led review of the legacy projects (keep / rewrite / drop each), GitHub archive view (build-time fetch with `GITHUB_TOKEN`) | fuller `/projects/` | R3 |
| R8 | **Cleanup**: delete dead branches (`astro`, `v3`, `old`, `page-src`, `master`), close draft PR #1, enforce HTTPS in Pages settings | — | all |

R4–R7 are independent of each other once R3 lands, so they can run in
parallel conversations.

---

## 9. Work packages (for future conversations and subagents)

How these are executed (branch, agents, gates, code style, minimal testing) is in
[`IMPLEMENTATION.md`](./IMPLEMENTATION.md), which overrides this table where they differ.

Convention: **conversation** = needs Rob's taste or decisions in the loop.
**subagent** = mechanical, with a clear spec and acceptance criteria.
Every package must end with `npm run build` passing.

| WP | Phase | Mode | Task | Acceptance |
|---|---|---|---|---|
| WP-0 | R3 | subagent | Bring the `experimental` Phase 2 code onto the R3 branch. Add `draft` to the projects schema and mark the 4 migrated projects as drafts | Build passes; no draft project is rendered |
| WP-1 | R1 | **conversation** | Specimen page for pairing A: type scale, monospace choice, Greek and maths, sample post paragraph, core and auxiliary colours as buttons, chips and panels, toon shadow variants | Rob signs off on the scale and mono; §5.2 updated |
| WP-2 | R1 | subagent | `scripts/check-contrast.mjs` (local, not CI); derive `-deep`/`-tint` variants that pass | All declared text/fill pairs ≥ 4.5 (≥ 3 for large text and UI) |
| WP-3 | R2 | subagent | `tokens.css` (light and dark, §5.1b), icon vendoring script and `packages/toon-ui/icons/` (§5.5), no-flash theme script, type scale, primitives, Astro components, `/styleguide/` | Matches §5; Rob reviews `/styleguide/` locally in **both themes** |
| WP-4 | R3 | **conversation** | BaseLayout and left bar, nav, responsive top bar, Home, About, Projects restyle, redirects | Rob signs off locally; old URLs redirect |
| WP-5 | R4 | conversation, then subagent | PostLayout, MDX/KaTeX/Shiki, Sidenote/Figure/WidgetFrame, RSS | Exemplar post renders, works with JS off (fallback) |
| WP-6 | R4 | subagent | Lorenz butterfly widget (vanilla TS) | Runs at 60fps on a laptop; reduced-motion respected |
| WP-7a | R5 | subagent | `publications` collection schema plus the `pubs:new` starter script (DOI or BibTeX → draft `.md`), §6a | `pubs:new 10.1029/2023MS004163` writes a valid draft; build passes with it |
| WP-7b | R5 | subagent | `/research/` page: publications collection, chips filter, paper ↔ post links | Every paper with a `post` shows the link both ways |
| WP-8 | R6 | conversation | Photography: album structure, image pipeline, lightbox. **Rob supplies the prototype photos at the start** | Optimised images; Lighthouse perf ≥ 90 on an album page |
| WP-9 | R7 | **conversation (Rob-led)** | Review legacy projects one by one (the 4 drafts plus 6 on `origin/page-src`): keep, rewrite or drop. Nothing is migrated without sign-off | Only approved projects have `draft: false` |
| WP-10 | R7 | subagent | GitHub archive view | Builds in CI with no rate-limit failures |
| WP-11 | R8 | subagent, with confirmation before deleting | Branch cleanup, PR close, HTTPS | Rob confirms each deletion |

---

## 10. Open decisions (summary)

1. ~~Font pairing~~: **decided, A** (Roboto Slab + Xmind), §5.2.
2. ~~Dark mode timing~~: **decided, ships with the new look** (§5.1b).
3. ~~Publications source~~: **decided, entered by hand** (one `.md` per paper,
   optional DOI/BibTeX starter), §6a. ORCID confirmed.
4. **R0**: *proposed* to drop it and carry the Phase 2 code into R3 with the
   legacy projects as drafts (follows from "no automatic inheritance").
5. ~~Avatar~~: **decided, real photo** (current `public/images/mugshota.png` until Rob supplies a new one).
6. ~~Section colours~~: **decided for now, per-section colours** as in §3 and the mood-board
   demo (2026-11-01). Rob may revisit this during the build, so keep section hues behind
   semantic tokens (`--section`, `--on-section`, set per layout). Then a switch to a
   single accent is a token change, not a rewrite.
7. **Iconography**: *recommended*, Phosphor duotone base, Simple Icons for brands, 2–5 custom
   icons (§5.5). Awaiting Rob's OK.
8. ~~Other sites' framework~~: **vanilla JS** (may move to Vue later), so no Vue wrappers for now (§5.6).

## Sources

- Google Fonts family metadata (subsets, axes, styles, date added):
  https://fonts.google.com/metadata/fonts
- Xmind on Google Fonts: https://fonts.google.com/specimen/Xmind
- NeverMind (Xmind) source and licence (OFL): https://github.com/xmindltd/nevermind
- ORCID public API v3.0 (works for `0009-0006-1944-7787`):
  https://pub.orcid.org/v3.0/0009-0006-1944-7787/works
- OpenAlex author and works API: https://api.openalex.org/authors/orcid:0009-0006-1944-7787
- WCAG 2.2 contrast minimum (1.4.3) and non-text contrast (1.4.11):
  https://www.w3.org/TR/WCAG22/
