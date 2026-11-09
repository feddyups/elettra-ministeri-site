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
 */

export const TONE_SETTINGS = {
  /** 0 is black, 1 is the painting's own color. Lower is darker. */
  darkness: 0.42,
  /** Text color on every tone. */
  ink: '#faf8f5',
};

const IMG = 'https://images.squarespace-cdn.com/content';
const SITE = '596fbc34c534a5fa937bd9bf';

export const SERIES = {
  mediterranean: { cover: `${IMG}/v1/${SITE}/1528638173689-P8T0RMNYOWAKAER05R02/wave.jpg?format=1500w` },
  maternity: { cover: `${IMG}/v1/${SITE}/9973033c-2b50-4c30-8ff6-89088a5f9c7b/maternity+II.jpg?format=1500w` },
  sicily: { cover: `${IMG}/${SITE}/8b291fd7-893e-4537-b1e8-9aa92c587177/carretto.jpg?format=1500w`, bg: 'rgb(20,63,74)' },
  'human-figure': { cover: `${IMG}/v1/${SITE}/1661720261897-CK1FYNCF1NS8AKUMLYKD/The+Hug+series.jpg?format=1500w` },
  archive: { cover: `${IMG}/v1/${SITE}/1528638090169-3WYNVACGH7G9O9XEUX92/help.jpg?format=1500w`, bg: 'rgb(96,28,19)' },
};
