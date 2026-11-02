/** Geometry helpers for the styleguide's hand-drawn SVG charts. */

export type Point = [number, number]

/** The plot area inside a chart's margins, in SVG units. */
export interface Plot {
  left: number
  top: number
  right: number
  bottom: number
}

/** A function mapping `domain` linearly onto `range`. */
export function linear([d0, d1]: [number, number], [r0, r1]: [number, number]) {
  return (value: number) => r0 + ((value - d0) / (d1 - d0)) * (r1 - r0)
}

/** Round tick values (steps of 1, 2 or 5 times a power of ten), from at or below min to at or
 *  above max, so the first and last ticks can bound the axis. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  const rough = (max - min) / count
  const power = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 5, 10].map((m) => m * power).find((s) => s >= rough) ?? rough
  const first = Math.floor(min / step)
  const last = Math.ceil(max / step)
  return Array.from({ length: last - first + 1 }, (_, i) => Number(((first + i) * step).toFixed(10)))
}

/** A tick label, with a true minus sign for negative numbers. */
export function formatTick(value: number): string {
  return String(value).replace('-', '−')
}

export const SEQUENTIAL = ['--seq-1', '--seq-2', '--seq-3', '--seq-4', '--seq-5']
export const DIVERGING = [
  '--div-cold-3',
  '--div-cold-2',
  '--div-cold-1',
  '--div-mid',
  '--div-warm-1',
  '--div-warm-2',
  '--div-warm-3',
]

/** The sequential step for a value from 0 to 1, as a CSS colour. */
export function sequentialColour(value: number): string {
  const step = Math.min(SEQUENTIAL.length - 1, Math.floor(value * SEQUENTIAL.length))
  return `var(${SEQUENTIAL[Math.max(0, step)]})`
}

/** The diverging step for a value, in bins `width` wide with the middle one centred on zero. */
export function divergingColour(value: number, width: number): string {
  const middle = (DIVERGING.length - 1) / 2
  const step = Math.max(-middle, Math.min(middle, Math.round(value / width)))
  return `var(${DIVERGING[step + middle]})`
}

/** An SVG path through the points, one straight segment each. */
export function linePath(points: Point[]): string {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('')
}

/** A column from the baseline up to `top`, with rounded corners at the data end only. */
export function columnPath(x: number, width: number, top: number, baseline: number, radius = 4): string {
  const r = Math.min(radius, width / 2, baseline - top)
  return [
    `M${x} ${baseline}`,
    `V${top + r}`,
    `Q${x} ${top} ${x + r} ${top}`,
    `H${x + width - r}`,
    `Q${x + width} ${top} ${x + width} ${top + r}`,
    `V${baseline}Z`,
  ].join('')
}
