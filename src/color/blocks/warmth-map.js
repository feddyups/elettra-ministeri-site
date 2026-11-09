import { h, svg } from '../../lib/elements.js';
import { accentOf, seriesInfo } from '../scope.js';

const PAD = { left: 36, right: 36, top: 30, bottom: 46 };
const NARROW = 520;

/** How far toward warm (positive) or cool (negative) a work leans, from -100 to 100. */
const lean = (work) => work.warm - work.cool - work.violet;

const labelled = (scope) => {
  if (scope.id !== 'all') return scope.works;
  const by = (key, pick) => scope.universe.reduce((best, w) => (pick(key(w), key(best)) ? w : best));
  return [...new Set([by(lean, (a, b) => a > b), by(lean, (a, b) => a < b), by((w) => w.chroma, (a, b) => a > b), by((w) => w.chroma, (a, b) => a < b)])];
};

const draw = (host, scope) => {
  const width = Math.max(280, host.clientWidth || 800);
  const narrow = width < NARROW;
  const height = narrow ? 340 : Math.round(width * 0.38);
  const radius = narrow ? 7 : 14;
  const chromas = scope.universe.map((w) => w.chroma);
  const low = Math.min(...chromas) - 0.01;
  const high = Math.max(...chromas) + 0.01;
  const x = (w) => PAD.left + (lean(w) + 100) / 200 * (width - PAD.left - PAD.right);
  const y = (w) => height - PAD.bottom - (w.chroma - low) / (high - low) * (height - PAD.top - PAD.bottom);
  const inScope = new Set(scope.works.map((w) => w.id));
  const named = new Set(labelled(scope).map((w) => w.id));

  const axis = (text, attrs) => svg('text', { class: 'ca-axis', ...attrs }, text);
  const parts = [
    svg('line', { class: 'ca-grid', x1: width / 2, y1: PAD.top - 10, x2: width / 2, y2: height - PAD.bottom + 18, 'stroke-dasharray': '3 6' }),
    svg('line', { class: 'ca-grid', x1: PAD.left, y1: height - PAD.bottom + 18, x2: width - PAD.right, y2: height - PAD.bottom + 18 }),
    axis('COOL', { x: PAD.left, y: height - 14 }),
    axis('WARM', { x: width - PAD.right, y: height - 14, 'text-anchor': 'end' }),
    axis('LOUD', { x: 0, y: PAD.top - 12 }),
    axis('QUIET', { x: 0, y: height - PAD.bottom - 6 }),
  ];

  const dots = scope.universe.map((work) => {
    const live = inScope.has(work.id);
    const dot = [
      svg('circle', { cx: x(work), cy: y(work), r: radius + (narrow ? 3 : 4), fill: 'none', stroke: accentOf(work.series), 'stroke-width': 2 }),
      svg('circle', { cx: x(work), cy: y(work), r: radius, fill: work.palette[0][0] }),
      work.palette[1] && svg('circle', { cx: x(work) + radius / 4, cy: y(work) + radius / 4, r: radius / 2.6, fill: work.palette[1][0] }),
    ];
    const group = live
      ? svg('a', { class: 'ca-dot', href: work.href, 'data-work': work.id, 'aria-label': work.title, 'data-tip': work.title, 'data-series': (seriesInfo(work.series) || {}).label, 'data-meta': `${work.warm}% warm · ${work.vivid}% vivid` }, dot)
      : svg('g', { class: 'ca-dot is-dim', 'aria-hidden': 'true' }, dot);
    return group;
  });

  const labels = scope.universe.filter((w) => named.has(w.id) && inScope.has(w.id) && !(narrow && scope.id === 'all')).map((work) => {
    const edge = x(work) < 90 ? 'start' : x(work) > width - 90 ? 'end' : 'middle';
    return svg('text', { class: 'ca-dot-label', x: x(work), y: y(work) - radius - 12, 'text-anchor': edge }, work.title);
  });

  host.replaceChildren(svg('svg', { viewBox: `0 0 ${width} ${height}`, width, height, role: 'group', 'aria-label': 'Every work placed by warmth and by how saturated it is' }, parts, dots, labels));
};

/** Every work as a dot: warmer to the right, more saturated higher. Works in the current scope are links; the rest sit dimmed around them. */
export const renderWarmthMap = (scope) => {
  const host = h('div', { class: 'ca-map-host' });
  let frame = 0;
  new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => draw(host, scope)); }).observe(host);
  return h('figure', { class: 'ca-map' }, host);
};
