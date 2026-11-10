import { PICKS_SHEET_CSV } from './picks-source.js';

const YES = /^(yes|y|x|1|true|✓|✔|★|☆)$/i;

/** Splits CSV text into rows of cells (quoted cells may hold commas, quotes and line breaks). */
const parseCsv = (text) => {
  const rows = [];
  let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') quoted = false; else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
};

/** Addresses the sheet may still carry for a work that has since been renamed. */
const RENAMED = { 'testa-di-moro': 'paladino-siciliano', 'seated-figure': 'by-the-window' };
const slugOf = (cell) => {
  const slug = (cell || '').trim().replace(/^\/?(paintings\/|textiles\/)?/, '');
  return RENAMED[slug] || slug;
};

/** A percentage from a cell ("15", "15%", "12,5", or 0.15 for 15%): above 0 and at most 90, or 0 when the cell holds none. */
const percentOf = (cell) => {
  const value = Number(String(cell || '').replace('%', '').replace(',', '.').trim());
  if (!Number.isFinite(value) || value <= 0) return 0;
  const percent = value < 1 ? value * 100 : value;
  return percent <= 90 ? Math.round(percent * 10) / 10 : 0;
};

/**
 * The artist's sheet, read once: the rows with the "Page address", "Artist pick" and "Discount" columns found by their headers.
 * Resolves to `null` when there is no sheet or it cannot be read.
 */
let reading;
const readRows = () => { reading ||= readSheet(); return reading; };

/**
 * The page addresses (slugs) of the paintings the artist has marked, from the sheet's "Page address" and "Artist pick" columns (a column headed "Favorite" works too)
 * (a cell of yes, y, x, 1, true or a star marks it). Resolves to `null` when there is no sheet or it cannot be read.
 */
export const readPickSlugs = async () => {
  const sheet = await readRows();
  return sheet && sheet.pick >= 0 ? sheet.rows.filter((cells) => YES.test((cells[sheet.pick] || '').trim())).map((cells) => slugOf(cells[sheet.address])) : null;
};

/**
 * The discounts the artist has entered, from the sheet's "Discount" column (a percentage: 15, 15% or 12,5): a map from a work's page address to its percentage.
 * Resolves to `null` when the sheet cannot be read, and to an empty map when it has no such column or no discounts.
 */
export const readDiscounts = async () => {
  const sheet = await readRows();
  if (!sheet) return null;
  const found = new Map();
  if (sheet.discount >= 0) sheet.rows.forEach((cells) => { const percent = percentOf(cells[sheet.discount]); if (percent) found.set(slugOf(cells[sheet.address]), percent); });
  return found;
};

const readSheet = async () => {
  if (!PICKS_SHEET_CSV) return null;
  try {
    const response = await fetch(PICKS_SHEET_CSV, { cache: 'no-cache' });
    if (!response.ok) return null;
    const [header = [], ...rows] = parseCsv(await response.text());
    const column = (...names) => header.findIndex((cell) => names.includes(cell.trim().toLowerCase()));
    const address = column('page address');
    if (address < 0) return null;
    return {
      address, rows,
      pick: column('artist pick', 'artist picks', 'favorite', 'favorites'),
      discount: column('discount', 'discount %', 'discount (%)', 'sale', 'sale %', 'sale (%)', 'percent off'),
    };
  } catch (error) {
    return null;
  }
};
