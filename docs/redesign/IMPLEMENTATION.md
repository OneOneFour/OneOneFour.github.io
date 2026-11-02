# robertcking.com redesign: implementation plan

Status: **APPROVED with amendments, 2026-11-01.** This file says **how the build is run**:
branches, agents, phases, review gates, and what Rob supplies when.
**What** is built is in [`PLAN.md`](./PLAN.md). The palette and icon reference is
[`moodboard.html`](./moodboard.html); open it locally (it fetches Google Fonts, so needs network).
Icon research is in [`research/icons.md`](./research/icons.md).

---

## 1. Ground rules (decided by Rob, 2026-11-01)

| Decision | Consequence |
|---|---|
| Prototype lives on a **separate branch, local only** (reaffirmed after the plan review) | All work happens on branch `redesign` (based on `experimental`, so it includes the Phase 2 code). `main` and the live site stay untouched until a single **switchover** merge that Rob triggers. Preview with `npm run dev` locally. Accepted risk: nothing builds on GitHub's Linux runner until switchover, and Linux file names are case-sensitive. Mitigation: all file and folder names are lowercase-kebab, and import paths match file names exactly. |
| **Rob pushes to GitHub** | Agents commit locally and never push. (Rob allowed one push of `redesign` on 2026-11-01 as a backup; that doesn't carry over.) |
| **Rob writes all content**, including photography as it comes in | Agents never write site copy, posts, captions or publication summaries, and never source photos. Styleguide specimen text is fine. |
| **Placeholder entries allowed, dev-only** | So layouts can be built and reviewed before Rob's content exists, agents may add obviously fake entries (lorem ipsum, named `_fixture-*`, always `draft: true`). Drafts render in `npm run dev` only and are never in `npm run build` (PLAN §6). |
| **Licence** | Code, including `packages/toon-ui`, is **MIT**. Content (posts, photos, page text) is **CC BY-NC 4.0**. Third-party licences (Phosphor and Tabler MIT, Simple Icons CC0, OFL fonts) are listed in `THIRD_PARTY_NOTICES.md`. |
| **Permissions enforced, not just written down** | The committed `.claude/settings.json` **denies `git push`** and **asks before `npm install`** (approved by Rob 2026-11-01). Rob can still push from his own terminal. |
| **Human in the loop** | Rob reviews the code as well as the look. Agents make small, focused commits with plain commit messages, so each merge is easy to read in a diff. |
| **Review at every phase** | Each phase ends at a gate (§4). Rob looks at the pages locally and reads the diff, and approves before the next phase starts. |
| **Minimal testing** | No test suite and no screenshot pipeline for the site. Playwright is used **only** for the interactive widget library (P3W), with a handful of smoke tests. `npm run build` passing is the bar for everything else. |
| **Reusable design language** | Rob's other project sites are **vanilla JS** (portable to Vue later). The design package is plain CSS + vanilla custom elements (PLAN §5.6), with no Vue wrappers for now. |

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
- **No dead code or speculative options.** Build what the current work package needs.
- **Consistent with what's there.** Match the existing formatting and naming. Never hard-code a colour
  outside the token files.
- **Self-review before handing back.** Each agent re-reads its own diff against this list and
  removes comments and code that don't earn their place. Rob reviews again at the gate.

The existing Phase 2 code on `experimental` predates these rules and has long explanatory comments
(e.g. in `astro.config.mjs` and `ProjectItem.astro`). P0 trims them.

---

## 3. Execution model

```
Coordinator session (one per phase; reads this file)
   │  starts builders, in parallel where §4 allows, each in its own git worktree
   ├─► astro-builder  (WP a) ──► branch worktree-<name> ──┐
   ├─► astro-builder  (WP b) ──► branch worktree-<name> ──┤ coordinator merges into `redesign`,
   └─► general-purpose (scripts, data) ───────────────────┘ runs `npm run build`
   ▼
reviewer agent: reads the diff and rendered pages against PLAN §5 and §2 above (read-only)
   ▼
GATE: Rob runs `npm run dev`, reads the diff → approve / request changes
```

- **Plain coordinator sessions for P0–P2.** Start a fresh conversation per phase: "Run phase P<n>
  of `docs/redesign/IMPLEMENTATION.md`". The coordinator starts the agents, merges their worktree
  branches into `redesign`, runs the build, gets the review, and presents the gate.
- **P3 may use the Workflow tool.** Its four tracks are independent, so a workflow per track is a
  reasonable fit. Workflows can't pause for user input, so a workflow never spans a gate.
- **Parallelism is limited where the code overlaps.** P1/P2 touch the same files (tokens, layouts),
  so builders run in at most 2 lanes.

### 3.1 Custom agents *(authored in P0)*

| Agent | Role |
|---|---|
| `astro-builder` | Implements one work package in its own worktree (`isolation: worktree`). Carries the §2 code-style rules, the token rules (PLAN §5), "both themes" and "no invented copy". Must end with `npm run build` passing and a self-review of its diff. |
| `reviewer` | Read-only. Checks a phase's diff and the rendered pages against PLAN §5 (contrast rules, dark mode, toon treatment, responsive layout) and §2 (readability, comment discipline, reuse of built-ins). Returns a short pass/fail list with file:line references. It may use Claude in Chrome on the local dev server to look at pages, if Rob has it connected. It doesn't need to. |

A `content-migrator` agent isn't worth it: legacy projects are a Rob-led review (WP-9).

### 3.2 Worktree setup

- Worktrees branch from the default branch unless told otherwise, and that would miss the redesign.
  P0 sets `worktree.baseRef: "head"` in project `.claude/settings.json`, and coordinators always run
  from a checkout of `redesign`.
- Each worktree needs `npm ci`. Dev servers take an explicit `--port` to avoid collisions.
- `.gitignore` gains `.claude/worktrees/` and `.claude/settings.local.json`.
- The coordinator merges each worktree branch into `redesign` with `--no-ff`, resolves conflicts,
  rebuilds, then deletes the worktree branch.

### 3.3 `CLAUDE.md` for the repo *(P0)*

Short, and the first thing every agent reads. It covers:
- the commands (`dev`, `build`);
- the "no `base` path" warning;
- the §2 code-style rules;
- "never hard-code a colour";
- "never write content";
- "never push" (also enforced in settings);
- lowercase-kebab file names, and never rename a content folder (its name is a public URL);
- files in `public/` that already have a URL are never moved or deleted without Rob's OK;
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
2b. [G] Housekeeping:
   - run `git remote set-head origin -a`, because local `origin/HEAD` still points at the old
     `master`;
   - remove the stale empty `.claude/worktrees/astro-phase0`;
   - add `LICENSE` (MIT), the content licence (CC BY-NC 4.0, as a `CONTENT-LICENSE.md` plus a
     site footer line later) and `THIRD_PARTY_NOTICES.md`.
3. [G] `.claude/agents/astro-builder.md` and `reviewer.md`.
4. [G] Add `draft: boolean` to the projects schema. Mark the 4 migrated projects `draft: true` and
   leave drafts out of the routes (WP-0).
5. [G] Trim the over-long comments in the existing Phase 2 code to the §2 standard.
6. [G] Apply the draft rule (PLAN §6) to the projects collection: drafts in `dev`, not in `build`.

**Gate 0:** Rob reads `CLAUDE.md` and the two agent files, and approves.

### P1 Foundation: design package *(R2; WP-1, WP-3)*
Everything except `/styleguide/` goes in `packages/toon-ui/` (PLAN §5.6). The styleguide page is
site code that imports the package.

Lane A:
1. [B] `tokens.css`: every colour in PLAN §5.1/§5.1a/§5.1b as semantic tokens in both themes, the
   `--section`/`--on-section` hooks, spacing, radii and shadows.
2. [B] Fonts: download Roboto Slab and Xmind woff2 once into `packages/toon-ui/fonts/` (Xmind
   isn't on Fontsource) and write the `@font-face` rules with latin/greek `unicode-range`. Add the
   type scale, and two monospace candidates with Greek, side by side for Rob to choose.
2b. [G] `scripts/check-contrast.mjs`, a small script with no framework. It reads `tokens.css`
   (both themes) and checks a list of pairs given by **token name**, so no hex values are
   duplicated. Run it by hand with `npm run contrast`; it isn't part of CI.
2c. [B] Specimen page: tokens, type scale, fonts and mono candidates, both themes, plus
   **proposed** `-deep`/`-tint` values for the hues PLAN doesn't give (teal, green, yellow,
   sky) for Rob to pick. Then stop for Gate 1a.
3. [B] Theme: set in `<head>` before first paint, plus a `<tu-theme-toggle>` custom element
   (Light / Dark / System).

Lane B ‖:
4. [G] Icons:
   - A small `vendor-icons` script copies the listed Phosphor duotone icons from GitHub and makes
     them recolourable (outline = `currentColor`, fill = `var(--icon-fill)`). It runs them through
     SVGO and writes them to `packages/toon-ui/icons/`, along with Phosphor's licence.
   - The satellite comes from Tabler.
   - Brand logos come from Simple Icons, plus LinkedIn's and ORCID's official files.

**Gate 1a:** small diff. Rob decides the type scale, the monospace font and the hue variants.
Nothing is built on top of the tokens until this passes.

Then (needs Gate 1a and 4):
5. [B] Component CSS (`tu-button`, `tu-chip`, `tu-card`, `tu-switch`, range slider, `tu-callout`,
   `tu-widget-frame`, …) and thin `.astro` wrappers in the site.
6. [B] `/styleguide/` page showing every token, type size, icon and component, in both themes.
7. [RV] Review.

**Gate 1b:** Rob compares `/styleguide/` against the mood board in both themes and reads the diff.

### P2 New shell *(R3; WP-4)* **Needs Rob's content pack C1 (§6) before pages can be finished**
1. [B] `BaseLayout`:
   - sticky left bar: photo, name, role, nav with section icons, socials, theme toggle;
   - top bar plus menu panel below about 800px wide;
   - breakout main grid (PLAN §4).

   The nav shows only sections that exist.
2. [B] `profile` and `pages` collections (`src/content/site/profile.md`, `home.md`, photo), per
   PLAN §6b. Bio, photo, role, email, CV and social links are all edited there, never in
   components. A `_fixture` profile lets the layout be built before C1 arrives.
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
- every collection schema (posts, publications, photos), draft-aware;
- the `markdown.processor` switch to `unified()` with remark-math/rehype-katex (PLAN §5.2);
- hidden nav entries;
- every new dependency.

After that, run **at most two tracks at a time**. Rob's review is the bottleneck anyway.

| Track | Tasks | Needs from Rob | Gate |
|---|---|---|---|
| **3W Writing** (WP-5, WP-6) | [B] `posts` collection, PostLayout (header band, breakout grid, sidenotes, end matter), MDX, KaTeX, Shiki themed from tokens, RSS. ‖ [B] **Interactive widget library** in `packages/toon-ui/widgets/`: vanilla custom elements (`<tu-widget>` frame, slider with readout, start/pause/reset controls), and the Lorenz widget built on them, with reduced motion and a static fallback. **This is the only place Playwright is used:** a few smoke tests per widget (renders, controls change state, works with reduced motion). | **C2**: first post | Post renders in both themes; widget works; smoke tests pass |
| **3R Research** (WP-7a/b) | [G] `publications` schema + `npm run pubs:new -- <doi or file.bib>` starter. [B] `/research/` with chips and paper ↔ post links | **C3**: Rob writes the publication files | Page lists Rob's entries; links work both ways |
| **3P Photography** (WP-8) | [G] `npm run photos:add -- <album> <files…>` using `sharp`. It resizes to a 2560px long edge, strips all EXIF (keeping camera and lens only), and writes into `src/content/photos/<album>/`. **Originals are never committed:** the repo is public and git history is permanent. `CLAUDE.md` gets a "no image over 2 MB" rule. [B] `photos` collection, `astro:assets` pipeline, album grid, lightbox on native `<dialog>` | **C4**: photos, as they come in | Images optimised; no GPS data in the repo; lightbox works by keyboard |
| **3J Projects review** (WP-9) | Rob-led conversation, one project at a time | Rob's decision per project | Only approved projects are non-draft |

### P4 Switchover and cleanup *(R8; WP-10, WP-11)*
- Merge `redesign` → `main` if not done at Gate 2. Rob pushes and confirms the Pages deploy, and
  turns on HTTPS enforcement.
- [G] GitHub archive view (optional).
- [G] Branch cleanup, **with Rob confirming each deletion**: `astro`, `v3`, `old`, `page-src`,
  `master`, draft PR #1, and `experimental` once merged.

---

## 5. Gate checklist (every gate)

The coordinator presents:
1. What was built (WP IDs), with the merge commits on `redesign`, so Rob can read
   `git log -p` or `git diff <before>..redesign`.
2. Confirmation that `npm run build` passes, and the reviewer's pass/fail list.
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
| **C2** | P3W | First post: text, title, date, and what the interactive should show |
| **C3** | P3R | Publication files (Rob writes them; `pubs:new` can prefill from a DOI or BibTeX) |
| **C4** | P3P | Photos as they come in, album groupings, any captions |

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

  Rob kept the redesign local-only. Open: Rob's other sites' build setup, and the design-package
  name and prefix (PLAN §5.6).
- **Next:** P0 in a fresh conversation: "Run phase P0 of `docs/redesign/IMPLEMENTATION.md`".
