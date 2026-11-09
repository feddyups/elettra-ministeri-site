import { h } from '../../lib/elements.js';
import { nearestWork } from '../nearest-work.js';
import { seriesInfo } from '../scope.js';

/** A bar of colors sized by how much they cover; each links to the work that shows that color most. */
export const renderPaletteBar = (scope) => {
  const colors = scope.loud || scope.palette;
  const total = colors.reduce((sum, [, , share]) => sum + share, 0);
  const segments = colors.map(([hex, name, share]) => {
    const work = nearestWork(hex, scope.works);
    const series = seriesInfo(work.series);
    return h('a', {
      class: 'ca-swatch', href: work.href, 'data-work': work.id, style: { '--share': share / total, '--color': hex },
      'data-tip': work.title, 'data-name': name, 'data-series': series && series.label,
      'aria-label': `${name}, most visible in ${work.title}${series ? `, ${series.label}` : ''}`,
    });
  });
  const names = colors.map(([hex, name]) => h('li', { style: { '--color': hex } }, name));
  return h('div', { class: 'ca-palette' }, h('div', { class: 'ca-bar' }, segments), h('ul', { class: 'ca-names' }, names));
};
