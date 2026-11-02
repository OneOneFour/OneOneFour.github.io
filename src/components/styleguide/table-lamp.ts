import type { ExplodedIllustration } from './exploded-view'

/** A table lamp: one assembly that comes apart upwards and downwards. */
export const tableLamp: ExplodedIllustration = {
  title: 'A table lamp',
  description: 'A table lamp with a shade, a bulb, a stem and a base. It comes apart when it is hovered or focused.',
  columns: 16,
  rows: 38,
  assemblies: [
    {
      name: 'Lamp',
      parts: [
        { name: 'Stem', x: 7, y: 20, w: 2, h: 10, fill: '--lilac', depth: 0, explode: [0, 1] },
        { name: 'Base', shape: 'pill', x: 3, y: 29, w: 10, h: 3, fill: '--navy', depth: 1, explode: [0, 4] },
        { name: 'Bulb', shape: 'round', x: 5.5, y: 17.5, w: 5, h: 5, fill: '--yellow', depth: 1, explode: [0, -4], glint: true },
        { name: 'Shade', x: 2.5, y: 12, w: 11, h: 7, fill: '--teal', depth: 2, explode: [0, -9], glint: true },
      ],
    },
  ],
}
