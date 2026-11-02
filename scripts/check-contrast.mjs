/**
 * Checks WCAG 2.x contrast between pairs of rk-ui colour tokens, in both themes and under every
 * page palette. Reads the styleguide's chart and illustration tokens too, and water.css's
 * busy-button recipe. Tokens may use var(), light-dark() and color-mix() (colour.mjs evaluates
 * the mixes).
 *
 * Usage: node scripts/check-contrast.mjs
 *
 * Also checks that the light-only fallback for browsers without light-dark() repeats every
 * light-dark() token's light colour. Exits with code 1 on any failure.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { composite, contrastRatio, evaluateColour, selfCheck, toHex } from './colour.mjs'

const TOKEN_FILES = [
  new URL('../packages/rk-ui/tokens.css', import.meta.url),
  new URL('../src/components/styleguide/chart-tokens.css', import.meta.url),
  new URL('../src/components/styleguide/illustration-tokens.css', import.meta.url),
]
// Component recipes that mix a per-element colour, measured below with each colour they take.
const RECIPE_FILE = new URL('../packages/rk-ui/components/water.css', import.meta.url)
const RECIPES = ['--water-empty']
export const THEMES = ['light', 'dark']
export const DEFAULT_PALETTE = 'cream'

const SURFACES = ['--surface', '--raised']
const DEEP_TEXT = ['navy', 'teal', 'coral', 'yellow', 'green', 'sky', 'grape', 'tangerine'].map(
  (hue) => `--${hue}-deep`
)
const TINTS = ['navy', 'teal', 'coral', 'yellow', 'green', 'sky', 'lilac', 'apricot'].map(
  (hue) => `--${hue}-tint`
)
const INK_LABEL_FILLS = ['--teal', '--yellow', '--green', '--sky', '--lilac', '--tangerine', '--apricot']
const FILLS = ['--navy', '--coral', '--grape', ...INK_LABEL_FILLS]
const STICKY_NOTES = ['yellow', 'sky', 'tangerine', 'green', 'coral', 'grape'].map((hue) => `--note-${hue}`)
const SLATES = ['--slate', '--slate-greige']
const TAB_STRIPS = ['--slate-tab', '--slate-greige-tab']
const CODE_COLOURS = ['--code-keyword', '--code-function', '--code-string', '--code-number', '--code-comment']
// The colour shadow mode gives every fill but navy a shadow in its own shade (shadow-colour.css).
const EXTRUDED_FILLS = FILLS.filter((fill) => fill !== '--navy')
// Each button fill, its label, the colour water.css mixes its empty part towards when busy, and
// how much of the fill that mix keeps.
const BUSY_BUTTONS = [
  ['--yellow', '--on-fill', '--glint', '45%'],
  ['--teal', '--on-fill', '--glint', '45%'],
  ['--green', '--on-fill', '--glint', '45%'],
  ['--tangerine', '--on-fill', '--glint', '45%'],
  ['--navy', '--on-navy', '--line', '45%'],
  ['--coral-solid', '--on-coral', '--fg', '45%'],
  ['--grape', '--on-grape', '--fg', '45%'],
  ['--section', '--on-section', '--glint', '70%'],
]

/** Every foreground against every background, with one minimum ratio. */
function pairs(foregrounds, backgrounds, min) {
  return foregrounds.flatMap((fg) => backgrounds.map((bg) => ({ fg, bg, min })))
}

