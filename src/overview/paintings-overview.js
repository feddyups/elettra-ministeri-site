import { h } from '../lib/elements.js';
import { seriesList } from '../color/scope.js';
import { createFilter } from './filter-state.js';
import { overviewWorks } from './works.js';
import { renderSeriesTiles } from './series-tiles.js';
import { renderSeriesRows, renderWheels, renderMap } from './series-compare.js';
import { renderReadings } from '../color/blocks/readings.js';
import { resolveScope } from '../color/scope.js';
import { renderSubjectBars, renderMediumBars } from './bars.js';
import { renderWorkIndex } from './work-index.js';

const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const section = (kicker, title, lede, ...children) => h('section', { class: 'ov-section' },
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

  const atlas = h('div', { 'data-color-atlas': '', 'data-scope': 'all', 'data-blocks': 'wheel,palette', 'data-heading': 'none', 'data-surface': 'inherit' });
  const range = works.map((w) => w.year).filter(Boolean);

  host.replaceChildren(
    section('Series', `${count(works.length, 'work', 'works')} in ${count(series.length, 'series', 'series')}`,
      'Choose a series to see its works. The strip under each name is the series’ main colors, as wide as the share they cover.',
      renderSeriesTiles(series, worksBySeries)),
    h('div', { class: 'ov-plate' },
      section('How she paints', 'The key to the pictures', 'Four things the colors show about how these paintings are put together. Point at a painting for its title and series.', h('div', { class: 'ca', 'data-surface': 'inherit' }, renderReadings(resolveScope('all')))),
      section('Compare', 'The series side by side', 'Warmest first. Every series is read the same way: the colors that cover most of it, how its hues divide, and what its colors do in a line.',
        renderSeriesRows(series, worksBySeries), renderWheels(series)),
      section('The whole body of work', 'The colors I use, measured', `All ${works.length} works together${range.length ? `, from ${Math.min(...range)} to ${Math.max(...range)} where the year is known` : ''}.`, atlas, renderMap(series, filter)),
      section('Subjects and materials', 'What I paint, and what on', 'Choose a bar to narrow everything on this page to those works.',
        h('div', { class: 'ov-bars-pair' }, renderSubjectBars(works, filter), renderMediumBars(works, filter))),
      section('Every work', 'The index', 'Sort it, or narrow it by series, subject, material, the color that covers most of the picture, or how its colors are built: in neighboring hues, with a small opposite accent, or carried by one color.',
        renderWorkIndex(works, series, filter))));
};
