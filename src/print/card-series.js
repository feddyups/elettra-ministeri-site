import { h } from '../lib/elements.js';
import { PROJECT_PATH } from '../journal/postcards.js';

/** What the series is, for a visitor who lands on one postcard: what it is, since when, how it works and why. */
export const renderCardSeries = () => h('section', { class: 'wp-section pr-series' },
  h('p', { class: 'ca-label' }, 'About the series'),
  h('p', null, 'Scrivo una cartolina (“I write a postcard”) is a monthly project I began in September 2017, together with my Journal, as my first conscious experiment in discipline, with an end date of August 2018. Each month I research a curious or mystical subject, write about it, and draw a card from it. You can print each card for free.'),
  h('p', null, 'Print one and address it to yourself, then write on the back what the month ahead holds for you: your expectations, your feelings, your doubts, your wishes. Or write a poem, a line from a song, a quote. Send it, give it away, or keep it. By the end of the year you have a collection of illustrations and a trace of your thoughts.'),
  h('p', { class: 'pr-series-links' },
    h('a', { href: '/print' }, 'All the postcards ›'),
    h('a', { href: PROJECT_PATH, hreflang: 'it' }, 'How the project began (in Italian) ›')));
