import {
  parseTokens,
  splitFallback,
  splitPalettes,
  resolveColor,
  contrastRatio,
  THEMES,
  DEFAULT_PALETTE,
} from '../../../scripts/check-contrast.mjs'
import rawTokensCss from 'rk-ui/tokens.css?raw'

export type Theme = 'light' | 'dark'
export type Tokens = Map<string, string>

/** One contrast measurement: foreground token on background token, in one theme. */
export interface Contrast {
  fg: string
  bg: string
  ratio: number
}

// The light-only fallback is left out: its plain values would hide the dark theme.
const { shared, palettes } = splitPalettes(splitFallback(rawTokensCss).main)

/** tokens.css without the fallback and the page palette rules: the tokens every palette shares. */
export const tokensCss: string = shared
/** Each page palette's tokens, by palette name, in the order tokens.css gives them. */
export const paletteTokens: Map<string, Tokens> = palettes
/** The default palette's tokens. */
export const tokens: Tokens = palettes.get(DEFAULT_PALETTE)!

/** The `#rrggbb` a token resolves to in one theme. */
export function hexOf(allTokens: Tokens, name: string, theme: Theme): string {
  return resolveColor(allTokens, name, theme)
}

/** WCAG contrast of the `fg` token on the `bg` token, in one theme. */
export function contrast(allTokens: Tokens, fg: string, bg: string, theme: Theme): Contrast {
  const ratio = contrastRatio(hexOf(allTokens, fg, theme), hexOf(allTokens, bg, theme))
  return { fg, bg, ratio }
}

/** The WCAG level a ratio reaches: AAA and AA for body text, 3:1 for large text and UI edges. */
export function grade(ratio: number): string {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return '3:1'
  return 'fail'
}

/** Whether a token resolves to a plain colour in both themes (spacing, shadows etc. don't). */
function isColour(allTokens: Tokens, name: string): boolean {
  try {
    THEMES.forEach((theme) => resolveColor(allTokens, name, theme))
    return true
  } catch {
    return false
  }
}

const SURFACES = ['--surface', '--raised']
const CODE_PANELS = ['--slate', '--slate-greige']

/** A panel carries --fg text: the page surfaces, the tints and the code slates. */
function isPanel(name: string): boolean {
  return SURFACES.includes(name) || name.endsWith('-tint') || name.startsWith('--slate')
}

/** The --on-* token a fill's own label would have; `--coral-solid` shares `--on-coral`. */
function ownLabel(fill: string): string {
  return `--on-${fill.slice(2).replace(/-solid$/, '')}`
}

/** A fill is a hue with -deep or -tint variants, or a colour with its own --on-* label. */
function isFill(allTokens: Tokens, name: string): boolean {
  if (name.startsWith('--on-')) return false
  const hasVariant = allTokens.has(`${name}-deep`) || allTokens.has(`${name}-tint`)
  return hasVariant || allTokens.has(ownLabel(name))
}

/** The label colour used on a fill: its own --on-* token, or --on-fill. */
function labelFor(allTokens: Tokens, fill: string): string {
  return allTokens.has(ownLabel(fill)) ? ownLabel(fill) : '--on-fill'
}

/**
 * The pairs a colour token's swatch shows, with their contrast:
 * panels carry --fg; fills carry their label; a label is shown on every fill that uses it;
 * syntax colours are read on the code slates, and any other colour on --surface and --raised.
 */
export function swatchPairs(allTokens: Tokens, name: string, theme: Theme): Contrast[] {
  if (isPanel(name)) {
    return [contrast(allTokens, '--fg', name, theme)]
  }
  if (isFill(allTokens, name)) {
    return [contrast(allTokens, labelFor(allTokens, name), name, theme)]
  }
  if (name.startsWith('--on-')) {
    const fills = [...allTokens.keys()].filter(
      (fill) => isFill(allTokens, fill) && labelFor(allTokens, fill) === name
    )
    return fills.map((fill) => contrast(allTokens, name, fill, theme))
  }
  const backgrounds = name.startsWith('--code-') ? CODE_PANELS : SURFACES
  return backgrounds.map((background) => contrast(allTokens, name, background, theme))
}

/** A group of colour tokens: a short title, an optional caption and the token names. */
export interface ColourGroup {
  title: string
  caption: string
  names: string[]
}

// A comment after a blank line or a `{` heads a group. One straight under a declaration is a
// note on the next token, so it stays in the group above.
const GROUP_HEADING = /(?:^|\{|\n[ \t]*\n)\s*\/\*\s*([\s\S]*?)\s*\*\//

/** Splits a heading comment such as `Fills: vivid in both themes` into title and caption. */
function splitHeading(comment: string): { title: string; caption: string } {
  const [title, ...rest] = comment.replace(/\s+/g, ' ').split(': ')
  const caption = rest.join(': ')
  return { title, caption: caption.charAt(0).toUpperCase() + caption.slice(1) }
}

/**
 * The colour tokens of a CSS file, grouped under the heading comment that precedes them.
 * Groups with no colour tokens are left out.
 */
export function colourGroups(css: string): ColourGroup[] {
  const allTokens = parseTokens(css)
  // Splitting on a captured comment gives [before, comment, after, comment, after, ...].
  const parts = css.split(GROUP_HEADING)
  const groups = []
  for (let i = 1; i < parts.length; i += 2) {
    const names = [...parseTokens(parts[i + 1]).keys()].filter((name) => isColour(allTokens, name))
    if (names.length > 0) groups.push({ ...splitHeading(parts[i]), names })
  }
  return groups
}
