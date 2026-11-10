import { h } from '../../lib/elements.js';
import { readingsFor } from '../readings.js';
import { renderStrip } from './work-strips.js';

const SHOWN = 12;

/**
 * The key to reading the paintings, in words (see color/readings.js): each reading is a short sentence, the paintings that
 * show it as strips of their colors (point at one for its title, color and series), and the measurement behind it in small print.
 */
export const renderReadings = (scope) => {
  const readings = readingsFor(scope.works);
  if (!readings.length) return null;
  return h('section', { class: 'ca-section ca-readings' },
    h('p', { class: 'ca-label' }, 'How the colors work'),
    h('div', { class: 'ca-reading-list' }, readings.map((reading) => h('article', { class: 'ca-reading' },
      h('h3', null, reading.title),
      h('p', { class: 'ca-reading-text' }, reading.text),
      h('div', { class: 'ca-strips' }, reading.works.slice(0, SHOWN).map(renderStrip)),
      h('small', null, reading.evidence)))));
};
