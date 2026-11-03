# robertcking.com redesign: implementation plan

Status: **APPROVED with amendments, 2026-11-01; revised after two plan reviews.** This file says
**how the build is run**: branches, agents, phases, review gates, file locations, and what Rob
supplies when. It is the single source for order and location. **What** is built is in
[`PLAN.md`](./PLAN.md). The palette and icon reference is [`moodboard.html`](./moodboard.html);
open it locally (it fetches Google Fonts, so needs network). Icon research is in
[`research/icons.md`](./research/icons.md).

---

## 1. Ground rules (decided by Rob, 2026-11-01)

| Decision | Consequence |
|---|---|
| Prototype lives on a **separate branch, local only** (reaffirmed after review) | All work happens on branch `redesign` (based on `experimental`, so it includes the Phase 2 code). `main` and the live site stay untouched until a single **switchover** merge that Rob triggers. Preview with `npm run dev` locally. Accepted risk: nothing builds on Linux, where file names are case-sensitive, until switchover. Mitigation: the naming rules in §2, `core.ignorecase false`, and a Linux build of the committed tree before switchover (§5). |
| **Rob pushes to GitHub** | Agents commit locally and never push. (Rob allowed one push of `redesign` on 2026-11-01 as a backup; that doesn't carry over.) |
| **Rob writes all content**, including photography as it comes in | Agents never write site copy, posts, captions or publication summaries, and never source photos. Styleguide specimen text is fine. |
| **Rob commits his own content** | Before saying "go" at a gate, Rob commits his content with a `content:` prefix. Worktrees only see committed files, and coordinators must never sweep up Rob's half-written files (§3.2). |
| **Placeholder entries allowed, dev-only** | So layouts can be built and reviewed before Rob's content exists, agents may add obviously fake entries (lorem ipsum, named `_fixture-*`, always `draft: true`). Drafts render in `npm run dev` only and are never in `npm run build` (PLAN §6). |
| **Licence** | Code, including the design package, is **MIT**. Content (posts, photos, page text) is **CC BY-NC 4.0, except where credited otherwise** (e.g. journal figures). `THIRD_PARTY_NOTICES.md` lists Phosphor and Tabler (MIT), Simple Icons (CC0), Xmind (OFL), Roboto Slab (Apache-2.0), and a trademark note for brand marks. |
| **Permissions enforced, not just written down** | The committed `.claude/settings.json` (created in P0) **denies `git push`** and **asks before `npm install`** (approved by Rob 2026-11-01). Rob can still push from his own terminal. |
| **Human in the loop** | Rob reviews the code as well as the look. Agents make small, focused commits with plain commit messages, so each merge is easy to read in a diff. |
| **Review at every phase** | Each phase ends at a gate (§5). Rob looks at the pages locally and reads the diff, and approves before the next phase starts. |
| **Minimal testing** | No test suite and no screenshot pipeline for the site. Playwright is used **only** for the interactive widget library (P3 writing track), with a handful of smoke tests. `npm run build` passing is the bar for everything else. |
| **Reusable design language** | Rob's other sites are a mix (plain HTML, ES modules with esbuild, Parcel, Vue CLI), all served from this domain. The design package needs no build step and is copied into each site's `vendor/` (PLAN §5.6). No Vue wrappers for now. |

Every commit on `redesign` must pass `npm run build`.

---

## 2. Code style (applies to every agent and every commit)

These go into the repo's `CLAUDE.md` and the `astro-builder` agent, word for word.

- **Readable by a human first.** Clear names, small functions and files, obvious structure. If a
  reviewer has to ask what something does, rename or restructure it before adding a comment.
- **Don't reinvent the wheel.** Use the platform (native `<input type="range">`, `<dialog>`, CSS
  grid, custom properties) and Astro's built-ins (content collections, `astro:assets`, SVG imports)
  before writing anything custom. Add a dependency only when it removes real code. Say why in the
  commit message.
- **Comment where it helps.** Add a comment when code is unclear, when behaviour is slightly
  surprising, or when a reasonably competent JS developer wouldn't understand it at a glance.
  Short, basic docstrings on exported functions and components (what it does, its parameters)
  are welcome.
