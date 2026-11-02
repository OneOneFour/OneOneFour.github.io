import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),

    // `icon` is a Devicon slug (https://devicon.dev). Entries without one are listed in a tooltip.
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

    // Paths under public/.
    image: z.string().optional(),
    slideshow: z.array(z.string()).default([]),

    // `logo` is an optional Devicon slug.
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
