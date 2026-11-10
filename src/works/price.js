import { CATALOGUE } from './catalogue.js';
import { discountFor } from './offers.js';

const EUR = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

/** What a frame adds to a work's price, in euros, unless the work sets its own `framePrice`. */
export const FRAME_PRICE = 200;

export const frameCost = (work) => work.framePrice ?? FRAME_PRICE;

const SLUGS = new Map(Object.entries(CATALOGUE).map(([slug, work]) => [work, slug]));

/** The list price of a work: its own price, plus the frame when the frame is part of it. Zero when the work has no price. */
export const listValue = (work) => (work.price ? work.price + (work.frame ? frameCost(work) : 0) : 0);

const reduced = (work, percent) => Math.round(listValue(work) * (100 - percent) / 100);

/** The percentage the artist has taken off a work in her sheet (offers.js), or 0: also 0 when the reduction would not change the whole-euro price. */
export const discountOf = (work) => {
  const percent = listValue(work) ? discountFor(SLUGS.get(work)) : 0;
  return percent && reduced(work, percent) < listValue(work) ? percent : 0;
};

/** Whether a work is on sale. */
export const onSale = (work) => discountOf(work) > 0;

/** The price a visitor pays for the work as shown: its list price, less the artist's discount in whole euros when it has one. Zero when the work has no price. */
export const priceValue = (work) => (onSale(work) ? reduced(work, discountOf(work)) : listValue(work));

/** A work's price as "€600", or an empty string when it has none. */
export const priceOf = (work) => (priceValue(work) ? EUR.format(priceValue(work)) : '');

/** A work's list price as "€600", for showing beside its sale price. */
export const listPriceOf = (work) => (listValue(work) ? EUR.format(listValue(work)) : '');

/** The price ranges the Paintings page filters by. */
export const PRICE_BANDS = [
  { key: 'under-250', label: 'Under €250', test: (p) => p > 0 && p < 250 },
  { key: '250-500', label: '€250 – 500', test: (p) => p >= 250 && p < 500 },
  { key: '500-1000', label: '€500 – 1,000', test: (p) => p >= 500 && p < 1000 },
  { key: 'over-1000', label: 'Over €1,000', test: (p) => p >= 1000 },
];

export const priceBandOf = (work) => {
  const band = PRICE_BANDS.find((b) => b.test(priceValue(work)));
  return band ? band.key : null;
};

/**
 * What an enquiry names the work as: the label, then the price shown at that moment with the date, so the enquiry keeps the price (and any
 * discount) it was made against ("Maternity III · listed at €600 on 2026-11-10", or "… · listed at €510 (was €600, 15% off) on 2026-11-10").
 */
export const enquiryTopic = (label, work, today = new Date()) => {
  if (!priceValue(work)) return label;
  const offer = onSale(work) ? ` (was ${listPriceOf(work)}, ${discountOf(work)}% off)` : '';
  return `${label} · listed at ${priceOf(work)}${offer} on ${today.toISOString().slice(0, 10)}`;
};
