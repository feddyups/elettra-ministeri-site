import { h } from '../lib/elements.js';

const LINES = 3;

/**
 * The back of a postcard, to print and write on: a space for the message, opened by the month's own question, a box for the stamp and lines for
 * the address. It is drawn in the same proportions as the front, so the two print as one card. Everything is sized from the card's own width
 * (print.css), so it looks the same on the page and on paper.
 */
export const renderCardBack = (card) => h('div', { class: 'pr-back', style: { '--ratio': card.width / card.height } }, h('div', { class: 'pr-back-card' },
  h('header', null,
    h('div', null, h('p', { class: 'pr-back-name' }, 'Scrivo una cartolina'), h('p', { class: 'pr-back-month' }, card.month)),
    h('div', { class: 'pr-back-stamp' }, 'Stamp')),
  h('div', { class: 'pr-back-write' },
    h('p', { class: 'pr-back-label' }, 'Write to yourself'),
    h('p', { class: 'pr-back-prompt' }, card.prompt),
    h('div', { class: 'pr-back-lines' })),
  h('footer', null,
    h('p', { class: 'pr-back-hint' }, 'What do you expect, feel, doubt or wish for? Or write a poem, a verse of a song, a quote. Keep it, give it, or send it.'),
    h('div', { class: 'pr-back-address' }, Array.from({ length: LINES }, () => h('span')))),
  h('p', { class: 'pr-back-credit' }, '© Elettra Ministeri · #scrivounacartolina')));
