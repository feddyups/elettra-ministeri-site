/**
 * The site's color map: which color belongs to which series, and the settings that derive it.
 *
 * The home page sections and the series pages both take their background from the tones generated from this file. Each series' background is
 * worked out from the colors the series is made of (scripts/palette/series-ground.mjs reads the series' palette from the color analysis), so it
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
   * How a ground is chosen from a series' colors (see series-ground.mjs): its lightness (OKLab), the range of its chroma and the share of the series' own mean chroma it takes, the contrast it must
   * give the text color, the smallest hue distance kept between two series (the first that can be met is used), and the weight of each thing a
   * candidate hue is judged on.
   */
  ground: {
    lightness: 0.35,
    minChroma: 0.075,
    maxChroma: 0.125,
    chromaShare: 0.85,
    minContrast: 8,
    gaps: [60, 55, 50, 45, 40, 35, 30],
    weights: { family: 0.30, opposites: 0.25, warmth: 0.20, anchor: 0.15, lead: 0.10 },
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

/** The backgrounds that were set by hand, one per region of the color wheel, before they were worked out from each series' colors. Kept to compare with `npm run build:tones`. */
export const MANUAL_TONES = {
  mediterranean: 'rgb(0,64,89)',
  maternity: 'rgb(94,27,19)',
  sicily: 'rgb(94,67,0)',
  'human-figure': 'rgb(24,41,105)',
  archive: 'rgb(7,65,28)',
  textiles: 'rgb(81,31,72)',
};
