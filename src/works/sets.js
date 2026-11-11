import { CATALOGUE } from './catalogue.js';
import { DEFAULT_SETS } from './set-defaults.js';
import { declaredSets } from './offers.js';

/**
 * The sets of paintings the artist made together (a pair or a triplet of a theme, whose colors are coordinated): the ones in her sheet's "Set" column, or
 * the default list (set-defaults.js) while the sheet cannot be read or has no such column. A page asks for them after `offersReady()`, so that every
 * page of a visit shows the same sets. A painting belongs to at most one set, and a set needs two paintings of the catalogue.
 */
export const allSets = () => (declaredSets() || DEFAULT_SETS)
  .map(({ label, works }) => ({ label, works: works.filter((slug) => CATALOGUE[slug]) }))
  .filter((set) => set.works.length >= 2);

/** The set a painting belongs to (`{ label, works }`), or null. */
export const setOf = (slug) => allSets().find((set) => set.works.includes(slug)) || null;

/** The name of a painting's set, or null. */
export const setLabelOf = (slug) => (setOf(slug) || {}).label || null;

/** A painting's place in its set, as `{ label, number, total }`, or null. */
export const placeInSet = (slug) => {
  const set = setOf(slug);
  return set ? { label: set.label, number: set.works.indexOf(slug) + 1, total: set.works.length } : null;
};

/** Puts the paintings of each set side by side, in the set's order, at the place its first member has in `items` (a series page's order); the rest keep their places. */
export const inSetOrder = (items, slugOf) => {
  const placed = new Set();
  const out = [];
  items.forEach((item) => {
    const slug = slugOf(item);
    if (placed.has(slug)) return;
    const set = setOf(slug);
    const members = set ? set.works.map((s) => items.find((other) => slugOf(other) === s)).filter(Boolean) : [item];
    members.forEach((member) => { out.push(member); placed.add(slugOf(member)); });
  });
  return out;
};
