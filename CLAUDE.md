# robertcking.com

Rob King's personal site, built with Astro. Rob reviews every diff by hand.

## Commands

- `npm run dev`: local dev server (shows drafts). Pass an explicit `--port` when running
  more than one, e.g. from a worktree.
- `npm run build`: type-check and build to `dist/` (drafts left out). **Every commit must pass it.**

## The plan

- `docs/redesign/IMPLEMENTATION.md`: how the build is run (phases, gates, branches, file locations).
  Read §7 Status first.
- `docs/redesign/PLAN.md`: what is built (layout, tokens, content model).
- `docs/redesign/moodboard.html`: palette and icon reference.

## Hard rules

- **Never push.** Commit locally; Rob pushes. (`git push` is denied in `.claude/settings.json`.)
- **Never write content.** No site copy, posts, captions, bios or publication summaries, and no
  sourced photos. Rob writes all of it. Placeholders are allowed only as obviously fake entries
  named `_fixture-*` with `draft: true`. Styleguide specimen text is fine.
- **No `base` path** in `astro.config.mjs`. The site is a user Pages site on the custom domain in
  `public/CNAME`, so it is always served from the root.
- **Never hard-code a colour.** Colours come from the token files only.
- **Never rename a content folder.** Its name is a public URL.
- **Files in `public/` that already have a URL** are never moved, renamed or deleted without
  Rob's OK.
- **Reserved top-level paths.** Rob's other GitHub Pages sites share this domain at `/<RepoName>/`.
  The site's own top-level names (`writing`, `research`, `projects`, `photos`, `about`,
  `styleguide`, `rss.xml`) are reserved, and no new section may take an existing repo's name
  (PLAN §3).
- **Images:** every committed image goes through the strip-and-resize script; none over 2 MB.
  Originals are never committed.
- **Design-package boundary** (PLAN §5.6): the package in `packages/` never imports from `src/`,
  holds no site copy or section names, and is themed only through tokens.
- **Git hygiene in the main checkout:** never `git add -A` or `git commit -a`. Rob may have
  uncommitted content there.
- **No browser automation outside Playwright.** Never launch Chrome, Chromium or "Chrome for
  Testing" directly (headless or not, CLI or DevTools protocol): it crashes and asks for Rob's
  keychain. Browser checks go through Playwright only, once it is a dev dependency (P3).
  Until then, verify with `npm run build`, `npm run contrast` and the built files; Rob checks
  visuals. Never start `astro dev` (Rob runs his own).

## Code style

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
- **Self-review before handing back.** Re-read your own diff against this list and remove
  comments and code that don't earn their place.
- Small, focused commits with plain commit messages.
