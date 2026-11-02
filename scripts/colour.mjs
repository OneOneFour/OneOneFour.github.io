/**
 * Colour maths for the contrast check: parsing, color-mix() as CSS Color 5 defines it,
 * compositing and WCAG contrast. A colour is `{ r, g, b, alpha }`, each from 0 to 1, in sRGB.
 */

/** Parses `#rgb`, `#rrggbb`, `#rrggbbaa` or `transparent`. */
export function parseColour(text) {
  const value = text.trim().toLowerCase()
  if (value === 'transparent') return { r: 0, g: 0, b: 0, alpha: 0 }

  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(value)
  const long = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/.exec(value)
  if (short) {
    const [r, g, b] = short.slice(1).map((digit) => parseInt(digit + digit, 16) / 255)
    return { r, g, b, alpha: 1 }
  }
  if (long) {
    const [r, g, b] = long.slice(1, 4).map((pair) => parseInt(pair, 16) / 255)
    return { r, g, b, alpha: long[4] ? parseInt(long[4], 16) / 255 : 1 }
  }
  throw new Error(`Not a colour this script can read: ${text}`)
}

/** A colour as `#rrggbb`, or `#rrggbbaa` when it is translucent. Channels are clamped to 0–1. */
export function toHex({ r, g, b, alpha }) {
  const channels = alpha < 1 ? [r, g, b, alpha] : [r, g, b]
  const bytes = channels.map((channel) => Math.round(Math.min(1, Math.max(0, channel)) * 255))
  return `#${bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')}`
}

function toLinear(channel) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

function fromLinear(channel) {
  return channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055
}

/** sRGB to OKLab `[L, a, b]`, with Björn Ottosson's published matrices. */
function srgbToOklab({ r, g, b }) {
  const [lr, lg, lb] = [r, g, b].map(toLinear)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

/** OKLab `[L, a, b]` back to sRGB `{ r, g, b }`, unclamped. */
function oklabToSrgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return {
    r: fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  }
}

// Below this chroma an OKLCh hue is "powerless" and counts as missing when mixing.
const ACHROMATIC = 1e-4

/**
 * The three interpolation spaces color-mix() accepts here. Each converts a colour to its
 * coordinates and back. OKLCh's hue (the third coordinate) is null when powerless.
 */
const SPACES = {
  srgb: {
    to: ({ r, g, b }) => [r, g, b],
    from: ([r, g, b]) => ({ r, g, b }),
  },
  oklab: { to: srgbToOklab, from: oklabToSrgb },
  oklch: {
    to(colour) {
      const [L, a, b] = srgbToOklab(colour)
      const chroma = Math.hypot(a, b)
      const hue = chroma < ACHROMATIC ? null : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360
      return [L, chroma, hue]
    },
    from([L, chroma, hue]) {
      const radians = ((hue ?? 0) * Math.PI) / 180
      return oklabToSrgb([L, chroma * Math.cos(radians), chroma * Math.sin(radians)])
    },
  },
}

/** Interpolates two hues in degrees the shorter way round, from `h1` (t = 0) to `h2` (t = 1). */
function mixHue(h1, h2, t) {
  if (h1 === null) return h2
  if (h2 === null) return h1
  const delta = ((h2 - h1 + 540) % 360) - 180
  return (h1 + delta * t + 360) % 360
}

/**
 * Normalises color-mix()'s two percentages (null when left out) to weights that sum to 1, and the
 * alpha multiplier that applies when they summed to less than 100%.
 */
export function mixWeights(p1, p2) {
  if (p1 === null && p2 === null) [p1, p2] = [50, 50]
  else if (p1 === null) p1 = 100 - p2
  else if (p2 === null) p2 = 100 - p1

  const sum = p1 + p2
  if (sum <= 0) throw new Error('color-mix() percentages must not sum to zero')
  return { w1: p1 / sum, w2: p2 / sum, alphaScale: Math.min(1, sum / 100) }
}

/**
 * Mixes two colours in a space, as color-mix() does: each is premultiplied by its alpha, the two
 * are interpolated by the weights, and the result is divided by its own alpha again.
 *
 * @param space 'srgb', 'oklab' or 'oklch'
 * @param first the first colour and its percentage (null when left out)
 * @param second the second colour and its percentage
 */