- **No design notes in the code.** No long blocks of reasoning at the top of files or inside
  docstrings, no history ("ported from…", "previously…"), and no variables or constants (such as
  `NOTE`) that hold thoughts or decisions. Decisions go in the plan docs or commit messages.
- **No dead code or speculative options.** Build what the current task needs.
- **Consistent with what's there.** Match the existing formatting and naming. Never hard-code a colour
  outside the token files.
- **Naming:**
  - content folders and new assets are lowercase-kebab;
  - components and layouts are PascalCase (Astro convention);
  - existing `public/` files keep their names (they have public URLs);
  - renames always use `git mv`, and import paths match file names exactly, including case.
- **Content access:** pages get content only through the content helper (`src/lib/content.ts`),
  never by calling `getCollection`/`getEntry` directly (PLAN §6, draft rule).
- **Self-review before handing back.** Each agent re-reads its own diff against this list and
  removes comments and code that don't earn their place. Rob reviews again at the gate.

The existing Phase 2 code on `experimental` predates these rules and has long explanatory comments
(e.g. in `astro.config.mjs` and `ProjectItem.astro`). P0 trims them.

---

## 3. Execution model

```
Coordinator session (one per phase; reads this file)
   │  starts builders, in parallel where §4 allows, each in its own git worktree
   ├─► astro-builder  (task a) ──► branch worktree-<name> ──┐
   ├─► astro-builder  (task b) ──► branch worktree-<name> ──┤ coordinator merges into `redesign`,
   └─► general-purpose (scripts, data) ─────────────────────┘ runs `npm run build`
   ▼
reviewer agent: reads the diff and rendered pages against PLAN §5 and §2 above (read-only)
   ▼
GATE: Rob runs `npm run dev`, reads the diff → approve / request changes
```

- **Plain coordinator sessions for P0–P2.** Start a fresh conversation per phase: "Run phase P<n>
  of `docs/redesign/IMPLEMENTATION.md`". The coordinator starts the agents, merges their worktree
  branches into `redesign`, runs the build, gets the review, and presents the gate.
- **P3 may use the Workflow tool.** After the P3.0 scaffold, its tracks touch separate files, so a
  workflow per track is a reasonable fit. Workflows can't pause for user input, so a workflow
  never spans a gate.
- **Parallelism is limited where the code overlaps.** P1/P2 touch the same files (tokens, layouts),
  so builders run in at most 2 lanes.

### 3.1 Custom agents *(authored in P0)*

| Agent | Role |
|---|---|
| `astro-builder` | Implements one task in its own worktree (`isolation: worktree`). Carries the §2 code-style rules, the token rules (PLAN §5), "both themes" and "no invented copy". Must end with `npm run build` passing and a self-review of its diff. |
| `reviewer` | Read-only. Checks a phase's diff and the rendered pages against PLAN §5 (contrast rules, dark mode, toon treatment, responsive layout) and §2 (readability, comment discipline, reuse of built-ins, naming, content helper use, which one grep checks). Returns a short pass/fail list with file:line references. It may use Claude in Chrome on the local dev server to look at pages, if Rob has it connected. It doesn't need to. |

A `content-migrator` agent isn't worth it: legacy projects are a Rob-led review (P3 projects track).

### 3.2 Worktree and merge rules

- Worktrees branch from the default branch unless told otherwise, and that would miss the redesign.
  P0 sets `worktree.baseRef: "head"` in project `.claude/settings.json`, and coordinators always run
  from a checkout of `redesign`.
- Each worktree needs `npm ci`. Dev servers take an explicit `--port` to avoid collisions.
- `.gitignore` gains `.claude/worktrees/` and `.claude/settings.local.json`.
- **Before every merge**, the coordinator checks that `git status --porcelain` is empty in the main
  checkout. If it isn't (usually Rob's uncommitted content), it stops and asks Rob to commit.
  It never uses `git add -A` or `git commit -a` in the main checkout.
- The coordinator merges each worktree branch into `redesign` with `--no-ff`, resolves conflicts,
  rebuilds, then deletes the worktree branch.

### 3.3 `CLAUDE.md` for the repo *(P0)*

