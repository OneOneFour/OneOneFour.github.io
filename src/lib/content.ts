import {
  getCollection,
  getEntry,
  type CollectionEntry,
  type CollectionKey,
  type ReferenceDataEntry,
} from 'astro:content'

/** Drafts show in `astro dev` and are left out of production builds. */
function isHidden(entry: { data: object }): boolean {
  return import.meta.env.PROD && 'draft' in entry.data && entry.data.draft === true
}

/**
 * Every entry in a collection, without drafts in production builds.
 * Pages use this instead of `getCollection`.
 */
export async function getPublished<C extends CollectionKey>(
  collection: C
): Promise<CollectionEntry<C>[]> {
  return getCollection(collection, (entry) => !isHidden(entry))
}

/**
 * The entry a `reference()` points to, or `undefined` if it is missing or is a draft in a
 * production build. Pages use this instead of `getEntry`.
 */
export async function resolvePublished<C extends CollectionKey>(
  ref: ReferenceDataEntry<C>
): Promise<CollectionEntry<C> | undefined> {
  // getEntry's return type is conditional on C, which TypeScript can't resolve for a generic C.
  const entry = (await getEntry(ref)) as CollectionEntry<C> | undefined
  return entry && !isHidden(entry) ? entry : undefined
}
