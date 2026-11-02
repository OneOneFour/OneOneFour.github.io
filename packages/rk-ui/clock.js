/** The SVG is drawn in a square of this many units, centred on (CENTRE, CENTRE). */
const VIEWBOX = 200
const CENTRE = VIEWBOX / 2

/** The day and night ring, where the hour hand's tag rides */
const RING_RADIUS = 86
const RING_WIDTH = 28
const TICK_INNER_RADIUS = 58
const QUARTER_TICK_INNER_RADIUS = 54
const TICK_OUTER_RADIUS = 66
const MINUTE_HAND_RADIUS = 40

/** The hour hand goes round once a day, with noon at the top and midnight at the bottom. */
const DEGREES_PER_HOUR = 360 / 24
const DEGREES_PER_MINUTE = 360 / 60
const NOON_ANGLE = 12 * DEGREES_PER_HOUR

/**
 * @param {number} value
 * @param {number} divisor
 * @returns {number} `value` modulo `divisor`, never negative
 */
function wrap(value, divisor) {
  return ((value % divisor) + divisor) % divisor
}

/**
 * @param {number} radius
 * @param {number} angle degrees clockwise from 12 o'clock
 * @returns {{ x: number, y: number }} the point in the SVG at `radius` and `angle` from the centre
 */
function polarToCartesian(radius, angle) {
  const radians = (angle * Math.PI) / 180
  return { x: CENTRE + radius * Math.sin(radians), y: CENTRE - radius * Math.cos(radians) }
}

/**
 * @param {number} radius
 * @param {number} fromAngle
 * @param {number} toAngle
 * @returns {string} SVG path data for a clockwise arc of up to half a turn
 */