Short, and the first thing every agent reads. It covers:
- the commands (`dev`, `build`);
- the "no `base` path" warning;
- the §2 code-style rules, including naming and the content helper;
- "never hard-code a colour";
- "never write content";
- "never push" (also enforced in settings);
- never rename a content folder (its name is a public URL);
- files in `public/` that already have a URL are never moved or deleted without Rob's OK;
- reserved top-level paths, shared with Rob's other Pages sites (PLAN §3);
- every committed image goes through the strip-and-resize script; no image over 2 MB;
- the design-package boundary (PLAN §5.6);
- where the plan lives.

---

## 4. Phases and tasks

Legend: **[B]** astro-builder · **[G]** general-purpose · **[RV]** reviewer · "‖" = parallel with the line above.

### P0 Setup *(coordinator alone, about 1 session)*
1. Branch `redesign` from `experimental`; commit `docs/redesign/`. **(done 2026-11-01)**
2. [G] `CLAUDE.md`, `.gitignore` additions, and a committed `.claude/settings.json` with
   `worktree.baseRef: "head"`, deny `Bash(git push*)` and ask on `Bash(npm install*)`. Then
   remove the matching allow rules from Rob's untracked `.claude/settings.local.json`, after showing
   him the change.
3. [G] Housekeeping:
   - run `git config core.ignorecase false` (so case-only renames are recorded);
   - run `git remote set-head origin -a`, because local `origin/HEAD` still points at the old
     `master`;
   - remove the stale empty `.claude/worktrees/astro-phase0`;
   - add `LICENSE` (MIT), `CONTENT-LICENSE.md` (CC BY-NC 4.0, except where credited otherwise)
     and `THIRD_PARTY_NOTICES.md`.
4. [G] `.claude/agents/astro-builder.md` and `reviewer.md`.
5. [G] Projects: add `draft: boolean` to the schema and mark the 4 migrated projects `draft: true`.
   Add the content helper `src/lib/content.ts` (`getPublished`, `resolvePublished`), which applies
   the draft rule (PLAN §6), and switch the existing pages to it.
6. [G] Trim the over-long comments in the existing Phase 2 code to the §2 standard.

**Gate 0:** Rob reads `CLAUDE.md` and the two agent files, and approves. **Rob also picks the
design package name and the class/element prefix** (PLAN §5.6). P1 writes the first prefixed
names, so this has to be settled first.

### P1 Foundation: design package
The design package lives in `packages/rk-ui/`, with the `rk-` prefix (decided at Gate 0). Everything below goes there,
except the `/styleguide/` page and brand marks, which are site code.

Lane A:
1. [B] Tokens file: every colour in PLAN §5.1/§5.1a/§5.1b as semantic tokens in both themes, the
   `--section`/`--on-section` hooks, spacing, radii and shadows.
2. [B] Fonts: download Roboto Slab and Xmind woff2 once into the package's `fonts/` folder (Xmind
   isn't on Fontsource), with each licence file. Write the `@font-face` rules with latin/greek
   `unicode-range`. Add the type scale, and two monospace candidates with Greek, side by side for
   Rob to choose.
3. [G] `scripts/check-contrast.mjs`, a small script with no framework. It reads the tokens file
   (both themes) and checks a list of pairs given by **token name**, so no hex values are
   duplicated. Run it by hand with `npm run contrast`; it isn't part of CI.
4. [B] Specimen page: tokens, type scale, fonts and mono candidates, both themes, plus
   **proposed** `-deep`/`-tint` values for the hues PLAN doesn't give (teal, green, yellow,
   sky) for Rob to pick. Then stop for Gate 1a.
5. [B] Theme: `theme-init.js` as a tiny classic script, inlined in `<head>` (in Astro via a `?raw`
   import), plus the theme-toggle custom element (Light / Dark / System). Follow the theme contract
   in PLAN §5.6: a `data-theme` attribute and a namespaced storage key.

