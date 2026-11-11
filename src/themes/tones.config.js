/**
 * The site's color map: which color belongs to which series, and the settings that derive it.
 *
 * The home page sections and the series pages both take their background from the tones generated from this file. Each series' background is
 * worked out from the colors the series is made of (scripts/palette/series-ground.mjs reads the cast of its colors from the color analysis), so it
 * follows the works: after a work is added, moved or retouched, `npm run sync` recomputes it. To pin one series to a color of your own, give it
 * `bg: '#1f3a2e'`. After editing this file, run `npm run build:tones`, commit, and release a new version (see README.md).
 */

export const TONE_SETTINGS = {
  /**
   * The second tone of each series' family, used for secondary surfaces such as the Previous / Next bar at the
   * bottom of a page: the same hue, with its lightness multiplied by this (1 is the series color, lower is deeper).
   */
  altDepth: 0.68,
  /** Text color on every tone. */
  ink: '#faf8f5',
  /**
   * How a ground is made from a series' colors (see series-ground.mjs): its lightness (OKLab), the range of its chroma and the share of the colors'
   * mean chroma it takes, and the contrast it must give the text color.
   */
  ground: {
    lightness: 0.35,
    minChroma: 0.05,
    maxChroma: 0.10,
    chromaShare: 0.5,
    minContrast: 8,
  },
};

/**
 * One entry per series. `label` is its display name and `path` its page (default `/paintings/<slug>`); the color infographic uses both to
 * name and link each series. `bg` pins the series' background to a color of your own instead of the one worked out from its colors.
 */
export const SERIES = {
  mediterranean: { label: 'Mediterranean' },
  maternity: { label: 'Maternity' },
  sicily: { label: 'Sicily' },
  'human-figure': { label: 'Human figure' },
  archive: { label: 'Archive' },
  textiles: { label: 'Textiles', path: '/textiles' },
};

/** The backgrounds that were set by hand, one per region of the color wheel, before they were worked out from each series' colors. They are the `chosen` preset. */
export const MANUAL_TONES = {
  mediterranean: 'rgb(0,64,89)',
  maternity: 'rgb(94,27,19)',
  sicily: 'rgb(94,67,0)',
  'human-figure': 'rgb(24,41,105)',
  archive: 'rgb(7,65,28)',
  textiles: 'rgb(81,31,72)',
};

/**
 * The backgrounds a visitor can choose between for a page (the palette button in the header). Every preset is made for every series and for the
 * All paintings page, and each keeps the text readable (the build fails if one does not). `chosen` holds the backgrounds picked by hand;
 * `tonal` is the hue of the colors of the series made deep; `contrast` is the opposite hue; `night` is the neutral near-black of the Print page.
 */
export const TONE_PRESETS = [
  { id: 'chosen', label: 'Chosen', note: 'Picked by Elettra for this page' },
  { id: 'tonal', label: 'Tonal', note: 'The hue of its colors, made deep' },
  { id: 'contrast', label: 'Contrast', note: 'The opposite hue, so the paintings stand out' },
  { id: 'night', label: 'Night', note: 'A neutral near-black' },
];

/** The preset every page shows until a visitor chooses another. */
export const DEFAULT_TONE = 'chosen';

/**
 * The backgrounds picked by Elettra, one per page: the hand-set map the site had before backgrounds were worked out from the colors (`MANUAL_TONES`),
 * and for the All paintings page (which had none) the pick made on the capture page "Lo sfondo di ogni quadro". A preset of their own, so a change in
 * the colors of a series does not move them.
 */
export const CHOSEN_TONES = { ...MANUAL_TONES, all: '#513317' };

/** The neutral near-black of the `night` preset (the color of the Print page). */
export const NIGHT_TONE = { bg: '#14110f', alt: '#1d1916' };
