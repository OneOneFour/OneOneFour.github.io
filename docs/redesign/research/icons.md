# Icons: open-source sets vs custom drawing

*Research for the robertcking.com redesign. Written 2026-11-01. All version
numbers, dates and licences were checked on that date against the npm registry,
the GitHub API, or the project's own licence file (see Sources). If something
could not be checked, the text says so.*

**TL;DR.** Use a **hybrid**, with one set doing nearly all the work:

1. **Phosphor's *raw duotone* SVGs** (MIT) are the base set for nav, UI and
   subject icons. Their source files already keep the **stroke layer**
   (2 px-able, round caps and joins) separate from a **fill layer**, which is
   the "coral pen in an ink outline" look. A one-off script swaps the fill
   layer to `var(--icon-fill)` and the strokes to `currentColor`.
   **Rendered and checked:** light and dark modes, and `<use>` reuse.
2. **Simple Icons** (CC0) for brand marks and tech logos. These are drawn
   one colour only, inside a toon *button*. Use **ORCID's own iD icon**, and
   **LinkedIn's own [in] mark** (Simple Icons dropped LinkedIn in 2024). Add
   `logos:jax` for JAX.
3. **Draw or adapt about 2–5 icons yourself**: a satellite (Phosphor has none),
   a signature "gravity wave" icon, and optionally a climate-model icon and a
   monogram. Everything else comes from the sets.
4. Wire it up with **Astro's built-in SVG components** (no dependency) from
   a vendored `src/icons/` folder. `astro-icon` is a fine alternative.

---

## 1. What the style needs from an icon (from PLAN §5 and the drafts)

- **Recolourable in CSS.** The ink comes from `currentColor`, and the
  accent fill from a CSS custom property. Nothing is baked in, so dark mode
  is a token swap. (Rob's note mid-task: "SVGs are nice because we can
  restyle them in our home colors." That is the requirement everything below
  is judged on.)
- **Toon look.** About 2 px strokes at 24 px, round caps and joins, flat
  fills, no gradients. Ideally a **fill region inside an ink outline**
  (duotone).
- **Draft 3** (`refs/draft-3-post-with-sidebar.png`) shows small multicolour
  filled nav glyphs (Home, Research, Essays, Code/Demos, CV/About) and
  single-colour social glyphs. Draft 1 has a warning triangle in yellow with
  an ink outline, which is exactly the duotone treatment.
- **Static Astro 7.** Icons are inlined at build time, with zero runtime JS.

---

## 2. Ranked shortlist

Icon counts are the visible icons in the Iconify JSON for each set (iconify/icon-sets, fetched
2026-11-01) unless noted.

