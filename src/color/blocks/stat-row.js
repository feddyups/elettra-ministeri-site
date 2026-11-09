import { h } from '../../lib/elements.js';

const FAMILIES = [['warm', 'warm'], ['green', 'green'], ['cool', 'cool'], ['violet', 'violet'], ['vivid', 'vivid']];

/** The share of warm, green, cool and violet color, and how much of it is vivid. */
export const renderStatRow = (scope) =>
  h('dl', { class: 'ca-stats' }, FAMILIES.map(([key, label]) =>
    h('div', null, h('dt', null, label), h('dd', null, `${scope.stats[key]}%`))));
