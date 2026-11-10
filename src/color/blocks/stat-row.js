import { h } from '../../lib/elements.js';
import { quantity, vividWord } from '../readings.js';

const HUES = [['warm', 'reds & yellows'], ['green', 'greens'], ['cool', 'blues'], ['violet', 'violets']];

/** The figure goes in the title and for screen readers; what is shown is the quantity in words. */
const stat = (label, shown, value, attrs) => h('div', { ...attrs, title: `${value}%` }, h('dt', null, label), h('dd', null, shown, h('span', { class: 'ca-sr' }, ` (${value}%)`)));

/** How much of the work is in each hue family, in words, then, apart from them, how strong its color is (quiet, lively, vivid). */
export const renderStatRow = (scope) =>
  h('dl', { class: 'ca-stats' },
    HUES.map(([key, label]) => stat(label, quantity(scope.stats[key] / 100), scope.stats[key])),
    stat('color strength', vividWord(scope.stats.vivid), scope.stats.vivid, { class: 'ca-stat--apart' }));
