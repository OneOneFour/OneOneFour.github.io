import { contrast, grade, hexOf, paletteTokens, tokens, type Inputs, type Theme, type Tokens } from './colour-tokens'

/** A colour token in both themes, as the summary shows it. */
export interface SummaryColour {
  /** The token, e.g. `--teal`, or `--shade` with `inputs` */
  name: string
  /** What the row or shade is labelled, e.g. `-deep`; the token by default */
  label: string
  inputs?: Inputs
  /** The page palette it is shown under, if not the default */
  palette?: string
  light: string
  dark: string
}

/** The text colour that goes on a colour, or the colour as text on the page, in both themes. */
export interface SummaryText {
  fg: string
  bg: string
  palette?: string
  light: string
  dark: string
}

/** One summary row: a colour, its permitted shades, and its text pair. */
export interface SummaryRow {
  colour: SummaryColour
  shades: SummaryColour[]
  text?: SummaryText
}

export interface SummaryGroup {
  title: string
  caption: string
  rows: SummaryRow[]
}

const HUES = ['yellow', 'teal', 'navy', 'green', 'sky', 'coral', 'grape', 'tangerine', 'lilac', 'apricot']
const HUE_SHADES = ['-deep', '-tint', '-solid']

interface ColourOptions {
  label?: string
  inputs?: Inputs
  palette?: string
}

/** A palette's tokens: the default palette's unless one is named. */
function tokensFor(palette?: string): Tokens {
  return palette ? paletteTokens.get(palette)! : tokens
}

/** A token's hex in each theme, under a palette and with a recipe's inputs if given. */
function colour(name: string, { label = name, inputs, palette }: ColourOptions = {}): SummaryColour {
  const all = tokensFor(palette)
  const hex = (theme: Theme) => hexOf(all, name, theme, inputs)
  return { name, label, inputs, palette, light: hex('light'), dark: hex('dark') }
}

/** The contrast of `fg` on `bg` in each theme, e.g. `9.1 AAA`. */
function text(fg: string, bg: string, palette?: string): SummaryText {
  const all = tokensFor(palette)
  const measure = (theme: Theme) => {
    const { ratio } = contrast(all, fg, bg, theme)
    return `${ratio.toFixed(1)} ${grade(ratio)}`
  }
  return { fg, bg, palette, light: measure('light'), dark: measure('dark') }
}

/** A colour that is read as text or as an edge on the page. */
function onPage(name: string): SummaryRow {
  return { colour: colour(name), shades: [], text: text(name, '--surface') }
}

/** The label colour a hue's fill carries: its own --on-* token, or --on-fill. */
function labelFor(hue: string): string {
  return tokens.has(`--on-${hue}`) ? `--on-${hue}` : '--on-fill'
}

function hueRow(hue: string): SummaryRow {
  const name = `--${hue}`
  const variants = HUE_SHADES.filter((suffix) => tokens.has(`${name}${suffix}`)).map((suffix) =>
    colour(`${name}${suffix}`, { label: suffix })
  )
  // Navy casts --shadow-lit in the colour shadow mode, so it has no shade.
  const shade = hue === 'navy' ? [] : [colour('--shade', { inputs: { '--shade-of': name } })]
  return { colour: colour(name), shades: [...variants, ...shade], text: text(labelFor(hue), name) }
}

function pageRows(palette: string): SummaryRow[] {
  return ['--surface', '--raised'].map((name) => ({
    colour: colour(name, { label: `${palette} ${name}`, palette }),
    shades: name === '--surface' ? [colour('--folder-back', { palette })] : [],
    text: text('--fg', name, palette),
  }))
}

/** The summary's groups, computed from the token files. */
export const SUMMARY: SummaryGroup[] = [
  {
    title: 'Page palettes',
    caption: 'Cream is the default; set data-palette for slate or greige.',
    rows: [...paletteTokens.keys()].flatMap(pageRows),
  },
  {
    title: 'Neutrals',
    caption: 'Text, outlines, ink and the glint. The dark outline is a known gap (PLAN §5.1b).',
    rows: [
      onPage('--fg'),
      onPage('--muted'),
      onPage('--line'),
      onPage('--line-unfilled'),
      { colour: colour('--ink'), shades: [], text: text('--on-ink', '--ink') },
      { colour: colour('--on-ink'), shades: [], text: text('--on-ink', '--ink') },
      { colour: colour('--glint'), shades: [] },
    ],
  },
  {
    title: 'Hues',
    caption:
      '-deep is for text on the page, -tint for panels, and --shade (75% fill, 25% --line) for the colour shadow mode and the sticky-note fold.',
    rows: HUES.map(hueRow),
  },
  {
    title: 'Focus',
    caption: 'The highlighter band, measured against the outline it hugs.',
    rows: ['--focus', '--focus-alt'].map((name) => ({
      colour: colour(name),
      shades: [],
      text: text(name, '--line'),
    })),
  },
  {
    title: 'Shading',
    caption:
      "Hard shadows: the slab's colour and rim, and the colour mode's shadow for things without a fill. Hatching stripes and tape are translucent.",
    rows: [
      { colour: colour('--shadow-color'), shades: [] },
      { colour: colour('--shadow-edge'), shades: [] },
      onPage('--shadow-lit'),
      { colour: colour('--stripe'), shades: [] },
      { colour: colour('--note-tape'), shades: [] },
    ],
  },
]

/** Every token the summary shows, text colours included, so the full reference can leave them out. */
export const SUMMARY_NAMES: Set<string> = new Set(
  SUMMARY.flatMap((group) => group.rows).flatMap((row) => [
    ...[row.colour, ...row.shades].filter((shown) => !shown.inputs).map((shown) => shown.name),
    ...(row.text ? [row.text.fg] : []),
  ])
)
