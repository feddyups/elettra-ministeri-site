import { h } from '../lib/elements.js';
import { seriesList } from '../color/scope.js';
import { createFilter } from './filter-state.js';
import { overviewWorks } from './works.js';
import { renderSeriesTiles } from './series-tiles.js';
import { renderSeriesRows } from './series-compare.js';
import { renderSubjectBars, renderMediumBars } from './bars.js';
import { renderWorkIndex } from './work-index.js';
import { renderColorMosaic } from './color-mosaic.js';
import { renderChartDrawer } from './chart-drawer.js';

const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const section = (id, kicker, title, lede, ...children) => h('section', { class: 'ov-section', id },
  h('header', null, h('p', { class: 'ov-kicker' }, kicker), h('h2', null, title), lede && h('p', { class: 'ov-lede' }, lede)), children);

/**
 * The Paintings page, built from the catalogue and the color analysis: the series, the series compared by color, the whole
 * body of work in color, what the paintings are about and what they are made on, and an index of every work that can be
 * sorted and narrowed. Mounted on `<div data-paintings-overview></div>`; nothing here is typed by hand, so a new work in the
 * catalogue shows up everywhere once the data has been rebuilt (npm run sync). The color chart in it is the site's ordinary
 * color infographic, filled in by color/main.js.
 */
export const initPaintingsOverview = (host) => {
  const works = overviewWorks();
  const series = seriesList().filter((s) => works.some((w) => w.series === s.slug)).map((s) => ({ ...s, palette: s.stats.palette }));
  const worksBySeries = Object.fromEntries(series.map((s) => [s.slug, works.filter((w) => w.series === s.slug)]));
  const filter = createFilter();

  const atlas = h('div', { 'data-color-atlas': '', 'data-scope': 'all', 'data-blocks': 'palette', 'data-heading': 'none', 'data-surface': 'inherit' });

  const workbench = h('div', { class: 'ov-workbench', 'data-drawer': 'closed' });
  const drawer = renderChartDrawer(workbench, [
    { id: 'subjects', label: 'Subjects and materials', content: [
      h('p', { class: 'ov-note' }, 'Choose a bar to narrow the index to those works.'),
      h('div', { class: 'ov-bars-pair' }, renderSubjectBars(works, filter), renderMediumBars(works, filter))] },
    { id: 'colors', label: 'Every main color', content: [
      h('p', { class: 'ov-note' }, 'Each tile is one of the main colors of one painting, gathered by hue from red round to violet, light to dark, with the greys and paper at the end. A larger tile is a color that covers a large part of its picture. Point at a tile for its painting; the works outside your choices fade back.'),
      renderColorMosaic(works, filter)] },
  ]);
  workbench.append(
    section('index', 'Every work', 'The index', 'Sort it, or narrow it by series, set, subject, material, price, the color that covers most of the picture, or how its colors are built. The charts for subjects, materials and colors open from the Charts button and follow what you choose.',
      renderWorkIndex(works, series, filter, drawer)),
    drawer.element);

  host.replaceChildren(
    workbench,
    section('series', 'Series', `${count(works.length, 'work', 'works')} in ${count(series.length, 'series', 'series')}`,
      ['Choose a series to see its works. The strip under each name is the series’ main colors, as wide as the share they cover. ', h('a', { href: '/paintings/artist-picks' }, 'Or see the artist’s picks.')],
      renderSeriesTiles(series, worksBySeries)),
    h('div', { class: 'ov-plate' },
      section('compare', 'Compare', 'The series side by side', 'Warmest first. Every series is read the same way: the colors that cover most of it, how its hues divide, and what its colors do in a line.',
        renderSeriesRows(series, worksBySeries)),
      section('colors', 'The whole body of work', 'The colors I use, measured', `All ${works.length} works together.`, atlas)));
  // the page is built here, after the browser has looked for an address like /paintings#index, so go there now
  const target = location.hash && host.querySelector(`#${CSS.escape(location.hash.slice(1))}`);
  if (target) requestAnimationFrame(() => target.scrollIntoView());
};
