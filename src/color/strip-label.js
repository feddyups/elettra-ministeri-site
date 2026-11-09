import { h } from '../lib/elements.js';
import { loadStylesheet } from '../lib/stylesheet.js';

/**
 * A label that names a strip of color while it is pointed at or focused, wherever strips appear (series pages,
 * the infographic, painting pages). A target is a `.ca-strip` carrying `aria-label`, or anything carrying `data-tip` (the work's title).
 * Optional lines follow: the color's name (`data-name` on the target or on an `<i>` inside it), the series
 * (`data-series`) and `data-meta`.
 */
const GAP = 10;
let label;
let current;

const ensure = () => {
  if (label) return label;
  loadStylesheet(new URL('./strip-label.css', import.meta.url).href);
  label = h('div', { class: 'em-strip-label', role: 'status', 'data-glass': 'dark' });
  document.body.append(label);
  return label;
};

const place = (strip) => {
  const tip = ensure();
  const box = strip.getBoundingClientRect();
  const { width, height } = tip.getBoundingClientRect();
  const left = Math.min(Math.max(box.left + box.width / 2 - width / 2, GAP), innerWidth - width - GAP);
  const above = box.top - height - GAP;
  tip.style.left = `${left}px`;
  tip.style.top = `${above >= GAP ? above : box.bottom + GAP}px`;
};

const show = (event) => {
  const strip = event.target.closest && event.target.closest('.ca-strip[aria-label], [data-tip]');
  if (!strip) return;
  const tip = ensure();
  const swatch = strip.dataset.name ? strip : event.target.closest('i[data-name]');
  const lines = [strip.dataset.tip || strip.getAttribute('aria-label'), swatch && swatch.dataset.name, strip.dataset.series, strip.dataset.meta].filter(Boolean);
  tip.replaceChildren(h('b', null, lines[0]), ...lines.slice(1).map((text) => h('span', null, text)));
  current = strip;
  place(strip);
  requestAnimationFrame(() => current === strip && place(strip));
  tip.classList.add('is-visible');
};

const hide = (event) => {
  if (!label || (event.relatedTarget && current && current.contains(event.relatedTarget))) return;
  label.classList.remove('is-visible');
  current = null;
};

document.addEventListener('pointerover', show);
document.addEventListener('focusin', show);
document.addEventListener('pointerout', hide);
document.addEventListener('focusout', hide);
addEventListener('scroll', () => current && place(current), { passive: true });
