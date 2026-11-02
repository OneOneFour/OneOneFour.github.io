import { band, piece, stroke, type ExplodedIllustration, type ExplodedPart } from './exploded-view'
import { circle, dome, ellipse, line, polygon, rect, union } from './illustration-shapes'

/** A wheel: a steel tyre, shaded underneath, round a red disc and a navy hub. */
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
    details: [
      band(rect(cx - r, cy + r / 2, 2 * r, r), 'steel-shade'),
      piece(circle(cx, cy, r * 0.68), 'red'),
      piece(circle(cx, cy, r * 0.26), 'navy'),
    ],
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
          details: [band(circle(9, 17.2, 0.45), 'navy-light'), band(circle(13.5, 17.4, 0.45), 'navy-light')],
          depth: 0,
          explode: [0, -5],
        },
        {
          name: 'Water tank',
          shape: rect(3.5, 18, 15, 13.5, 0.8),
          fill: 'red',
          details: [
            band(rect(3.5, 18, 15, 1.6), 'red-light'),
            band(rect(3.5, 28.5, 15, 3), 'red-shade'),
            stroke(rect(5.5, 20.8, 11, 5.8, 0.6)),
          ],
          depth: 0,
          explode: [0, 0],
        },
        {
          name: 'Frame',
          shape: rect(2.5, 31.5, 17, 2.5, 0.5),
          fill: 'navy',
          details: [band(rect(2.5, 31.5, 17, 0.8), 'navy-light'), band(rect(2.5, 33.2, 17, 0.8), 'navy-shade')],
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
          details: [band(rect(20.5, 26.5, 12, 3), 'red-shade'), piece(rect(20.5, 25.2, 12, 1.3), 'ochre')],
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
          details: [
            band(rect(24.3, 18, 1.1, 5), 'steel-light'),
            band(rect(27.8, 18, 1.1, 5), 'steel-light'),
            stroke(line(27, 18, 27, 23)),
          ],
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
          details: [band(rect(55, 12.5, 1.6, 7), 'navy-light')],
          depth: 0,
          explode: [0, -3],
        },
        {
          name: 'Chimney cap',
          shape: rect(54.7, 11, 4.6, 2, 0.6),
          fill: 'red',
          details: [band(rect(54.7, 11, 4.6, 0.7), 'red-light')],
          depth: 1,
          explode: [0, -7],
        },
        {
          name: 'Steam dome',
          shape: dome(43, 15.5, 5, 5),
          fill: 'red',
          details: [band(rect(43.7, 16, 1, 4), 'red-light'), band(rect(43, 18.4, 5, 2.1), 'red-shade')],
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
            band(rect(32, 26.8, 22.5, 2.7), 'ochre-shade'),
            stroke(line(37.5, 19.5, 37.5, 29.5)),
            stroke(line(43, 19.5, 43, 29.5)),
            stroke(line(48.5, 19.5, 48.5, 29.5)),
          ],
          depth: 0,
          explode: [0, 0],
        },
        {
          name: 'Smokebox',
          shape: rect(54, 19, 6.5, 11, 0.8),
          fill: 'steel',
          details: [band(rect(54, 19, 6.5, 1.8), 'steel-light'), band(rect(54, 27.3, 6.5, 2.7), 'steel-shade')],
          depth: 1,
          explode: [3, 0],
        },
        {
          name: 'Smokebox door',
          shape: ellipse(60.6, 24.5, 1.3, 4.3),
          fill: 'steel',
          details: [band(rect(59.3, 20.2, 2.6, 1.6), 'steel-light'), piece(circle(61, 24.5, 0.55), 'navy')],
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
          details: [band(rect(20, 29.5, 41, 0.9), 'navy-light'), band(rect(20, 31.5, 41, 1), 'navy-shade')],
          depth: 0,
          explode: [0, 0],
        },
        {
          name: 'Cylinder',
          shape: rect(47.5, 31, 7.5, 4.6, 1),
          fill: 'steel',
          details: [
            band(rect(47.5, 31, 7.5, 1.2), 'steel-light'),
            band(rect(47.5, 34.2, 7.5, 1.4), 'steel-shade'),
            stroke(line(49.2, 31, 49.2, 35.6)),
            stroke(line(53.3, 31, 53.3, 35.6)),
          ],
          depth: 1,
          explode: [1, 3],
        },
        {
          name: 'Buffer beam',
          shape: rect(60.5, 29, 2.2, 4.5, 0.4),
          fill: 'red',
          details: [band(rect(60.5, 32, 2.2, 1.5), 'red-shade')],
          depth: 1,
          explode: [3, 0],
        },
        {
          name: 'Buffer',
          shape: union(rect(62.7, 30.4, 1.8, 1.6), rect(64.3, 29.8, 1, 2.8, 0.4)),
          fill: 'steel',
          details: [band(rect(62.7, 29.8, 3, 0.6), 'steel-light')],
          depth: 2,
          explode: [5, 0],
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
          details: [piece(circle(32, 37.9, 0.45), 'navy'), piece(circle(43, 37.9, 0.45), 'navy')],
          depth: 2,
          explode: [0, 6],
        },
      ],
    },
  ],
}