Lane B ‖:
6. [G] Icons:
   - A small `vendor-icons` script copies the listed Phosphor duotone icons from GitHub and makes
     them recolourable (outline = `currentColor`, fill = `var(--icon-fill)`).
   - It runs them through SVGO, writes them to the package's `icons/` folder along with Phosphor's
     licence, and builds `icons/sprite.svg` for the vanilla sites.
   - The satellite comes from Tabler.
   - Brand logos (Simple Icons, plus LinkedIn's and ORCID's official files) go in the **site**, in
     `src/icons/brands/`, not in the package.

**Gate 1a:** small diff. Rob decides the type scale, the monospace font and the hue variants.
Nothing is built on top of the tokens until this passes.

Then (needs Gate 1a and step 6):
7. [B] Component CSS (button, chip, card, switch, range slider, callout, widget frame, …), with the
   chosen prefix, and thin `.astro` wrappers in the site.
8. [B] `/styleguide/` page showing every token, type size, icon and component, in both themes.
9. [RV] Review.

**Gate 1b:** Rob compares `/styleguide/` against the mood board in both themes and reads the diff.

### P2 New shell **Needs Rob's content pack C1 (§6) before pages can be finished**
1. [B] `BaseLayout`:
   - sticky left bar: photo, name, role, nav with section icons, socials, theme toggle;
   - top bar plus menu panel below about 800px wide;
   - breakout main grid (PLAN §4).

   The nav shows only sections that exist.
2. [B] `profile` and `pages` collections, per PLAN §6b, as single-file globs:
   - `src/content/site/profile.md` for the profile, `home.md` and others for pages, plus the photo;
   - bio, photo, role, email, CV and social links are edited there, never in components;
   - a `_fixture` profile lets the layout be built before C1 arrives. The real profile wins, and
     a production build with no real profile fails.
3. [B] Pages:
   - Home;
   - About;
   - Projects index, with an empty state until a project is approved, plus `/projects/[slug]/`;
   - an explicit redirect map for all 10 legacy project slugs (PLAN §3);
   - `trailingSlash: 'always'` in `astro.config.mjs`.
4. [B] Remove the legacy layout styles from `global.css`.
5. [RV] Review.

**Gate 2:** Rob approves the shell with his real text. **Switchover decision:** Rob may merge
`redesign` → `main` and push (the new look goes live), or wait for P3.

### P3 Tracks *(after Gate 2; each track has its own gate)*

**P3.0 Scaffold (one serial commit, before any track starts).** The tracks share
`src/content.config.ts`, `astro.config.mjs`, the BaseLayout nav and `package-lock.json`, so set all
the shared pieces up first:
- every collection schema (posts, publications, photos), draft-aware, read through the content
  helper;
- the `markdown.processor` switch to `unified()` with remark-math/rehype-katex (PLAN §5.2);
- hidden nav entries;
- every new dependency.

Photos are stored in R2 (§8), so the album schema holds image keys, dimensions and alt text, not image files.

After that, run **at most two tracks at a time**. Rob's review is the bottleneck anyway.

| Track | Tasks | Needs from Rob | Gate |
|---|---|---|---|
| **Writing** | [B] `posts` collection, PostLayout (header band, breakout grid, sidenotes, end matter), MDX, KaTeX with a shared macros file, the equation-reference plugin (PLAN §5.2), Shiki themed from tokens, RSS (summary-only). ‖ [B] **Interactive widget library** in the package's `widgets/` folder: vanilla custom elements (widget frame, slider with readout, start/pause/reset controls), and the Lorenz widget built on them, with reduced motion and a static fallback. Each widget loads its simulation with `import()` from a **relative path** (e.g. `` import(`../sims/${name}.js`) ``) so Vite bundles it. A path read from an attribute wouldn't be bundled. **This is the only place Playwright is used:** a few smoke tests per widget (renders, controls change state, works with reduced motion). | **C2**: first post | Post renders in both themes; widget works; smoke tests pass |
| **Research** | [G] `publications` schema (file name = ID, `figureCredit`) + `npm run pubs:new -- <doi or file.bib>` starter. [B] `/research/` with chips and backlinks | **C3**: Rob writes the publication files | Page lists Rob's entries; a post with `publication:` shows the link on both pages |
| **Photography** (storage: R2, §8) | [G] One image script, `npm run img:add`, using `sharp`. It resizes, strips **all** EXIF, and writes or uploads (depending on §8). It's used for **every** committed image (albums, post heroes, figures, profile photo). **Originals are never committed.** [B] `photos` collection, album grid, lightbox on native `<dialog>` | **C4**: photos, as they come in | Images optimised; no EXIF in the repo; lightbox works by keyboard |
| **Projects review** | Rob-led conversation, one project at a time. Each keep/drop decision also updates the redirect map (PLAN §3) | Rob's decision per project | Only approved projects are non-draft; every legacy slug redirects |

