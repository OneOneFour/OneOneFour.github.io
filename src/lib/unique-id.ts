let count = 0

/** Returns `prefix-N`, with N unique for each call in this build or dev server. */
export function uniqueId(prefix: string): string {
  count += 1
  return `${prefix}-${count}`
}
