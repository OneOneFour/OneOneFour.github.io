/** Angles are in degrees, clockwise from 12 o'clock, and name where the light comes from. */
const DEFAULT_ANGLE = 315

/** At the default angle this gives --shadow-dx and --shadow-dy of exactly 1. */
const SHADOW_LENGTH = Math.SQRT2

const SUNRISE_HOUR = 6
const SUNSET_HOUR = 18
/** The sun rises on the left, at 9 o'clock. */
const SUNRISE_ANGLE = 270
const CLOCK_INTERVAL_MS = 60_000

/**
 * @param {number} value
 * @returns {string} `value` rounded to three decimals, so the default angle gives exactly 1
 */
function toToken(value) {
  return String(Math.round(value * 1000) / 1000)
}

/**
 * Points every shadow away from a light at `angle`, by setting --shadow-dx and --shadow-dy on
 * `<html>`.
 * @param {number} angle where the light comes from
 */
function setLightAngle(angle) {
  const radians = (angle * Math.PI) / 180
  const style = document.documentElement.style
  style.setProperty('--shadow-dx', toToken(-SHADOW_LENGTH * Math.sin(radians)))
  style.setProperty('--shadow-dy', toToken(SHADOW_LENGTH * Math.cos(radians)))
}

/**
 * The sun rises on the left at 6:00, is overhead at noon and sets on the right at 18:00, so 9:00
 * gives the default angle. At night the light goes back to the default.
 * @param {Date} time
 * @returns {number} the light angle at `time`
 */
function sunAngle(time) {
  const hour = time.getHours() + time.getMinutes() / 60
  const dayFraction = (hour - SUNRISE_HOUR) / (SUNSET_HOUR - SUNRISE_HOUR)
  if (dayFraction < 0 || dayFraction > 1) return DEFAULT_ANGLE
  return (SUNRISE_ANGLE + 180 * dayFraction) % 360
}

/**
 * `<rk-light-direction>`: turns the light for the whole page. It enhances a range input (the
 * light angle, 0 to 359) and an optional checkbox that makes the light follow the time of day,
 * both put inside it by the page.
 */
export class RkLightDirection extends HTMLElement {
  /** @type {AbortController | undefined} */
  #listeners
  /** @type {HTMLInputElement} */
  #angleInput
  /** @type {HTMLInputElement | undefined} */
  #clockInput
  /** @type {number | undefined} */
  #clock

  connectedCallback() {
    const angleInput = this.querySelector('input[type="range"]')
    if (!(angleInput instanceof HTMLInputElement)) return
    this.#angleInput = angleInput
    const clockInput = this.querySelector('input[type="checkbox"]')
    this.#clockInput = clockInput instanceof HTMLInputElement ? clockInput : undefined

    this.#listeners = new AbortController()
    const { signal } = this.#listeners
    angleInput.addEventListener('input', this.#onAngleInput, { signal })
    this.#clockInput?.addEventListener('change', this.#onClockChange, { signal })
    this.#followClock(this.#clockInput?.checked ?? false)
  }

  disconnectedCallback() {
    this.#listeners?.abort()
    clearInterval(this.#clock)
  }

  #onAngleInput = () => {
    setLightAngle(Number(this.#angleInput.value))
  }

  #onClockChange = () => {
    this.#followClock(this.#clockInput?.checked ?? false)
  }

  /** @param {boolean} follow true to drive the light from the time, false to hand it to the range */
  #followClock(follow) {
    clearInterval(this.#clock)
    this.#angleInput.disabled = follow
    if (follow) {
      this.#showTime()
      this.#clock = setInterval(this.#showTime, CLOCK_INTERVAL_MS)
    } else {
      this.#onAngleInput()
    }
  }

  #showTime = () => {
    const angle = sunAngle(new Date())
    this.#angleInput.value = String(Math.round(angle))
    setLightAngle(angle)
  }
}

customElements.define('rk-light-direction', RkLightDirection)
