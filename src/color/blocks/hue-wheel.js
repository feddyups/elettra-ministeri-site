import { h, svg } from '../../lib/elements.js';
import { hueWord } from '../hue-slices.js';

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

/**
 * A ring of wedges, one per slice of the hue circle; a wedge is longer the more of that color the work contains.
 * With `interactive`, each wedge can be pointed at, tapped, or reached with the arrow keys, and the figure announces the choice as a
 * `hue:select` event (`detail.index`, or null when let go); the middle of the wheel has room for two short lines (see color/hue-explorer.js).
 */
export const renderHueWheel = (scope, { interactive = false } = {}) => {
  const max = Math.max(...scope.hue);
  const count = scope.hue.length;
  const wedges = scope.hue.map((value, i) => {
    const mid = (i + 0.5) * 360 / count;
    return svg('path', {
      class: 'ca-wedge', d: wedge(i, count, value / max), fill: `hsl(${(mid + 20) % 360} 70% 62%)`, style: { fill: `oklch(0.7 0.15 ${mid})` },
      ...(interactive ? { tabindex: i === 0 ? 0 : -1, role: 'button', 'aria-label': `${hueWord(i)}: see where it is used` } : {}),
    });
  });
  const rings = [1, 2, 3].map((n) => svg('circle', { r: INNER + n * 46, fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.1 }));
  const drawing = svg('svg', { viewBox: '-300 -300 600 600', role: interactive ? 'group' : 'img', 'aria-label': `How much of each hue appears in ${scope.id === 'all' ? 'the whole body of work' : scope.label}` }, rings, wedges);
  const figure = h('figure', { class: interactive ? 'ca-wheel is-interactive' : 'ca-wheel' },
    drawing,
    interactive
      ? h('figcaption', { class: 'ca-wheel-center', 'aria-hidden': 'true' }, h('b'), h('span'))
      : h('figcaption', { class: 'ca-sr' }, `${scope.id === 'all' ? 'The whole body of work' : scope.label}: how much of each hue it contains.`));
  if (!interactive) return figure;

  let locked = null;
  let current = null;
  const announce = (index) => {
    if (index === current) return;
    current = index;
    figure.classList.toggle('has-choice', index != null);
    wedges.forEach((w, i) => w.classList.toggle('is-chosen', i === index));
    figure.dispatchEvent(new CustomEvent('hue:select', { detail: { index } }));
  };
  const focusWedge = (i) => { wedges.forEach((w, k) => w.setAttribute('tabindex', k === i ? '0' : '-1')); wedges[i].focus(); };
  wedges.forEach((w, i) => {
    w.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse' && locked == null) announce(i); });
    w.addEventListener('pointerleave', (event) => { if (event.pointerType === 'mouse' && locked == null) announce(null); });
    w.addEventListener('click', () => { locked = locked === i ? null : i; announce(locked); });
    w.addEventListener('focus', () => { if (locked == null) announce(i); });
    w.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (step) { event.preventDefault(); const next = (i + step + count) % count; if (locked != null) { locked = next; announce(next); } focusWedge(next); }
      else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); w.dispatchEvent(new Event('click')); }
      else if (event.key === 'Escape') { locked = null; announce(null); }
    });
  });
  drawing.addEventListener('focusout', (event) => { if (locked == null && !drawing.contains(event.relatedTarget)) announce(null); });
  return figure;
};
