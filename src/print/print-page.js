import { h } from '../lib/elements.js';
import { CARDS } from './cards.js';

const WIDTHS = [500, 750, 1000];
const SIZES = '(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw';
const at = (card, width) => `${card.src}?format=${width}w`;
const full = (card) => `${card.src}?format=original`;

/** Prints one postcard on its own: the picture is placed in a sheet that is the only thing the printed page shows. */
const printCard = (card) => {
  const root = document.documentElement;
  const img = h('img', { src: full(card), alt: card.alt });
  const sheet = h('div', { class: 'pr-sheet' }, img);
  document.body.append(sheet);
  const done = () => { root.classList.remove('pr-printing'); sheet.remove(); window.removeEventListener('afterprint', done); };
  const go = () => { root.classList.add('pr-printing'); window.addEventListener('afterprint', done); window.print(); };
  (img.decode ? img.decode() : Promise.resolve()).then(go, go);
};

/** One postcard: its picture, the month and the story it belongs to on the blog, and the ways to take it. */
const renderCard = (card) => {
  const label = `${card.month} ${card.year}`;
  const print = h('a', { href: '#', role: 'button' }, 'Print');
  print.addEventListener('click', (event) => { event.preventDefault(); printCard(card); });
  return h('li', { class: 'th-work' },
    h('a', { class: 'th-img', href: full(card), target: '_blank', rel: 'noopener' },
      h('img', {
        src: at(card, 1000), srcset: WIDTHS.map((w) => `${at(card, w)} ${w}w`).join(', '), sizes: SIZES,
        alt: card.alt, width: 1000, height: Math.round(1000 * card.height / card.width), loading: 'lazy',
      })),
    h('div', { class: 'th-cap' },
      h('div', null, h('b', null, h('a', { href: card.post.href }, label)), h('small', null, card.post.title)),
      h('div', { class: 'th-act' }, print, h('a', { href: full(card), target: '_blank', rel: 'noopener' }, 'Full size'))));
};

/** Fills the grid of the Print page with the postcards. */
export const initPrintPage = (list) => list.replaceChildren(...CARDS.map(renderCard));