| # | Set | Licence (verified) | Icons | Stroke | Duotone / fill-in-outline | Last release | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | **Phosphor** (raw SVGs from GitHub) | MIT | 1,512 glyphs × 6 weights (9,072) | **Stroked in `raw/`** (16/256 regular, 24/256 bold), round caps and joins. Fully adjustable | **Native duotone weight**. Fill layer is a separate `<path opacity="0.2">`, strokes are separate | npm `@phosphor-icons/core` 2.1.1 (2024-03-29). Repo last icon commit 2026-01-06 | **Base set.** Best toon fit. Slow-moving, but we vendor the files, so that doesn't matter |
| 2 | **Tabler Icons** | MIT | 6,257 (incl. 1,088 `-filled`, 413 `brand-`) | Stroked, `stroke-width="2"`, round caps and joins, 24 grid | No duotone. Separate `-filled` variants. Putting fill on the stroke paths works for about 60% of icons (see §4) | v3.50.0, 2026-10-27 | **Gap filler / fallback.** Very active, huge, has `satellite` and `brand-bluesky` |
| 3 | **Lucide** | ISC (+MIT for Feather-derived icons) | 2,015 | Stroked, 2 px, round caps and joins | None. Same partial fill-the-stroke trick | 1.66.0, 2026-10-31 | Good monoline alternative. **No brand icons by policy** |
| 4 | **Simple Icons** (brands) | CC0-1.0 (trademarks still apply) | 3,467 | Solid single-path marks | n/a (one colour by design) | 16.36.0, 2026-10-25 | **Brand and tech logos.** No LinkedIn (removed in v14), no MATLAB, no JAX |
| 5 | **Academicons** | Font: OFL-1.1. CSS: MIT | 158 | Solid | n/a | v1.9.6 (GitHub, 2025-08-26) | Backup for ORCID / Google Scholar / arXiv / Semantic Scholar |
| 6 | Hugeicons (free) | MIT (`@hugeicons/core-free-icons` 4.4.0, 2026-10-28) | 6,065 (Iconify `hugeicons`) | Stroked, **1.5 px** | Not in the free set (all free icons are stroke-rounded, per the Iconify JSON) | 2026-10-28 | Big and current, but thinner. No duotone |
| 7 | Material Symbols | Apache-2.0 | 15,761 | Variable font axes: `wght` 100–700, `FILL` 0–1, `GRAD`, `opsz` 20–48. **SVGs are outlined fills**, not strokes | `FILL` is solid on/off, not duotone | `@material-symbols/svg-400` 0.48.2, 2026-10-27 | Too "Google". No brands. Stroke not editable in SVG |
| 8 | Solar | **CC BY 4.0 (visible attribution required)** | 8,706 | Mixed (1.5 px line) | Has `bold-duotone` and `line-duotone` | Repo files 2023-01; Iconify 2026-09 | Nice duotone, but attribution and 1.5 px strokes |
| 9 | Iconoir | MIT | 1,671 | Stroked, 1.5 px | No | v7.12.1, 2026-08-12 | Missing `sun`, `rss`, `thermometer`, `satellite`, line chart in our list |
| 10 | Remix Icon | **Remix Icon License v1.0 (Jan 2026), no longer Apache** (npm metadata still says Apache-2.0) | 3,188 | Solid line/fill pairs | No | 4.9.1, 2026-01-29 | Custom licence bans using icons as a logo and building competing sets. Avoid |
| 11 | Heroicons | MIT | 1,288 | Stroked 1.5 px | No | 2.2.0, 2024-11-18 | Missing 17 of our 43 needs (no brands, wind, globe, code …) |
| 12 | Pictogrammers MDI | Pictogrammers Free License (icons Apache-2.0) | 7,447 | Outlined fills | No | `@mdi/svg` 7.4.47, 2023-12-27 | Stale. Material look |
| 13 | Meteocons (Bas Milius) | MIT | ~450 (Iconify) | v3 has Fill / **Flat** / Line / Monochrome styles | Flat style has **baked hex fills, no outline** | `@meteocons/svg-static` 0.1.0, 2026-04-12 | Only if a weather-data widget needs dozens of states |
| 14 | Weather Icons (Erik Flowers) | Icons OFL-1.1, code MIT | 219 | Solid | No | 2.0.10, **2015** | Unmaintained |
| 15 | Streamline free (Flex / Plump / …) | **CC BY 4.0, link to streamlinehq.com required** | 1,500 per family | Mixed | Colour family has baked colours | Iconify pkg 2025 | Attribution burden, gaps (Plump lacks home, menu, close …) |
| — | IconPark TwoTone (ByteDance) | Apache-2.0 | 1,944 | Stroked | **Native outline + fill** | **Archived** (last push 2023-02) | Would have been ideal. Don't adopt an archived set |
| — | Fluent Emoji Flat / OpenMoji / Noto | MIT / **CC BY-SA 4.0** / Apache-2.0 | 3–4.5k each | Fluent: no outlines. OpenMoji: black 2/72 outline (≈0.7 px at 24). Noto: 2,013 of 3,819 use gradients | Baked colours | 2026 | Illustration, not icons. Not themeable. OpenMoji is share-alike |

---

## 3. Coverage matrix (needs × top three sets)

Names are verified to exist in each set's Iconify JSON (2026-11-01). For
Phosphor they were also checked against `raw/regular/*.svg` in the GitHub
repo. ✗ means not present.

