import type { Shape } from './illustration-shapes'

/** The illustration hues of illustration-tokens.css */
export const ILLUSTRATION_HUES = ['red', 'ochre', 'steel', 'navy'] as const
type Hue = (typeof ILLUSTRATION_HUES)[number]

/** A hue, or its lighter or darker step: `--illustration-<colour>` */
export type IllustrationColour = Hue | `${Hue}-light` | `${Hue}-shade`

/** Something drawn on a part, inside its outline. */
export interface Detail {
  shape: Shape
  /** Left out for a line */
  fill?: IllustrationColour
  outlined: boolean
}

/** A flat band of colour with no outline of its own, such as a highlight. */
export function band(shape: Shape, fill: IllustrationColour): Detail {
  return { shape, fill, outlined: false }
}

/** A smaller outlined shape on a part, such as a wheel's hub. */
export function piece(shape: Shape, fill: IllustrationColour): Detail {
  return { shape, fill, outlined: true }
}

/** An outline-coloured line, such as a boiler band. */
export function stroke(shape: Shape): Detail {
  return { shape, outlined: true }
}

/** One outlined shape of an exploded illustration, with its details. Lengths are grid units. */
export interface ExplodedPart {
  name: string
  shape: Shape
  fill: IllustrationColour
  /** Drawn in order, and cut off at the part's edge */
  details?: Detail[]
  /** Layers from the back: an exploded part rises and casts a longer shadow for each */
  depth: number
  /** How far the part moves, across and down, when its assembly comes apart */
  explode: [number, number]
}

/** Parts that come apart together. They are drawn in order, back to front. */
export interface ExplodedAssembly {
  name: string
  parts: ExplodedPart[]
}

/** A whole illustration: a grid of `columns` × `rows` units, with its assemblies back to front. */
export interface ExplodedIllustration {
  title: string
  description: string
  columns: number
  rows: number
  /** A dashed line for the ground: its height, and where each dash starts and ends */
  ground: { y: number; dashes: [number, number][] }
  assemblies: ExplodedAssembly[]
}
