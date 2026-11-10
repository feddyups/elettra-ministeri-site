import { h } from '../lib/elements.js';
import { renderCardBack } from './card-back.js';

export const full = (card) => `${card.src}?format=original`;
export const at = (card, width) => `${card.src}?format=${width}w`;

/**
 * Prints a postcard on its own sheets: `what` is "both" (the front, then the back on the next page, for printing on both sides),
 * "front" or "back". The sheets are the only thing the printed page shows (print.css).
 */
export const printCard = (card, what = 'both') => {
  const root = document.documentElement;
  const img = h('img', { src: full(card), alt: card.alt });
  const pages = [];
  if (what !== 'back') pages.push(h('div', { class: 'pr-page' }, img));
  if (what !== 'front') pages.push(h('div', { class: 'pr-page' }, renderCardBack(card)));
  const sheet = h('div', { class: 'pr-sheet' }, pages);
  document.body.append(sheet);
  const done = () => { root.classList.remove('pr-printing'); sheet.remove(); window.removeEventListener('afterprint', done); };
  const go = () => { root.classList.add('pr-printing'); window.addEventListener('afterprint', done); window.print(); };
  (what === 'back' || !img.decode ? Promise.resolve() : img.decode()).then(go, go);
};
