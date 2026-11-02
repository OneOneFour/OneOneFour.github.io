/**
 * A scrollbar above each folder's tab strip (`.rk-folder-tabs`), which hides its own: a bar below
 * the tabs would come between them and the sheet. The new bar is a thin scroller with an empty
 * spacer as wide as the strip's content, kept scrolled to the same place as the strip. Without
 * this script the strip still scrolls by touch, trackpad, wheel and keyboard.
 */

/** @param {HTMLElement} strip */
export function addScrollbarAbove(strip) {
  const bar = document.createElement('div')
  bar.className = 'rk-scroll rk-scroll--bar rk-folder-scrollbar'
  bar.setAttribute('aria-hidden', 'true')
  bar.tabIndex = -1
  const spacer = document.createElement('div')
  bar.append(spacer)
  strip.before(bar)

  // The bar shows only while the strip overflows, and then scrolls exactly as far as the strip.
  const fit = () => {
    const overflow = strip.scrollWidth - strip.clientWidth
    bar.hidden = overflow <= 0
    if (!bar.hidden) spacer.style.inlineSize = `${bar.clientWidth + overflow}px`
  }
  const resizes = new ResizeObserver(fit)
  for (const element of [strip, ...strip.children]) resizes.observe(element)

  scrollTogether(strip, bar)
}

/**
 * Keeps two scrollers scrolled to the same place. Moving one moves the other, and the scroll
 * event that move causes is ignored, so a scroll still in progress (a fling) isn't pulled back.
 *
 * @param {HTMLElement} a
 * @param {HTMLElement} b
 */
function scrollTogether(a, b) {
  /** @type {Map<HTMLElement, number>} where each scroller was last moved to by the other */
  const movedTo = new Map()

  /** @param {HTMLElement} source @param {HTMLElement} target */
  const follow = (source, target) => () => {
    const expected = movedTo.get(source)
    if (expected !== undefined && Math.abs(source.scrollLeft - expected) < 1) return
    movedTo.set(target, source.scrollLeft)
    target.scrollLeft = source.scrollLeft
  }
  a.addEventListener('scroll', follow(a, b), { passive: true })
  b.addEventListener('scroll', follow(b, a), { passive: true })
}

for (const strip of document.querySelectorAll('.rk-folder-tabs')) {
  if (strip instanceof HTMLElement) addScrollbarAbove(strip)
}
