import { h } from '../lib/elements.js';
import { loadStylesheet } from '../lib/stylesheet.js';
import { SERIES_NOTES } from './series-notes.js';
import { seriesInfo } from '../color/scope.js';
import { seriesPager, paintingSeries } from './pager.js';
import { cardOf } from '../print/cards.js';

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
      h('a', { href: '/paintings' }, 'All paintings')));
  const bar = seriesPager(slug);
  if (bar) shell.after(bar);
  loadStylesheet(new URL('./pager.css', import.meta.url).href);
};

/** The Artist picks page: its heading and the grid of picks (filled by picks-grid.js). */
const initPicksPage = (shell) => {
  shell.classList.add('th');
  shell.replaceChildren(heading('Artist picks', PICKS_INTRO), h('ul', { class: 'th-grid', 'data-picks': '' }));
};

/**
 * The series pages, the Artist picks page and the postcard pages are empty pages in Squarespace (the page's name, address, search text and social
 * image are set there); on the address of one of them this puts its content into the page: the page of a series or of the picks below the header
 * and between the page's margins, a postcard's page as a painting's page is made (`[data-work-page]`, filled by work-page.js).
 */
export const mountSeriesPages = () => {
  const here = location.pathname.replace(/\/$/, '');
  const picks = here === PICKS_PATH;
  const series = !picks && paintingSeries().find((s) => s.path === here);
  const card = !picks && !series && /^\/(postcards|print)\/[a-z-]+$/.test(here) && cardOf(here.split('/').pop());
  const main = document.querySelector('main#page, main');
  if ((!picks && !series && !card) || !main || main.querySelector('[data-series-page], [data-work-page], .th')) return;
  if (card) { main.append(h('div', { 'data-work-page': '' })); return; }
  const shell = h('div', { 'data-series-page': picks ? 'artist-picks' : series.slug, 'data-em-series-page': '1' });
  main.append(shell);
  const header = document.querySelector('header');
  const clear = () => shell.style.setProperty('--em-series-top', `${header ? header.getBoundingClientRect().height : 0}px`);
  clear();
  addEventListener('resize', clear);
  if (picks) initPicksPage(shell); else initSeriesPage(shell);
};