function arcPath(radius, fromAngle, toAngle) {
  const start = polarToCartesian(radius, fromAngle)
  const end = polarToCartesian(radius, toAngle)
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`
}

/**
 * @param {number} previous the angle a hand points at now, which may be past 360 or below 0
 * @param {number} angle the way it should point next, from 0 to 360
 * @returns {number} the angle nearest `previous` that points the same way as `angle`, so the
 *   hand takes the short way round instead of spinning back past 12
 */
function nearestTurn(previous, angle) {
  return previous + wrap(angle - previous + 180, 360) - 180
}

/**
 * @param {number} value
 * @returns {string} the value as two digits
 */
function twoDigits(value) {
  return String(value).padStart(2, '0')
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
 * Sets `--clock-x` and `--clock-y` on the element, for CSS to centre it on that point of the face.
 * @param {SVGElement} element
 * @param {number} radius
 * @param {number} angle
 */
function placeOnFace(element, radius, angle) {
  const { x, y } = polarToCartesian(radius, angle)
  element.style.setProperty('--clock-x', `${(x / VIEWBOX) * 100}%`)
  element.style.setProperty('--clock-y', `${(y / VIEWBOX) * 100}%`)
}

/**
 * @param {string} className
 * @param {number} innerRadius
 * @param {number} outerRadius
 * @param {number} angle
 * @returns {SVGElement} a line pointing out from the centre, between the two radii
 */
function radialLine(className, innerRadius, outerRadius, angle) {
  const inner = polarToCartesian(innerRadius, angle)
  const outer = polarToCartesian(outerRadius, angle)
  return svgElement('line', {
    class: className,
    x1: inner.x,
    y1: inner.y,
    x2: outer.x,
    y2: outer.y,
  })
}

/**
 * @param {string} className
 * @param {number} fromAngle
 * @returns {SVGElement} half of the day and night ring, clockwise from `fromAngle`
 */
function ringHalf(className, fromAngle) {
  return svgElement('path', {
    class: className,
    d: arcPath(RING_RADIUS, fromAngle, fromAngle + 180),
    'stroke-width': RING_WIDTH,
  })
}

/** @returns {SVGElement[]} the day half of the ring over the top, the night half under it */
function dayAndNightRing() {
  const sixAm = 6 * DEGREES_PER_HOUR - NOON_ANGLE
  const sixPm = 18 * DEGREES_PER_HOUR - NOON_ANGLE
  const innerEdge = RING_RADIUS - RING_WIDTH / 2
  const outerEdge = RING_RADIUS + RING_WIDTH / 2
  return [
    ringHalf('rk-clock-day', sixAm),
    ringHalf('rk-clock-night', sixPm),
    svgElement('circle', { class: 'rk-clock-ring-edge', cx: CENTRE, cy: CENTRE, r: innerEdge }),
    radialLine('rk-clock-ring-edge', innerEdge, outerEdge, sixAm),
    radialLine('rk-clock-ring-edge', innerEdge, outerEdge, sixPm),
  ]
}

/** @returns {SVGElement[]} a tick for every five minutes, longer at the quarters */
function minuteTicks() {
  return Array.from({ length: 12 }, (_, index) => {
    const angle = index * 5 * DEGREES_PER_MINUTE
    return index % 3 === 0
      ? radialLine(
          'rk-clock-tick rk-clock-tick--quarter',
          QUARTER_TICK_INNER_RADIUS,
          TICK_OUTER_RADIUS,
          angle
        )
      : radialLine('rk-clock-tick', TICK_INNER_RADIUS, TICK_OUTER_RADIUS, angle)
  })
}

/** @typedef {{ hand: HTMLElement, tag: HTMLElement }} ClockHand */

/**
 * @param {'hour' | 'minute'} name
 * @param {number} length in SVG units
 * @returns {ClockHand} a hand of that length, with its tag at the tip
 */
function clockHand(name, length) {
  const hand = span(`rk-clock-hand rk-clock-hand--${name}`)
  hand.style.setProperty('--hand-length', `${(length / VIEWBOX) * 100}%`)
  const tip = span('rk-clock-tip')
  const tag = span('rk-clock-tag')
  tip.append(tag)
  hand.append(tip)
  return { hand, tag }
}

/**
 * `<rk-clock>`: a clock face with hands to drag, over a native `<input type="time">`, which stays
 * the control for keys, screen readers and forms. Put a `<label>` and the input inside it, and,
 * optionally, a day and a night icon with the classes `rk-clock-day-icon` and
 * `rk-clock-night-icon`. The hour hand goes round once a day on a ring split into day (6:00 to
 * 18:00, over the top) and night. Dragging a hand sets the input, snapping minutes to its `step`
 * (in seconds, e.g. 300 for five minutes), and fires `input` and, on release, `change`. The
 * minute hand carries into the hour as it passes 12.
 */
export class RkClock extends HTMLElement {
  /** @type {AbortController | undefined} */
  #listeners
  /** @type {HTMLInputElement} */
  #input
  /** @type {HTMLElement} */
  #face
  /** @type {{ hour: ClockHand, minute: ClockHand }} */
  #hands
  /** @type {'hour' | 'minute' | undefined} */
  #grabbed
  #hourAngle = 0
  #minuteAngle = 0
  #valueAtDragStart = ''

  connectedCallback() {
    const input = this.querySelector('input[type="time"]')
    if (!(input instanceof HTMLInputElement)) return
    this.#input = input
    this.#face ??= this.#drawFace(input)

    this.#listeners = new AbortController()
    const { signal } = this.#listeners
    this.addEventListener('input', this.#render, { signal })
    this.#face.addEventListener('pointerdown', this.#onPointerDown, { signal })
    this.#face.addEventListener('pointermove', this.#onPointerMove, { signal })
    this.#face.addEventListener('lostpointercapture', this.#onDragEnd, { signal })
    this.#render()
  }

  disconnectedCallback() {
    this.#listeners?.abort()
  }

  /**
   * Builds the face (an SVG, the icons, the hands and their tags) and puts it before the input.
   * @param {HTMLInputElement} input
   * @returns {HTMLElement}
   */
  #drawFace(input) {
    const face = document.createElement('div')
    face.className = 'rk-clock-face'
    face.setAttribute('aria-hidden', 'true')

    const svg = svgElement('svg', { viewBox: `0 0 ${VIEWBOX} ${VIEWBOX}` })
    svg.append(...dayAndNightRing(), ...minuteTicks())
    face.append(svg)

    const icons = { '.rk-clock-day-icon': 0, '.rk-clock-night-icon': 180 }
    for (const [selector, angle] of Object.entries(icons)) {
      const icon = this.querySelector(selector)
      if (!(icon instanceof SVGElement)) continue
      placeOnFace(icon, RING_RADIUS, angle)
      face.append(icon)
    }

    this.#hands = {
      hour: clockHand('hour', RING_RADIUS),
      minute: clockHand('minute', MINUTE_HAND_RADIUS),
    }
    face.append(this.#hands.hour.hand, this.#hands.minute.hand, span('rk-clock-hub'))

    input.before(face)
    return face
  }

  /** @returns {{ hours: number, minutes: number }} the input's time; an empty input is midnight */
  #time() {
    const [hours = 0, minutes = 0] = this.#input.value.split(':').map(Number)
    return { hours, minutes }
  }

  /** @returns {number} the minutes a drag snaps to, from the input's step (one by default) */
  #minuteStep() {
    return Math.max(1, Math.round(Number(this.#input.step || 60) / 60))
  }

  /** Turns the hands to the input's time and writes it on their tags. */
  #render = () => {
    if (this.#input.value === '') return
    const { hours, minutes } = this.#time()
    const { hour, minute } = this.#hands

    const hourAngle = wrap((hours + minutes / 60) * DEGREES_PER_HOUR - NOON_ANGLE, 360)
    this.#hourAngle = nearestTurn(this.#hourAngle, hourAngle)
    this.#minuteAngle = nearestTurn(this.#minuteAngle, minutes * DEGREES_PER_MINUTE)
    hour.hand.style.setProperty('--hand-angle', `${this.#hourAngle}deg`)
    minute.hand.style.setProperty('--hand-angle', `${this.#minuteAngle}deg`)

    hour.tag.textContent = twoDigits(hours)
    minute.tag.textContent = twoDigits(minutes)
  }

  /**
   * Sets the input to the time and fires `input` if it changed.
   * @param {number} hours any whole number; it wraps round the day
   * @param {number} minutes from 0 to 59
   */
  #setTime(hours, minutes) {
    const input = this.#input
    const value = `${twoDigits(wrap(hours, 24))}:${twoDigits(minutes)}`
    if (value === input.value) return
    input.value = value
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }

  /**
   * @param {PointerEvent} event
   * @returns {number} the pointer's angle around the face's centre, clockwise from 12, 0 to 360
   */
  #pointerAngle(event) {
    const box = this.#face.getBoundingClientRect()
    const dx = event.clientX - (box.left + box.width / 2)
    const dy = event.clientY - (box.top + box.height / 2)
    return wrap((Math.atan2(dx, -dy) * 180) / Math.PI, 360)
  }

  /**
   * @param {PointerEvent} event
   * @returns {'hour' | 'minute'} the hand whose tag is nearer the pointer
   */
  #nearestHand(event) {
    const distance = (/** @type {HTMLElement} */ tag) => {
      const box = tag.getBoundingClientRect()
      return Math.hypot(
        event.clientX - (box.left + box.width / 2),
        event.clientY - (box.top + box.height / 2)
      )
    }
    const { hour, minute } = this.#hands
    return distance(hour.tag) < distance(minute.tag) ? 'hour' : 'minute'
  }

  /**
   * Moves the grabbed hand to the pointer. The hour hand keeps the minutes; the minute hand snaps
   * to the step and, passing 12, moves the hour on or back, as on a real clock.
   * @param {PointerEvent} event
   */
  #setTimeFromPointer(event) {
    const angle = this.#pointerAngle(event)
    const { hours, minutes } = this.#time()

    if (this.#grabbed === 'hour') {
      const hour = Math.round((angle + NOON_ANGLE) / DEGREES_PER_HOUR - minutes / 60)
      this.#setTime(hour, minutes)
      return
    }

    const step = this.#minuteStep()
    const minute = wrap(Math.round(angle / DEGREES_PER_MINUTE / step) * step, 60)
    let hour = hours
    if (minutes >= 45 && minute < 15) hour += 1
    if (minutes < 15 && minute >= 45) hour -= 1
    this.#setTime(hour, minute)
  }

  /** @param {PointerEvent} event */
  #onPointerDown = (event) => {
    if (this.#input.disabled || event.button !== 0) return
    this.#face.setPointerCapture(event.pointerId)
    this.#valueAtDragStart = this.#input.value
    this.#grabbed = this.#nearestHand(event)
    this.#hands[this.#grabbed].hand.toggleAttribute('data-grabbed', true)
    this.#setTimeFromPointer(event)
  }

  /** @param {PointerEvent} event */
  #onPointerMove = (event) => {
    if (this.#grabbed) this.#setTimeFromPointer(event)
  }

  /** Fires `change` once at the end of a drag, as a native input does when it's committed. */
  #onDragEnd = () => {
    if (!this.#grabbed) return
    this.#hands[this.#grabbed].hand.removeAttribute('data-grabbed')
    this.#grabbed = undefined
    const input = this.#input
    if (input.value !== this.#valueAtDragStart) {
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }
}

customElements.define('rk-clock', RkClock)
