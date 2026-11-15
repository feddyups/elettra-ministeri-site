import { h } from '../../lib/elements.js';
import { carriersOf, coverageOf } from '../carriers.js';

/**
 * A bar of colors sized by how much they cover. The colors of the whole body of work are the vivid ones its analysis picked out (`scope.loud`);
 * their widths and their order are the share of an average painting each one covers, so the bar agrees with the strips below it. Each color says
 * how many of the paintings carry it, and pointing at it (or
 * tapping it) lights those paintings among the strips of color on the page: the `ca:light` event (`detail.ids`, or null when let go)
 * is handled by the atlas (color-atlas.js).
 */
export const renderPaletteBar = (scope) => {
  const colors = scope.loud
    ? scope.loud.map(([hex, name]) => [hex, name, coverageOf(scope, hex)]).sort((a, b) => b[2] - a[2])
    : scope.palette;
  const total = colors.reduce((sum, [, , share]) => sum + share, 0);
  const segments = colors.map(([hex, name, share]) => {
    const carriers = carriersOf(scope, hex);
    const carried = `in ${carriers.length} of ${scope.works.length} paintings`;
    const many = scope.loud ? `${Math.round(share * 100)}% of an average painting · ${carried}` : carried;
    const segment = h('button', {
      type: 'button', class: 'ca-swatch', style: { '--share': share / total, '--color': hex },
      'data-tip': name, 'data-meta': many, 'aria-label': `${name}, ${many}`,
    });
    const light = (ids) => segment.dispatchEvent(new CustomEvent('ca:light', { bubbles: true, detail: { ids } }));
    const ids = carriers.map((work) => String(work.id));
    segment.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') light(ids); });
    segment.addEventListener('pointerleave', (event) => { if (event.pointerType === 'mouse') light(null); });
    segment.addEventListener('focus', () => light(ids));
    segment.addEventListener('blur', () => light(null));
    segment.addEventListener('click', () => light(ids));
    return segment;
  });
  const names = colors.map(([hex, name]) => h('li', { style: { '--color': hex } }, name));
  return h('div', { class: 'ca-palette' }, h('div', { class: 'ca-bar' }, segments), h('ul', { class: 'ca-names' }, names));
};
