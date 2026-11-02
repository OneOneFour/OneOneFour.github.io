/**
 * `<rk-diagram>`: while a node (an element with data-node) inside it is hovered or focused, lights
 * the links joined to it, the elements whose data-from or data-to is that node's data-node. It
 * marks them with data-lit and itself with data-highlight, which dims the other links
 * (diagram.css).
 */
export class RkDiagram extends HTMLElement {
  /** @type {AbortController | undefined} */
  #listeners

  connectedCallback() {
    this.#listeners = new AbortController()
    const { signal } = this.#listeners
    this.addEventListener('pointerover', this.#onEnter, { signal })
    this.addEventListener('focusin', this.#onEnter, { signal })
    this.addEventListener('pointerout', this.#onLeave, { signal })
    this.addEventListener('focusout', this.#onLeave, { signal })
  }

  disconnectedCallback() {
    this.#listeners?.abort()
  }

  /** @param {Event} event */
  #onEnter = (event) => {
    const node = event.target instanceof Element && event.target.closest('[data-node]')
    if (node instanceof SVGElement || node instanceof HTMLElement) this.#light(node.dataset.node ?? '')
  }

  /** Clears the lights, unless the pointer or focus is only moving within the same node.
   *  @param {PointerEvent | FocusEvent} event */
  #onLeave = (event) => {
    const node = event.target instanceof Element && event.target.closest('[data-node]')
    if (node && event.relatedTarget instanceof Node && node.contains(event.relatedTarget)) return
    this.#light(undefined)
  }

  /** @param {string | undefined} id the node whose links to light, or undefined for none */
  #light(id) {
    for (const lit of this.querySelectorAll('[data-lit]')) lit.removeAttribute('data-lit')
    this.toggleAttribute('data-highlight', id !== undefined)
    if (id === undefined) return
    const name = CSS.escape(id)
    for (const link of this.querySelectorAll(`[data-from="${name}"], [data-to="${name}"]`)) {
      link.toggleAttribute('data-lit', true)
    }
  }
}

customElements.define('rk-diagram', RkDiagram)
