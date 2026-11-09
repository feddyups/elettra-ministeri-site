import { h } from '../../lib/elements.js';

/** The two colors I return to most that sit opposite each other on the color wheel. */
export const renderColorPair = (scope) => {
  if (!scope.pair) return null;
  const { a, b } = scope.pair;
  return h('div', { class: 'ca-pair' },
    h('span', { class: 'ca-dots' }, h('i', { style: { background: a[0] } }), h('i', { style: { background: b[0] } })),
    h('p', null, h('b', null, `${a[1]} against ${b[1]}.`), ' Opposite sides of the color wheel, the pairing I return to most.'));
};
