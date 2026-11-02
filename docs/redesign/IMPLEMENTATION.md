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
| Prototype lives on a **separate branch, local only** | All work happens on branch `redesign` (based on `experimental`, so it includes the Phase 2 code). `main` and the live site stay untouched until a single **switchover** merge that Rob triggers. Preview with `npm run dev` locally. |
| **Rob pushes to GitHub** | Agents commit locally and never push. (Rob allowed one push of `redesign` on 2026-11-01 as a backup; that doesn't carry over.) |
| **Rob writes all content**, including photography as it comes in | Agents build layouts and components around clearly labelled empty states. They never write site copy, posts, captions or publication summaries, and never source photos. Styleguide specimen text is fine. |
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
- **Comments are rare and short.** One line saying *why* when the why isn't obvious. No restating
  the code, no docstrings on self-explanatory functions, no history ("ported from…", "previously…"),
  and no reasoning written to the reader or to Claude. Git history holds the story.
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
- "never push";
- the design-package boundary (PLAN §5.6);
- where the plan lives.

---

## 4. Phases and tasks

Legend: **[B]** astro-builder · **[G]** general-purpose · **[RV]** reviewer · "‖" = parallel with the line above.

### P0 Setup *(coordinator alone, about 1 session)*
1. Branch `redesign` from `experimental`; commit `docs/redesign/`. **(done 2026-11-01)**
2. [G] `CLAUDE.md`, `.gitignore` additions, `.claude/settings.json` with `worktree.baseRef: "head"`.
3. [G] `.claude/agents/astro-builder.md` and `reviewer.md`.
4. [G] Add `draft: boolean` to the projects schema. Mark the 4 migrated projects `draft: true` and
   leave drafts out of the routes (WP-0).
5. [G] Trim the over-long comments in the existing Phase 2 code to the §2 standard.
6. [G] `scripts/check-contrast.mjs`: a small script (no framework) that checks the token pairs in
   PLAN §5.1/§5.1b. Run it by hand with `npm run contrast`. It isn't part of CI.

**Gate 0:** Rob reads `CLAUDE.md` and the two agent files, and approves.

### P1 Foundation: design package *(R2; WP-1, WP-3)*
Everything except `/styleguide/` goes in `packages/toon-ui/` (PLAN §5.6). The styleguide page is
site code that imports the package.

Lane A:
1. [B] `tokens.css`: every colour in PLAN §5.1/§5.1a/§5.1b as semantic tokens in both themes, the
   `--section`/`--on-section` hooks, spacing, radii and shadows.
2. [B] Fonts: self-hosted Roboto Slab and Xmind via Fontsource packages, plus the type scale. Two
   monospace candidates with Greek, side by side for Rob to choose.
3. [B] Theme: set in `<head>` before first paint, plus a `<tu-theme-toggle>` custom element
   (Light / Dark / System).

Lane B ‖:
4. [G] Icons:
   - A small `vendor-icons` script copies the listed Phosphor duotone icons from GitHub and makes
     them recolourable (outline = `currentColor`, fill = `var(--icon-fill)`). It runs them through
     SVGO and writes them to `packages/toon-ui/icons/`, along with Phosphor's licence.
   - The satellite comes from Tabler.
   - Brand logos come from Simple Icons, plus LinkedIn's and ORCID's official files.

Then (needs 1–4):
5. [B] Component CSS (`tu-button`, `tu-chip`, `tu-card`, `tu-switch`, range slider, `tu-callout`,
   `tu-widget-frame`, …) and thin `.astro` wrappers in the site.
6. [B] `/styleguide/` page showing every token, type size, icon and component, in both themes.
7. [RV] Review.

**Gate 1:** Rob compares `/styleguide/` against the mood board in both themes, picks the monospace
font, and reads the diff.

### P2 New shell *(R3; WP-4)* **Needs Rob's content pack C1 (§6) before pages can be finished**
1. [B] `BaseLayout`:
   - sticky left bar: photo, name, role, nav with section icons, socials, theme toggle;
   - top bar plus menu panel below about 800px wide;
   - breakout main grid (PLAN §4).

   The nav shows only sections that exist.
2. [B] Pages:
   - Home;
   - About;
   - Projects index, with an empty state until a project is approved, plus `/projects/[slug]/`;
   - redirects from `/project/*` to `/projects/*`.
3. [B] Remove the legacy layout styles from `global.css`.
4. [RV] Review.

**Gate 2:** Rob approves the shell with his real text. **Switchover decision:** Rob may merge
`redesign` → `main` and push (the new look goes live), or wait for P3.

### P3 Tracks *(parallel after Gate 2; each track has its own gate)*
| Track | Tasks | Needs from Rob | Gate |
|---|---|---|---|
| **3W Writing** (WP-5, WP-6) | [B] `posts` collection, PostLayout (header band, breakout grid, sidenotes, end matter), MDX, KaTeX, Shiki themed from tokens, RSS. ‖ [B] **Interactive widget library** in `packages/toon-ui/widgets/`: vanilla custom elements (`<tu-widget>` frame, slider with readout, start/pause/reset controls), and the Lorenz widget built on them, with reduced motion and a static fallback. **This is the only place Playwright is used:** a few smoke tests per widget (renders, controls change state, works with reduced motion). | **C2**: first post | Post renders in both themes; widget works; smoke tests pass |
| **3R Research** (WP-7a/b) | [G] `publications` schema + `npm run pubs:new -- <doi or file.bib>` starter. [B] `/research/` with chips and paper ↔ post links | **C3**: Rob writes the publication files | Page lists Rob's entries; links work both ways |
| **3P Photography** (WP-8) | [B] `photos` collection, `astro:assets` pipeline, album grid, lightbox on native `<dialog>` | **C4**: photos, as they come in | Images optimised; lightbox works by keyboard |
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

---

## 6. Content requests (what Rob supplies, and when)

| Pack | Needed by | Contents |
|---|---|---|
| **C1** | P2 | One-line role for the left bar; short home intro; About bio; photo (`mugshota.png` or a new one); social links to show (GitHub, LinkedIn URL, ORCID `0009-0006-1944-7787`, Scholar URL, any of Bluesky/Mastodon/X); email to display; CV PDF |
| **C2** | P3W | First post: text, title, date, and what the interactive should show |
| **C3** | P3R | Publication files (Rob writes them; `pubs:new` can prefill from a DOI or BibTeX) |
| **C4** | P3P | Photos as they come in, album groupings, any captions |

---

## 7. Status

- 2026-11-01: plan approved with amendments (minimal testing, code-style rules, vanilla-JS reuse).
  P0 step 1 done; `redesign` pushed once to GitHub as a backup, with Rob's permission.
- **Next:** P0 in a fresh conversation: "Run phase P0 of `docs/redesign/IMPLEMENTATION.md`".
