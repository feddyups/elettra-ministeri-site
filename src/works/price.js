const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

/** A work's price as "$600", or an empty string when it has none. */
export const priceOf = (work) => (work.price ? USD.format(work.price) : '');

/** What an enquiry names the work as: the label, followed by the price when there is one. */
export const enquiryTopic = (label, work) => [label, priceOf(work)].filter(Boolean).join(' · ');
