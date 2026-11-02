/**
 * Checks WCAG 2.x contrast between pairs of rk-ui colour tokens, in both themes.
 *
 * Usage: node scripts/check-contrast.mjs
 *
 * Also checks that the light-only fallback for browsers without light-dark() repeats every
 * light-dark() token's light colour. Exits with code 1 on any failure.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const TOKENS_FILE = new URL('../packages/rk-ui/tokens.css', import.meta.url)
export const THEMES = ['light', 'dark']

const SURFACES = ['--surface', '--raised']
const DEEP_TEXT = ['navy', 'teal', 'coral', 'yellow', 'green', 'sky', 'grape', 'tangerine'].map(
  (hue) => `--${hue}-deep`
)
const TINTS = ['navy', 'teal', 'coral', 'yellow', 'green', 'sky', 'lilac', 'apricot'].map(
  (hue) => `--${hue}-tint`
)
const INK_LABEL_FILLS = ['--teal', '--yellow', '--green', '--sky', '--lilac', '--tangerine', '--apricot']
const FILLS = ['--navy', '--coral', '--grape', ...INK_LABEL_FILLS]
const SLATES = ['--slate-a', '--slate-b', '--slate-c']

/** Every foreground against every background, with one minimum ratio. */
function pairs(foregrounds, backgrounds, min) {
  return foregrounds.flatMap((fg) => backgrounds.map((bg) => ({ fg, bg, min })))
}

const GROUPS = [
  { title: 'Body text', pairs: pairs(['--fg', '--muted'], SURFACES, 4.5) },
  { title: 'Hue text', pairs: pairs(DEEP_TEXT, SURFACES, 4.5) },
  { title: 'Text and links on tints', pairs: pairs(['--fg', '--navy-deep'], TINTS, 4.5) },
  // Code is long reading, so its text gets the AAA ratio.
  { title: 'Code text on slate', pairs: pairs(['--fg'], SLATES, 7) },
  { title: 'Code comments on slate', pairs: pairs(['--muted'], SLATES, 4.5) },
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
  { title: 'Large text on bright coral', pairs: [{ fg: '--on-coral', bg: '--coral', min: 3 }] },
  // The highlighter band hugs the ink outline, so that is the edge it must stand out from.
  { title: 'Focus band against the outline', pairs: pairs(['--focus', '--focus-alt'], ['--line'], 3) },
  { title: 'Unfilled outlines', pairs: pairs(['--line-unfilled'], SURFACES, 3) },
  { title: 'Error outline on its panel', pairs: [{ fg: '--coral-deep', bg: '--coral-tint', min: 3 }] },
  { title: 'Outline against the page', themes: ['light'], pairs: pairs(['--line'], SURFACES, 3) },
  { title: 'Fill edge against the page', themes: ['dark'], pairs: pairs(FILLS, ['--surface'], 3) },
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

/** The `#rrggbb` colour a token resolves to in one theme ('light' or 'dark'). */
export function resolveColor(tokens, name, theme) {
  const value = chooseTheme(expandVars(tokens, name), theme)
  if (!/^#[0-9a-f]{6}$/i.test(value)) {
    throw new Error(`${name} is not a #rrggbb colour in the ${theme} theme: ${value}`)
  }
  return value
}

function toLinear(channel) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

/** WCAG 2.x relative luminance of a `#rrggbb` colour. */
export function relativeLuminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2.x contrast ratio between two `#rrggbb` colours, from 1 to 21. */
export function contrastRatio(hexA, hexB) {
  const [lighter, darker] = [relativeLuminance(hexA), relativeLuminance(hexB)].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

/** Prints one theme's table and returns the number of failing pairs. */
function printTheme(tokens, theme) {
  console.log(`\n${theme.toUpperCase()} THEME`)
  let failures = 0

  for (const group of GROUPS) {
    if (group.themes && !group.themes.includes(theme)) continue
    console.log(`\n  ${group.title}`)

    for (const { fg, bg, min } of group.pairs) {
      const fgHex = resolveColor(tokens, fg, theme)
      const bgHex = resolveColor(tokens, bg, theme)
      const ratio = contrastRatio(fgHex, bgHex)
      const status = ratio >= min ? 'pass' : group.knownGap ? 'known gap' : 'FAIL'
      if (status === 'FAIL') failures++

      const fgCell = `${fg} ${fgHex}`.padEnd(30)
      const bgCell = `${bg} ${bgHex}`.padEnd(30)
      console.log(`    ${fgCell} on ${bgCell} ${ratio.toFixed(2).padStart(5)}  min ${min}  ${status}`)
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

    const light = resolveColor(tokens, name, 'light').toLowerCase()
    const actual = resolveColor(withFallback, name, 'light').toLowerCase()
    return actual === light ? [] : [`${name} is ${actual}, light is ${light}`]
  })

  console.log('\nLIGHT-ONLY FALLBACK')
  problems.forEach((problem) => console.log(`  FAIL ${problem}`))
  if (!problems.length) console.log(`  All ${themed.length} light-dark() tokens match.`)
  return problems.length
}

function main() {
  const css = readFileSync(TOKENS_FILE, 'utf8')
  const { main: mainCss, fallback: fallbackCss } = splitFallback(css)
  const tokens = parseTokens(mainCss)
  const fallbackFailures = checkFallback(tokens, parseTokens(fallbackCss))

  const failures = THEMES.reduce((sum, theme) => sum + printTheme(tokens, theme), 0)
  console.log(failures ? `\n${failures} pair(s) fail.` : '\nAll pairs pass.')
  process.exitCode = failures || fallbackFailures ? 1 : 0
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
