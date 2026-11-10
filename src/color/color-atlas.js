import { h } from '../lib/elements.js';
import { resolveScope } from './scope.js';
import { joinNames } from './text.js';
import { renderPaletteBar } from './blocks/palette-bar.js';
import { gistOf } from './gist.js';
import { renderWorkStrips } from './blocks/work-strips.js';

const ALL_BLOCKS = 'palette,strips';
const SERIES_BLOCKS = 'palette,strips';
const MAIN_COLORS_SHOWN = 3;

const heading = (scope) => (scope.id === 'all'
  ? { kicker: 'The colors I speak in', title: 'My colors, measured.', lede: `I looked closely at the colors of ${scope.count} paintings. This is what they are made of, how they sit together, and what it says about how I paint.` }
  : {
    kicker: `Color in ${scope.label}`,
    title: null,
    lede: `Built mostly from ${joinNames(scope.palette.slice(0, MAIN_COLORS_SHOWN).map(([, name]) => name))}. ${gistOf(scope.works)}`,
  });

const section = (label, ...children) => h('section', { class: 'ca-section' }, h('p', { class: 'ca-label' }, label), children);

/**
 * Renders the color infographic into an element:
 *   <div data-color-atlas data-scope="all"></div>
 *   <div data-color-atlas data-scope="series:archive" data-blocks="palette,strips"></div>
 * `data-scope` is `all` or `series:<slug>`. `data-blocks` lists which blocks appear (palette,
 * strips); without it every scope shows both. They always appear in that order.
 * Optional: `data-heading="none"` drops the heading; `data-surface` is `plate` (own dark ground),
 * `theme` (the series colors) or `inherit` (the surrounding section's text color); `data-more-href`
 * and `data-more-label` add a link below.
 */
export const initAtlas = (host) => {
  const scope = resolveScope(host.dataset.scope || 'all');
  if (!scope) return;
  const wanted = new Set((host.dataset.blocks || (scope.id === 'all' ? ALL_BLOCKS : SERIES_BLOCKS)).split(',').map((name) => name.trim()));
  host.classList.add('ca');
  host.dataset.surface = host.dataset.surface || (scope.id === 'all' ? 'plate' : 'theme');

  const { kicker, title, lede } = heading(scope);
  const more = host.dataset.moreHref && h('p', { class: 'ca-more' }, h('a', { href: host.dataset.moreHref }, host.dataset.moreLabel || 'Explore all of my colors'));
  const top = wanted.has('palette') && h('div', { class: 'ca-side' },
    section(scope.id === 'all' ? 'The colors that stand out' : `What ${scope.label} is made of`, renderPaletteBar(scope)));

  host.replaceChildren(...[
    host.dataset.heading !== 'none' && h('header', { class: 'ca-head' }, h('p', { class: 'ca-label' }, kicker), title && h('h2', null, title), h('p', { class: 'ca-lede' }, lede)),
    top && h('div', { class: 'ca-top' }, top),
    wanted.has('strips') && section(scope.id === 'all' ? 'Every work, as a strip of its colors' : 'Each work, as a strip of its colors', renderWorkStrips(scope)),
    more,
  ].filter(Boolean));
  // pointing at a color lights the paintings that carry it among the strips, and dims the rest
  const strips = [...host.querySelectorAll('.ca-strip[data-work]')];
  host.addEventListener('ca:light', (event) => {
    const lit = event.detail.ids && new Set(event.detail.ids);
    strips.forEach((strip) => strip.classList.toggle('is-dim', Boolean(lit) && !lit.has(strip.dataset.work)));
  });
};
