import type { ExplodedIllustration } from './exploded-view'

/** A toon steam locomotive and its tender, side on, facing right. */
export const steamTrain: ExplodedIllustration = {
  title: 'A steam locomotive',
  description:
    'A side view of a steam locomotive and its tender. Each assembly comes apart when it is hovered or focused.',
  columns: 70,
  rows: 46,
  assemblies: [
    {
      name: 'Tender',
      parts: [
        { name: 'Coal', x: 7, y: 17.5, w: 10, h: 4, fill: '--navy', depth: 0, explode: [0, -5] },
        { name: 'Water tank', x: 5, y: 20, w: 14, h: 12.5, fill: '--teal', depth: 1, explode: [0, 0], glint: true },
        { name: 'Rear wheel', shape: 'round', x: 6, y: 32, w: 6, h: 6, fill: '--coral', depth: 2, explode: [-1, 4] },
        { name: 'Front wheel', shape: 'round', x: 13, y: 32, w: 6, h: 6, fill: '--coral', depth: 2, explode: [1, 4] },
      ],
    },
    {
      name: 'Cab',
      parts: [
        { name: 'Cab', x: 21, y: 15, w: 12, h: 12, fill: '--coral', depth: 0, explode: [0, 0] },
        { name: 'Roof', shape: 'pill', x: 19.5, y: 13.5, w: 15, h: 2, fill: '--navy', depth: 1, explode: [0, -4] },
        { name: 'Window', x: 24, y: 17.5, w: 6, h: 4.5, fill: '--sky', depth: 2, explode: [0, 3], glint: true },
      ],
    },
    {
      name: 'Chimney and dome',
      parts: [
        { name: 'Chimney', x: 55.5, y: 12, w: 3.5, h: 7, fill: '--navy', depth: 0, explode: [0, -3] },
        { name: 'Chimney cap', shape: 'pill', x: 54.75, y: 11, w: 5, h: 2, fill: '--yellow', depth: 1, explode: [0, -8] },
        { name: 'Steam dome', shape: 'round', x: 42, y: 14.5, w: 6, h: 6, fill: '--yellow', depth: 0, explode: [0, -5], glint: true },
      ],
    },
    {
      name: 'Boiler',
      parts: [
        { name: 'Boiler', x: 32, y: 18, w: 24, h: 9, fill: '--green', depth: 0, explode: [0, 0], glint: true },
        { name: 'Smokebox', x: 54, y: 17.5, w: 7, h: 9.5, fill: '--navy', depth: 1, explode: [4, 0] },
        { name: 'Buffer beam', x: 61, y: 26, w: 2.5, h: 4, fill: '--coral', depth: 2, explode: [4, 0] },
      ],
    },
    {
      name: 'Running gear',
      parts: [
        { name: 'Frame', shape: 'pill', x: 21, y: 27, w: 41, h: 2, fill: '--grape', depth: 0, explode: [0, 0] },
        { name: 'Cylinder', x: 49, y: 28.5, w: 7, h: 4.5, fill: '--lilac', depth: 1, explode: [3, 3] },
        { name: 'Leading wheel', shape: 'round', x: 52, y: 32, w: 6, h: 6, fill: '--coral', depth: 1, explode: [4, 5] },
        { name: 'Rear driver', shape: 'round', x: 27.5, y: 29, w: 9, h: 9, fill: '--coral', depth: 1, explode: [-2, 4], glint: true },
        { name: 'Front driver', shape: 'round', x: 38.5, y: 29, w: 9, h: 9, fill: '--coral', depth: 1, explode: [2, 4], glint: true },
        { name: 'Coupling rod', shape: 'pill', x: 31, y: 32.5, w: 13, h: 2, fill: '--sky', depth: 2, explode: [0, 9] },
      ],
    },
  ],
}
