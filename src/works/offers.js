import { readDiscounts, readSets, readSold } from './picks.js';

const WAIT_MS = 1500;
let discounts = new Map();
let sets = null;
let sold = new Set();
let ready;

/**
 * The discounts, sets and sold paintings the artist has entered in her sheet (picks.js), as far as a page can know them when it draws its prices, its groups and its enquiry buttons. A page awaits this once
 * before drawing; if the sheet has not answered within a moment, or cannot be read, the pages show the list prices (never a discount that is not
 * confirmed), and an answer that comes later is ignored so that no page shows two different prices.
 */
export const offersReady = () => {
  if (!ready) {
    let settled = false;
    const load = Promise.all([readDiscounts(), readSets(), readSold()]).then(([found, declared, gone]) => { if (settled) return; if (found) discounts = found; sets = declared; if (gone) sold = gone; });
    const timeout = new Promise((resolve) => setTimeout(resolve, WAIT_MS));
    ready = Promise.race([load, timeout]).then(() => { settled = true; });
  }
  return ready;
};

/** The percentage off for a work (by its page address), or 0: a sold work is never on sale. */
export const discountFor = (slug) => (sold.has(slug) ? 0 : discounts.get(slug) || 0);

/** Whether the artist has marked a work (by its page address) as sold. */
export const isSold = (slug) => sold.has(slug);

/** The page addresses of every work with a discount (a sold work has none). */
export const discountedSlugs = () => [...discounts.keys()].filter((slug) => !sold.has(slug));

/** The sets declared in the sheet (a list of `{ label, works }`), or null when the sheet could not be read in time or has no "Set" column. */
export const declaredSets = () => sets;