| Need | Phosphor | Tabler | Lucide | Brand source |
|---|---|---|---|---|
| Home | `house` | `home` | `house` | |
| Writing | `pen-nib` | `pencil`, `ballpen` | `pen`, `pen-line` | |
| Research | `flask`, `graduation-cap`, `book-open-text`, `microscope` | `flask`, `microscope`, `school` | `flask-conical`, `microscope`, `graduation-cap` | |
| Projects | `rocket`, `cube` | `rocket`, `cube` | `rocket`, `folder` | |
| Photography | `camera`, `aperture` | `camera`, `aperture` | `camera`, `aperture` | |
| About / CV | `identification-card`, `read-cv-logo`, `user-circle` | `id`, `user-circle` | `id-card`, `user-circle` | |
| GitHub | `github-logo` (redrawn) | `brand-github` | ✗ (brand policy) | Simple Icons `github` |
| LinkedIn | `linkedin-logo` (redrawn) | `brand-linkedin` | ✗ | **LinkedIn's own [in] asset** (Simple Icons removed it) |
| ORCID | ✗ | ✗ | ✗ | **ORCID official iD icon**. Also Simple Icons `orcid`, Academicons `orcid` |
| Google Scholar | ✗ | ✗ | ✗ | Simple Icons `googlescholar`, Academicons `google-scholar` |
| Email | `envelope-simple`, `at` | `mail` | `mail` | |
| Bluesky | ✗ (`butterfly` is generic) | `brand-bluesky` | ✗ | Simple Icons `bluesky` |
| Mastodon | `mastodon-logo` | `brand-mastodon` | ✗ | Simple Icons `mastodon` |
| X / Twitter | `x-logo` | `brand-x` | ✗ | Simple Icons `x` |
| RSS | `rss` | `rss` | `rss` | |
| Play / pause | `play`, `pause`, `play-pause` | `player-play`, `player-pause` | `play`, `pause` | |
| Reset | `arrow-counter-clockwise` | `refresh`, `rotate` | `rotate-ccw` | |
| Menu / close | `list` / `x` | `menu-2` / `x` | `menu` / `x` | |
| Chevrons | `caret-down`, `caret-right` … | `chevron-down` … | `chevron-down` … | |
| External link | `arrow-square-out` | `external-link` | `external-link` | |
| Download / copy | `download-simple` / `copy` | `download` / `copy` | `download` / `copy` | |
| Theme toggle | `sun`, `moon`, `moon-stars`, `circle-half` | `sun`, `moon`, `sun-moon` | `sun`, `moon`, `sun-moon` | |
| Search / filter | `magnifying-glass` / `funnel` | `search` / `filter` | `search` / `funnel` | |
| Info / warning | `info` / `warning` | `info-circle` / `alert-triangle` | `info` / `triangle-alert` | |
| Cloud / wind | `cloud` / `wind` | `cloud` / `wind` | `cloud` / `wind` | |
| Thermometer | `thermometer` (+`-hot`, `-cold`) | `temperature` | `thermometer` | |
| Globe | `globe-hemisphere-west` | `world` | `globe`, `earth` | |
| **Satellite** | **✗** (no `orbit` either; `planet` exists) | `satellite` | `satellite`, `satellite-dish` | |
| Wave | `wave-sine`, `waves` | `wave-sine` | `waves` | |
| Rain / storm | `cloud-rain` / `cloud-lightning`, `tornado`, `hurricane` | `cloud-rain` / `cloud-storm`, `tornado` | `cloud-rain` / `cloud-lightning`, `tornado` | |
| Chart | `chart-line`, `chart-scatter` | `chart-line` | `chart-line` | |
| Code | `code`, `brackets-curly` | `code` | `code` | |
| Science | `flask`, `atom` | `flask` | `flask-conical` | |
| Camera / map pin | `camera` / `map-pin` | `camera` / `map-pin` | `camera` / `map-pin` | |
| **Score (of 43, excluding brands)** | **42** (missing: satellite) | 43 | 43 | |

**Tech stack** (Simple Icons slugs, all present unless marked): `python`, `fortran`, `julia`,
`pytorch`, `c`, `cplusplus`, `javascript`, `typescript`, `jupyter`, `numpy`,
`scipy`, `pandas`, `latex`, `rust`, `astro`, `vuedotjs`, `arxiv`, `zotero`,
`zenodo`. **Missing: JAX** (use `logos:jax` from gilbarbara/logos, CC0,
multicolour) and **MATLAB** (Devicon has `matlab`).

