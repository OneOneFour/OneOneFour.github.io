/**
 * `<rk-tabs>`: the ARIA tabs pattern over markup the page writes: a `role="tablist"` of
 * `role="tab"` buttons, each naming its `role="tabpanel"` with `aria-controls`. Clicking a tab, or
 * moving to it with the arrow keys, Home or End, selects it and shows only its panel.
 */
export class RkTabs extends HTMLElement {
  constructor() {
    super()
    this.addEventListener('click', this.#onClick)
    this.addEventListener('keydown', this.#onKeydown)
  }

  /** @returns {HTMLElement[]} this element's own tabs, not those of tabs nested in a panel */
  get #tabs() {
    return [...this.querySelectorAll(':scope > [role="tablist"] [role="tab"]')].filter(
      (tab) => tab instanceof HTMLElement
    )
  }

  /** @param {MouseEvent} event */
  #onClick = (event) => {
    const tab = event.target instanceof Element ? event.target.closest('[role="tab"]') : null
    if (tab instanceof HTMLElement && this.#tabs.includes(tab)) this.#select(tab)
  }

  /** @param {KeyboardEvent} event */
  #onKeydown = (event) => {
    const tabs = this.#tabs
    const current = event.target instanceof HTMLElement ? tabs.indexOf(event.target) : -1
    if (current === -1) return

    /** @type {Record<string, number>} */
    const targets = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: tabs.length - 1 }
    const target = targets[event.key]
    if (target === undefined) return

    event.preventDefault()
    // The arrow keys wrap around from the last tab to the first, and back.
    const tab = tabs[(target + tabs.length) % tabs.length]
    this.#select(tab)
    tab.focus()
  }

  /** @param {HTMLElement} selected the tab to select */
  #select(selected) {
    for (const tab of this.#tabs) {
      const isSelected = tab === selected
      tab.setAttribute('aria-selected', String(isSelected))
      tab.tabIndex = isSelected ? 0 : -1
      const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '')
      if (panel) panel.hidden = !isSelected
    }
  }
}

customElements.define('rk-tabs', RkTabs)
