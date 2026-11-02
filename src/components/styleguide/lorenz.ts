/** The Lorenz system, integrated at build time for the static widget mock. */

type State = [number, number, number]

const SIGMA = 10
const RHO = 28
const BETA = 8 / 3

function derivative([x, y, z]: State): State {
  return [SIGMA * (y - x), x * (RHO - z) - y, x * y - BETA * z]
}

function add(a: State, b: State, scale: number): State {
  return [a[0] + b[0] * scale, a[1] + b[1] * scale, a[2] + b[2] * scale]
}

/** One fourth-order Runge–Kutta step. */
function step(state: State, dt: number): State {
  const k1 = derivative(state)
  const k2 = derivative(add(state, k1, dt / 2))
  const k3 = derivative(add(state, k2, dt / 2))
  const k4 = derivative(add(state, k3, dt))
  return state.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])) as State
}

/**
 * A trajectory from `start`, as one state every `every` steps.
 *
 * @param start the initial (x, y, z)
 * @param steps how many steps of `dt` to take
 * @param dt the time step
 * @param every keep one state in this many
 */
export function trajectory(start: State, steps: number, dt = 0.01, every = 2): State[] {
  const states: State[] = []
  let state = start
  for (let i = 0; i <= steps; i++) {
    if (i % every === 0) states.push(state)
    state = step(state, dt)
  }
  return states
}
