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

/**
 * The page addresses (slugs) of the paintings the artist has marked, from the sheet's "Page address" and "Artist pick" columns
 * (a cell of yes, y, x, 1, true or a star marks it). Resolves to `null` when there is no sheet or it cannot be read.
 */
let reading;
export const readPickSlugs = () => { reading ||= readSheet(); return reading; };

const readSheet = async () => {
  if (!PICKS_SHEET_CSV) return null;
  try {
    const response = await fetch(PICKS_SHEET_CSV, { cache: 'no-cache' });
    if (!response.ok) return null;
    const [header = [], ...rows] = parseCsv(await response.text());
    const column = (...names) => header.findIndex((cell) => names.includes(cell.trim().toLowerCase()));
    const address = column('page address');
    const pick = column('artist pick', 'artist picks');
    if (address < 0 || pick < 0) return null;
    return rows.filter((cells) => YES.test((cells[pick] || '').trim())).map((cells) => (cells[address] || '').trim().replace(/^\/?(paintings\/)?/, ''));
  } catch (error) {
    return null;
  }
};
