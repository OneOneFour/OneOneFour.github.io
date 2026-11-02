/**
 * `<rk-stepper>`: step buttons for a number input. Put an `<input type="number">` and buttons with
 * `data-step="up"` and `data-step="down"` inside it. A click steps the input by its `step`, within
 * `min` and `max`, and fires `input` and `change` as typing would.
 */
export class RkStepper extends HTMLElement {
  constructor() {
    super()
    this.addEventListener('click', this.#onClick)
  }

  /** @param {MouseEvent} event */
  #onClick = (event) => {
    const button = event.target instanceof Element ? event.target.closest('button[data-step]') : null
    const input = this.querySelector('input[type="number"]')
    if (!(button instanceof HTMLButtonElement) || !(input instanceof HTMLInputElement)) return
    if (input.disabled || input.readOnly) return

    const before = input.value
    if (button.dataset.step === 'up') {
      input.stepUp()
    } else {
      input.stepDown()
    }
    if (input.value === before) return

    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

customElements.define('rk-stepper', RkStepper)