const GROUPS = [
  { title: 'Body text', pairs: pairs(['--fg', '--muted'], SURFACES, 4.5) },
  { title: 'Hue text', pairs: pairs(DEEP_TEXT, SURFACES, 4.5) },
  { title: 'Text and links on tints', pairs: pairs(['--fg', '--navy-deep'], TINTS, 4.5) },
  { title: 'Text on the selected tint', pairs: pairs(['--fg'], ['--selected-tint'], 4.5) },
  // Code is long reading, so its text gets the AAA ratio.
  { title: 'Code text on slate', pairs: pairs(['--fg'], [...SLATES, ...TAB_STRIPS], 7) },
  { title: 'Code comments and captions on slate', pairs: pairs(['--muted'], [...SLATES, ...TAB_STRIPS], 4.5) },
  { title: 'Syntax highlighting on slate', pairs: pairs(CODE_COLOURS, SLATES, 4.5) },
  {
    title: 'Text on fills',
    pairs: [
      ...pairs(['--on-fill'], INK_LABEL_FILLS, 4.5),
      { fg: '--on-ink', bg: '--ink', min: 4.5 },
      { fg: '--on-navy', bg: '--navy', min: 4.5 },
      { fg: '--on-coral', bg: '--coral-solid', min: 4.5 },
      { fg: '--on-grape', bg: '--grape', min: 4.5 },
      { fg: '--on-selected', bg: '--selected', min: 4.5 },
      { fg: '--on-section', bg: '--section', min: 4.5 },
    ],
  },
  { title: 'Text on sticky notes', pairs: pairs(['--on-fill'], STICKY_NOTES, 4.5) },
  {
    title: "Icon lines on a sticky note's fold and icon fills (--shade of the note)",
    pairs: STICKY_NOTES.map((note) => ({
      fg: '--on-fill',
      bg: '--shade',
      inputs: { '--shade-of': note },
      min: 3,
      ...(note === '--note-coral' && {
        accepted: 'Rob, 2026-11-02: just under in dark mode; the lines also read against the note',
      }),
    })),
  },
  { title: 'Muted labels on unselected folder tabs', pairs: pairs(['--muted'], ['--folder-back'], 4.5) },
  { title: 'Tooltip text', pairs: [{ fg: '--surface', bg: '--fg', min: 4.5 }] },
  {
    title: "Labels on a busy button's empty part",
    pairs: BUSY_BUTTONS.map(([fill, label, away, share]) => ({
      fg: label,
      bg: '--water-empty',
      inputs: { '--button-fill': fill, '--water-empty-mix': away, '--water-empty-fill': share },
      min: 4.5,
    })),
  },
  { title: 'Large text on bright coral', pairs: [{ fg: '--on-coral', bg: '--coral', min: 3 }] },
  // The highlighter band hugs the ink outline, so that is the edge it must stand out from.
  { title: 'Focus band against the outline', pairs: pairs(['--focus', '--focus-alt'], ['--line'], 3) },
  { title: 'Unfilled outlines', pairs: pairs(['--line-unfilled'], SURFACES, 3) },
  { title: 'Error outline on its panel', pairs: [{ fg: '--coral-deep', bg: '--coral-tint', min: 3 }] },
  { title: 'Outline against the page', themes: ['light'], pairs: pairs(['--line'], SURFACES, 3) },
  { title: 'Fill edge against the page', themes: ['dark'], pairs: pairs(FILLS, ['--surface'], 3) },
  {
    title: 'Colour shadow mode: the shadow without a fill against the page',
    themes: ['dark'],
    pairs: pairs(['--shadow-lit'], SURFACES, 3),
  },
  {
    title: "Colour shadow mode: each fill's shade against the page",
    themes: ['dark'],
    pairs: EXTRUDED_FILLS.flatMap((fill) =>
      SURFACES.map((bg) => ({
        fg: '--shade',
        bg,
        inputs: { '--shade-of': fill },
        min: 3,
        ...(['--coral', '--grape'].includes(fill) && {
          accepted: "Rob, 2026-11-02: fine as they are; the ink outline marks the element's edge",
        }),
      }))
    ),
  },
  {
    title: 'Outline against the page',
    themes: ['dark'],
    knownGap: 'PLAN §5.1b: filled components get their edge from the fill; unfilled ones use --line-unfilled',
    pairs: pairs(['--line'], SURFACES, 3),
  },
]

/** Reads every `--name: value;` declaration in a CSS string into a Map. Later ones win. */
export function parseTokens(css) {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const declarations = withoutComments.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)
  return new Map([...declarations].map(([, name, value]) => [name, value.trim()]))
}

/**
 * Splits tokens.css into the main CSS and the body of the light-only fallback block
 * (`@supports not (color: light-dark(…))`), so the fallback can't override the main values.
 */
export function splitFallback(css) {
  const start = css.indexOf('@supports not (color: light-dark(')
  if (start === -1) return { main: css, fallback: '' }

  const bodyStart = css.indexOf('{', start) + 1
  let depth = 1
  let end = bodyStart
  for (; depth > 0 && end < css.length; end++) {
    if (css[end] === '{') depth++
    else if (css[end] === '}') depth--
  }
  return { main: css.slice(0, start) + css.slice(end), fallback: css.slice(bodyStart, end - 1) }
}

