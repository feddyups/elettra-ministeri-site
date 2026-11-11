import { readDiscounts, readSets } from './picks.js';

const WAIT_MS = 1500;
let discounts = new Map();
let sets = null;
let ready;

/**
 * The discounts and sets the artist has entered in her sheet (picks.js), as far as a page can know them when it draws its prices and its groups. A page awaits this once
 * before drawing; if the sheet has not answered within a moment, or cannot be read, the pages show the list prices (never a discount that is not
 * confirmed), and an answer that comes later is ignored so that no page shows two different prices.
 */
export const offersReady = () => {
  if (!ready) {
    let settled = false;
    const load = Promise.all([readDiscounts(), readSets()]).then(([found, declared]) => { if (settled) return; if (found) discounts = found; sets = declared; });
    const timeout = new Promise((resolve) => setTimeout(resolve, WAIT_MS));
    ready = Promise.race([load, timeout]).then(() => { settled = true; });
  }
  return ready;
};

/** The percentage off for a work (by its page address), or 0. */
export const discountFor = (slug) => discounts.get(slug) || 0;

/** The page addresses of every work with a discount. */
export const discountedSlugs = () => [...discounts.keys()];

/** The sets declared in the sheet (a list of `{ label, works }`), or null when the sheet could not be read in time or has no "Set" column. */
export const declaredSets = () => sets;
