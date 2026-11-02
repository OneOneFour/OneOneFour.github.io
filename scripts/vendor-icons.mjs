// Downloads the rk-ui icons, makes them recolourable, and writes them with a sprite to
// packages/rk-ui/icons/. Run with `npm run vendor-icons`.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { optimize } from 'svgo'

const PHOSPHOR = 'https://raw.githubusercontent.com/phosphor-icons/core/v2.0.8'
const TABLER = 'https://raw.githubusercontent.com/tabler/tabler-icons/v3.50.0'

const PHOSPHOR_ICONS = [
  'house', 'pen-nib', 'flask', 'rocket', 'camera', 'identification-card',
  'cloud', 'cloud-rain', 'cloud-lightning', 'wind', 'thermometer', 'globe-hemisphere-west',
  'wave-sine', 'chart-line', 'code', 'map-pin',
  'play', 'pause', 'arrow-counter-clockwise', 'download-simple', 'arrow-square-out',
  'list', 'x', 'caret-right', 'caret-down', 'magnifying-glass', 'funnel', 'copy',
  'sun', 'moon', 'circle-half', 'info', 'warning', 'envelope-simple', 'rss',
  'calendar-blank', 'clock', 'upload-simple', 'plus', 'minus', 'caret-up',
  'paint-brush', 'palette', 'drop',
]

// Hand-adapted icons in Phosphor's raw duotone format, read from scripts/icon-sources/.
const LOCAL_ICONS = ['satellite']

// Each icon's fill when nothing sets --icon-fill, as a token name. Unlisted icons (interface
// icons such as copy, x and the carets) use the neutral wash, --icon-fill-neutral.
const DEFAULT_FILLS = {
  house: 'sky',
  'pen-nib': 'coral',
  flask: 'sky',
  rocket: 'teal',
  camera: 'yellow',
  'identification-card': 'green',
  cloud: 'sky',
  'cloud-rain': 'sky',
  'cloud-lightning': 'yellow',
  wind: 'teal',
  thermometer: 'coral',
  'globe-hemisphere-west': 'green',
  'wave-sine': 'teal',
  'chart-line': 'apricot',
  code: 'grape',
  'map-pin': 'tangerine',
  satellite: 'lilac',
  play: 'green',
  pause: 'yellow',
  'download-simple': 'green',
  'arrow-square-out': 'lilac',
  sun: 'yellow',
  moon: 'lilac',
  info: 'sky',
  warning: 'tangerine',
  'envelope-simple': 'apricot',
  rss: 'tangerine',
  'calendar-blank': 'coral',
  'paint-brush': 'coral',
  palette: 'apricot',
  drop: 'sky',
}

const SOURCE_DIR = new URL('./icon-sources/', import.meta.url)
const OUT_DIR = new URL('../packages/rk-ui/icons/', import.meta.url)

const BACKGROUND_RECT = '<rect width="256" height="256" fill="none"/>'
const FILL_LAYER = ' opacity="0.2"'
const SHARED_STROKE_ATTRS = / (fill="none"|stroke="currentColor"|stroke-linecap="round"|stroke-linejoin="round"|stroke-width="16")/g
const ROOT_ATTRS =
  'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--icon-stroke, 16)" aria-hidden="true"'

/** Fetches a URL as text, failing loudly on any HTTP error. */
async function fetchText(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status} ${url}`)
  return response.text()
}

/** The attributes for an icon's fill layer: `--icon-fill`, falling back to the icon's default. */
function fillHook(name) {
  const defaultFill = DEFAULT_FILLS[name] ?? 'icon-fill-neutral'
  return ` stroke="none" style="fill:var(--icon-fill, var(--${defaultFill}))"`
}

/**
 * Rewrites one shape element of a raw duotone icon.
 * The 20% opacity layer becomes the fill region, given `fillAttrs`. Outline strokes lose the
 * attributes the root now carries, and unpainted shapes (solid dots) are filled with the outline
 * colour.
 */
function recolourShape(tag, fillAttrs) {
  if (tag.includes(FILL_LAYER)) return tag.replace(FILL_LAYER, fillAttrs)
  if (tag.includes('stroke="currentColor"')) return tag.replace(SHARED_STROKE_ATTRS, '')
  return tag.replace('/>', ' fill="currentColor" stroke="none"/>')
}

/** Turns a raw duotone SVG into a recolourable, SVGO-optimised one. */
function makeRecolourable(name, rawSvg) {
  const fillAttrs = fillHook(name)
  const svg = rawSvg
    .replace(BACKGROUND_RECT, '')
    .replace(/<(path|line|circle|rect|polyline|polygon)\b[^>]*\/>/g, (tag) =>
      recolourShape(tag, fillAttrs)
    )
    .replace(/<svg ([^>]*)>/, `<svg $1 ${ROOT_ATTRS}>`)
  // convertStyleToAttrs stays off (it isn't in preset-default) so the fill hook remains a style.
  return optimize(svg, { multipass: true, plugins: ['preset-default'] }).data
}

/** Wraps an optimised icon as a `<symbol>` for the sprite. */
function toSymbol(name, svg) {
  return svg
    .replace('<svg', `<symbol id="${name}"`)
    .replace(' xmlns="http://www.w3.org/2000/svg"', '')
    .replace(' aria-hidden="true"', '')
    .replace('</svg>', '</symbol>')
}

/** Returns the raw duotone source of every icon, keyed by name. */
async function loadRawIcons() {
  const phosphor = PHOSPHOR_ICONS.map(async (name) => [
    name,
    await fetchText(`${PHOSPHOR}/raw/duotone/${name}-duotone.svg`),
  ])
  const local = LOCAL_ICONS.map(async (name) => [
    name,
    await readFile(new URL(`${name}-duotone.svg`, SOURCE_DIR), 'utf8'),
  ])
  return Promise.all([...phosphor, ...local])
}

await mkdir(OUT_DIR, { recursive: true })

const symbols = []
for (const [name, rawSvg] of await loadRawIcons()) {
  const svg = makeRecolourable(name, rawSvg)
  await writeFile(new URL(`${name}.svg`, OUT_DIR), `${svg}\n`)
  symbols.push(toSymbol(name, svg))
}

const sprite = `<svg xmlns="http://www.w3.org/2000/svg">\n${symbols.join('\n')}\n</svg>\n`
await writeFile(new URL('sprite.svg', OUT_DIR), sprite)

await writeFile(new URL('LICENSE-phosphor.txt', OUT_DIR), await fetchText(`${PHOSPHOR}/LICENSE`))
await writeFile(new URL('LICENSE-tabler.txt', OUT_DIR), await fetchText(`${TABLER}/LICENSE`))

console.log(`Wrote ${symbols.length} icons and sprite.svg to packages/rk-ui/icons/`)
