/** Synthetic, seeded data for the chart specimens: the same numbers on every build. */

/** A small seeded random number generator (mulberry32), uniform on [0, 1). */
function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const random = seeded(114)

/** A normally distributed sample (Box–Muller). */
function normal(mean = 0, sd = 1): number {
  return mean + sd * Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random())
}

export interface Series {
  name: string
  values: number[]
}

export const YEARS = Array.from({ length: 41 }, (_, i) => 1980 + i)

/** Four noisy trends over YEARS that end well apart, so each can carry a direct label. */
export const TIME_SERIES: Series[] = [
  { name: 'Series A', start: 0.6, trend: 0.04 },
  { name: 'Series B', start: 0.5, trend: 0.018 },
  { name: 'Series C', start: 0.1, trend: 0.006 },
  { name: 'Series D', start: -0.3, trend: -0.004 },
].map(({ name, start, trend }) => ({
  name,
  values: YEARS.map((_, i) => start + trend * i + normal(0, 0.12)),
}))

export const COLUMNS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, i) => ({
  label,
  value: Math.round(40 + 30 * Math.sin(i / 1.8) + normal(0, 6)),
}))

export interface Cluster {
  name: string
  points: [number, number][]
}

/** Three clusters of points: in a scatter plot any two series can touch, so three is the most
 *  the palette keeps apart for colour-blind readers. */
export const CLUSTERS: Cluster[] = [
  { name: 'Group A', x: 2, y: 3 },
  { name: 'Group B', x: 5, y: 6 },
  { name: 'Group C', x: 7.5, y: 2.5 },
].map(({ name, x, y }) => ({
  name,
  points: Array.from({ length: 40 }, () => [normal(x, 0.9), normal(y, 0.9)] as [number, number]),
}))

/** Monthly anomalies (rows: months, columns: years) with a warming trend, in kelvin. */
export const ANOMALY_YEARS = Array.from({ length: 30 }, (_, i) => 1991 + i)
export const ANOMALIES: number[][] = Array.from({ length: 12 }, () =>
  ANOMALY_YEARS.map((_, i) => 0.09 * (i - 12) + normal(0, 0.55)),
)

/** A value from 0 to 1 for every hour (columns) of every day of a week (rows). */
export const WEEK_BY_HOUR: number[][] = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const daily = 0.5 - 0.45 * Math.cos(((hour - 3) / 24) * 2 * Math.PI)
    const weekend = day >= 5 ? 0.7 : 1
    return Math.min(1, Math.max(0, daily * weekend + normal(0, 0.06)))
  }),
)

/** Short random walks for sparklines. */
export const SPARKS: number[][] = Array.from({ length: 3 }, () => {
  let value = 0
  return Array.from({ length: 24 }, () => (value += normal(0.05, 0.4)))
})