### P4 Switchover and cleanup
- Merge `redesign` → `main` if not done at Gate 2. Rob pushes and confirms the Pages deploy, and
  turns on HTTPS enforcement.
- [G] GitHub archive view (optional).
- [G] Branch cleanup, **with Rob confirming each deletion**: `astro`, `v3`, `old`, `page-src`,
  `master`, draft PR #1, and `experimental` once merged.

---

## 5. Gate checklist (every gate)

Before the gate, Rob's content is committed and the main checkout is clean (§3.2).

The coordinator presents:
1. What was built, with the merge commits on `redesign`, so Rob can read
   `git log -p` or `git diff <before>..redesign`.
2. Confirmation that `npm run build` passes locally, and the reviewer's pass/fail list.
   **Before switchover only** (Gate 2 if Rob switches then, otherwise P4), also build the
   committed tree on Linux, where file names are case-sensitive:
   `git archive HEAD | docker run -i --rm node:22 sh -c 'mkdir /s && cd /s && tar x && npm ci && npm run build'`.
   (A bind mount wouldn't catch case errors, because it inherits the Mac's case-insensitivity.)
3. Which local pages to open (`npm run dev`) and what to look for.
4. Deviations from PLAN.md, and decisions Rob needs to make.
5. Rob replies **approve** or lists changes. Changes go back to the builders. The next phase doesn't
   start without approval.
6. **Handoff (last step of every gate):** tag the approved commit `gate-<n>` (local tag), and add an
   entry to §7 Status with the commit range, the decisions made and any open items. The next
   session starts by reading §7 and running `git diff gate-<n>..redesign`.

---

## 6. Content requests (what Rob supplies, and when)

| Pack | Needed by | Contents |
|---|---|---|
| **C1** | P2 | Rob writes these straight into `src/content/site/profile.md` and `home.md` (PLAN §6b): one-line role for the left bar; short home intro; About bio; photo (`mugshota.png` or a new one); social links to show (GitHub, LinkedIn URL, ORCID `0009-0006-1944-7787`, Scholar URL, any of Bluesky/Mastodon/X); email to display; CV PDF |
| **C2** | P3 writing | First post: text, title, date, and what the interactive should show |
| **C3** | P3 research | Publication files (Rob writes them; `pubs:new` can prefill from a DOI or BibTeX) |
| **C4** | P3 photography | Photos as they come in, album groupings, any captions |

---

## 7. Status

- 2026-11-01: plan approved with amendments (minimal testing, code-style rules, vanilla-JS reuse).
  P0 step 1 done; `redesign` pushed once to GitHub as a backup, with Rob's permission.
- 2026-11-01: an Opus plan review found 15 issues. All 15 were addressed:
  - Astro 7 corrections: fonts, KaTeX processor, widget lazy-loading, redirects.
  - Content rules: URL policy, links stored on the post side, profile/pages collections, the
    draft rule with placeholders, photo ingest.
  - Licences and enforced permissions.
  - Gate 1 split into 1a/1b; a P3 scaffold step; gate handoff tags.

  Rob kept the redesign local-only.
