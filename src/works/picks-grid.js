import { h } from '../lib/elements.js';
import { CATALOGUE } from './catalogue.js';
import { allPaintings } from '../color/scope.js';
import { groupsOf } from './series-order.js';
import { readPickSlugs } from './picks.js';
import { offersComplete, discountedSlugs } from './offers.js';
import { markSlugs } from './pick-star.js';
import { renderEntry, scaleEntries } from './series-grid.js';
import { longestSideCm } from './picture-scale.js';
import { masonry } from './masonry.js';

const MESSAGES = {
  unreadable: 'The artist’s picks will appear here soon.',
  none: 'The artist has not marked any picks or sales yet.',
};

const PICKS = 'Artist picks';
const DISCOUNTED = 'Discounted';

/** The works named by `slugs` that the catalogue knows, in the smooth path through color with the sets first (series-order.js); a work without a color analysis (a textile) comes after the others. */
const inOrder = (slugs) => {
  const ordered = groupsOf(allPaintings().filter((work) => slugs.has(work.slug) && CATALOGUE[work.slug])).flatMap((group) => group.works).map((work) => work.slug);
  [...slugs].filter((slug) => CATALOGUE[slug] && !ordered.includes(slug)).forEach((slug) => ordered.push(slug));
  return ordered;
};

/**
 * Fills the Artist picks page's grid (`<ul class="th-grid" data-picks>`) from the artist's sheet (see picks.js and offers.js), in the same layout as a series page: each picture sized by its painting's real size
 * (the largest of those shown at full width) and in its smooth path through color with the sets first (series-order.js). The works come in two groups, each under its own name:
 * the paintings she has marked as picks (whether or not they are also on sale, in which case they carry the sale's tag too, and only the picks carry the star), which the page's own title names, then the paintings that are only on sale
 * under the heading "Discounted".
 * Changing a tick or a discount in the sheet changes the page; nothing here is typed by hand.
 */
export const initPicksGrid = async (list) => {
  try {
    const [slugs] = await Promise.all([readPickSlugs(), offersComplete()]);
    const picked = new Set(slugs || []);
    const onSaleOnly = new Set(discountedSlugs().filter((slug) => !picked.has(slug)));
    const groups = [{ title: PICKS, works: inOrder(picked) }, { title: DISCOUNTED, works: inOrder(onSaleOnly) }].filter((group) => group.works.length);
    if (!groups.length) {
      list.replaceChildren(h('li', { class: 'th-empty' }, slugs === null ? MESSAGES.unreadable : MESSAGES.none));
      return;
    }
    const largest = Math.max(0, ...groups.flatMap((group) => group.works).map((slug) => longestSideCm(CATALOGUE[slug]) || 0));
    let after = list;
    groups.forEach((group, i) => {
      const grid = i === 0 ? list : h('ul', { class: 'th-grid', 'data-group': '', 'data-ready': '' });
      grid.replaceChildren(...group.works.map((slug) => renderEntry(slug, CATALOGUE[slug])));
      scaleEntries(grid, (slug) => CATALOGUE[slug], largest);
      if (slugs && slugs.length) markSlugs(grid, slugs);
      if (group.title !== PICKS) {
        const head = h('header', { class: 'th-group-head' }, h('h2', null, group.title), h('p', null, `${group.works.length} ${group.works.length === 1 ? 'painting' : 'paintings'}`));
        if (i === 0) list.before(head); else after.after(head, grid);
      }
      masonry(grid);
      after = grid;
    });
  } finally {
    list.setAttribute('data-ready', '');
  }
};
