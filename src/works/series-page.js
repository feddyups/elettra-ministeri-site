import { h } from '../lib/elements.js';
import { loadStylesheet } from '../lib/stylesheet.js';
import { SERIES_NOTES } from './series-notes.js';
import { seriesInfo } from '../color/scope.js';
import { seriesPager, paintingSeries } from './pager.js';

const PICKS_PATH = '/artist-picks';
const PICKS_INTRO = ['The paintings I come back to. My choice changes from time to time, so look again.'];

/** A paragraph of an introduction; text between ** marks is set in bold. */
const paragraph = (text) => h('p', { class: 'th-lede' }, ...text.split('**').map((part, i) => (i % 2 ? h('strong', null, part) : part)));

const heading = (title, intro) => h('header', { class: 'th-head' },
  h('div', null, h('p', { class: 'th-kicker' }, 'Paintings'), h('h1', null, title)),
  h('div', null, ...intro.map(paragraph)));

/**
 * The page of a series, built from the catalogue into `shell`: the heading and introduction, the grid of its works (filled by series-grid.js),
 * the color infographic of the series, links to the other series, and the bar to the previous and next series.
 */
export const initSeriesPage = (shell) => {
  const slug = shell.dataset.seriesPage || document.documentElement.dataset.series;
  const info = seriesInfo(slug);
  const notes = SERIES_NOTES[slug];
  if (!info || !notes || !notes.intro) return;
  const others = paintingSeries().filter((s) => s.slug !== slug);
  shell.classList.add('th');
  shell.replaceChildren(
    heading(info.label, notes.intro),
    h('ul', { class: 'th-grid' }),
    h('div', { 'data-color-atlas': '', 'data-scope': `series:${slug}` }),
    h('nav', { class: 'th-more', 'aria-label': 'More paintings' },
      h('span', null, 'More paintings'),
      ...others.map((s) => h('a', { href: s.path }, s.label)),
      h('a', { href: '/paintings' }, 'All paintings')),
    seriesPager(slug));
  loadStylesheet(new URL('./pager.css', import.meta.url).href);
};

/** The Artist picks page: its heading and the grid of picks (filled by picks-grid.js). */
const initPicksPage = (shell) => {
  shell.classList.add('th');
  shell.replaceChildren(heading('Artist picks', PICKS_INTRO), h('ul', { class: 'th-grid', 'data-picks': '' }));
};

/**
 * The series pages and the Artist picks page are empty pages in Squarespace (the page's name, address and search text are set there); on the
 * address of one of them this puts its content into the page.
 */
export const mountSeriesPages = () => {
  const here = location.pathname.replace(/\/$/, '');
  const picks = here === PICKS_PATH;
  const series = !picks && paintingSeries().find((s) => s.path === here);
  const main = document.querySelector('main#page, main');
  if ((!picks && !series) || !main || main.querySelector('[data-series-page], .th')) return;
  const shell = h('div', { 'data-series-page': picks ? 'artist-picks' : series.slug, 'data-em-series-page': '1' });
  main.append(shell);
  if (picks) initPicksPage(shell); else initSeriesPage(shell);
};