**Devicon question.** Devicon is alive (v2.18.0, 2026-10-25, MIT) and ships per-icon SVGs
(`icons/<name>/<name>-original.svg` / `-plain.svg`), not just the font.
But its "original" logos are multicolour and its `plain` set is patchy
(no plain `fortran` in Iconify's `devicon-plain`). For a one-colour toon
chip, Simple Icons is the better source. Use Devicon only for MATLAB.

---

## 4. Evidence: rendering the duotone treatment

I rendered contact sheets with `rsvg-convert`, and a themed HTML page with
macOS Quick Look (WebKit). They are in the scratchpad (not committed):

- `/private/tmp/claude-502/-Users-robcking-MiscProjects-OneOneFour-github-io/2116d1d2-bf21-4747-9fd9-43b338d6c007/scratchpad/sheet.png`
  shows 16 icons × 5 treatments × light/dark.
- `/private/tmp/claude-502/-Users-robcking-MiscProjects-OneOneFour-github-io/2116d1d2-bf21-4747-9fd9-43b338d6c007/scratchpad/proto/demo.html.png`
  shows the nav, subject tiles, `<use>` reuse, brand buttons and tech chips,
  all coloured from CSS tokens.
- `/private/tmp/claude-502/-Users-robcking-MiscProjects-OneOneFour-github-io/2116d1d2-bf21-4747-9fd9-43b338d6c007/scratchpad/proto/nss.html.png`
  compares scaling and non-scaling strokes at 16–64 px.

What they show:

1. **Phosphor raw duotone works with no hand edits.** Its fill regions are
   *designed*: the liquid in the flask, the fins of the rocket, the body of
   the cloud. Strokes at 21.33/256 (= 2 px at 24 px) look right next to the
   2 px component outlines. The bold weight (24/256 = 2.25 px) also works and
   is slightly chunkier.
2. **Tabler and Lucide with a naive fill on the stroke paths** look right
   for the house, flask, camera, cloud, thermometer and globe. They **break**
   for the map pin (the inner hole gets filled), the Lucide id-card (the fill
   covers the details), waves and chart (open paths filled as chords) and the
   storm bolt. **About a third of icons would need hand-editing**, so these
   sets are fallbacks, not the base.
3. **Phosphor's npm package is not the same as its GitHub raw files.**
   `@phosphor-icons/core/assets/**` (and Iconify's `ph` set) are *outlined*:
   strokes are expanded to filled shapes, so stroke width is fixed. Only
   `raw/<weight>/*.svg` in the GitHub repo keeps
   `stroke="currentColor" stroke-width="16"`. **Vendor from `raw/duotone/`.**
4. **CSS custom properties pass through `<use>`.** One `<symbol>` was drawn
   four times with four different `--icon-fill` values, and all four rendered
   correctly in WebKit. Inherited properties cross into the `<use>` shadow
   tree, but document selectors don't. So **put the colour hooks inside the
   SVG as `style="fill:var(...)"` and inherited attributes**, not as class
   selectors aimed at inner paths.
5. **Dark mode:** don't feed the flipped *tint* tokens to icon fills. In dark
   mode, sky becomes `#1e3a50`, and the cloud fill nearly vanished on
   `#1a1f2b`. Icons should use the **vivid core hues in both themes**, with
   the outline switching to `fg` (cream) in dark mode. Also, a **navy fill
   inside an ink outline** reads as almost solid in light mode (low
   fill/outline contrast). That's acceptable, but it's a design choice.
6. **`vector-effect: non-scaling-stroke`** keeps the outline at exactly 2 px
   at every size. That suits the 48–64 px card and tile icons, which then
   match the component borders. At 16 px both approaches clog, so small
   inline icons should drop to about 1.5 px.
7. **SVGO keeps the markup intact.** SVGO 4.0.2 `preset-default` (already
   in `node_modules`) keeps `style="fill:var(--icon-fill, none)"` and
   `viewBox`. **Don't enable `convertStyleToAttrs`**: it rewrites the style
   to `fill="var(...)"`, which works in browsers but has no spec backing
   (W3C svgwg issue, July 2025). Also, **never write `--` inside an XML
   comment** in an icon file, because SVGO rejects it as a malformed comment.

---

## 5. Licence and attribution obligations

| Source | Licence | Visible credit on site? | What to do |
|---|---|---|---|
| Phosphor | MIT | No | Keep `src/icons/phosphor/LICENSE` (the MIT notice must travel with "substantial portions") |
| Tabler (gap fillers) | MIT | No | Same, `src/icons/tabler/LICENSE` |
| Lucide (if used) | ISC + MIT (Feather-derived) | No | Keep both notices |
| Simple Icons | CC0-1.0 | No | None for the SVG data. **Trademarks are not covered.** Simple Icons' DISCLAIMER says to check each brand's guidelines |
| gilbarbara/logos (`jax`) | CC0-1.0 | No | Trademarks apply |
| Academicons | OFL-1.1 (font), MIT (CSS) | No | Keep the OFL text with any glyphs you extract. Don't sell them standalone |
| Devicon (`matlab`) | MIT | No | Keep the notice. Trademarks apply |
| Solar, Streamline, Font Awesome Brands, Twemoji | CC BY 4.0 | **Yes** | Avoid. A footer credit is required |
| OpenMoji | CC BY-SA 4.0 | **Yes**, and modified icons must stay BY-SA | Avoid |
| Remix Icon | Remix Icon License v1.0 | Optional | Bans use as a logo or brand identity and building competing sets. Avoid |
| Existing `public/icons/*.svg` | **Unknown provenance** (they look like iconmonstr paths) | Not verified | Replace during the redesign |

### Brand-mark rules (from each brand's own page)

These conflict with "restyle in home colours", so **brand marks are the one
exception**:

- **GitHub** (brand.github.com/foundations/logo): the mark appears only in
  "white, black, or in few cases grey or green". You may not change its
  colour or add "shadows or gradients". It is explicitly allowed "as a social
  button to link to your GitHub profile".
- **LinkedIn** (brand.linkedin.com/in-logo): "only … three color variations:
  blue, black, and white". Don't "modify the color or the shape". Linking to
  your profile is permitted. Their policy also says "logos or images found
  elsewhere on the web are not approved", so **download the [in] asset from
  LinkedIn**.
- **ORCID** (iD display guidelines): "In most circumstances use the green iD
  icon". Black-and-white or reversed white are allowed for contrast. "Do not
  use the ORCID iD icon in any colourway other than those shown". Optimal
  size 24 px, minimum 16 px. **Use ORCID's own asset**, not a recoloured
  Simple Icons path.
- **Mastodon** (joinmastodon.org/branding): use the main logo, or the black
  or white version when contrast requires it.
- **Bluesky, X, Google Scholar**: no colour rules found. Bluesky's press FAQ
  only links a media kit. I did not fetch X's brand toolkit. Simple Icons
  lists no guidelines for Google Scholar. **Not verified.** Treat them the
  same way as the others.

**How this fits the toon look.** Draw the **mark** in plain black or white
(`--brand-mark`: `#000` in light mode, `#fff` in dark mode; or ink/cream if
you accept near-black as "black"). ORCID is the exception: its mark stays
green. Put the **toon treatment** (section-colour fill, 2 px ink border,
hard shadow) on the **button around it**, never on the mark. The demo render
shows this works.

---

## 6. Integration with Astro 7 (build-time inline, zero JS)

| Route | Package (verified) | Inlines at build? | Notes |
|---|---|---|---|
| **A. Astro built-in SVG components** (recommended) | none, it's core. "Added in astro@5.7.0". Optional `experimental.svgOptimizer: svgoOptimizer({...})` (astro@5.16.0+) | Yes: "Astro will inline the SVG content into your HTML output". Props such as `fill`, `stroke`, `width` override the file's values | `import Pen from '~/icons/pen-nib.svg'` then `<Pen class="icon" />`. **Can't be used inside Vue islands** (pass them in as children from `.astro`). No automatic dedupe |
| B. `astro-icon` | `astro-icon` 1.2.0 (2026-08-18, MIT). The changelog says it builds against Astro 7 and needs Node ≥22.12. Iconify sets via `@iconify-json/<prefix>` (e.g. `@iconify-json/simple-icons` 1.2.101) | Yes, `<Icon name="simple-icons:github" />`. Local icons from `src/icons/`, optimised with SVGO. Repeated icons become `<symbol>` + `<use>` | Its local loader runs `@iconify/tools` `cleanupSVG` and `parseColors`, which can rewrite colours. **Not tested whether it keeps `style="fill:var(...)"`**. Open issues: #275 (stroke-width prop doesn't reach inner `<g>`), #319 (astro not declared as a peer dependency) |
| C. `unplugin-icons` | `unplugin-icons` 24.0.0 (2026-09-11, MIT), `compiler: 'astro'`, `FileSystemIconLoader` for local folders | Yes (Vite plugin, imports like `~icons/ph/house-duotone`) | More machinery than this site needs |

**Recommendation.** Use route A for everything. **Vendor** the about 45
Phosphor raw duotone SVGs, about 12 brand/tech SVGs and the custom ones into
`src/icons/`, each folder with its licence file. That means no icon
dependencies and no upstream risk, and it's exactly what Astro inlines. Move
to `astro-icon` later only if the page weight from repeated inline SVGs ever
matters.

---

## 7. Themeable duotone markup + CSS

This is Phosphor `pen-nib-duotone` (MIT) after a one-off conversion. The
fill layer gets `style="fill:var(--icon-fill, none)"`, the per-element
stroke attributes are lifted onto the root, and the stroke width becomes a
variable. It is verified to render in WebKit and to survive SVGO
`preset-default`.

```svg
<!-- src/icons/writing.svg (from phosphor-icons/core raw/duotone/pen-nib-duotone.svg, MIT) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
     fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
     style="stroke-width:var(--icon-stroke, 21.33)" aria-hidden="true">
  <path stroke="none" style="fill:var(--icon-fill, none)"
        d="M128,48,68.32,70.38a8,8,0,0,0-5.08,6.17L40,216l139.45-23.24a8,8,0,0,0,6.17-5.08L208,128Zm-4,104a20,20,0,1,1,20-20A20,20,0,0,1,124,152Z"/>
  <line x1="40.01" y1="216" x2="109.86" y2="146.14"/>
  <circle cx="124" cy="132" r="20"/>
  <path d="M40,216l139.45-23.24a8,8,0,0,0,6.17-5.08L208,128,128,48,68.32,70.38a8,8,0,0,0-5.08,6.17Z"/>
  <path d="M208,128l29.66-29.66a8,8,0,0,0,0-11.31L169,18.34a8,8,0,0,0-11.31,0L128,48"/>
</svg>
```

```css
/* src/styles/icons.css. Uses the tokens from PLAN §5.1/5.1b */
:root {
  /* icon fills always use the VIVID hues, even in dark mode (see §4, finding 5) */
  --icon-home: var(--sky-vivid, #8fd3f7);
  --icon-writing: var(--coral);    /* #de4d45 → #e8625a dark */
  --icon-research: var(--navy);    /* #2c4d6e → #4a78ad dark */
  --icon-projects: var(--teal);
  --icon-photos: var(--yellow);
  --icon-about: var(--green);
  --brand-mark: #000;
}
:root[data-theme="dark"] { --brand-mark: #fff; }

.icon {
  inline-size: 1.5rem; block-size: 1.5rem; flex: none;
  color: var(--fg);                 /* outline = ink (light) / cream (dark) */
  --icon-stroke: 21.33;             /* 2px at 24px on Phosphor's 256 grid */
}
.icon--sm   { inline-size: 1rem; block-size: 1rem; --icon-stroke: 24; } /* ≈1.5px at 16px */
.icon--tile { inline-size: 3rem; block-size: 3rem; --icon-stroke: 10.67; } /* 2px at 48px */

/* the section colour flows in through the inherited custom property */
.nav-link[data-section="writing"]  { --icon-fill: var(--icon-writing); }
.nav-link[data-section="research"] { --icon-fill: var(--icon-research); }
/* ...one line per section; chips and cards reuse the same hook */
.nav-link[aria-current="page"] .icon { --icon-stroke: 24; } /* chunkier when active */

/* brand marks: one flat colour, toon chrome on the container only */
.social { border: 2px solid var(--line); border-radius: 10px;
          box-shadow: 4px 4px 0 var(--line); background: var(--icon-fill, var(--raised)); }
.social svg { fill: var(--brand-mark); }
```

```astro
---
import Writing from '../icons/writing.svg';
---
<a class="nav-link" data-section="writing" href="/writing/">
  <Writing class="icon" /> Writing
</a>
```

The conversion is about 20 lines of Node (strip
`<rect width="256" height="256" fill="none"/>`, replace `opacity="0.2"` with
`stroke="none" style="fill:var(--icon-fill, none)"`, remove the repeated
stroke attributes, add the root attributes). Run it once over
`raw/duotone/*.svg` and commit the output. A working Python version of the
same transform is in the scratchpad (`scripts/demo.py`, function `phsvg`).

---

## 8. The custom-drawing route, honestly

**What actually needs drawing.** With the hybrid plan, only **2–5 icons**:

| Icon | Why | Effort (non-designer) |
|---|---|---|
| Satellite | Phosphor has none | **Adapt**, ~30 min: scale Tabler's `satellite` (24 grid → ×10.67), add a closed fill shape underneath |
| "Gravity wave" signature (a mountain with a wave train or streamlines over it) | The research identity. No set has it | **Draw**, 1–3 h with iterations |
| Climate model / atmosphere column (optional) | `globe-hemisphere-west` or `cube` + `wave-sine` may be enough | 1–2 h |
| Monogram / favicon (optional) | Identity. Note Remix's licence bans exactly this use for *its* icons; Phosphor's MIT doesn't | 1–3 h |
| Interactive-demo badge (optional) | Phosphor's `cursor-click` or `hand-pointing` probably suffices | 0–1 h |

**Drawing the full set of ~45 yourself** would realistically take a
non-designer **40–100+ hours**. Keeping 45 icons consistent in optical
weight, corner treatment and fill placement is the hard part. It buys no
coverage the sets lack, so it isn't worth it.

**Workflow for the few custom icons (matches Phosphor so they sit together):**

1. **Grid.** 256×256 artboard. In the raw sources the outer shapes sit
   roughly in 24–232 (e.g. `house` spans x 40–216 before stroke). Keep a
   ~32-unit margin and align to whole or half units.
2. **Stroke.** Draw *centre-line strokes* (don't outline them). Width 16
   while drawing, which matches Phosphor regular; the CSS variable sets the
   real width. Round caps and joins. Corner radius ~8 units on rectangles,
   like Phosphor's `a8,8` arcs.
3. **Layers.** One closed `<path>` for the fill region, drawn *under* the
   strokes (Phosphor's convention). Leave it unfilled in the source; the
   conversion script adds the `var(--icon-fill)` hook.
4. **Tools.** Figma (free tier) or Inkscape (free). Phosphor publishes a
   Figma file and Tabler has an SVG editor in its site. **Not verified**
   whether either template is free to download, so start from a copied raw
   SVG instead.
5. **Export.** Plain SVG, no `<style>` blocks, no transforms, no ids. Run
   the same conversion script, then SVGO `preset-default` (tested to keep
   `viewBox` and the `style` hook).
6. **Check.** Render on the `/styleguide/` page next to Phosphor icons at
   16, 24 and 48 px, in both themes.

---

## 9. Recommendation

1. **Base set:** Phosphor duotone, vendored from GitHub `raw/duotone/`,
   converted once to the `currentColor` + `--icon-fill` + `--icon-stroke`
   template above. It covers 42 of 43 non-brand needs.
2. **Brands:** Simple Icons (CC0) for GitHub, Bluesky, Mastodon, X, Google
   Scholar and RSS, drawn in one flat black or white colour inside toon
   buttons. Use **LinkedIn's** and **ORCID's** official assets in their
   permitted colours (ORCID green). Tech chips from Simple Icons, plus
   `logos:jax`, plus Devicon `matlab` if needed.
3. **Custom:** satellite (adapted from Tabler) and a gravity-wave signature
   icon. Optionally a climate-model icon and a monogram.
4. **Integration:** Astro built-in SVG components, licence files next to the
   vendored icons, a `/styleguide/` icon grid as the acceptance surface.
   Keep Tabler (MIT) as the documented fallback for future gaps: it shares
   the round-cap 2 px geometry.
5. **Decide in WP-2:** stroke 2 px (21.33) or Phosphor bold (24) as the
   default, and whether ≥48 px tiles use `vector-effect: non-scaling-stroke`.

---

## Sources

Fetched 2026-11-01 unless stated.

**Icon sets: repos, licences, metadata**
- Phosphor core repo, LICENSE (MIT), `raw/` stroked sources: https://github.com/phosphor-icons/core ·
  raw sample https://raw.githubusercontent.com/phosphor-icons/core/main/raw/duotone/pen-nib-duotone.svg ·
  npm outlined asset https://unpkg.com/@phosphor-icons/core@2.1.1/assets/duotone/pen-nib-duotone.svg ·
  site https://phosphoricons.com · homepage repo https://github.com/phosphor-icons/homepage
- Tabler Icons: https://github.com/tabler/tabler-icons · https://tabler.io/icons
- Lucide LICENSE: https://github.com/lucide-icons/lucide/blob/main/LICENSE ·
  brand policy https://github.com/lucide-icons/lucide/blob/main/BRAND_LOGOS_STATEMENT.md
- Iconoir: https://github.com/iconoir-icons/iconoir
- Remix Icon licence v1.0: https://github.com/Remix-Design/RemixIcon/blob/master/License
- Heroicons: https://github.com/tailwindlabs/heroicons
- Material Symbols: https://developers.google.com/fonts/docs/material_symbols · https://github.com/google/material-design-icons · https://github.com/marella/material-symbols
- Pictogrammers MDI licence: https://github.com/Templarian/MaterialDesign/blob/master/LICENSE
- Meteocons: https://github.com/basmilius/meteocons · sample https://cdn.jsdelivr.net/npm/@meteocons/svg-static@0.1.0/flat/thunderstorms.svg
- Weather Icons: https://github.com/erikflowers/weather-icons
- Simple Icons: https://github.com/simple-icons/simple-icons · DISCLAIMER https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md ·
  data https://github.com/simple-icons/simple-icons/blob/develop/data/simple-icons.json ·
  LinkedIn removal https://github.com/simple-icons/simple-icons/issues/11372 · re-add refused https://github.com/simple-icons/simple-icons/issues/12440, https://github.com/simple-icons/simple-icons/issues/12762
- Academicons: https://github.com/jpswalsh/academicons
- Devicon: https://github.com/devicons/devicon
- SVG Logos (gilbarbara): https://github.com/gilbarbara/logos
- Hugeicons: https://www.npmjs.com/package/@hugeicons/core-free-icons · https://github.com/hugeicons/hugeicons-react (archived)
- Solar: https://github.com/480-Design/Solar-Icon-Set
- Streamline free vectors (CC BY 4.0 + link requirement): https://github.com/webalys-hq/streamline-vectors
- IconPark (archived): https://github.com/bytedance/IconPark
- Fluent Emoji: https://github.com/microsoft/fluentui-emoji · OpenMoji: https://github.com/hfg-gmuend/openmoji · Noto Emoji: https://github.com/googlefonts/noto-emoji
- Iconify collections metadata and per-set JSON (icon counts, names, SVG bodies): https://github.com/iconify/icon-sets (`collections.json`, `json/<prefix>.json`) · https://icon-sets.iconify.design/
- npm registry metadata (versions, dates, licence fields): https://registry.npmjs.org/<package> for every package named above

**Brand guidelines**
- GitHub: https://brand.github.com/foundations/logo (redirected from https://github.com/logos)
- LinkedIn: https://brand.linkedin.com/in-logo · https://brand.linkedin.com/policies
- ORCID: https://info.orcid.org/brand-guidelines/ · https://info.orcid.org/documentation/integration-guide/orcid-id-display-guidelines/ · assets https://orcid.figshare.com/articles/figure/ORCID_iD_icon_graphics/5008697
- Mastodon: https://joinmastodon.org/branding
- Bluesky: https://bsky.social/about/blog/press-faq
- X: https://about.x.com/en/who-we-are/brand-toolkit (listed in Simple Icons data, **not fetched**)

**Astro / tooling**
- Astro SVG components: https://docs.astro.build/en/guides/images/#svg-components
- Astro `experimental.svgOptimizer`: https://docs.astro.build/en/reference/experimental-flags/svg-optimization/
- astro-icon README, CHANGELOG, local loader source, issues: https://github.com/natemoo-re/astro-icon ·
  https://github.com/natemoo-re/astro-icon/blob/main/packages/core/src/loaders/loadLocalCollection.ts ·
  https://github.com/natemoo-re/astro-icon/issues/275 · https://github.com/natemoo-re/astro-icon/pull/319
- unplugin-icons: https://github.com/unplugin/unplugin-icons
- CSS variables in SVG presentation attributes (spec gap): https://lists.w3.org/Archives/Public/public-svg-issues/2025Jul/0008.html · https://fvsch.com/svg-css-vars
