import { readDiscounts, readDiscountReasons, readSets, readSold } from './picks.js';

const WAIT_MS = 1500;
let discounts = new Map();
let reasons = new Map();
let sets = null;
let sold = new Set();
let ready;
let loading;

const load = () => { loading ||= Promise.all([readDiscounts(), readSets(), readSold(), readDiscountReasons()]); return loading; };
const apply = ([found, declared, gone, given]) => { if (found) discounts = found; sets = declared; if (gone) sold = gone; if (given) reasons = given; };

/**
 * The discounts, sets and sold paintings the artist has entered in her sheet (picks.js), as far as a page can know them when it draws its prices, its groups and its enquiry buttons. A page awaits this once
 * before drawing; if the sheet has not answered within a moment, or cannot be read, the pages show the list prices (never a discount that is not
 * confirmed), and an answer that comes later is ignored so that no page shows two different prices.
 */
export const offersReady = () => {
  if (!ready) {
    let settled = false;
    const answer = load().then((found) => { if (!settled) apply(found); });
    const timeout = new Promise((resolve) => setTimeout(resolve, WAIT_MS));
    ready = Promise.race([answer, timeout]).then(() => { settled = true; });
  }
  return ready;
};

/**
 * For a page whose content comes from the sheet itself (the Artist picks page, which is empty without it): waits for the sheet's answer, up to `limitMs`, and uses it
 * however long it took, so a slow first read never shows the page as having no picks. Such a page draws only after this resolves, so it never shows two prices.
 */
export const offersComplete = async (limitMs = 6000) => {
  const answer = await Promise.race([load(), new Promise((resolve) => setTimeout(resolve, limitMs))]);
  if (answer) apply(answer);
};

/** The percentage off for a work (by its page address), or 0: a sold work is never on sale. */
export const discountFor = (slug) => (sold.has(slug) ? 0 : discounts.get(slug) || 0);

/** Whether the artist has marked a work (by its page address) as sold. */
export const isSold = (slug) => sold.has(slug);

/** The reason the artist gave for a work's discount (by its page address), or an empty string: it is shown wherever the discount is, and never for a work that has none. */
export const discountReasonFor = (slug) => (discountFor(slug) ? reasons.get(slug) || '' : '');

/** The page addresses of every work with a discount (a sold work has none). */
export const discountedSlugs = () => [...discounts.keys()].filter((slug) => !sold.has(slug));

/** The sets declared in the sheet (a list of `{ label, works }`), or null when the sheet could not be read in time or has no "Set" column. */
export const declaredSets = () => sets;
