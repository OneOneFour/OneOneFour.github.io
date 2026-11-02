// Downloads the rk-ui icons, makes them recolourable, and writes them with a sprite to
// packages/rk-ui/icons/. Run with `npm run vendor-icons`.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { optimize } from 'svgo'

// Phosphor 2.1.1 has no git tag, so this pins the commit its npm release was published from.
const PHOSPHOR_COMMIT = 'fe23e2534cdb7bec24bd8e6bd99b3676bcf0d54f'
const PHOSPHOR = `https://raw.githubusercontent.com/phosphor-icons/core/${PHOSPHOR_COMMIT}`
const TABLER = 'https://raw.githubusercontent.com/tabler/tabler-icons/v3.50.0'

const PHOSPHOR_ICONS = [
  'house', 'pen-nib', 'flask', 'rocket', 'camera', 'identification-card',
  'cloud', 'cloud-rain', 'cloud-lightning', 'wind',
  'thermometer', 'thermometer-cold', 'thermometer-hot',
  'globe-hemisphere-west', 'globe-hemisphere-east',
  'wave-sine', 'chart-line', 'code', 'map-pin',
  'play', 'pause', 'arrow-counter-clockwise', 'download-simple', 'arrow-square-out',
  'list', 'x', 'caret-right', 'caret-down', 'magnifying-glass', 'funnel', 'copy',
  'sun', 'moon', 'circle-half', 'info', 'warning', 'envelope-simple', 'rss',
  'calendar-blank', 'clock', 'upload-simple', 'plus', 'minus', 'caret-up',
  'paint-brush', 'palette', 'drop',
  'arrow-left', 'arrow-right', 'caret-left', 'check', 'link', 'tag',
  'book-open-text', 'graduation-cap', 'file-pdf', 'presentation-chart', 'quotes', 'lightbulb',
  'image', 'images', 'atom',
  'stop', 'shuffle', 'sliders-horizontal', 'arrows-out', 'circle-notch',
  'magnifying-glass-plus', 'magnifying-glass-minus', 'aperture', 'map-trifold',
  'arrow-up', 'list-bullets', 'users', 'file-text', 'newspaper-clipping', 'database',
  'briefcase', 'buildings', 'check-circle', 'x-circle', 'question',
  'snowflake', 'cloud-snow', 'waves', 'mountains', 'leaf', 'tree-evergreen', 'fire',
  'tornado', 'hurricane',
  'gauge', 'compass', 'cpu', 'chart-scatter', 'chart-bar', 'function', 'sigma', 'planet',
  'eye', 'eye-slash', 'keyboard', 'person-simple-circle', 'closed-captioning', 'translate',
  'share-network', 'speaker-high', 'speaker-slash', 'video', 'printer',
  'trophy', 'seal-check', 'brain', 'robot', 'chalkboard-teacher', 'hand-waving',
  // Weather, climate and the natural world
  'cloud-sun', 'cloud-moon', 'cloud-fog', 'cloud-warning', 'sun-dim', 'sun-horizon', 'rainbow',
  'rainbow-cloud', 'drop-simple', 'drop-half', 'drop-half-bottom', 'drop-slash', 'umbrella',
  'umbrella-simple', 'thermometer-simple', 'lightning', 'lightning-slash', 'flame', 'fire-simple',
  'moon-stars', 'star', 'star-four', 'shooting-star', 'meteor', 'globe', 'globe-simple',
  'globe-stand', 'compass-rose', 'island', 'footprints', 'tree', 'tree-palm', 'plant',
  'potted-plant', 'flower', 'flower-lotus', 'flower-tulip', 'acorn', 'cactus', 'clover', 'grains',
  'grains-slash', 'recycle', 'fish', 'fish-simple', 'bird', 'butterfly', 'cow', 'farm', 'barn',
  'solar-panel', 'solar-roof', 'windmill', 'nuclear-plant', 'radioactive', 'biohazard',
  'battery-charging', 'plug', 'plug-charging', 'face-mask', 'binoculars', 'shovel',
  // Science and maths
  'test-tube', 'microscope', 'dna', 'virus', 'magnet', 'magnet-straight', 'wave-square',
  'wave-triangle', 'wave-sawtooth', 'waveform', 'pulse', 'chart-line-up', 'chart-line-down',
  'chart-bar-horizontal', 'chart-polar', 'chart-donut', 'chart-pie', 'chart-pie-slice', 'trend-up',
  'trend-down', 'gradient', 'pi', 'infinity', 'math-operations', 'equals', 'not-equals',
  'approximate-equals', 'plus-minus', 'divide', 'percent', 'radical', 'greater-than',
  'greater-than-or-equal', 'less-than', 'less-than-or-equal', 'member-of', 'not-member-of',
  'subset-of', 'subset-proper-of', 'not-subset-of', 'superset-of', 'superset-proper-of',
  'not-superset-of', 'union', 'intersection', 'intersect-three', 'vector-two', 'vector-three',
  'graph', 'bezier-curve', 'line-segment', 'line-segments', 'angle', 'compass-tool', 'sphere',
  'cube', 'cube-transparent', 'cube-focus', 'cylinder', 'grid-four', 'grid-nine', 'dice-five',
  'calculator', 'ruler', 'scales', 'notebook', 'blueprint',
  // Programming, computing and AI
  'terminal', 'terminal-window', 'code-block', 'code-simple', 'brackets-curly', 'brackets-square',
  'brackets-round', 'brackets-angle', 'file-code', 'file-py', 'file-c', 'file-cpp', 'file-c-sharp',
  'file-rs', 'file-js', 'file-ts', 'file-jsx', 'file-tsx', 'file-vue', 'file-html', 'file-css',
  'file-svg', 'file-sql', 'file-ini', 'file-md', 'file-txt', 'file-csv', 'file-xls', 'file-image',
  'file-zip', 'file-archive', 'file-cloud', 'file-arrow-down', 'git-branch', 'git-commit',
  'git-merge', 'git-pull-request', 'git-diff', 'git-fork', 'bug', 'bug-beetle', 'cloud-arrow-up',
  'cloud-arrow-down', 'cloud-check', 'cloud-slash', 'cloud-x', 'hard-drive', 'hard-drives',
  'circuitry', 'memory', 'graphics-card', 'binary', 'head-circuit', 'sparkle', 'magic-wand',
  'bounding-box', 'network', 'flow-arrow', 'tree-structure', 'tree-view', 'stack', 'stack-simple',
  'package', 'puzzle-piece', 'table', 'rows', 'columns', 'kanban', 'browser', 'app-window',
  'command', 'laptop', 'desktop', 'desktop-tower', 'computer-tower', 'monitor', 'gear', 'gear-six',
  'gear-fine', 'wrench', 'screwdriver', 'hammer', 'toolbox',
  // Transport and getting around
  'car', 'car-simple', 'car-profile', 'car-battery', 'taxi', 'jeep', 'van', 'truck',
  'truck-trailer', 'bus', 'train', 'train-simple', 'train-regional', 'tram', 'subway', 'cable-car',
  'bicycle', 'person-simple-bike', 'person-simple-walk', 'person-simple-hike', 'motorcycle',
  'scooter', 'moped', 'moped-front', 'ambulance', 'fire-truck', 'police-car', 'tractor',
  'bulldozer', 'airplane', 'airplane-tilt', 'airplane-in-flight', 'airplane-takeoff',
  'airplane-landing', 'airplane-taxiing', 'air-traffic-control', 'drone', 'rocket-launch', 'boat',
  'sailboat', 'anchor', 'anchor-simple', 'shipping-container', 'gas-pump', 'gas-can',
  'charging-station', 'steering-wheel', 'speedometer', 'engine', 'tire', 'traffic-signal',
  'traffic-sign', 'traffic-cone', 'road-horizon', 'path', 'signpost', 'navigation-arrow', 'gps',
  'gps-fix', 'map-pin-simple', 'map-pin-line', 'map-pin-simple-line', 'map-pin-area',
  'map-pin-simple-area',
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
  'thermometer-cold': 'sky',
  'thermometer-hot': 'coral',
  'globe-hemisphere-west': 'green',
  'globe-hemisphere-east': 'green',
  'wave-sine': 'teal',
  'chart-line': 'apricot',
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
  check: 'green',
  tag: 'apricot',
  'book-open-text': 'sky',
  'graduation-cap': 'navy',
  'file-pdf': 'coral',
  'presentation-chart': 'apricot',
  quotes: 'coral',
  lightbulb: 'yellow',
  image: 'sky',
  images: 'yellow',
  atom: 'teal',
  stop: 'coral',
  aperture: 'yellow',
  'map-trifold': 'green',
  users: 'apricot',
  'file-text': 'sky',
  'newspaper-clipping': 'yellow',
  briefcase: 'tangerine',
  buildings: 'lilac',
  'check-circle': 'green',
  'x-circle': 'coral',
  question: 'sky',
  snowflake: 'sky',
  'cloud-snow': 'sky',
  tornado: 'teal',
  hurricane: 'teal',
  waves: 'teal',
  mountains: 'green',
  leaf: 'green',
  'tree-evergreen': 'green',
  fire: 'tangerine',
  gauge: 'yellow',
  compass: 'tangerine',
  cpu: 'grape',
  'chart-scatter': 'apricot',
  'chart-bar': 'apricot',
  function: 'grape',
  sigma: 'grape',
  planet: 'lilac',
  trophy: 'yellow',
  'seal-check': 'green',
  brain: 'coral',
  robot: 'teal',
  'chalkboard-teacher': 'green',
  'hand-waving': 'yellow',
  // Weather, climate and the natural world
  'cloud-sun': 'yellow',
  'cloud-moon': 'lilac',
  'cloud-fog': 'sky',
  'cloud-warning': 'tangerine',
  'sun-dim': 'yellow',
  'sun-horizon': 'yellow',
  rainbow: 'yellow',
  'rainbow-cloud': 'sky',
  'drop-simple': 'sky',
  'drop-half': 'sky',
  'drop-half-bottom': 'sky',
  'drop-slash': 'sky',
  umbrella: 'sky',
  'umbrella-simple': 'sky',
  'thermometer-simple': 'coral',
  lightning: 'yellow',
  'lightning-slash': 'yellow',
  flame: 'tangerine',
  'fire-simple': 'tangerine',
  'moon-stars': 'lilac',
  star: 'yellow',
  'star-four': 'yellow',
  'shooting-star': 'lilac',
  meteor: 'lilac',
  globe: 'sky',
  'globe-simple': 'sky',
  'globe-stand': 'sky',
  'compass-rose': 'tangerine',
  island: 'green',
  footprints: 'green',
  tree: 'green',
  'tree-palm': 'green',
  plant: 'green',
  'potted-plant': 'green',
  flower: 'green',
  'flower-lotus': 'green',
  'flower-tulip': 'green',
  acorn: 'green',
  cactus: 'green',
  clover: 'green',
  grains: 'yellow',
  'grains-slash': 'yellow',
  recycle: 'green',
  fish: 'sky',
  'fish-simple': 'sky',
  bird: 'sky',
  butterfly: 'green',
  farm: 'green',
  barn: 'coral',
  'solar-panel': 'yellow',
  'solar-roof': 'yellow',
  windmill: 'teal',
  'nuclear-plant': 'yellow',
  radioactive: 'yellow',
  biohazard: 'tangerine',
  'battery-charging': 'yellow',
  plug: 'yellow',
  'plug-charging': 'yellow',
  // Science and maths
  'test-tube': 'sky',
  microscope: 'teal',
  dna: 'coral',
  virus: 'green',
  magnet: 'coral',
  'magnet-straight': 'coral',
  'wave-square': 'teal',
  'wave-triangle': 'teal',
  'wave-sawtooth': 'teal',
  waveform: 'teal',
  pulse: 'teal',
  'chart-line-up': 'apricot',
  'chart-line-down': 'apricot',
  'chart-bar-horizontal': 'apricot',
  'chart-polar': 'apricot',
  'chart-donut': 'apricot',
  'chart-pie': 'apricot',
  'chart-pie-slice': 'apricot',
  'trend-up': 'apricot',
  'trend-down': 'apricot',
  gradient: 'apricot',
  pi: 'grape',
  infinity: 'grape',
  'math-operations': 'grape',
  equals: 'grape',
  'not-equals': 'grape',
  'approximate-equals': 'grape',
  'plus-minus': 'grape',
  divide: 'grape',
  percent: 'grape',
  radical: 'grape',
  'greater-than': 'grape',
  'greater-than-or-equal': 'grape',
  'less-than': 'grape',
  'less-than-or-equal': 'grape',
  'member-of': 'grape',
  'not-member-of': 'grape',
  'subset-of': 'grape',
  'subset-proper-of': 'grape',
  'not-subset-of': 'grape',
  'superset-of': 'grape',
  'superset-proper-of': 'grape',
  'not-superset-of': 'grape',
  union: 'grape',
  intersection: 'grape',
  'intersect-three': 'grape',
  'vector-two': 'grape',
  'vector-three': 'grape',
  graph: 'grape',
  'bezier-curve': 'grape',
  'line-segment': 'grape',
  'line-segments': 'grape',
  angle: 'grape',
  'compass-tool': 'grape',
  sphere: 'grape',
  cube: 'grape',
  'cube-transparent': 'grape',
  'cube-focus': 'grape',
  cylinder: 'grape',
  'grid-four': 'grape',
  'grid-nine': 'grape',
  'dice-five': 'grape',
  calculator: 'grape',
  notebook: 'sky',
  blueprint: 'sky',
  // Programming, computing and AI
  'file-md': 'sky',
  'file-txt': 'sky',
  'file-csv': 'green',
  'file-xls': 'green',
  'file-image': 'sky',
  'file-cloud': 'sky',
  'file-arrow-down': 'green',
  bug: 'coral',
  'bug-beetle': 'coral',
  'cloud-arrow-up': 'sky',
  'cloud-arrow-down': 'sky',
  'cloud-check': 'sky',
  'cloud-slash': 'sky',
  'cloud-x': 'sky',
  circuitry: 'grape',
  memory: 'grape',
  'graphics-card': 'grape',
  binary: 'grape',
  'head-circuit': 'grape',
  sparkle: 'grape',
  'magic-wand': 'grape',
  'bounding-box': 'grape',
  // Transport and getting around
  'car-battery': 'yellow',
  taxi: 'yellow',
  bicycle: 'green',
  'person-simple-bike': 'green',
  'fire-truck': 'tangerine',
  tractor: 'green',
  bulldozer: 'yellow',
  'rocket-launch': 'teal',
  boat: 'sky',
  sailboat: 'sky',
  anchor: 'sky',
  'anchor-simple': 'sky',
  'gas-pump': 'tangerine',
  'gas-can': 'tangerine',
  'charging-station': 'yellow',
  speedometer: 'yellow',
  'traffic-sign': 'tangerine',
  'traffic-cone': 'tangerine',
  'navigation-arrow': 'tangerine',
  gps: 'tangerine',
  'gps-fix': 'tangerine',
  'map-pin-simple': 'tangerine',
  'map-pin-line': 'tangerine',
  'map-pin-simple-line': 'tangerine',
  'map-pin-area': 'tangerine',
  'map-pin-simple-area': 'tangerine',
}

