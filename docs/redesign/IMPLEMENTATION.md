# robertcking.com redesign: implementation plan

Status: **DRAFT, 2026-11-01**, for Rob's approval. This file says **how the build is run**:
branches, agents, phases, gates, and what Rob supplies when.
**What** is built is in [`PLAN.md`](./PLAN.md). The palette and icon reference is
[`moodboard.html`](./moodboard.html); open it locally (it fetches Google Fonts, so needs network).
Icon research is in [`research/icons.md`](./research/icons.md).

---

## 1. Ground rules (decided by Rob, 2026-11-01)

| Decision | Consequence |
|---|---|
| Prototype lives on a **separate branch, local only** | All work happens on branch `redesign` (based on `experimental`, so it includes the Phase 2 code). `main` and the live site stay untouched until a single **switchover** merge that Rob triggers. Preview with `npm run dev` / `npm run preview` locally. Nothing is pushed unless Rob asks. |
| **Rob supplies real text first** | Agents build layouts, components and styleguide specimens without content. Any page that needs words (bio, about, home intro, posts) waits for Rob's text, using the content requests in §5. Agents never write copy that could be mistaken for final. Styleguide specimen text is fine. |
| **Review at every phase** | Each phase ends at a gate (§4). Rob reviews screenshots (light and dark, ≈1400px and ≈390px) plus a short report, and approves before the next phase starts. |
| Docs committed on a branch | `docs/redesign/` is committed on `redesign`. |
| **Rob writes all content**, including photography as it comes in | Agents never write site copy, posts, captions or publication summaries, and never source photos. |
| **Design language must be reusable** on Rob's other project sites | The design system is built as a separate, framework-light package inside this repo (PLAN §5.6). Site code consumes it, never the other way round. |

Every commit on `redesign` must pass `npm run build`. The branch is always buildable, even though it isn't deployed.

---

## 2. Execution model

```
Coordinator session (one per phase; reads this file)
   │  starts builders in parallel where §3 allows, each in its own git worktree
   ├─► astro-builder  (WP a) ──► branch worktree-<name> ──┐
   ├─► astro-builder  (WP b) ──► branch worktree-<name> ──┤ coordinator merges into `redesign`,
   └─► general-purpose (scripts, data) ───────────────────┘ runs `npm run build`
   ▼
visual-qa agent: screenshots + rubric report (read-only)
   ▼
GATE: Rob reviews report and screenshots → approve / request changes
```

- **One coordinator per phase.** Start a fresh conversation for each phase with:
  "Run phase P<n> of `docs/redesign/IMPLEMENTATION.md`". The coordinator starts the agents,
  merges their worktree branches into `redesign`, runs the build, starts `visual-qa`,
  and presents the gate.
- **Workflow tool, optional.** A phase can be run as one Workflow script if Rob opts in at the
  time. Workflows can't pause for user input, so **one workflow per phase**, never across a gate.
  Whether a workflow step can use a custom agent type is unconfirmed, so workflow steps embed
  the role prompt directly.
- **Parallelism is limited where the code overlaps.** Within P1/P2, files overlap heavily
  (tokens, layouts), so builders run **sequentially or in at most 2 lanes** (§3). P3's tracks are
  independent and can run fully in parallel.

### 2.1 Custom agents *(to author in P0)*

Researched 2026-11-01 against the Claude Code docs (sub-agents, workflows, worktrees, chrome):

| Agent | Worth it? | Why |
|---|---|---|
| `astro-builder` | **Yes** | Fixed rules every builder needs: read PLAN §5 tokens, never hard-code colours, both themes, `npm run build` must pass, commit to its worktree branch. Uses `isolation: worktree`. |
| `visual-qa` | **Yes** | Read-only reviewer with a fixed checklist (PLAN §5.1 contrast rules, §5.1b dark mode, §5.3 toon treatment, responsive checks). Turns each gate into a checklist before Rob looks. `memory: project` keeps the baseline between phases. |
| `content-migrator` | No | Legacy projects are a Rob-led review (WP-9). A general-purpose agent is enough. |

Both are defined in `.claude/agents/*.md` (frontmatter: `name`, `description`, `tools`,
`disallowedTools`, `model`, `isolation`, `memory`, …). The research agent drafted a `visual-qa`
file; it's adapted in P0, not copied blindly.

### 2.2 Screenshots: headless Playwright, not the browser extension

Claude in Chrome drives Rob's real browser. Parallel agents would all share one browser, its
login and its prompts, and it needs a direct Anthropic login. For repeatable gate screenshots,
P0 adds:

