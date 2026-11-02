/** Degrees of travel, centred on 12 o'clock, leaving a gap at the bottom. */
const SWEEP = 270
/** Angles are in degrees, clockwise from 12 o'clock. */
const START_ANGLE = -SWEEP / 2
const END_ANGLE = SWEEP / 2

/** The SVG is drawn in a square of this many units, centred on (CENTRE, CENTRE). */
const VIEWBOX = 200
const CENTRE = VIEWBOX / 2

const TICK_COUNT = 11
const TICK_INNER_RADIUS = 84
const TICK_OUTER_RADIUS = 94
const TRACK_RADIUS = 84
const LIMIT_RADIUS = 86
const LIMIT_ANGLE = 158

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number} the angle that shows `value` on the dial
 */
function valueToAngle(value, min, max) {
  return START_ANGLE + ((value - min) / (max - min)) * SWEEP
}

/**
 * @param {number} angle an angle within the dial's travel
 * @param {number} min
 * @param {number} max
 * @returns {number} the value at `angle`, not yet snapped to a step
 */
function angleToValue(angle, min, max) {
  return min + ((angle - START_ANGLE) / SWEEP) * (max - min)
}

/**
 * @param {number} radius
 * @param {number} angle
 * @returns {{ x: number, y: number }} the point in the SVG at `radius` and `angle` from the centre
 */
function polarToCartesian(radius, angle) {
  const radians = (angle * Math.PI) / 180
  return { x: CENTRE + radius * Math.sin(radians), y: CENTRE - radius * Math.cos(radians) }
}

/**
 * @param {number} dx distance right of the centre
 * @param {number} dy distance below the centre
 * @returns {number} the angle of that point, from -180 to 180
 */
function pointToAngle(dx, dy) {
  return (Math.atan2(dx, -dy) * 180) / Math.PI
}

/**
 * @param {number} radius
 * @param {number} fromAngle
 * @param {number} toAngle
 * @returns {string} SVG path data for a clockwise arc
 */
function arcPath(radius, fromAngle, toAngle) {
  const start = polarToCartesian(radius, fromAngle)
  const end = polarToCartesian(radius, toAngle)
  const largeArc = toAngle - fromAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

/**
 * @param {string} name
 * @param {Record<string, string | number>} attributes
 * @returns {SVGElement}
 */
function svgElement(name, attributes) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name)
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value))
  return element
}

/** @returns {SVGElement[]} evenly spaced tick marks around the dial's travel */
function ticks() {
  return Array.from({ length: TICK_COUNT }, (_, index) => {
    const angle = START_ANGLE + (index * SWEEP) / (TICK_COUNT - 1)
    const inner = polarToCartesian(TICK_INNER_RADIUS, angle)
    const outer = polarToCartesian(TICK_OUTER_RADIUS, angle)
    return svgElement('line', {
      class: 'rk-dial-tick',
      x1: inner.x,
      y1: inner.y,
      x2: outer.x,
      y2: outer.y,
    })
  })
}

/**
 * @param {string} text
 * @param {number} angle
 * @returns {SVGElement} a min or max label, beside the gap at the bottom
 */
function limitLabel(text, angle) {
  const { x, y } = polarToCartesian(LIMIT_RADIUS, angle)
  const label = svgElement('text', { class: 'rk-dial-limit', x, y })
  label.textContent = text
  return label
}

/**
 * @param {string} className
 * @returns {HTMLSpanElement}
 */
function span(className) {
  const element = document.createElement('span')
  element.className = className
  return element
}

/**
 * `<rk-dial>`: a rotary "thermostat" over a native range input, which stays the focusable,
 * accessible control (keys, labels and forms work as usual). Put a `<label>`, an
 * `<input type="range">` and an optional `<output>` inside it. Add the class `rk-dial--knob` for a
 * turning knob or `rk-dial--arc` for a filled arc with a thumb. Dragging around the dial sets the
 * value and fires `input` and, on release, `change`; the wheel steps it while the input has focus.
 */
export class RkDial extends HTMLElement {
  /** @type {AbortController | undefined} */
  #listeners
  /** @type {HTMLInputElement} */
  #input
  /** @type {HTMLElement} */
  #face
  /** @type {SVGElement | undefined} */
  #fill
  #valueAtDragStart = ''

