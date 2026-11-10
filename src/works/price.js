const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

/** A work's price as "$600", or an empty string when it has none. */
export const priceOf = (work) => (work.price ? USD.format(work.price) : '');

/**
 * What an enquiry names the work as: the label, then the price shown at that moment with the date, so the enquiry keeps
 * the price it was made against ("Maternity III · listed at $600 on 2026-11-10").
 */
export const enquiryTopic = (label, work, today = new Date()) => (work.price
  ? `${label} · listed at ${priceOf(work)} on ${today.toISOString().slice(0, 10)}`
  : label);
