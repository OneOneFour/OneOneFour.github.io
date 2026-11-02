/**
 * `<rk-tooltip>`: lets Escape hide an rk-ui tooltip while its control is hovered or focused, so it
 * can be dismissed without moving the pointer or focus. It shows again once the pointer leaves or
 * focus moves on.
 */
export class RkTooltip extends HTMLElement {
  constructor() {
    super()
    this.addEventListener('pointerleave', this.#reset)
    this.addEventListener('focusout', this.#reset)
  }

  connectedCallback() {
    document.addEventListener('keydown', this.#onKeydown)
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.#onKeydown)
  }

  /** @param {KeyboardEvent} event */
  #onKeydown = (event) => {
    if (event.key === 'Escape' && this.matches(':hover, :focus-within')) {
      this.toggleAttribute('data-dismissed', true)
    }
  }

  #reset = () => {
    this.removeAttribute('data-dismissed')
  }
}

customElements.define('rk-tooltip', RkTooltip)