- 2026-11-01: a second review checked those fixes and found 2 regressions and 9 new issues. All
  were addressed:
  - The profile loader (`file()` can't read Markdown).
  - Stale PLAN sections (roadmap and work packages removed; this file is now the single source).
  - Same-origin discovery: Rob's other Pages sites live at `/<Repo>/`, so the design package is
    copied into each site's `vendor/` with no CDN, top-level paths are reserved, storage keys are
    namespaced, `theme-init.js` is inlined, and icons ship as a sprite.
  - The content helper for drafts.
  - Rob commits content before gates, with a clean-tree check before merges.
  - Scoped naming rules, `core.ignorecase false` and a Linux build at gates.
  - Licence corrections: Roboto Slab is Apache-2.0, brand marks stay in the site, and the content
    licence has a credit carve-out.
  - Publications use the file name as ID.
- 2026-11-01: Rob activated R2 on his Cloudflare account, so **photo storage is option B**. Equation
  references are decided: a small plugin before KaTeX, prototyped successfully (PLAN §5.2).
- 2026-11-01: **Gate 0 approved** (tag `gate-0`). P0 commits `8d85c24..gate-0`:
  - `CLAUDE.md`, committed `.claude/settings.json` (deny `git push*`, ask on `npm install*`,
    `worktree.baseRef: "head"`), `.gitignore` additions; the matching allow rules were removed
    from Rob's `settings.local.json`.
  - Housekeeping: `core.ignorecase false`, `origin/HEAD` → `main`, stale worktree removed.
  - `LICENSE`, `CONTENT-LICENSE.md`, `THIRD_PARTY_NOTICES.md`.
  - `astro-builder` and `reviewer` agents.
  - `draft` field (default `false`) and `src/lib/content.ts`; the 4 migrated projects are drafts,
    so `npm run build` has no project pages until the projects review.
  - Phase 2 comments trimmed.

  Decisions: package **`rk-ui`**, prefix **`rk-`**. The Linux build check runs before switchover
  only, not at every gate.

  Known issue left for P2: project page titles contain a literal `---` (`[slug].astro`).
- 2026-11-01: **Gate 1a approved** (tag `gate-1a`). P1 commits `gate-0..gate-1a`, steps 1–4 and 6:
  - `packages/rk-ui/`: `tokens.css` (`light-dark()` colours with a light-only fallback,
    `--section` hooks, spacing, radii, shadows, focus, motion), `fonts.css` + `fonts/`
    (Xmind, Roboto Slab, JetBrains Mono; latin, greek and maths-symbol subsets), `type.css`,
    and `icons/` (35 Phosphor duotone + Tabler satellite, `sprite.svg`, licences).
  - `scripts/check-contrast.mjs` (`npm run contrast`, also checks the fallback) and
    `scripts/vendor-icons.mjs` (`npm run vendor-icons`).
  - `/styleguide/` specimen; the site imports the package via a `tsconfig.json` alias (`rk-ui/*`).
  - Brand marks in `src/icons/brands/` (Simple Icons + ORCID's orcid.org file).
  - `package-lock.json` regenerated by Rob (Node 26, npm 11); `npm ci` works again.

  Decisions (details in PLAN §5.1–§5.4): current value for every `-deep`/`-tint`; added
  `--coral-solid`; type ratio 1.3; JetBrains Mono with ligatures; focus is a 6px tangerine
  highlighter band (`--focus-alt` yellow), shadow off while focused; hover-lift / press-sink
  "pop" for every clickable component; unfilled buttons discouraged and press inward; chart
  order; radio and textarea join the step 7 primitives; projects index layout open for P2.
- 2026-11-02: Rob decided to consolidate all library code (Astro wrappers, styleguide, an optional
  Astro integration). *Superseded the same day:* the library moves to **its own repo,
  `~/MiscProjects/rk-ui`**, and this site installs it as a package (below).
- 2026-11-02: **Gate 1b work done; Rob to approve.** P1 commits `gate-1a..redesign` (300), steps
  5 and 7–8. Step 9, the review, ran at close-down; its findings are in rk-ui `docs/HANDOFF.md`
  §8.
  - Everything built, and its state, is summarised in rk-ui `docs/HANDOFF.md`. The design
    decisions are in PLAN §5 (5.1–5.7), distilled in rk-ui `docs/DESIGN.md`.
  - Still-open design choices (23) are PLAN §5.8, each marked "Open" on `/styleguide/`. They don't
    block Gate 1b: they move to rk-ui phase L3.
  - The styleguide was reorganised into a library-style reference (38 sections, 8 groups).
    `npm run contrast` now resolves `color-mix()` and passes, with three shortfalls Rob accepted.
  - No browser was used. Rob's checks by eye are listed in the HANDOFF; the unverified items go to
    rk-ui's Playwright lane.
- 2026-11-02: **rk-ui spin-out.** `~/MiscProjects/rk-ui` was scaffolded as a new git repo, with
  docs only:
  - `README.md` and `CLAUDE.md`;
  - `docs/HANDOFF.md`, `docs/PLAN.md` (phases L0–L4, gates, the agent workflow) and
    `docs/DESIGN.md`;
  - the PowerPoint generator in `pptx/`.

  The code moves there with its history in L0 (`git subtree split --prefix=packages/rk-ui`).
  **This site's P2 waits on rk-ui v0.1.0.** Then the site installs it from a git tag, deletes
  `packages/rk-ui/`, `src/components/ui/`, the styleguide files and the `rk-ui/*` alias, and
  decides what the reserved `/styleguide/` path becomes (rk-ui PLAN §3, "Site integration").
- **Open:**
  - `svgo` is imported by `vendor-icons.mjs` from Astro's tree; declare it as a dev dependency
    (in rk-ui after L0).
  - LinkedIn brand mark: Rob deferred it.
  - Xmind's source link in `THIRD_PARTY_NOTICES.md` is probably `github.com/lamzhonghang/xmind`.
  - The dark-mode neutral `--section` nearly matches the page (P2).
  - Scrollbar lag on `/styleguide/`, not yet diagnosed (rk-ui HANDOFF §4).
- **Next:**
  - Rob approves Gate 1b and tags `gate-1b`. The review found nothing blocking; its small fixes
    are in `05ffe8e`.
  - Then library work happens in `~/MiscProjects/rk-ui`, following its `docs/HANDOFF.md` §7.
  - This repo resumes at P2 once rk-ui v0.1.0 is installed.

---

## 8. Photo storage *(DECIDED 2026-11-01: option B, Cloudflare R2)*

Whatever the choice, **originals never leave Rob's own library**, and only resized,
EXIF-stripped web versions are published. This decision is hard to undo, because photos
committed to git stay in history and the repo never shrinks without a history rewrite.

| Option | How | Good | Bad |
|---|---|---|---|
| **A. Web versions in the repo** | `img:add` writes 2560px stripped JPEGs into `src/content/photos/`; `astro:assets` makes the responsive sizes at build | Simplest; no extra service; optimisation built in | Public history forever; GitHub Pages recommends a source repo ≤ 1 GB and caps the published site at 1 GB. Rough estimate: fine to a few hundred photos, tight beyond |
| **B. External bucket** *(recommended if the portfolio will keep growing)* | `img:add` (run by Rob, with credentials kept locally) strips and resizes, generates the sizes (e.g. 640/1280/2560 WebP + JPEG) and uploads them to **Cloudflare R2** behind `photos.robertcking.com`. The repo holds only album Markdown: captions, alt text, image keys, dimensions | Repo and site stay small; a deleted photo is actually deleted; storage can be swapped later by editing one base URL | One more service and credentials; `astro:assets` isn't used for these, so the script makes the sizes |

R2 free tier (checked 2026-11-01): 10 GB-month storage, 1M Class A / 10M Class B operations
per month, no egress fees. `r2.dev` URLs are rate-limited and meant for development only, so
production needs a custom hostname.

Rob's domain is registered with Cloudflare Registrar (2026-11-01), which requires Cloudflare DNS,
so `robertcking.com` is already a Cloudflare zone. That removes option B's main setup hurdle:
connecting `photos.robertcking.com` to an R2 bucket is a dashboard step in the same account.
Check that the bucket is in the same Cloudflare account as the zone. Leave the existing
`www` CNAME to GitHub Pages untouched.

**Setup Rob does at the start of the photography track** (not before; nothing needs it earlier):
1. Create a bucket (e.g. `robertcking-photos`) in the same Cloudflare account as the zone.
2. Connect the custom domain `photos.robertcking.com` to it (bucket Settings → Custom Domains).
3. Create an R2 API token scoped to **that bucket only**, with Object Read & Write.
4. Put the token's values in a local `.env` (already gitignored), which `img:add` reads. Never
   paste them into a chat, commit them, or add them to CI.
