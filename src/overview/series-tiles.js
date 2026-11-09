import { h } from '../lib/elements.js';
import { SERIES_NOTES, coverOf } from '../works/series-notes.js';
import { MEDIA } from './subjects.js';

const years = (works) => {
  const known = works.map((w) => w.year).filter(Boolean);
  if (!known.length) return null;
  const [low, high] = [Math.min(...known), Math.max(...known)];
  return low === high ? `${low}` : `${low}–${high}`;
};

const mediaOf = (works) => MEDIA.filter((kind) => works.some((w) => w.medium === kind.key)).map((kind) => kind.label);

/** The strip of a series' main colors, each as wide as its share, naming itself when pointed at. */
export const renderPaletteStrip = (series) => h('div', { class: 'ov-strip', role: 'img', 'aria-label': `Main colors of ${series.label}` },
  series.palette.map(([hex, name, share]) => h('i', { style: { '--color': hex, '--share': share }, 'data-tip': series.label, 'data-name': name, 'data-meta': `${Math.round(share * 100)}% of the series` })));

/** One tile per series: its picture, a line about it, its colors, and what is in it. */
export const renderSeriesTiles = (seriesData, worksBySeries) => h('div', { class: 'ov-tiles' }, seriesData.map((series) => {
  const works = worksBySeries[series.slug] || [];
  const note = SERIES_NOTES[series.slug] || {};
  const cover = coverOf(series.slug, 1000);
  const facts = [`${works.length} ${works.length === 1 ? 'work' : 'works'}`, years(works), mediaOf(works).join(', ')].filter(Boolean).join(' · ');
  return h('a', { class: 'ov-tile', href: series.path },
    h('div', { class: 'ov-tile-picture' }, cover && h('img', { src: cover, alt: '', loading: 'lazy' })),
    h('div', { class: 'ov-tile-text' },
      h('h3', null, series.label),
      note.note && h('p', null, note.note),
      renderPaletteStrip(series),
      h('small', null, facts)));
}));
