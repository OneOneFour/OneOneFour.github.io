/**
 * `<rk-colour-picker>`: put it around a tile group that ends with a custom colour tile (a radio and
 * an `<input type="color">` in one `.rk-tile`). Picking a colour checks that tile's radio, so the
 * custom colour becomes the group's choice.
 */
export class RkColourPicker extends HTMLElement {
  constructor() {
    super()
    this.addEventListener('input', this.#onInput)
  }

  /** @param {Event} event */
  #onInput = (event) => {
    const picker = event.target
    if (!(picker instanceof HTMLInputElement) || picker.type !== 'color') return

    const radio = picker.closest('.rk-tile')?.querySelector('input[type="radio"]')
    if (radio instanceof HTMLInputElement) radio.checked = true
  }
}

customElements.define('rk-colour-picker', RkColourPicker)
