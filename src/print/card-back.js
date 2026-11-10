import { h } from '../lib/elements.js';

const ADDRESS_LINES = 4;

/**
 * The back of a postcard, plain and ready to use: ruled space for a message on the left, and on the right a box for the stamp and lines for the
 * address. It carries no text, so it suits any message. It is drawn in the same proportions as the front, so the two print as one card, and sized
 * from the card's own width (print.css), so it looks the same on the page and on paper.
 */
export const renderCardBack = (card) => h('div', {
  class: 'pr-back', style: { '--ratio': card.width / card.height }, role: 'img',
  'aria-label': 'The back of the postcard, blank: ruled space for a message, a box for the stamp and lines for the address',
}, h('div', { class: 'pr-back-card' },
  h('div', { class: 'pr-back-message' }),
  h('div', { class: 'pr-back-side' },
    h('div', { class: 'pr-back-stamp' }),
    h('div', { class: 'pr-back-address' }, Array.from({ length: ADDRESS_LINES }, () => h('span'))))));