export function mixColours(space, [c1, p1], [c2, p2]) {
  const { to, from } = SPACES[space] ?? {}
  if (!to) throw new Error(`Unsupported color-mix() space: ${space}`)
  const { w1, w2, alphaScale } = mixWeights(p1, p2)

  const alpha = c1.alpha * w1 + c2.alpha * w2
  if (alpha === 0) return { r: 0, g: 0, b: 0, alpha: 0 }

  const [x1, x2] = [to(c1), to(c2)]
  // OKLCh's hue isn't premultiplied, and a missing hue takes the other colour's.
  const coordinates = [0, 1, 2].map((i) =>
    space === 'oklch' && i === 2
      ? null
      : (x1[i] * c1.alpha * w1 + x2[i] * c2.alpha * w2) / alpha
  )
  if (space === 'oklch') coordinates[2] = mixHue(x1[2], x2[2], w2)

  return { ...from(coordinates), alpha: alpha * alphaScale }
}

/** Splits a list at its top-level commas, leaving commas inside brackets alone. */
function splitTopLevel(text) {
  const parts = []
  let depth = 0
  let start = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '(') depth++
    else if (text[i] === ')') depth--
    else if (text[i] === ',' && depth === 0) {
      parts.push(text.slice(start, i))
      start = i + 1
    }
  }
  return [...parts, text.slice(start)].map((part) => part.trim())
}

/** Splits one color-mix() argument, such as `#05070b 8%`, into its colour text and percentage. */
function splitPercentage(argument) {
  const after = /^([\s\S]+?)\s+(-?[\d.]+)%$/.exec(argument)
  if (after) return [after[1], Number(after[2])]
  const before = /^(-?[\d.]+)%\s+([\s\S]+)$/.exec(argument)
  if (before) return [before[2], Number(before[1])]
  return [argument, null]
}

/**
 * Evaluates a colour value with no `var()` or `light-dark()` left in it: a plain colour or a
 * `color-mix()`, which may nest.
 */
export function evaluateColour(value) {
  const text = value.trim()
  const call = /^color-mix\(([\s\S]*)\)$/.exec(text)
  if (!call) return parseColour(text)

  const [method, ...colours] = splitTopLevel(call[1])
  const space = /^in\s+([\w-]+)$/.exec(method)?.[1]
  if (!space || colours.length !== 2) throw new Error(`Malformed color-mix(): ${text}`)

  const [first, second] = colours.map((argument) => {
    const [colour, percentage] = splitPercentage(argument)
    return [evaluateColour(colour), percentage]
  })
  return mixColours(space, first, second)
}

/**
 * Paints `top` over `bottom` (source-over). An opaque `top` needs no backdrop; a translucent one
 * throws without one, because its colour depends on what it sits on.
 */
export function composite(top, bottom) {
  if (top.alpha >= 1) return top
  if (!bottom) throw new Error(`${toHex(top)} is translucent and needs a backdrop`)

  const alpha = top.alpha + bottom.alpha * (1 - top.alpha)
  const channel = (key) => (top[key] * top.alpha + bottom[key] * bottom.alpha * (1 - top.alpha)) / alpha
  return { r: channel('r'), g: channel('g'), b: channel('b'), alpha }
}

/** WCAG 2.x relative luminance of an opaque colour. */
export function relativeLuminance({ r, g, b }) {
  const [lr, lg, lb] = [r, g, b].map(toLinear)
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

/** WCAG 2.x contrast ratio between two opaque colours, from 1 to 21. */
export function contrastRatio(a, b) {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x)
  return (lighter + 0.05) / (darker + 0.05)
}

// Known results, from the CSS Color 5 examples and Ottosson's OKLab reference values.
const SELF_CHECKS = [
  ['color-mix(in srgb, #000000, #ffffff)', '#808080'],
  ['color-mix(in srgb, #ff0000 20%, #0000ff 20%)', '#80008066'],
  ['color-mix(in srgb, #ff0000 50%, transparent)', '#ff000080'],
  ['color-mix(in oklab, #000000, #ffffff)', '#636363'],
  ['color-mix(in oklch, #ff0000, transparent)', '#ff000080'],
  ['color-mix(in oklab, color-mix(in srgb, #cc0000, #0000cc) 100%, #00ff00)', '#660066'],
]

/** Runs the self-checks above. Returns the ones that fail, as messages. */
export function selfCheck() {
  return SELF_CHECKS.flatMap(([input, expected]) => {
    const actual = toHex(evaluateColour(input))
    return actual === expected ? [] : [`${input} gave ${actual}, expected ${expected}`]
  })
}
