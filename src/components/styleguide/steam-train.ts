import { band, hatch, piece, stroke, type ExplodedIllustration, type ExplodedPart } from './exploded-view'
import { circle, dome, ellipse, hatching, line, polygon, rect, union } from './illustration-shapes'

/** A wheel: a steel tyre round a red disc, with a steel hub. */
function wheel(
  name: string,
  cx: number,
  cy: number,
  r: number,
  depth: number,
  explode: [number, number]
): ExplodedPart {
  return {
    name,
    shape: circle(cx, cy, r),
    fill: 'steel',
    details: [piece(circle(cx, cy, r * 0.68), 'red'), piece(circle(cx, cy, r * 0.26), 'steel')],
    depth,
    explode,
  }
}

/** A steam locomotive and its tender, side on, facing right. */
export const steamTrain: ExplodedIllustration = {
  title: 'A steam locomotive',
  description:
    'A side view of a steam locomotive and its tender. Each assembly comes apart when it is hovered or focused.',
  columns: 72,
  rows: 46,
  ground: { y: 41, dashes: [[1, 3.5], [5.5, 67], [69, 71]] },
  assemblies: [
    {
      name: 'Tender',
      parts: [
        {
          name: 'Coal',
          shape: polygon([5, 18.5], [7, 16], [10, 15.5], [12.5, 16.5], [15, 15.8], [17, 18.5]),
          fill: 'navy',
          depth: 0,
          explode: [0, -5],
        },
        {
          name: 'Water tank',
          shape: rect(3.5, 18, 15, 13.5, 0.8),
          fill: 'red',
          details: [stroke(rect(5.5, 20.5, 11, 8.5, 0.6))],
          depth: 0,
          explode: [0, 0],
        },
        {
          name: 'Frame',
          shape: rect(2.5, 31.5, 17, 2.5, 0.5),
          fill: 'navy',
          depth: 1,
          explode: [0, 1.5],
        },
        wheel('Rear wheel', 7.5, 37.5, 3, 2, [-1, 4]),
        wheel('Front wheel', 14.5, 37.5, 3, 2, [1, 4]),
      ],
    },
    {
      name: 'Cab',
      parts: [
        {
          name: 'Cab',
          shape: rect(20.5, 15.5, 12, 14, 0.5),
          fill: 'red',
          depth: 0,
          explode: [0, 0],
        },
        {
          name: 'Roof',
          shape: rect(19, 13.5, 15, 2.4, 1.2),
          fill: 'ochre',
          details: [band(rect(19, 13.5, 15, 0.9), 'ochre-light')],
          depth: 1,
          explode: [0, -4],
        },
        {
          name: 'Window',
          shape: rect(23.5, 18, 7, 5, 0.6),
          fill: 'steel',
          details: [band(rect(24.6, 18, 1.4, 5), 'steel-light')],
          depth: 2,
          explode: [0, 2.5],
        },
      ],
    },
    {
      name: 'Chimney and dome',
      parts: [
        {
          name: 'Steam',
          shape: union(circle(48.5, 8.8, 2.1), circle(51.6, 7.4, 2.6), circle(54.8, 8.4, 2), circle(51.5, 9.8, 1.8)),
          fill: 'steel-light',
          details: [band(rect(46, 9.8, 11, 3), 'steel')],
          depth: 1,
          explode: [-3, -3],
        },
        {
          name: 'Chimney',
          shape: polygon([55.4, 19.5], [55.8, 12.5], [58.2, 12.5], [58.6, 19.5]),
          fill: 'navy',
          depth: 0,
          explode: [0, -3],
        },
        {
          name: 'Chimney cap',
          shape: rect(54.7, 11, 4.6, 2, 0.6),
          fill: 'red',
          depth: 1,
          explode: [0, -7],
        },
        {
          name: 'Steam dome',
          shape: dome(43, 15.5, 5, 5),
          fill: 'red',
          details: [band(rect(43, 18.4, 5, 2.1), 'red-shade')],
          depth: 0,
          explode: [0, -4],
        },
      ],
    },
    {
      name: 'Boiler',
      parts: [
        {
          name: 'Boiler',
          shape: rect(32, 19.5, 22.5, 10, 0.6),
          fill: 'ochre',
          details: [
            band(rect(32, 19.5, 22.5, 2.2), 'ochre-light'),
            hatch(hatching(33, 27, 21, 2.5, 2.2)),
            stroke(line(39.5, 19.5, 39.5, 29.5)),
            stroke(line(47, 19.5, 47, 29.5)),
          ],
          depth: 0,
          explode: [0, 0],
        },
        {
          name: 'Smokebox',
          shape: rect(54, 19, 6.5, 11, 0.8),
          fill: 'steel',
          details: [band(rect(54, 19, 6.5, 1.8), 'steel-light'), hatch(hatching(54.6, 27.5, 6, 2.5, 2.2))],
          depth: 1,
          explode: [3, 0],
        },
        {
          name: 'Smokebox door',
          shape: ellipse(60.6, 24.5, 1.3, 4.3),
          fill: 'steel',
          depth: 2,
          explode: [6, 0],
        },
      ],
    },
    {
      name: 'Running gear',
      parts: [
        {
          name: 'Frame',
          shape: rect(20, 29.5, 41, 3, 0.5),
          fill: 'navy',
          depth: 0,
          explode: [0, 0],
        },
        {
          name: 'Cylinder',
          shape: rect(47.5, 31, 7.5, 4.6, 1),
          fill: 'steel',
          details: [band(rect(47.5, 31, 7.5, 1.2), 'steel-light')],
          depth: 1,
          explode: [1, 3],
        },
        {
          name: 'Buffer beam',
          shape: rect(60.5, 29, 2.2, 4.5, 0.4),
          fill: 'red',
          depth: 1,
          explode: [3, 0],
        },
        {
          name: 'Cowcatcher',
          shape: polygon([60.5, 33.5], [63, 33.5], [67, 40.5], [60.5, 40.5]),
          fill: 'red',
          details: [piece(rect(62, 33.5, 1.2, 7), 'ochre'), piece(rect(64.4, 33.5, 1.2, 7), 'ochre')],
          depth: 1,
          explode: [4, 2],
        },
        wheel('Leading wheel', 57, 37.5, 3, 1, [3, 5]),
        wheel('Rear driver', 31, 36, 4.5, 1, [-2, 4]),
        wheel('Front driver', 42, 36, 4.5, 1, [2, 4]),
        {
          name: 'Coupling rod',
          shape: rect(31.2, 37.2, 12.6, 1.4, 0.7),
          fill: 'steel-light',
          depth: 2,
          explode: [0, 6],
        },
      ],
    },
  ],
}
