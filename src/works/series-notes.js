import { CATALOGUE } from './catalogue.js';

/**
 * What the site says about each series in one place: a line about it and the painting that stands for it
 * (its tile on the Paintings page, its chapter on the home page); `home` is a line for the home chapter when it should say something other than `note`. Everything else about a series (its works, counts,
 * colors, years, media) is worked out from the catalogue and the color analysis.
 */
export const SERIES_NOTES = {
  mediterranean: { cover: 'wave', note: 'The sea I grew up beside and the places around it: waves, shells, fish, whitewashed islands and a table set in the sun.', home: 'The sea I grew up beside and the places around it: waves, shells and fish, lighthouses, whitewashed islands and a table set in the sun.' },
  maternity: { cover: 'maternity-ii', note: 'Pregnancy as it is lived: body, strength and agency.' },
  sicily: { cover: 'carretto', note: 'A tribute to the island of my birth, set in hand-painted frames.' },
  'human-figure': { cover: 'amore-e-pandemia-i', note: 'Bodies reduced to gesture and color: bonds, embraces, states of mind.' },
  archive: { cover: 'help', note: 'An exploration of many styles and themes: works that stand on their own, outside a series.' },
  textiles: { cover: 'mask-divine', note: 'Color you can touch: felt, buttons and thread.' },
};

/** The works of a series, in catalogue order: `[slug, work]` pairs. */
export const worksOfSeries = (series) => Object.entries(CATALOGUE).filter(([, work]) => work.series === series);

/** The address of a work's picture at a given width. */
export const pictureAt = (work, width) => `${work.image.src}?format=${width}w`;

/** The picture that stands for a series, at a given width (the first work of the series if the chosen cover is gone). */
export const coverOf = (series, width) => {
  const chosen = CATALOGUE[(SERIES_NOTES[series] || {}).cover];
  const work = chosen && chosen.series === series ? chosen : (worksOfSeries(series)[0] || [])[1];
  return work ? pictureAt(work, width) : null;
};

/** A work of the series chosen at random, as `[slug, work]` (or null for a series without works): a different one on each visit. */
export const randomWorkOf = (series) => {
  const works = worksOfSeries(series);
  return works.length ? works[Math.floor(Math.random() * works.length)] : null;
};
