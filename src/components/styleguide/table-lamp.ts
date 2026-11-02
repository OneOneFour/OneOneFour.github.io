import { band, type ExplodedIllustration } from './exploded-view'
import { circle, polygon, rect } from './illustration-shapes'

/** A table lamp: one assembly that comes apart upwards and downwards. */
export const tableLamp: ExplodedIllustration = {
  title: 'A table lamp',
  description: 'A table lamp with a shade, a bulb, a stem and a base. It comes apart when it is hovered or focused.',
  columns: 16,
  rows: 38,
  ground: { y: 32.4, dashes: [[1, 2.5], [3.5, 12.5], [13.5, 15]] },
  assemblies: [
    {
      name: 'Lamp',
      parts: [
        {
          name: 'Stem',
          shape: rect(7.2, 21, 1.6, 8.5),
          fill: 'steel',
          details: [band(rect(7.2, 21, 0.6, 8.5), 'steel-light')],
          depth: 0,
          explode: [0, 1],
        },
        {
          name: 'Base',
          shape: rect(3.5, 29, 9, 2.8, 1.4),
          fill: 'navy',
          depth: 1,
          explode: [0, 4],
        },
        {
          name: 'Bulb',
          shape: circle(8, 20.5, 2.5),
          fill: 'ochre-light',
          details: [band(rect(5.5, 21.6, 5, 1.4), 'ochre')],
          depth: 1,
          explode: [0, -4],
        },
        {
          name: 'Shade',
          shape: polygon([5, 12], [11, 12], [13.5, 19], [2.5, 19]),
          fill: 'red',
          details: [band(rect(2, 17, 12, 2), 'red-shade')],
          depth: 2,
          explode: [0, -9],
        },
      ],
    },
  ],
}
