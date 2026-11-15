import { h } from '../lib/elements.js';
import { priceOf, listPriceOf, onSale, discountOf, isSoldWork } from './price.js';

/**
 * A work's price as an element, or null when it has none: "Sold" for a work the artist has sold, otherwise the price, or when the artist has put the work on sale, its list price struck through,
 * the price now and, when asked, the percentage taken off. A screen reader hears one sentence ("€510, was €600, 15% off").
 */
export const renderPrice = (work, { tag = 'span', className = '', percent = false } = {}) => {
  if (isSoldWork(work)) return h(tag, { class: `${className} is-sold`.trim() }, 'Sold');
  const price = priceOf(work);
  if (!price) return null;
  if (!onSale(work)) return h(tag, { class: className || null }, price);
  return h(tag, { class: `${className} is-sale`.trim(), 'aria-label': `${price}, was ${listPriceOf(work)}, ${discountOf(work)}% off` },
    h('s', { 'aria-hidden': 'true' }, listPriceOf(work)),
    h('b', { 'aria-hidden': 'true' }, price),
    percent && h('small', { 'aria-hidden': 'true' }, `${discountOf(work)}% off`));
};
