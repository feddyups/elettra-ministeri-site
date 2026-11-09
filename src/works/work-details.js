import { h } from '../lib/elements.js';

const format = (image) => {
  const ratio = image.width / image.height;
  return ratio > 1.08 ? 'Landscape' : ratio < 0.92 ? 'Portrait' : 'Square';
};

/** The technical facts that are known; a row appears only when its field exists. */
export const renderWorkDetails = (info, series) => {
  const rows = [
    ['Medium', info.medium], ['Dimensions', info.size], ['Year', info.year && String(info.year)], ['Frame', info.frame],
    ['Format', format(info.image)], ['Series', h('a', { href: series.path }, series.label)],
  ].filter(([, value]) => value);
  return h('section', { class: 'wp-section' },
    h('p', { class: 'ca-label' }, 'Technical details'),
    h('dl', { class: 'wp-details' }, rows.map(([term, value]) => h('div', null, h('dt', null, term), h('dd', null, value)))));
};