/** Splits each token file's CSS as splitFallback does, and joins the parts in file order. */
export function splitFallbacks(files) {
  const parts = files.map(splitFallback)
  return {
    main: parts.map((part) => part.main).join('\n'),
    fallback: parts.map((part) => part.fallback).join('\n'),
  }
}

// A `[data-palette='name'] { … }` rule, with the `:root,` that the default palette's rule starts with.
const PALETTE_RULE = /(?::root,\s*)?\[data-palette='([\w-]+)'\]\s*\{([^}]*)\}/g

/**
 * Splits the page palette rules out of the main CSS. Returns the CSS without them (the tokens
 * every palette shares) and each palette's tokens: the shared ones, then the default palette's,
 * then its own.
 */
export function splitPalettes(css) {
  const shared = css.replace(PALETTE_RULE, '')
  const sharedTokens = parseTokens(shared)
  const rules = [...css.matchAll(PALETTE_RULE)].map(([, name, body]) => [name, parseTokens(body)])
  const defaults = new Map(rules).get(DEFAULT_PALETTE)
  const palettes = new Map(
    rules.map(([name, own]) => [name, new Map([...sharedTokens, ...defaults, ...own])])
  )
  return { shared, palettes }
}

/** A token's value with every `var(--x)` replaced by the value of `--x`, recursively. */
function expandVars(tokens, name, seen = []) {
  if (seen.includes(name)) throw new Error(`Circular reference: ${[...seen, name].join(' -> ')}`)
  const value = tokens.get(name)
  if (value === undefined) throw new Error(`Unknown token ${name}`)
  return value.replace(/var\((--[\w-]+)\)/g, (_, ref) => expandVars(tokens, ref, [...seen, name]))
}

/** Replaces each `light-dark(a, b)` in a value with `a` or `b`, including nested ones. */
function chooseTheme(value, theme) {
  const start = value.indexOf('light-dark(')
  if (start === -1) return value

  const argsStart = start + 'light-dark('.length
  let depth = 0
  let comma = -1
  let end = -1
  for (let i = argsStart; i < value.length && end === -1; i++) {
    if (value[i] === '(') depth++
    else if (value[i] === ')' && depth > 0) depth--
    else if (value[i] === ')') end = i
    else if (value[i] === ',' && depth === 0) comma = i
  }
  if (comma === -1 || end === -1) throw new Error(`Malformed light-dark() in: ${value}`)

  const chosen = theme === 'light' ? value.slice(argsStart, comma) : value.slice(comma + 1, end)
  return chooseTheme(value.slice(0, start) + chosen.trim() + value.slice(end + 1), theme)
}

/** The colour a token resolves to in one theme ('light' or 'dark'), as `{ r, g, b, alpha }`. */
export function resolveRgba(tokens, name, theme) {
  const value = chooseTheme(expandVars(tokens, name), theme)
  try {
    return evaluateColour(value)
  } catch (error) {
    throw new Error(`${name} is not a colour in the ${theme} theme: ${value} (${error.message})`)
  }
}

/** The colour a token resolves to in one theme, as `#rrggbb`, or `#rrggbbaa` if translucent. */
export function resolveColor(tokens, name, theme) {
  return toHex(resolveRgba(tokens, name, theme))
}

/**
 * The tokens with the per-element tokens a recipe reads set, e.g. `{ '--shade-of': '--teal' }`
 * makes `--shade` teal's shade.
 *
 * @param {Map<string, string>} tokens
 * @param {Record<string, string>} [inputs] each input token and the token it is set to, or a
 *   plain value such as `70%`
 */
export function withInputs(tokens, inputs) {
  if (!inputs) return tokens
  const set = Object.entries(inputs).map(([name, value]) => [
    name,
    value.startsWith('--') ? `var(${value})` : value,
  ])
  return new Map([...tokens, ...set])
}

/**
 * Measures one pair in one theme, with a translucent foreground painted over the background.
 * `inputs` sets the per-element tokens a recipe reads (see withInputs).
 *
 * @param {Map<string, string>} tokens
 * @param {{ fg: string, bg: string, inputs?: Record<string, string> }} pair
 * @param {string} theme
 * @returns the hex colours as painted, and their contrast ratio
 */
