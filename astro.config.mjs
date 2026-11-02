import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import mdx from '@astrojs/mdx'

export default defineConfig({
  // A user Pages site on a custom domain is always served from the root: never add `base`.
  site: 'https://www.robertcking.com',

  integrations: [vue(), mdx()],

  vite: {
    build: {
      // Keep fonts as files: inlined, every unicode-range subset would load on every page.
      assetsInlineLimit: (filePath) => (filePath.endsWith('.woff2') ? false : undefined),
    },
  },
})