- `scripts/shots.mjs` (Playwright, a dev dependency). For a list of routes, it writes
  `shots/<phase>/<route>.<theme>.<width>.png` for themes `light`/`dark` and widths `1400`/`390`.
  Theme is forced via `colorScheme` plus `data-theme`. It also fails if any page scrolls
  horizontally at 390px.
- `npm run shots -- --phase P1 --routes /styleguide/`
- `shots/` is gitignored. The coordinator attaches the PNG paths to the gate report.

`visual-qa` reads the PNGs (image-capable Read) and runs `scripts/check-contrast.mjs`. Claude
in Chrome stays available for Rob's own ad-hoc look.

### 2.3 Worktree setup

- Worktrees branch from the **default branch** unless told otherwise, and that would miss the
  redesign. P0 sets `worktree.baseRef: "head"` in project `.claude/settings.json`, and
  coordinators always run from a checkout of `redesign`.
- Each worktree needs `npm ci` (no shared `node_modules`). Dev servers take an explicit
  `--port` (builders 4321+n, visual-qa 4400).
- `.gitignore` gains `.claude/worktrees/`, `.claude/settings.local.json`, `shots/`.
- The coordinator merges each worktree branch into `redesign` with `--no-ff`, resolves
  conflicts, rebuilds, then deletes the worktree branch.

### 2.4 `CLAUDE.md` for the repo *(P0)*

This is the one place every agent reads automatically. It covers commands (`dev`, `build`,
`shots`, `contrast`), the "no `base` path" warning, the token and theme rules in brief,
"never hard-code a colour", "never invent final copy", where the plan lives, and the
icon pipeline. It stays short and points to PLAN.md for detail.

---

## 3. Phases and tasks

Legend: **[B]** astro-builder · **[G]** general-purpose · **[QA]** visual-qa · **[R]** needs Rob ·
"‖" = can run in parallel with the line above.

### P0 Setup *(coordinator alone, about 1 session)*
1. Create branch `redesign` from `experimental`; commit `docs/redesign/`. **(done 2026-11-01)**
2. [G] `CLAUDE.md`, `.gitignore` additions, `.claude/settings.json` with `worktree.baseRef: "head"`.
3. [G] `.claude/agents/astro-builder.md` and `visual-qa.md`.
4. [G] `scripts/shots.mjs` + Playwright dev dependency; `scripts/check-contrast.mjs`
   (WP-2: every token pair in both themes; the rules from PLAN §5.1/§5.1b) + `npm run contrast`.
5. [G] Add `draft: boolean` to the projects schema; mark the 4 migrated projects `draft: true` and
   exclude drafts from routes (WP-0).

**Gate 0** (light): Rob approves the agent definitions and `CLAUDE.md`; `npm run build`,
`npm run contrast` and `npm run shots` work on the current pages.

### P1 Foundation: tokens, type, icons, components *(R2; WP-1, WP-3)*
All P1 output lives in the design package `packages/toon-ui/` (PLAN §5.6), except the
`/styleguide/` page, which is site code that imports from the package.

Lane A:
1. [B] `src/styles/tokens.css`: every colour in PLAN §5.1/§5.1a/§5.1b as semantic tokens, both
   themes, `--section`/`--on-section` hooks; spacing scale; radii; shadow tokens. Contrast script
   passes.
