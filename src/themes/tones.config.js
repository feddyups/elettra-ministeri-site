/**
 * The site's color map: the one place to change which color belongs to which series.
 *
 * The home page sections and the series pages both take their background from
 * the tones generated from this file. After editing it, run `npm run build:tones`,
 * commit, and release a new version (see README.md).
 *
 * Each series needs a `cover`: the painting its color is taken from. By default
 * the tone is the painting's most saturated color, darkened. To change one series:
 *   - `pick: 2`        use the painting's third palette color instead (run the build to see the candidates)
 *   - `bg: '#1f3a2e'`  set the color directly, ignoring the painting
 * To change them all at once, edit TONE_SETTINGS.
 *
 * The six colors are set directly, one per region of the color wheel (hue in degrees, OKLCH), so no two
 * series look alike and the colors work as a map of the site. Keep new colors about 60 degrees apart and
 * dark enough for the text color (a contrast ratio of at least 7:1):
 *   maternity 30 (rust red) · sicily 85 (ochre) · archive 150 (forest green)
 *   mediterranean 225 (sea blue) · human-figure 268 (indigo) · textiles 335 (plum)
 */

export const TONE_SETTINGS = {
  /** 0 is black, 1 is the painting's own color. Lower is darker. */
  darkness: 0.42,
  /**
   * The second tone of each series' family, used for secondary surfaces such as the Previous / Next bar at the
   * bottom of a page: the same hue, with its lightness multiplied by this (1 is the series color, lower is deeper).
   */
  altDepth: 0.68,
  /** Text color on every tone. */
  ink: '#faf8f5',
};

const IMG = 'https://images.squarespace-cdn.com/content';
const SITE = '596fbc34c534a5fa937bd9bf';

/**
 * One entry per series. `label` is its display name and `path` its page (default `/paintings/<slug>`);
 * the color infographic uses both to name and link each series.
 */
export const SERIES = {
  mediterranean: { label: 'Mediterranean', cover: `${IMG}/v1/${SITE}/0b1d1e51-8576-4b9e-a2c5-99787967a690/mediterranean-wave.jpg?format=1500w`, bg: 'rgb(0,64,89)' },
  maternity: { label: 'Maternity', cover: `${IMG}/v1/${SITE}/9973033c-2b50-4c30-8ff6-89088a5f9c7b/maternity+II.jpg?format=1500w`, bg: 'rgb(94,27,19)' },
  sicily: { label: 'Sicily', cover: `${IMG}/${SITE}/d0403442-5dd2-4b6c-8c1b-93b9b2388298/carretto-siciliano-v2.jpg?format=1500w`, bg: 'rgb(94,67,0)' },
  'human-figure': { label: 'Human figure', cover: `${IMG}/v1/${SITE}/1661720261897-CK1FYNCF1NS8AKUMLYKD/The+Hug+series.jpg?format=1500w`, bg: 'rgb(24,41,105)' },
  archive: { label: 'Archive', cover: `${IMG}/v1/${SITE}/1528638090169-3WYNVACGH7G9O9XEUX92/help.jpg?format=1500w`, bg: 'rgb(7,65,28)' },
  textiles: { label: 'Textiles', path: '/textiles', cover: `${IMG}/${SITE}/7dca847c-fdb9-4619-8b03-e8f6fcb84afa/textile-mask.jpg?format=1500w`, bg: 'rgb(81,31,72)' },
};
