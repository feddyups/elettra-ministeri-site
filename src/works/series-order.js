import { allPaintings } from '../color/scope.js';
import { harmonicOrder } from './harmony-order.js';
import { setOf } from './sets.js';

const mean = (works, key) => works.reduce((sum, work) => sum + work[key], 0) / works.length;

/** A set as one stop of the path: the colors of its paintings together (each painting counting alike), so the path passes it where its colors as a whole belong. */
const stopOf = (members) => ({
  members,
  palette: members.flatMap((work) => work.palette.map(([hex, name, share]) => [hex, name, share / members.length])),
  warm: mean(members, 'warm'), cool: mean(members, 'cool'), violet: mean(members, 'violet'),
});

/**
 * Paintings (each with a `slug`, `palette`, `warm`, `cool` and `violet`) in the order of their smooth path through color (works/harmony-order.js), the groups first:
 * each set the artist made together (works/sets.js) is one stop on the path, placed by the colors of the set as a whole, and the paintings of a stop follow the
 * order given for the set (the order of her sheet, or of its Order column). A painting that is in no set is a stop of its own, placed by its own colors.
 * A set stands for the paintings of it that are in `works`.
 */
export const orderWithSets = (works) => {
  const bySlug = new Map(works.map((work) => [work.slug, work]));
  const taken = new Set();
  const stops = [];
  works.forEach((work) => {
    if (taken.has(work.slug)) return;
    const set = setOf(work.slug);
    const members = (set ? set.works.map((slug) => bySlug.get(slug)).filter(Boolean) : [work]);
    members.forEach((member) => taken.add(member.slug));
    stops.push(members.length > 1 ? stopOf(members) : { ...work, members });
  });
  return harmonicOrder(stops).flatMap((stop) => stop.members);
};

/**
 * The slugs of a series' paintings in the order its page lays them out (orderWithSets), which the strips under "More in <series>" on a painting page,
 * the way to the previous and next painting and the arrow keys follow too. Empty for a series that is not made of paintings (textiles), whose works stay in
 * catalogue order. Sets are known once `offersReady()` has resolved, so every page of a visit asks after it.
 */
export const seriesOrder = (series) => orderWithSets(allPaintings().filter((work) => work.series === series)).map((work) => work.slug);

/** Sorts items of a series (by their slug) into that order; items the order does not name keep their place at the end. */
export const inSeriesOrder = (series, items, slugOf) => {
  const order = seriesOrder(series);
  const rank = (item) => (order.includes(slugOf(item)) ? order.indexOf(slugOf(item)) : order.length);
  return items.slice().sort((a, b) => rank(a) - rank(b));
};

/** The work before and after the one with this slug in an ordered list, going around from the last to the first. */
export const around = (ordered, slug) => {
  const index = ordered.findIndex((item) => item.slug === slug);
  return { index, previous: ordered[(index - 1 + ordered.length) % ordered.length], next: ordered[(index + 1) % ordered.length] };
};
