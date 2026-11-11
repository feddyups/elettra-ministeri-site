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
 * Paintings (each with a `slug`, `palette`, `warm`, `cool` and `violet`) as groups, the sets first: each set the artist made together (works/sets.js) is a group of
 * its own, its paintings in the order given for the set (the order of its rows in her sheet); the sets follow a smooth path through color
 * (works/harmony-order.js), each placed by the colors of the set as a whole; the paintings that are in no set come last, as one group in their own path through
 * color (`label: null`). A set stands for the paintings of it that are in `works`, and needs one of them. Resolves to `[{ label, works }]`.
 */
export const groupsOf = (works) => {
  const bySlug = new Map(works.map((work) => [work.slug, work]));
  const taken = new Set();
  const sets = [];
  works.forEach((work) => {
    if (taken.has(work.slug)) return;
    const set = setOf(work.slug);
    const members = set ? set.works.map((slug) => bySlug.get(slug)).filter(Boolean) : [];
    if (members.length < 1) return;
    members.forEach((member) => taken.add(member.slug));
    sets.push({ ...stopOf(members), label: set.label });
  });
  const singles = harmonicOrder(works.filter((work) => !taken.has(work.slug)));
  return [
    ...harmonicOrder(sets).map(({ label, members }) => ({ label, works: members })),
    ...(singles.length ? [{ label: null, works: singles }] : []),
  ];
};

/**
 * The slugs of a series' paintings in the order its page lays them out (groupsOf: the sets, then the rest), which the strips under "More in <series>" on a
 * painting page, the way to the previous and next painting and the arrow keys follow too. Empty for a series that is not made of paintings (textiles), whose
 * works stay in catalogue order. Sets are known once `offersReady()` has resolved, so every page of a visit asks after it.
 */
export const seriesOrder = (series) => groupsOf(allPaintings().filter((work) => work.series === series)).flatMap((group) => group.works).map((work) => work.slug);

/** The groups of a series page (groupsOf) as `{ label, slugs }`; empty for a series that is not made of paintings. */
export const seriesGroups = (series) => groupsOf(allPaintings().filter((work) => work.series === series)).map(({ label, works }) => ({ label, slugs: works.map((work) => work.slug) }));

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
