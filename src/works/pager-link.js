import { h } from '../lib/elements.js';

/** One link of the bar at the foot of a page: a small caption (with a chevron on the side it points to) above a title in the serif. */
export const pagerLink = (direction, label, title, href) => h('a', { class: `em-pager-link em-pager-link--${direction}`, href },
  h('small', null, direction === 'prev' ? `‹ ${label}` : direction === 'next' ? `${label} ›` : label),
  h('b', null, title));
