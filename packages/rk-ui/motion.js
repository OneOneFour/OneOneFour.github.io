/**
 * `<rk-motion>`: pauses the CSS animations inside it (motion.css) while it is scrolled out of view,
 * and while the reader has pressed its pause button, a `<button data-motion-pause
 * aria-pressed="false">` inside it. It sets data-paused while either holds.
 */
export class RkMotion extends HTMLElement {
  /** @type {AbortController | undefined} */
  #listeners
  /** @type {IntersectionObserver | undefined} */
  #observer
  #offscreen = false

  connectedCallback() {
    this.#listeners = new AbortController()
    this.#button?.addEventListener('click', this.#onPauseClick, { signal: this.#listeners.signal })
    this.#observer = new IntersectionObserver(([entry]) => {
      this.#offscreen = !entry.isIntersecting
      this.#update()
    })
    this.#observer.observe(this)
  }

  disconnectedCallback() {
    this.#listeners?.abort()
    this.#observer?.disconnect()
  }

  get #button() {
    return this.querySelector('[data-motion-pause]')
  }

  get #pausedByReader() {
    return this.#button?.getAttribute('aria-pressed') === 'true'
  }

  #onPauseClick = () => {
    this.#button?.setAttribute('aria-pressed', String(!this.#pausedByReader))
    this.#update()
  }

  #update() {
    this.toggleAttribute('data-paused', this.#offscreen || this.#pausedByReader)
  }
}

customElements.define('rk-motion', RkMotion)
