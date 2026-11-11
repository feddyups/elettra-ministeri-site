import { CATALOGUE } from '../works/catalogue.js';
import { allPaintings, seriesInfo } from '../color/scope.js';
import { subjectsOf, mediumOf } from './subjects.js';
import { readPalette, buildsOf } from '../lib/color-harmony.js';
import { priceValue, priceBandOf, onSale } from '../works/price.js';
import { setLabelOf } from '../works/sets.js';

const FAMILIES = [['warm', 'reds and yellows'], ['green', 'greens'], ['cool', 'blues'], ['violet', 'violets']];
export const FAMILY_LABELS = Object.fromEntries(FAMILIES);

/** The family that covers most of a work (warm, green, cool or violet). */
const dominantFamily = (work) => FAMILIES.reduce((best, [key]) => (work[key] > work[best] ? key : best), FAMILIES[0][0]);

/** Every work the Paintings page shows: the catalogue's facts joined with the color analysis. */
export const overviewWorks = () => allPaintings().filter((work) => CATALOGUE[work.slug]).map((work) => {
  const entry = CATALOGUE[work.slug];
  return {
    ...work,
    entry,
    seriesLabel: (seriesInfo(work.series) || {}).label || work.series,
    set: setLabelOf(work.slug),
    subjects: subjectsOf(work.slug),
    medium: mediumOf(work.slug),
    family: dominantFamily(work),
    builds: buildsOf(readPalette(work.palette)),
    price: priceValue(entry),
    priceBand: priceBandOf(entry),
    onSale: onSale(entry),
  };
});