  connectedCallback() {
    const input = this.querySelector('input[type="range"]')
    if (!(input instanceof HTMLInputElement)) return
    this.#input = input
    this.#face ??= this.#drawFace(input)

    this.#listeners = new AbortController()
    const { signal } = this.#listeners
    this.addEventListener('input', this.#render, { signal })
    this.addEventListener('wheel', this.#onWheel, { signal, passive: false })
    this.#face.addEventListener('pointerdown', this.#onPointerDown, { signal })
    this.#face.addEventListener('pointermove', this.#onPointerMove, { signal })
    this.#face.addEventListener('lostpointercapture', this.#onDragEnd, { signal })
    // A mousedown on the face would otherwise move focus off the input.
    this.#face.addEventListener('mousedown', (event) => event.preventDefault(), { signal })
    this.#render()
  }

  disconnectedCallback() {
    this.#listeners?.abort()
  }

  /** @returns {{ min: number, max: number }} the input's limits; a range defaults to 0 and 100 */
  #limits() {
    const input = this.#input
    return { min: Number(input.min || 0), max: Number(input.max || 100) }
  }

  /**
   * Builds the face (an SVG, plus the knob or thumb) and puts it before the input.
   * @param {HTMLInputElement} input
   * @returns {HTMLElement}
   */
  #drawFace(input) {
    const face = document.createElement('div')
    face.className = 'rk-dial-face'
    face.setAttribute('aria-hidden', 'true')

    const svg = svgElement('svg', { viewBox: `0 0 ${VIEWBOX} ${VIEWBOX}` })
    svg.append(
      limitLabel(input.min || '0', -LIMIT_ANGLE),
      limitLabel(input.max || '100', LIMIT_ANGLE)
    )
    face.append(svg)

    if (this.classList.contains('rk-dial--arc')) {
      const track = arcPath(TRACK_RADIUS, START_ANGLE, END_ANGLE)
      this.#fill = svgElement('path', { class: 'rk-dial-fill' })
      svg.append(
        svgElement('path', { class: 'rk-dial-track-outline', d: track }),
        svgElement('path', { class: 'rk-dial-track', d: track }),
        this.#fill
      )
      face.append(span('rk-dial-thumb'))
    } else {
      svg.append(...ticks())
      const knob = span('rk-dial-knob')
      knob.append(span('rk-dial-notch'))
      face.append(knob)
    }

    input.before(face)
    return face
  }

  /** Turns the knob, or moves the arc and thumb, to the input's value and updates the output. */
  #render = () => {
    const input = this.#input
    const { min, max } = this.#limits()
    const angle = valueToAngle(input.valueAsNumber, min, max)
    this.style.setProperty('--dial-angle', `${angle}deg`)

    if (this.#fill) {
      this.#fill.setAttribute('d', arcPath(TRACK_RADIUS, START_ANGLE, angle))
      const thumb = polarToCartesian(TRACK_RADIUS, angle)
      this.style.setProperty('--dial-thumb-x', `${(thumb.x / VIEWBOX) * 100}%`)
      this.style.setProperty('--dial-thumb-y', `${(thumb.y / VIEWBOX) * 100}%`)
    }

    const output = this.querySelector('output')
    if (output) output.value = input.value
  }

  /**
   * Sets the input's value and fires `input` if it changed. The browser clamps a range input's
   * value to its min and max and snaps it to the nearest step.
   * @param {number} value
   */
  #setValue(value) {
    const input = this.#input
    const before = input.value
    input.value = String(value)
    if (input.value !== before) input.dispatchEvent(new Event('input', { bubbles: true }))
  }

  /**
   * Sets the value from where the pointer is around the dial's centre. In the gap at the bottom,
   * it holds at the nearer end, so a drag past either end doesn't jump to the other.
   * @param {PointerEvent} event
   */
  #setValueFromPointer(event) {
    const box = this.#face.getBoundingClientRect()
    const angle = pointToAngle(
      event.clientX - (box.left + box.width / 2),
      event.clientY - (box.top + box.height / 2)
    )
    const { min, max } = this.#limits()
    if (Math.abs(angle) <= END_ANGLE) {
      this.#setValue(angleToValue(angle, min, max))
    } else {
      const current = this.#input.valueAsNumber
      this.#setValue(current > (min + max) / 2 ? max : min)
    }
  }

  /** @param {PointerEvent} event */
  #onPointerDown = (event) => {
    const input = this.#input
    if (input.disabled || event.button !== 0) return
    this.#face.setPointerCapture(event.pointerId)
    input.focus({ preventScroll: true })
    this.#valueAtDragStart = input.value
    this.toggleAttribute('data-dragging', true)
    this.#setValueFromPointer(event)
  }

  /** @param {PointerEvent} event */
  #onPointerMove = (event) => {
    if (this.hasAttribute('data-dragging')) this.#setValueFromPointer(event)
  }

  /** Fires `change` once at the end of a drag, as a native range does on release. */
  #onDragEnd = () => {
    const input = this.#input
    this.removeAttribute('data-dragging')
    if (input.value !== this.#valueAtDragStart) {
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  /**
   * Steps the value while the input has focus, so an unfocused dial never traps page scrolling.
   * @param {WheelEvent} event
   */
  #onWheel = (event) => {
    const input = this.#input
    if (document.activeElement !== input || event.deltaY === 0) return
    event.preventDefault()
    const before = input.value
    if (event.deltaY < 0) {
      input.stepUp()
    } else {
      input.stepDown()
    }
    if (input.value === before) return
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

customElements.define('rk-dial', RkDial)
