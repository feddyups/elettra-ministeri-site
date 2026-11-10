import { h } from '../lib/elements.js';
import { resolveScope } from './scope.js';
import { joinNames } from './text.js';
import { renderHueWheel } from './blocks/hue-wheel.js';
import { renderPaletteBar } from './blocks/palette-bar.js';
import { renderReadings } from './blocks/readings.js';
import { gistOf } from './readings.js';
import { renderWarmthMap } from './blocks/warmth-map.js';
import { renderWorkStrips } from './blocks/work-strips.js';

const ALL_BLOCKS = 'reading,wheel,palette,map,strips';
const SERIES_BLOCKS = 'wheel,palette,strips';
const TOP_BLOCKS = ['wheel', 'palette'];
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
 *   <div data-color-atlas data-scope="series:archive" data-blocks="wheel,palette,strips"></div>
 * `data-scope` is `all` or `series:<slug>`. `data-blocks` lists which blocks appear (reading, wheel, palette,
 * map, strips); without it the whole body of work shows every block and a series shows the wheel, the palette and the strips. They always appear in that order.
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
  const top = [
    wanted.has('wheel') && renderHueWheel(scope),
    TOP_BLOCKS.slice(1).some((name) => wanted.has(name)) && h('div', { class: 'ca-side' },
      wanted.has('palette') && section(scope.id === 'all' ? 'The colors that stand out' : `What ${scope.label} is made of`, renderPaletteBar(scope))),
  ].filter(Boolean);

  host.replaceChildren(...[
    host.dataset.heading !== 'none' && h('header', { class: 'ca-head' }, h('p', { class: 'ca-label' }, kicker), title && h('h2', null, title), h('p', { class: 'ca-lede' }, lede)),
    wanted.has('reading') && renderReadings(scope),
    top.length > 0 && h('div', { class: 'ca-top' }, top),
    wanted.has('map') && section('Warm to cool, muted to saturated', renderWarmthMap(scope), h('p', { class: 'ca-note' }, 'Each dot is one work, ringed in its series color. The further right, the warmer; the higher, the more saturated.')),
    wanted.has('strips') && section(scope.id === 'all' ? 'Every work, as a strip of its colors' : 'Each work, as a strip of its colors', renderWorkStrips(scope)),
    more,
  ].filter(Boolean));
};
