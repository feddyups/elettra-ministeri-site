import { h } from '../lib/elements.js';
import { CATALOGUE } from './catalogue.js';
import { allPaintings } from '../color/scope.js';
import { harmonicOrder } from './harmony-order.js';
import { readFavoriteSlugs } from './favorites.js';
import { renderEntry } from './series-grid.js';

const MESSAGES = {
  unreadable: 'The artist’s favorites will appear here soon.',
  none: 'The artist has not marked any favorites yet.',
};

/**
 * Fills the Favorites page's grid (`<ul class="th-grid" data-favorites>`) with the paintings the artist has marked in her sheet
 * (see favorites.js), in the same layout as a series page and in its smooth path through color (harmony-order.js).
 * Changing a tick in the sheet changes the page; nothing here is typed by hand.
 */
export const initFavoritesGrid = async (list) => {
  const slugs = await readFavoriteSlugs();
  const marked = new Set(slugs || []);
  const works = harmonicOrder(allPaintings().filter((work) => marked.has(work.slug) && CATALOGUE[work.slug])).map((work) => work.slug);
  // a work without a color analysis (a textile) still belongs on the page, after the others
  [...marked].filter((slug) => CATALOGUE[slug] && !works.includes(slug)).forEach((slug) => works.push(slug));
  if (!works.length) {
    list.replaceChildren(h('li', { class: 'th-empty' }, slugs === null ? MESSAGES.unreadable : MESSAGES.none));
    return;
  }
  list.replaceChildren(...works.map((slug) => renderEntry(slug, CATALOGUE[slug])));
};
