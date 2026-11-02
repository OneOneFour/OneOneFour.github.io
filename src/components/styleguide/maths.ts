import katex from 'katex'

/** The palette hues with a term class; each has a `\name{…}` macro for colour-coded terms. */
export const TERM_HUES = ['teal', 'yellow', 'navy', 'green', 'sky', 'coral', 'grape', 'tangerine']

const termMacros = Object.fromEntries(
  TERM_HUES.map((hue) => [`\\${hue}`, `\\htmlClass{rk-maths-${hue}}{#1}`]),
)

/** KaTeX may only write same-page links (equation references) and rk-maths-* classes. */
function trust(context: { command: string; url?: string; class?: string }): boolean {
  if (context.command === '\\href') return context.url?.startsWith('#') ?? false
  if (context.command === '\\htmlClass') return context.class?.startsWith('rk-maths-') ?? false
  return false
}

/**
 * Renders TeX to KaTeX HTML (with MathML for screen readers) at build time.
 *
 * @param tex the TeX source
 * @param display true for display maths, false (default) for inline
 */
export function renderMaths(tex: string, display = false): string {
  return katex.renderToString(tex, {
    displayMode: display,
    output: 'htmlAndMathml',
    throwOnError: true,
    trust,
    // \htmlClass is a KaTeX extension, which strict mode would warn about.
    strict: (code: string) => (code === 'htmlExtension' ? 'ignore' : 'warn'),
    macros: termMacros,
  })
}
