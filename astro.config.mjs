import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import mdx from '@astrojs/mdx'

export default defineConfig({
  // This site is served at the custom domain in public/CNAME (www.robertcking.com),
  // and the repo (OneOneFour.github.io) is a user/org GitHub Pages site, which is
  // always served from the domain root. That means NO `base` path here, ever ---
  // `base: '/some-repo-name'` is only correct for project-repo Pages sites
  // (username.github.io/repo-name), which this is not. Don't "fix" this later.
  site: 'https://www.robertcking.com',

  integrations: [
    // Lets existing/future Vue components be used as islands (see Phase 2 of the
    // migration plan) --- static HTML by default, JS only where a client:* directive
    // is added.
    vue(),
    // Lets blog posts (Phase 3) be written as .mdx when they need to embed an
    // interactive component. Ordinary posts stay plain .md.
    mdx(),
  ],
})
