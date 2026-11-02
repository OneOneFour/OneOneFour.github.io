/** Shapes for illustrations: SVG paths in grid units, from the top left, each with its box. */

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

export interface Shape {
  d: string
  box: Box
}

type Point = [number, number]

/** Rounds to three decimals, so that sums such as 0.1 + 0.2 print short. */
function round(value: number): number {
  return Math.round(value * 1000) / 1000
}

/** Path data with each number rounded. */
function path(strings: TemplateStringsArray, ...numbers: number[]): string {
  return strings.reduce((d, text, i) => d + round(numbers[i - 1]) + text)
}

function box(x: number, y: number, w: number, h: number): Box {
  return { x: round(x), y: round(y), w: round(w), h: round(h) }
}

/** The box around a set of points. */
function boxAround(points: Point[]): Box {
  const xs = points.map(([x]) => x)
  const ys = points.map(([, y]) => y)
  const [x, y] = [Math.min(...xs), Math.min(...ys)]
  return box(x, y, Math.max(...xs) - x, Math.max(...ys) - y)
}

/** A box, with corners of radius `r` if given. */
export function rect(x: number, y: number, w: number, h: number, r = 0): Shape {
  if (r === 0) return { d: path`M${x} ${y}h${w}v${h}h${-w}z`, box: box(x, y, w, h) }

  const d = [
    path`M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}`,
    path`a${r} ${r} 0 0 1 ${-r} ${r}h${2 * r - w}a${r} ${r} 0 0 1 ${-r} ${-r}`,
    path`v${2 * r - h}a${r} ${r} 0 0 1 ${r} ${-r}z`,
  ].join('')
  return { d, box: box(x, y, w, h) }
}

/** An ellipse centred on `cx, cy`. */
export function ellipse(cx: number, cy: number, rx: number, ry: number): Shape {
  const d = path`M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`
  return { d, box: box(cx - rx, cy - ry, 2 * rx, 2 * ry) }
}

/** A circle centred on `cx, cy`. */
export function circle(cx: number, cy: number, r: number): Shape {
  return ellipse(cx, cy, r, r)
}

/** A box with a round top, such as a steam dome. It needs to be taller than half its width. */
export function dome(x: number, y: number, w: number, h: number): Shape {
  const r = w / 2
  const d = path`M${x} ${y + h}v${r - h}a${r} ${r} 0 0 1 ${w} 0v${h - r}z`
  return { d, box: box(x, y, w, h) }
}

/** A closed shape through the points, in order. */
export function polygon(...points: Point[]): Shape {
  const d = `M${points.map(([x, y]) => path`${x} ${y}`).join('L')}z`
  return { d, box: boxAround(points) }
}

/** A straight line. */
export function line(x1: number, y1: number, x2: number, y2: number): Shape {
  return { d: path`M${x1} ${y1}L${x2} ${y2}`, box: boxAround([[x1, y1], [x2, y2]]) }
}

/** Short parallel strokes across a box, `gap` apart, each leaning right at 45°. */
export function hatching(x: number, y: number, w: number, h: number, gap: number): Shape {
  const starts = Array.from({ length: Math.floor((w - h) / gap) + 1 }, (_, i) => x + i * gap)
  const d = starts.map((start) => path`M${start} ${y + h}l${h} ${-h}`).join('')
  return { d, box: box(x, y, w, h) }
}

/** Overlapping shapes filled and outlined as one, such as a puff of steam. */
export function union(...shapes: Shape[]): Shape {
  const corners = shapes.flatMap(({ box: { x, y, w, h } }): Point[] => [[x, y], [x + w, y + h]])
  return { d: shapes.map((shape) => shape.d).join(''), box: boxAround(corners) }
}
