/** How far the popped copy reaches past its cell on each side, in SVG units. */
const POP_GROWTH = 3

/** @type {Record<string, [number, number]>} rows and columns to move by */
const ARROW_KEYS = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
}

/**
 * @param {string} value a CSS time, such as `180ms` or `0.18s`
 * @returns {number} the time in milliseconds
 */
function toMilliseconds(value) {
  const number = parseFloat(value) || 0
  return value.trim().endsWith('ms') ? number : number * 1000
}

/**
 * `<rk-heatmap>`: pops the hovered or focused cell of the heatmap inside it, and fills in the
 * tooltip with the cell's data-value and data-name. The cells (`[role="gridcell"]` in
 * `[role="row"]`s) become one tab stop, moved with the arrow keys, and Escape hides the tooltip.
 * chart.css shows and hides the pop and the tooltip; this places them.
 */
export class RkHeatmap extends HTMLElement {
  /** @type {AbortController | undefined} */
  #listeners
  /** @type {SVGElement[][]} */
  #rows = []
  /** @type {SVGElement | undefined} */
  #current

  connectedCallback() {
    this.#rows = [...this.querySelectorAll('[role="row"]')].map((row) => [
      ...row.querySelectorAll('[role="gridcell"]'),
    ])
    if (!this.#rows[0]?.length) return
    this.#rows.flat().forEach((cell) => (cell.tabIndex = -1))
    this.#rows[0][0].tabIndex = 0

    this.#listeners = new AbortController()
    const { signal } = this.#listeners
    this.addEventListener('pointerover', this.#onEnter, { signal })
    this.addEventListener('focusin', this.#onEnter, { signal })
    this.addEventListener('keydown', this.#onKeydown, { signal })
  }

  disconnectedCallback() {
    this.#listeners?.abort()
  }

  get #tip() {
    return this.querySelector('.rk-heatmap-tip')
  }

  /** @param {Event} event */
  #onEnter = (event) => {
    const cell = event.target instanceof Element && event.target.closest('[role="gridcell"]')
    if (cell instanceof SVGElement) this.#show(cell)
  }

  /** @param {KeyboardEvent} event */
  #onKeydown = (event) => {
    if (event.key === 'Escape') {
      this.#tip?.toggleAttribute('data-dismissed', true)
      return
    }
    const step = ARROW_KEYS[event.key]
    const cell = event.target
    if (!step || !(cell instanceof SVGElement)) return

    const row = this.#rows.findIndex((cells) => cells.includes(cell))
    if (row === -1) return
    event.preventDefault()
    const column = this.#rows[row].indexOf(cell)
    const nextRow = this.#rows[Math.min(this.#rows.length - 1, Math.max(0, row + step[0]))]
    const next = nextRow[Math.min(nextRow.length - 1, Math.max(0, column + step[1]))]
    cell.tabIndex = -1
    next.tabIndex = 0
    next.focus()
  }

  /**
   * Moves the pop and the tooltip onto `cell`, and pops it in if it is a new cell.
   * @param {SVGElement} cell
   */
  #show(cell) {
    const [x, y, width, height] = ['x', 'y', 'width', 'height'].map((name) => Number(cell.getAttribute(name)))
    for (const rect of this.querySelectorAll('.rk-heatmap-pop rect')) {
      rect.setAttribute('x', String(x - POP_GROWTH))
      rect.setAttribute('y', String(y - POP_GROWTH))
      rect.setAttribute('width', String(width + 2 * POP_GROWTH))
      rect.setAttribute('height', String(height + 2 * POP_GROWTH))
    }
    const popCell = this.querySelector('.rk-heatmap-pop-cell')
    if (popCell instanceof SVGElement) popCell.style.fill = cell.style.fill

    const tip = this.#tip
    const value = tip?.querySelector('.rk-heatmap-value')
    const name = tip?.querySelector('.rk-heatmap-name')
    if (tip instanceof HTMLElement && value && name) {
      const box = cell.getBoundingClientRect()
      const host = this.getBoundingClientRect()
      Object.assign(tip.style, {
        left: `${box.left - host.left}px`,
        top: `${box.top - host.top}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
      })
      value.textContent = cell.dataset.value ?? ''
      name.textContent = cell.dataset.name ?? ''
      tip.removeAttribute('data-dismissed')
    }

    if (cell !== this.#current && popCell) this.#popIn(popCell)
    this.#current = cell
  }

  /**
   * Grows the popped copy into place, timed and eased by the tokens, so it follows reduced motion.
   * @param {SVGElement} popCell
   */
  #popIn(popCell) {
    const style = getComputedStyle(this)
    popCell.animate(
      { scale: [0.7, 1] },
      {
        duration: toMilliseconds(style.getPropertyValue('--duration-spring')),
        easing: style.getPropertyValue('--ease-snap').trim() || 'ease-out',
      },
    )
  }
}

customElements.define('rk-heatmap', RkHeatmap)
