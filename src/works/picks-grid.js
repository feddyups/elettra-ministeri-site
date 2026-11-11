import { h } from '../lib/elements.js';
import { CATALOGUE } from './catalogue.js';
import { allPaintings } from '../color/scope.js';
import { orderWithSets } from './series-order.js';
import { readPickSlugs } from './picks.js';
import { offersReady, discountedSlugs } from './offers.js';
import { markSlugs } from './pick-star.js';
import { renderEntry } from './series-grid.js';

const MESSAGES = {
  unreadable: 'The artist’s picks will appear here soon.',
  none: 'The artist has not marked any picks or sales yet.',
};

/**
 * Fills the Artist picks page's grid (`<ul class="th-grid" data-picks>`) with the paintings the artist has marked in her sheet and those she has put
 * on sale (see picks.js and offers.js; a work on sale appears here whether or not it is a pick, and only the picks carry the star), in the same layout as a series page and in its smooth path through color with each set as one stop (series-order.js).
 * Changing a tick in the sheet changes the page; nothing here is typed by hand.
 */
export const initPicksGrid = async (list) => {
  try {
    const [slugs] = await Promise.all([readPickSlugs(), offersReady()]);
    const marked = new Set([...(slugs || []), ...discountedSlugs()]);
    const works = orderWithSets(allPaintings().filter((work) => marked.has(work.slug) && CATALOGUE[work.slug])).map((work) => work.slug);
    // a work without a color analysis (a textile) still belongs on the page, after the others
    [...marked].filter((slug) => CATALOGUE[slug] && !works.includes(slug)).forEach((slug) => works.push(slug));
    if (!works.length) {
      list.replaceChildren(h('li', { class: 'th-empty' }, slugs === null ? MESSAGES.unreadable : MESSAGES.none));
      return;
    }
    list.replaceChildren(...works.map((slug) => renderEntry(slug, CATALOGUE[slug])));
    if (slugs && slugs.length) markSlugs(list, slugs);
  } finally {
    list.setAttribute('data-ready', '');
  }
};
