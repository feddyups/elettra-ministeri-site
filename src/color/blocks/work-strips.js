import { h } from '../../lib/elements.js';
import { seriesInfo, seriesList } from '../scope.js';

export const renderStrip = (work) => h('a', { class: 'ca-strip', href: work.href, 'data-work': work.id, 'data-series': (seriesInfo(work.series) || {}).label, 'data-meta': `${work.warm}% warm · ${work.vivid}% vivid`, 'aria-label': work.title },
  work.palette.map(([hex, name, share]) => h('i', { style: { '--share': share, '--color': hex }, 'data-name': name })));

const group = (label, href, works) => h('div', { class: label ? 'ca-row' : 'ca-row ca-row--bare' },
  label && h('a', { class: 'ca-row-name', href }, label),
  h('div', { class: 'ca-strips' }, works.map(renderStrip)));

/** Each work as a stack of its colors, sized by how much of the work they cover; every strip links to the work. */
export const renderWorkStrips = (scope) => {
  if (scope.id !== 'all') return h('div', { class: 'ca-rows' }, group(null, null, scope.works));
  return h('div', { class: 'ca-rows' }, seriesList().map(({ slug, label, path }) => group(label, path, scope.works.filter((w) => w.series === slug))));
};
