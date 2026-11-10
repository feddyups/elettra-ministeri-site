import { h } from '../lib/elements.js';
import { loadStylesheet } from '../lib/stylesheet.js';
import { CARDS, cardPath } from './cards.js';
import { renderCardBack } from './card-back.js';
import { at, full, printCard } from './print-actions.js';
import { initSlideshow } from '../works/work-slideshow.js';

const WIDTHS = [500, 1000, 1500];

const action = (label, onClick) => {
  const link = h('a', { class: 'wp-cta', href: '#', role: 'button' }, label);
  link.addEventListener('click', (event) => { event.preventDefault(); onClick(); });
  return link;
};

/**
 * The page of one postcard, in the layout of a painting's page: the card, its month and title and the ways to print it, the article that goes
 * with it, the back to write on, and the way to the other cards (the arrow keys and a swipe go there too).
 */
export const initCardPage = (host, card) => {
  loadStylesheet(new URL('./print.css', import.meta.url).href).then(() => {
    const index = CARDS.indexOf(card);
    const previous = CARDS[(index - 1 + CARDS.length) % CARDS.length];
    const next = CARDS[(index + 1) % CARDS.length];
    host.classList.add('ca', 'wp');
    host.dataset.surface = 'theme';

    const img = h('img', { src: `${card.src}?format=1500w`, srcset: WIDTHS.map((w) => `${at(card, w)} ${w}w`).join(', '), sizes: '(max-width: 900px) 100vw, 58vw', alt: card.alt, width: card.width, height: card.height });
    const zoom = h('a', { class: 'wp-zoom', href: full(card), target: '_blank', rel: 'noopener', 'aria-label': `Open the ${card.month} postcard at full size` }, img);
    const hero = h('section', { class: 'wp-hero' },
      h('figure', { class: 'wp-figure', style: { '--ratio': card.width / card.height } }, h('div', { class: 'wp-stage' }, zoom)),
      h('div', { class: 'wp-info' },
        h('a', { class: 'wp-kicker', href: '/print' }, 'Print ›'),
        h('h1', null, card.title),
        h('p', { class: 'wp-facts' }, `Postcard for ${card.month}`),
        h('p', { class: 'pr-actions' }, action('Print the card', () => printCard(card, 'both')), action('Full size', () => window.open(full(card), '_blank', 'noopener')))));

    const article = h('section', { class: 'wp-section wp-story' },
      h('p', { class: 'ca-label' }, 'The story'),
      h('p', { class: 'wp-lede' }, card.dek),
      card.article.map((paragraph) => h('p', null, paragraph)),
      h('p', { class: 'pr-original' }, h('a', { href: card.post.href }, 'Read the original article, in Italian')));

    const back = h('section', { class: 'wp-section pr-back-section' },
      h('p', { class: 'ca-label' }, 'The back of the card'),
      h('p', { class: 'wp-reading' }, 'Print it behind the card, or on its own, and write to yourself: what you expect, feel, doubt or wish for in the month that begins. Or a poem, a verse of a song, a quote.'),
      renderCardBack(card),
      h('p', { class: 'pr-actions' }, action('Print the back', () => printCard(card, 'back')), action('Print front and back', () => printCard(card, 'both'))));

    const pager = h('section', { class: 'wp-section' },
      h('p', { class: 'ca-label' }, 'More postcards'),
      h('nav', { class: 'wp-pager', 'aria-label': 'Postcards' },
        h('a', { href: cardPath(previous) }, `‹ ${previous.month}`),
        h('a', { href: '/print' }, 'All postcards'),
        h('a', { href: cardPath(next) }, `${next.month} ›`)),
      h('p', { class: 'wp-keys wp-keys--keys' }, 'Use the ← and → keys to move through the postcards.'),
      h('p', { class: 'wp-keys wp-keys--swipe' }, 'Swipe left or right to move through the postcards.'));

    host.replaceChildren(hero, article, back, pager);
    initSlideshow({ host, slug: card.slug, ordered: CARDS.map((c) => ({ slug: c.slug, href: cardPath(c) })) });
  });
};
