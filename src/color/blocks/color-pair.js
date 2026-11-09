import { h } from '../../lib/elements.js';
import { findPairing } from '../pairing.js';
import { renderStrip } from './work-strips.js';

const capital = (word) => word[0].toUpperCase() + word.slice(1);

/**
 * The pairing of opposite color families that meets in the most paintings (counted from the paintings themselves),
 * with every painting that holds it, as its strip of colors, to see at a glance.
 */
export const renderColorPair = (scope) => {
  if (scope.id !== 'all') return null;
  const pairing = findPairing(scope.works);
  if (!pairing) return null;
  const [first, second] = pairing.names;
  const [a, b] = pairing.colors;
  return h('div', { class: 'ca-pair' },
    h('span', { class: 'ca-dots' }, h('i', { style: { background: a[0] } }), h('i', { style: { background: b[0] } })),
    h('div', { class: 'ca-pair-body' },
      h('p', null, h('b', null, `${capital(first)} against ${second}.`),
        ` Opposite sides of the color wheel, and they meet in ${pairing.works.length} of my ${scope.works.length} paintings.`),
      h('div', { class: 'ca-strips ca-pair-works' }, pairing.works.map(renderStrip))));
};
