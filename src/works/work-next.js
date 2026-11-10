import { h } from '../lib/elements.js';
import { nextWorks, seenWorks, markSeen } from './walk.js';
import { seriesInfo } from '../color/scope.js';
import { CATALOGUE } from './catalogue.js';
import { nextBandColor } from './next-tone.js';
import { toneOf } from '../themes/tone-choice.js';

const KIND_TITLE = { nearest: 'Nearest in color', counterpart: 'Turned the other way', step: 'A step along' };

/**
 * "Where to look next": the band the colors of the painting (`intro`) and up to three paintings suggested by color (see walk.js). Each is its picture, its strip of colors and a
 * reason in a line; a painting from another series says which. The band behind them is a color worked out from the three
 * paintings (next-tone.js). The painting being looked at is remembered for the visit, so the
 * next suggestions lead somewhere new.
 */
export const renderWorkNext = ({ work, scope, intro }) => {
  const seen = seenWorks();
  markSeen(work.slug);
  const suggestions = nextWorks(work, scope.universe, seen);
  if (!suggestions.length && !intro) return null;
  const bandFor = () => {
    const tone = toneOf(work.series);
    return suggestions.length ? nextBandColor(suggestions.map((s) => s.work), tone && tone.bg) : (tone && tone.bg);
  };
  const bg = bandFor();
  const band = h('div', { class: 'wp-next', style: bg ? { '--next-bg': bg } : null },
    intro,
    suggestions.length > 0 && h('div', { class: 'wp-next-suggestions' },
    h('p', { class: 'ca-label' }, 'Where to look next'),
    h('div', { class: 'wp-next-list' }, suggestions.map(({ work: other, kind, reason, crossSeries }) => {
      const entry = CATALOGUE[other.slug];
      const series = seriesInfo(other.series);
      return h('a', { class: 'wp-next-item', href: other.href },
        h('span', { class: 'wp-next-kind' }, KIND_TITLE[kind]),
        entry && h('span', { class: 'wp-next-picture' }, h('img', { src: `${entry.image.src}?format=500w`, alt: '', loading: 'lazy', width: entry.image.width, height: entry.image.height })),
        h('span', { class: 'wp-next-strip', 'aria-hidden': 'true' }, other.palette.map(([hex, , share]) => h('i', { style: { '--color': hex, '--share': share } }))),
        h('b', null, other.title),
        h('span', { class: 'wp-next-reason' }, reason, crossSeries && series ? ` From ${series.label}.` : ''));
    }))));
  // the band follows the background the visitor picks in the header (theme/tone-control.js)
  addEventListener('em-tone-change', () => { const next = bandFor(); if (next) band.style.setProperty('--next-bg', next); });
  return band;
};
