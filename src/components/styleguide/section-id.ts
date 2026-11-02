/** A styleguide section's anchor, made from its title, e.g. 'Tile picker' → 'tile-picker'. */
export function sectionId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
