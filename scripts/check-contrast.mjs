/**
 * Checks WCAG 2.x contrast between pairs of rk-ui colour tokens, in both themes.
 *
 * Usage: node scripts/check-contrast.mjs [extra-tokens.css]
 *
 * An extra file's tokens are layered over the main file. A token named `--x-alt1` is checked
 * in every pair that uses `--x`. Exits with code 1 if any pair fails.
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

/** Every foreground against every background, with one minimum ratio. */
function pairs(foregrounds, backgrounds, min) {
  return foregrounds.flatMap((fg) => backgrounds.map((bg) => ({ fg, bg, min })))
}

const GROUPS = [
  { title: 'Body text', pairs: pairs(['--fg', '--muted'], SURFACES, 4.5) },
  { title: 'Hue text', pairs: pairs(DEEP_TEXT, SURFACES, 4.5) },
  { title: 'Text on tints', pairs: pairs(['--fg'], TINTS, 4.5) },
  {
    title: 'Text on fills',
    pairs: [
      ...pairs(['--on-fill'], INK_LABEL_FILLS, 4.5),
      { fg: '--on-ink', bg: '--ink', min: 4.5 },
      { fg: '--on-navy', bg: '--navy', min: 4.5 },
      { fg: '--on-coral', bg: '--coral-solid', min: 4.5 },
      { fg: '--on-grape', bg: '--grape', min: 4.5 },
      { fg: '--on-section', bg: '--section', min: 4.5 },
    ],
  },
  { title: 'Large text on bright coral', pairs: [{ fg: '--on-coral', bg: '--coral', min: 3 }] },
  { title: 'Focus ring and unfilled outlines', pairs: pairs(['--focus', '--line-unfilled'], SURFACES, 3) },
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

/** Copies of each group's pairs with every `--x-altN` token in place of `--x`. */
function candidateGroups(tokenNames) {
  const alternates = tokenNames.filter((name) => /-alt\d+$/.test(name))
  const swap = (token, base, alt) => (token === base ? alt : token)

  return GROUPS.map((group) => ({
    ...group,
    title: `${group.title} (candidates)`,
    pairs: alternates.flatMap((alt) => {
      const base = alt.replace(/-alt\d+$/, '')
      return group.pairs
        .filter(({ fg, bg }) => fg === base || bg === base)
        .map((pair) => ({ ...pair, fg: swap(pair.fg, base, alt), bg: swap(pair.bg, base, alt) }))
    }),
  })).filter((group) => group.pairs.length > 0)
}

/** Prints one theme's table and returns the number of failing pairs. */
function printTheme(tokens, groups, theme) {
  console.log(`\n${theme.toUpperCase()} THEME`)
  let failures = 0

  for (const group of groups) {
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

function main([extraFile]) {
  const tokens = parseTokens(readFileSync(TOKENS_FILE, 'utf8'))
  let groups = GROUPS

  if (extraFile) {
    const extra = parseTokens(readFileSync(extraFile, 'utf8'))
    extra.forEach((value, name) => tokens.set(name, value))
    groups = [...GROUPS, ...candidateGroups([...extra.keys()])]
  }

  const failures = THEMES.reduce((sum, theme) => sum + printTheme(tokens, groups, theme), 0)
  console.log(failures ? `\n${failures} pair(s) fail.` : '\nAll pairs pass.')
  process.exitCode = failures ? 1 : 0
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2))
}
