import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// One project = one file (frontmatter + Markdown body), replacing the old
// pattern of a `content/projects/{slug}.json` metadata file paired with a
// separate `content/{slug}.md` description file. The schema below folds in
// every field seen across the ~10 legacy projects, including the
// inconsistent ones (`directLink` vs `links[]`, optional `location`,
// optional start date) --- see src/content/projects/*.md for the migrated
// examples and MIGRATING-PROJECTS.md for the mapping from the old files.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),

    // Devicon slugs (see https://devicon.dev) for the little tech-stack
    // icons. `icon` is optional --- a tech entry with no icon just shows up
    // as a "+" with a tooltip (see ProjectIcons).
    tech: z.array(
      z.object({
        name: z.string(),
        icon: z.string().optional(),
      })
    ),

    // End date (or only date, for single-point-in-time projects).
    year: z.number(),
    month: z.number().min(1).max(12),
    // Start date, for projects that ran over a range (e.g. a thesis project).
    startYear: z.number().optional(),
    startMonth: z.number().min(1).max(12).optional(),

    location: z.string().optional(),

    // Card background + slideshow images. Plain public/ paths for now
    // (matching the legacy site) --- Phase 5 (photography) introduces
    // astro:assets-optimized images, at which point these can be upgraded
    // to the same pattern.
    image: z.string().optional(),
    slideshow: z.array(z.string()).default([]),

    // A single `links` array replaces the old `directLink` vs `links[]`
    // split: a project that used to have a bare `directLink` now just has
    // one entry here (see src/content/projects/perlin.md). `logo` is an
    // optional devicon slug for the link's icon.
    links: z
      .array(
        z.object({
          type: z.string(),
          url: z.string(),
          logo: z.string().optional(),
        })
      )
      .default([]),

    draft: z.boolean().default(false),
  }),
})

export const collections = { projects }
