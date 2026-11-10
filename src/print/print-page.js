import { h } from '../lib/elements.js';
import { CARDS, cardPath } from './cards.js';
import { at, full, printCard } from './print-actions.js';

const WIDTHS = [500, 750, 1000];
const SIZES = '(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw';

/** One postcard: its picture, the month and the title of its article, and the ways to take it. */
const renderCard = (card) => {
  const print = h('a', { href: '#', role: 'button' }, 'Print');
  print.addEventListener('click', (event) => { event.preventDefault(); printCard(card); });
  return h('li', { class: 'th-work', id: card.slug },
    h('a', { class: 'th-img', href: cardPath(card) },
      h('img', {
        src: at(card, 1000), srcset: WIDTHS.map((w) => `${at(card, w)} ${w}w`).join(', '), sizes: SIZES,
        alt: card.alt, width: 1000, height: Math.round(1000 * card.height / card.width), loading: 'lazy',
      })),
    h('div', { class: 'th-cap' },
      h('div', null, h('b', null, h('a', { href: cardPath(card) }, card.month)), h('small', null, card.title)),
      h('div', { class: 'th-act' }, print, h('a', { href: full(card), target: '_blank', rel: 'noopener' }, 'Full size'))));
};

/** Fills the grid of the Print page with the postcards. */
export const initPrintPage = (list) => list.replaceChildren(...CARDS.map(renderCard));
