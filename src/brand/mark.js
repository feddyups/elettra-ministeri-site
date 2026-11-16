/**
 * The site's mark: an E of three bars on a dark tile, drawn on a 64-unit grid so it stays legible at 16 px.
 * The stem is cream; each arm carries one color, by default the three that stand out most in her paintings
 * (vermilion, sunflower, cerulean; see ATLAS.overall.loud). Everything that draws the mark (the generated icons in
 * scripts/build-icons.mjs and the live tab icon in favicon.js) reads its geometry from here.
 */
export const GRID = 64;
export const TILE_RADIUS = 14;
export const INK = '#17130f';
export const CREAM = '#f6f1e8';
export const TRIAD = ['#dc3c3b', '#e2c760', '#4ba4e0'];

export const STEM = { x: 15, y: 11, w: 10, h: 42 };
export const ARMS = [
  { x: 25, y: 11, w: 24, h: 10 },
  { x: 25, y: 27, w: 19, h: 10 },
  { x: 25, y: 43, w: 24, h: 10 },
];

const rect = ({ x, y, w, h }, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra}/>`;

/** The mark as an SVG file. `adaptive` adds the dark-tab variant: a slightly lifted tile with a hairline edge, so it does not sink into a dark tab strip. */
export const markSvg = (arms = TRIAD, { adaptive = false } = {}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}">${
  adaptive ? `<style>.tile{fill:${INK}}.edge{fill:none;stroke:none}@media (prefers-color-scheme:dark){.tile{fill:#2a2420}.edge{stroke:#fff;stroke-opacity:.16;stroke-width:1}}</style>` : ''
}<rect class="tile" width="${GRID}" height="${GRID}" rx="${TILE_RADIUS}" fill="${INK}"/>${
  adaptive ? `<rect class="edge" x=".5" y=".5" width="${GRID - 1}" height="${GRID - 1}" rx="${TILE_RADIUS - 0.5}"/>` : ''
}${rect(STEM, CREAM)}${ARMS.map((arm, i) => rect(arm, arms[i])).join('')}</svg>`;

/** Draws the mark onto a canvas context, `size` px square. */
export const drawMark = (ctx, size, arms = TRIAD) => {
  const k = size / GRID;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, TILE_RADIUS * k);
  ctx.fill();
  const bar = ({ x, y, w, h }, fill) => { ctx.fillStyle = fill; ctx.fillRect(x * k, y * k, w * k, h * k); };
  bar(STEM, CREAM);
  ARMS.forEach((arm, i) => bar(arm, arms[i]));
};
