const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

/** What a hand-painted frame adds to a work's price, in US dollars. */
export const FRAME_PRICE = 200;

/** The price a visitor pays for the work as shown: its own price, plus the frame when the frame is part of it. Zero when the work has no price. */
export const priceValue = (work) => (work.price ? work.price + (work.frame ? FRAME_PRICE : 0) : 0);

/** A work's price as "$600", or an empty string when it has none. */
export const priceOf = (work) => (priceValue(work) ? USD.format(priceValue(work)) : '');

/** The price ranges the Paintings page filters by. */
export const PRICE_BANDS = [
  { key: 'under-250', label: 'Under $250', test: (p) => p > 0 && p < 250 },
  { key: '250-500', label: '$250 – 500', test: (p) => p >= 250 && p < 500 },
  { key: '500-1000', label: '$500 – 1,000', test: (p) => p >= 500 && p < 1000 },
  { key: 'over-1000', label: 'Over $1,000', test: (p) => p >= 1000 },
];

export const priceBandOf = (work) => {
  const band = PRICE_BANDS.find((b) => b.test(priceValue(work)));
  return band ? band.key : null;
};

/**
 * What an enquiry names the work as: the label, then the price shown at that moment with the date, so the enquiry keeps
 * the price it was made against ("Maternity III · listed at $600 on 2026-11-10").
 */
export const enquiryTopic = (label, work, today = new Date()) => (priceValue(work)
  ? `${label} · listed at ${priceOf(work)} on ${today.toISOString().slice(0, 10)}`
  : label);
