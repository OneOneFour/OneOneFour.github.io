/**
 * Runs `callback` once a segmented control's sliding pill has reached the newly checked option:
 * after `--duration-slide`, read where the control is, so it is immediate under reduced motion.
 * Use it when checking an option restyles the whole page (a theme or palette switch), which can
 * otherwise cut the slide short.
 *
 * @param {Element} control the `.rk-segmented` group, or any element inside it
 * @param {() => void} callback
 */
export function afterSlide(control, callback) {
  const duration = getComputedStyle(control).getPropertyValue('--duration-slide').trim()
  const milliseconds = duration.endsWith('ms') ? parseFloat(duration) : parseFloat(duration) * 1000
  setTimeout(callback, Number.isFinite(milliseconds) ? milliseconds : 0)
}
