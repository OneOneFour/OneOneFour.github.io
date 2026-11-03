/** Specimen code shared by the styleguide's font, code block and overflow specimens. */

export const LORENZ_PYTHON = `def lorenz(x, y, z, σ=10.0, ρ=28.0, β=8 / 3) -> tuple:
    """Return (dx/dt, dy/dt, dz/dt) for the Lorenz system."""
    # σ: Prandtl number, ρ: Rayleigh number
    return σ * (y - x), x * (ρ - z) - y, x * y - β * z

Δt = 0.01  # step size
if Δt != 0 and Δt <= 0.1:
    steps = {"n": 1000, "Δt": Δt}`

export const LORENZ_JS = `// One Euler step; the long lines show the block scrolling sideways.
export function step([x, y, z], dt, { sigma = 10, rho = 28, beta = 8 / 3 } = {}) {
  return [x + dt * sigma * (y - x), y + dt * (x * (rho - z) - y), z + dt * (x * y - beta * z)]
}`
