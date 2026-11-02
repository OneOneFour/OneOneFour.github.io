import { afterSlide } from './segmented.js'

/** @typedef {'light' | 'dark' | 'system'} ThemeChoice */

const STORAGE_KEY = 'rk-theme'
const CHANGE_EVENT = 'rk-theme-change'

/**
 * @param {string | null} value
 * @returns {ThemeChoice}
 */
function toChoice(value) {
  return value === 'light' || value === 'dark' ? value : 'system'
}

/** @returns {ThemeChoice} the stored choice, or 'system' if there is none or storage is blocked */
function readChoice() {
  try {
    return toChoice(localStorage.getItem(STORAGE_KEY))
  } catch {
    return 'system'
  }
}

/** @param {ThemeChoice} choice */
function saveChoice(choice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    // Storage is blocked, so the choice lasts only until the page is left.
  }
}

/** @param {ThemeChoice} choice */
function applyChoice(choice) {
  const root = document.documentElement
  if (choice === 'system') {
    delete root.dataset.theme
  } else {
    root.dataset.theme = choice
  }
}

/**
 * `<rk-theme-toggle>`: a Light / Dark / System switch. It enhances radios (values `light`, `dark`,
 * `system`) that the page puts inside it, storing the choice under `rk-theme` and setting
 * `data-theme` on `<html>`. Other toggles, tabs and sites on the domain stay in sync.
 */
export class RkThemeToggle extends HTMLElement {
  /** @type {AbortController | undefined} */
  #listeners

  connectedCallback() {
    this.#listeners = new AbortController()
    const { signal } = this.#listeners
    this.addEventListener('change', this.#onChange, { signal })
    document.addEventListener(CHANGE_EVENT, this.#onChoiceChanged, { signal })
    window.addEventListener('storage', this.#onStorage, { signal })
    this.#check(readChoice())
  }

  disconnectedCallback() {
    this.#listeners?.abort()
  }

  /** @param {Event} event */
  #onChange = (event) => {
    if (!(event.target instanceof HTMLInputElement)) return
    const choice = toChoice(event.target.value)
    saveChoice(choice)
    afterSlide(event.target, () => applyChoice(choice))
    document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: choice }))
  }

  /**
   * Another toggle on this page changed the theme.
   * @param {Event} event
   */
  #onChoiceChanged = (event) => {
    if (event instanceof CustomEvent) this.#check(toChoice(event.detail))
  }

  /**
   * Another tab or site changed the theme. A null key means storage was cleared.
   * @param {StorageEvent} event
   */
  #onStorage = (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return
    const choice = toChoice(event.newValue)
    applyChoice(choice)
    this.#check(choice)
  }

  /** @param {ThemeChoice} choice */
  #check(choice) {
    const radio = this.querySelector(`input[type="radio"][value="${choice}"]`)
    if (radio instanceof HTMLInputElement) radio.checked = true
  }
}

customElements.define('rk-theme-toggle', RkThemeToggle)
