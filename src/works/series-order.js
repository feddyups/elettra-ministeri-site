import { allPaintings } from '../color/scope.js';
import { harmonicOrder } from './harmony-order.js';

/**
 * The slugs of a series' paintings in the order its page lays them out (works/harmony-order.js), which the strips under "More in <series>"
 * on a painting page follow too. Empty for a series that is not made of paintings (textiles), whose works stay in catalogue order.
 */
export const seriesOrder = (series) => harmonicOrder(allPaintings().filter((work) => work.series === series)).map((work) => work.slug);

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
