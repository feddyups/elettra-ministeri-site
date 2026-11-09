import { h } from '../../lib/elements.js';

const HUES = [['warm', 'reds & yellows'], ['green', 'greens'], ['cool', 'blues'], ['violet', 'violets']];

const stat = (label, value, attrs) => h('div', attrs, h('dt', null, label), h('dd', null, `${value}%`));

/** The share of the work in each hue family (these add up to the whole), then, apart from them, how vivid its color is. */
export const renderStatRow = (scope) =>
  h('dl', { class: 'ca-stats' },
    HUES.map(([key, label]) => stat(label, scope.stats[key])),
    stat('vividness', scope.stats.vivid, { class: 'ca-stat--apart' }));
