import type { Shape } from './illustration-shapes'

/** The colours of illustration-tokens.css (`--illustration-<colour>`): each hue, then its step */
export const ILLUSTRATION_COLOURS = [
  ['red', 'red-shade'],
  ['ochre', 'ochre-light'],
  ['steel', 'steel-light'],
  ['navy'],
] as const

export type IllustrationColour = (typeof ILLUSTRATION_COLOURS)[number][number]

/** Something drawn on a part, inside its outline. */
export interface Detail {
  kind: 'band' | 'hatch' | 'piece' | 'stroke'
  shape: Shape
  /** Bands and pieces only */
  fill?: IllustrationColour
}

/** A flat band of colour with no outline of its own, such as a highlight. */
export function band(shape: Shape, fill: IllustrationColour): Detail {
  return { kind: 'band', shape, fill }
}

/** A region of diagonal stripes, like the striped progress bar's, for shade without a shade step. */
export function hatch(shape: Shape): Detail {
  return { kind: 'hatch', shape }
}

/** A smaller outlined shape on a part, such as a wheel's hub. */
export function piece(shape: Shape, fill: IllustrationColour): Detail {
  return { kind: 'piece', shape, fill }
}

/** An outline-coloured line, such as a boiler band. */
export function stroke(shape: Shape): Detail {
  return { kind: 'stroke', shape }
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