export function measurePair(tokens, { fg, bg, inputs }, theme) {
  const scoped = withInputs(tokens, inputs)
  const background = composite(resolveRgba(scoped, bg, theme))
  const foreground = composite(resolveRgba(scoped, fg, theme), background)
  return {
    fgHex: toHex(foreground),
    bgHex: toHex(background),
    ratio: contrastRatio(foreground, background),
  }
}

/** The inputs a recipe pair was measured with, for the table, e.g. ` (--shade-of: --teal)`. */
function describeInputs({ inputs }) {
  if (!inputs) return ''
  return ` (${Object.entries(inputs).map(([name, token]) => `${name}: ${token}`).join(', ')})`
}

/** Prints one palette and theme's table and returns its failing pairs' lines. */
function printTable(tokens, palette, theme) {
  const heading = `${palette.toUpperCase()} PALETTE, ${theme.toUpperCase()} THEME`
  console.log(`\n${heading}`)
  const failures = []

  for (const group of GROUPS) {
    if (group.themes && !group.themes.includes(theme)) continue
    console.log(`\n  ${group.title}`)

    for (const pair of group.pairs) {
      const { fg, bg, min } = pair
      const { fgHex, bgHex, ratio } = measurePair(tokens, pair, theme)
      // A shortfall Rob has accepted is listed with his reason but doesn't fail the check.
      const status = ratio >= min ? 'pass' : pair.accepted ? 'accepted' : group.knownGap ? 'known gap' : 'FAIL'

      const fgCell = `${fg} ${fgHex}`.padEnd(30)
      const bgCell = `${bg} ${bgHex}`.padEnd(30)
      const measured = `${ratio.toFixed(2).padStart(5)}  min ${min}  ${status}${describeInputs(pair)}`
      console.log(`    ${fgCell} on ${bgCell} ${measured}`)
      if (status === 'accepted') console.log(`      (${pair.accepted})`)
      if (status === 'FAIL') failures.push(`  ${heading}, ${group.title}:\n    ${fgCell} on ${bgCell} ${measured}`)
    }
    if (group.knownGap) console.log(`    (${group.knownGap})`)
  }
  return failures
}

/**
 * Checks that the fallback declares every light-dark() token as a plain value with the same
 * light colour. Prints each problem and returns how many there are.
 */
function checkFallback(tokens, fallback) {
  const withFallback = new Map([...tokens, ...fallback])
  const themed = [...tokens.keys()].filter((name) => tokens.get(name).includes('light-dark('))
  const problems = themed.flatMap((name) => {
    if (!fallback.has(name)) return [`${name} is missing`]
    if (expandVars(withFallback, name).includes('light-dark(')) {
      return [`${name} still uses light-dark()`]
    }

    // Compared as expanded text, so the fallback must repeat the light value itself.
    const light = chooseTheme(expandVars(tokens, name), 'light').toLowerCase()
    const actual = expandVars(withFallback, name).toLowerCase()
    return actual === light ? [] : [`${name} is ${actual}, light is ${light}`]
  })

  console.log('\nLIGHT-ONLY FALLBACK')
  problems.forEach((problem) => console.log(`  FAIL ${problem}`))
  if (!problems.length) console.log(`  All ${themed.length} light-dark() tokens match.`)
  return problems.length
}

function main() {
  const resolverProblems = selfCheck()
  resolverProblems.forEach((problem) => console.log(`RESOLVER SELF-CHECK FAIL ${problem}`))

  const files = TOKEN_FILES.map((file) => readFileSync(file, 'utf8'))
  const { main: mainCss, fallback: fallbackCss } = splitFallbacks(files)
  const { palettes } = splitPalettes(mainCss)
  const recipes = parseTokens(readFileSync(RECIPE_FILE, 'utf8'))
  const recipeTokens = RECIPES.map((name) => [name, recipes.get(name)])
  const fallbackFailures = checkFallback(palettes.get(DEFAULT_PALETTE), parseTokens(fallbackCss))

  const failures = [...palettes].flatMap(([palette, tokens]) => {
    const withRecipes = new Map([...tokens, ...recipeTokens])
    return THEMES.flatMap((theme) => printTable(withRecipes, palette, theme))
  })
  if (failures.length) console.log(`\nFAILURES\n${failures.join('\n')}`)
  console.log(failures.length ? `\n${failures.length} pair(s) fail.` : '\nAll pairs pass.')
  process.exitCode = failures.length || fallbackFailures || resolverProblems.length ? 1 : 0
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