// Globes whose duotone layer is the land. They also get an ocean disc behind it, coloured by
// --icon-ocean (default sky); `--icon-ocean: none` leaves just the land filled.
const GLOBES = ['globe-hemisphere-west', 'globe-hemisphere-east']

const SOURCE_DIR = new URL('./icon-sources/', import.meta.url)
const OUT_DIR = new URL('../packages/rk-ui/icons/', import.meta.url)

const BACKGROUND_RECT = '<rect width="256" height="256" fill="none"/>'
const FILL_LAYER = ' opacity="0.2"'
// A few icons (code-block) draw their outline in a fixed colour instead of currentColor.
const FIXED_STROKE = /stroke="#\w+"/g
const SHARED_STROKE_ATTRS = / (fill="none"|stroke="currentColor"|stroke-linecap="round"|stroke-linejoin="round"|stroke-width="16")/g
const ROOT_ATTRS =
  'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--icon-stroke, 16)" aria-hidden="true"'
// Fills the globes' outline circle, so it sits behind every other shape.
const OCEAN_DISC =
  '<circle cx="128" cy="128" r="96" stroke="none" style="fill:var(--icon-ocean, var(--sky))"/>'

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

/**
 * Some icons wrap their fill layer in `<g opacity="0.2">`. Moves the opacity onto each shape in
 * the group and drops the group, so those shapes are recoloured like any other fill layer.
 */
function ungroupFillLayers(svg) {
  return svg.replace(/<g opacity="0.2">(.*?)<\/g>/g, (_, shapes) =>
    shapes.replaceAll('/>', `${FILL_LAYER}/>`)
  )
}

/** Turns a raw duotone SVG into a recolourable, SVGO-optimised one. */
function makeRecolourable(name, rawSvg) {
  const fillAttrs = fillHook(name)
  const ocean = GLOBES.includes(name) ? OCEAN_DISC : ''
  const svg = ungroupFillLayers(rawSvg)
    .replace(FIXED_STROKE, 'stroke="currentColor"')
    .replace(BACKGROUND_RECT, '')
    .replace(/<(path|line|circle|ellipse|rect|polyline|polygon)\b[^>]*\/>/g, (tag) =>
      recolourShape(tag, fillAttrs)
    )
    .replace(/<svg ([^>]*)>/, `<svg $1 ${ROOT_ATTRS}>${ocean}`)
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
