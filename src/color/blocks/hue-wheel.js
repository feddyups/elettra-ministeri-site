import { h, svg } from '../../lib/elements.js';

const INNER = 96;
const MIN_BAR = 16;
const MAX_BAR = 170;
const GAP_DEGREES = 1.2;

const point = (degrees, radius) => {
  const t = (degrees - 90) * Math.PI / 180;
  return [Math.cos(t) * radius, Math.sin(t) * radius];
};

const wedge = (index, count, share) => {
  const span = 360 / count;
  const from = index * span;
  const to = from + span - GAP_DEGREES;
  const outer = INNER + MIN_BAR + share * MAX_BAR;
  const [x0, y0] = point(from, INNER);
  const [x1, y1] = point(from, outer);
  const [x2, y2] = point(to, outer);
  const [x3, y3] = point(to, INNER);
  return `M${x0},${y0} L${x1},${y1} A${outer},${outer} 0 0 1 ${x2},${y2} L${x3},${y3} A${INNER},${INNER} 0 0 0 ${x0},${y0} Z`;
};

/** A ring of wedges, one per slice of the hue circle; a wedge is longer the more of that color the work contains. */
export const renderHueWheel = (scope) => {
  const max = Math.max(...scope.hue);
  const count = scope.hue.length;
  const wedges = scope.hue.map((value, i) => {
    const mid = (i + 0.5) * 360 / count;
    return svg('path', { d: wedge(i, count, value / max), fill: `hsl(${(mid + 20) % 360} 70% 62%)`, style: { fill: `oklch(0.7 0.15 ${mid})` } });
  });
  const rings = [1, 2, 3].map((n) => svg('circle', { r: INNER + n * 46, fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.1 }));
  return h('figure', { class: 'ca-wheel' },
    svg('svg', { viewBox: '-300 -300 600 600', role: 'img', 'aria-label': `How much of each hue appears in ${scope.id === 'all' ? 'the whole body of work' : scope.label}` }, rings, wedges),
    h('figcaption', { class: 'ca-sr' }, `${scope.id === 'all' ? 'The whole body of work' : scope.label}: how much of each hue it contains.`));
};
