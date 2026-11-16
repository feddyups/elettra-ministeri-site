import { h } from '../lib/elements.js';
import { CARDS, cardPath } from './cards.js';
import { at, full, printCard } from './print-actions.js';
import { PROJECT_PATH, PROJECT_ARTICLES } from '../journal/postcards.js';

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

/** How the series began and where its articles are, under the grid: the project's own story, told in the artist's Journal entry about it. */
const renderProject = () => h('section', { class: 'pr-project' },
  h('p', { class: 'pr-project-label' }, 'How the postcards began'),
  h('p', null, 'Scrivo una cartolina began in September 2017, together with my Journal, as my first conscious experiment in discipline, with an end date of August 2018. Every month I research a curious or mystical subject, whether a forgotten ancestral feast, a custom from a faraway place, or a thought that comes to me while I walk or look out of the window. I write about it, and I draw the month’s card from what I find.'),
  h('p', null, 'The story of each card began as an article in my Journal, written in Italian.'),
  h('p', { class: 'pr-project-links' },
    h('a', { href: PROJECT_PATH, hreflang: 'it' }, 'How the project began (in Italian) ›'),
    h('a', { href: PROJECT_ARTICLES, hreflang: 'it' }, 'All the articles (in Italian) ›')));

/** Fills the grid of the Print page with the postcards, and puts the story of the series under it. */
export const initPrintPage = (list) => {
  list.replaceChildren(...CARDS.map(renderCard));
  list.after(renderProject());
};
