# robertcking.com

Personal site, built with [Astro](https://astro.build).

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check + build to dist/
npm run preview  # preview the production build
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site and publishes it to GitHub Pages automatically --- no manual build/push
step needed. The custom domain (`www.robertcking.com`) is configured via
`public/CNAME`.

## Project structure

- `src/pages/` --- routes (`index.astro` is the homepage)
- `src/layouts/` --- shared page shells (head tags, global CSS import)
- `src/styles/global.css` --- site-wide styles and theme variables
- `public/` --- static files served as-is (favicon, icons, CNAME, CV)
