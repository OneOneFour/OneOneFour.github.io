const COPIED = 'Copied'
const FAILED = "Couldn't copy"
const RESET_DELAY_MS = 2000

/**
 * `<rk-code-block>`: a copy button for the `<pre><code>` inside it. The markup carries the button
 * (`.rk-code-copy`) with `hidden`, so it only shows once this script runs. A click copies the
 * code's text, shows the result in the button's `.rk-code-copy-label` for a moment, and announces
 * it to screen readers.
 */
export class RkCodeBlock extends HTMLElement {
  /** @type {AbortController | undefined} */
  #listeners
  /** @type {HTMLElement | undefined} */
  #announcer
  /** @type {number | undefined} */
  #resetTimer
  #restingLabel = ''

  connectedCallback() {
    const button = this.querySelector('.rk-code-copy')
    if (!(button instanceof HTMLButtonElement)) return

    this.#listeners = new AbortController()
    button.addEventListener('click', this.#copy, { signal: this.#listeners.signal })
    this.#restingLabel = this.#label()?.textContent ?? ''
    this.#announcer = this.#createAnnouncer()
    this.append(this.#announcer)
    button.hidden = false
  }

  disconnectedCallback() {
    this.#listeners?.abort()
    clearTimeout(this.#resetTimer)
    this.#announcer?.remove()
  }

  #copy = async () => {
    const text = this.querySelector('pre code')?.textContent ?? ''
    try {
      await navigator.clipboard.writeText(text)
      this.#show(COPIED)
    } catch {
      // No clipboard (an insecure page or an old browser) or permission denied.
      this.#show(FAILED)
    }
  }

  /** @param {string} message */
  #show(message) {
    const label = this.#label()
    if (label) label.textContent = message
    if (this.#announcer) this.#announcer.textContent = message

    clearTimeout(this.#resetTimer)
    this.#resetTimer = window.setTimeout(() => {
      if (label) label.textContent = this.#restingLabel
      if (this.#announcer) this.#announcer.textContent = ''
    }, RESET_DELAY_MS)
  }

  #label() {
    return this.querySelector('.rk-code-copy-label')
  }

  #createAnnouncer() {
    const announcer = document.createElement('span')
    announcer.className = 'rk-visually-hidden'
    announcer.setAttribute('aria-live', 'polite')
    return announcer
  }
}

customElements.define('rk-code-block', RkCodeBlock)