2. [B] Fonts: self-host Roboto Slab and Xmind variable (Fontsource, or Astro's font API if stable in 7.x),
   with `unicode-range` subsets and fallbacks. Type scale (≈1.25, rem). Two monospace candidates
   with Greek, shown side by side for Rob to choose.
3. [B] No-flash theme script in `<head>`, plus the Light / Dark / System toggle component (localStorage,
   wrapped in try/catch).

Lane B ‖:
4. [G] Icon pipeline: `scripts/vendor-icons.mjs`. It takes a list of Phosphor names, fetches raw duotone
   from GitHub, rewrites strokes → `currentColor` and fill → `var(--icon-fill)`, runs SVGO, and writes
   `src/icons/*.svg` + `src/icons/LICENSE-phosphor`. It vendors the 33 icons on the mood board plus a
   satellite from Tabler. Brand marks: Simple Icons (CC0) + LinkedIn/ORCID official assets. An
   `Icon.astro` wrapper.

Then (needs 1–4):
5. [B] Primitives (button, range slider, switch, select, input, link) and Astro components (`Button`,
   `Chip`/`ChipGroup`, `Card` variants, `HeaderBand`, `Callout`, `PullQuote`, `Sidenote`, `Figure`,
   `WidgetFrame`) per PLAN §5.3–5.4.
6. [B] `/styleguide/` page showing every token, type size, icon and component in both themes. It
   should match the mood board.
7. [QA] Screenshots and report.

**Gate 1:** Rob compares the styleguide against the mood board and picks the monospace font and
any type-scale tweaks.

### P2 New shell *(R3; WP-4)* **needs Rob's content pack C1 (§5) before the pages can be finished**
1. [B] `BaseLayout`: sticky left bar (photo, name, one-line role, nav with section icons, socials,
   theme toggle); top bar plus menu panel below ≈800px; breakout main grid (PLAN §4).
   Nav shows only sections that exist.
2. [B] Pages: Home (intro + feed scaffold), About (long bio, CV link), Projects index (empty state
   until any project is approved) + `/projects/[slug]/`; redirects `/project/*` → `/projects/*`.
3. [B] Retire legacy styles: the old `global.css` layout rules go, replaced by tokens.
4. [QA] Screenshots and report.

**Gate 2:** Rob approves the shell with his real text. **Switchover decision**: Rob may choose to
merge `redesign` → `main` here (the new look goes live) or wait until P3 tracks land. The
merge and push happen only on Rob's explicit say-so.

### P3 Tracks *(fully parallel after Gate 2; each track has its own gate)*
| Track | Tasks | Needs from Rob | Gate |
|---|---|---|---|
| **3W Writing** (WP-5, WP-6) | [B] `posts` collection, PostLayout (header band, breakout grid, sidenotes, end matter), MDX, KaTeX, Shiki themed from tokens, RSS; ‖ [B] Lorenz widget (vanilla TS on canvas, WidgetFrame controls, reduced motion, static fallback) | **C2**: first post text (the Lorenz post or another) | Post renders in both themes; widget works; JS-off fallback |
| **3R Research** (WP-7a/b) | [G] `publications` schema + `npm run pubs:new -- <doi\|file.bib>` starter; [B] `/research/` with chips, paper ↔ post links | **C3**: Rob writes or edits the publication files (starter can prefill from his DOIs) | Page lists Rob's entries; links work both ways |
| **3P Photography** (WP-8) | [B] `photos` collection, astro:assets pipeline, album grid, accessible lightbox | **C4**: prototype photos + album names | Lighthouse perf ≥ 90 on an album page |
| **3J Projects review** (WP-9) | Rob-led conversation, one project at a time | Rob's decisions per project | Only approved projects are non-draft |

### P4 Switchover and cleanup *(R8; WP-10, WP-11)*
- Merge `redesign` → `main` (if not done at Gate 2), confirm the Pages deploy, enforce HTTPS.
- [G] GitHub archive view (optional). Branch cleanup **with Rob confirming each deletion**:
  `astro`, `v3`, `old`, `page-src`, `master`, draft PR #1, `experimental` after merge.

---

## 4. Gate checklist (every gate)

The coordinator presents:
1. What was built (WP IDs), and the merge commits on `redesign`.
2. `npm run build` ✓, `npm run contrast` output, `visual-qa` table (route × theme × width, pass/fail).
3. Screenshot paths (`shots/<phase>/…`), and how to view locally (`npm run preview`).
4. Deviations from PLAN.md, and decisions Rob needs to make.
5. Rob replies **approve** or lists changes. Changes loop back to builders; there's no next phase without approval.

---

## 5. Content requests (what Rob supplies, and when)

| Pack | Needed by | Contents |
|---|---|---|
| **C1** | P2 | One-line role for the left bar; short home intro (2–4 sentences); longer About bio; confirm photo (`mugshota.png` or a new one); social links: GitHub, LinkedIn URL, ORCID (`0009-0006-1944-7787`), Scholar URL, Bluesky/Mastodon/X? (which ones to show), email to display; CV PDF (current `public/files/Robert_King_CV.pdf`, or a new one) |
| **C2** | P3W | First post: text (Markdown is fine), title, date, and what the interactive should show |
| **C3** | P3R | Which publications appear, and per paper any summary, figure, slides, code and companion post |
| **C4** | P3P | Prototype photos (originals), album groupings, captions/locations if wanted |

Agents may build everything around a missing pack, but must leave clearly labelled empty
states, never invented text.

---

## 6. Open questions for Rob

1. **Approve this plan?** In particular: the Playwright screenshot script (adds a dev dependency),
   and the two custom agents.
2. **Workflow tool:** use it for P1/P2/P3 runs (more parallel, more tokens), or plain coordinator
   sessions starting agents one or two at a time? *Proposed:* coordinator sessions for P0–P2,
   then consider a workflow for P3's parallel tracks.
3. **Push `redesign` to GitHub as a backup?** Pushing doesn't deploy, since the deploy only runs on `main`.
   *Proposed:* yes, but only if Rob agrees.
4. **What are the other project sites built with** (Astro, Vue/Nuxt, plain HTML, something
   else)? This decides which component wrappers the design package ships (PLAN §5.6).
