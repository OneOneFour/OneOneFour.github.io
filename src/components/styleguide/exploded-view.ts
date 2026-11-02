/** One flat shape of an exploded illustration. Lengths are grid units from the top left. */
export interface ExplodedPart {
  name: string
  /** A circle or ellipse, or a pill; a rounded box if left out */
  shape?: 'round' | 'pill'
  x: number
  y: number
  w: number
  h: number
  /** A fill token, such as '--coral' */
  fill: string
  /** Layers from the back: an exploded part rises and casts a longer shadow for each */
  depth: number
  /** How far the part moves, across and down, when its assembly comes apart */
  explode: [number, number]
  /** A highlight on the side the light comes from */
  glint?: boolean
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
  assemblies: ExplodedAssembly[]
}
