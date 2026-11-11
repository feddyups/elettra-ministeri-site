/** How much of a card's width the picture of the largest painting of a series takes is 1; this is the share the smallest may take. */
const SMALLEST_SHARE = 0.45;

/** How closely the picture follows the real size: 1 is true proportion, 0 is every picture the same width. */
const FOLLOW = 0.6;

/** The longest side of a painting in centimeters, read from its stated size ("40 × 60 cm", "52 cm diameter"), or null when it states none. */
export const longestSideCm = (work) => {
  const text = (work.size || '').replace(/,/g, '.');
  const sides = text.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)/);
  if (sides) return Math.max(Number(sides[1]), Number(sides[2]));
  const diameter = text.match(/(\d+(?:\.\d+)?)\s*cm\s+diameter/i);
  return diameter ? Number(diameter[1]) : null;
};

/**
 * The share of its card's width a painting's picture takes on a series page, from 1 for the largest painting of the series down to `SMALLEST_SHARE`:
 * a painting twice as long as another looks larger, though by less than twice (its real size raised to `FOLLOW`), so the smallest works stay easy to see and to
 * reach. A painting that states no size takes the whole width.
 */
export const pictureShare = (work, largestCm) => {
  const side = longestSideCm(work);
  if (!side || !largestCm) return 1;
  return Math.min(1, Math.max(SMALLEST_SHARE, (side / largestCm) ** FOLLOW));
};
