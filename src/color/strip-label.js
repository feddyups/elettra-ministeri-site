import { h } from '../lib/elements.js';
import { loadStylesheet } from '../lib/stylesheet.js';

/**
 * A label that names a strip of color while it is pointed at or focused, wherever strips appear (series pages,
 * the infographic, painting pages). A target is a `.ca-strip` carrying `aria-label`, or anything carrying `data-tip` (the work's title).
 * Optional lines follow: the color's name (`data-name` on the target or on an `<i>` inside it), the series
 * (`data-series`) and `data-meta`.
 */
const GAP = 10;
const STYLES_WAIT_MS = 30000;
let label;
let current;

// loads with the page, so that the label's styles are usually there before anyone points at a color
loadStylesheet(new URL('./strip-label.css', import.meta.url).href);

/** The label, invisible until it is shown: it is added to the page at once but takes no place and no look until its stylesheet applies. */
const ensure = () => {
  if (label) return label;
  label = h('div', { class: 'em-strip-label', role: 'status', 'data-glass': 'dark', style: { position: 'fixed', left: '0', top: '0', visibility: 'hidden', 'pointer-events': 'none' } });
  document.body.append(label);
  return label;
};

/** Resolves when the label's stylesheet has applied (the label is a grid then), which is the only moment it can be measured to be placed. False if it never does. */
const styled = (tip) => new Promise((resolve) => {
  const started = performance.now();
  const check = () => {
    if (getComputedStyle(tip).display === 'grid') resolve(true);
    else if (performance.now() - started > STYLES_WAIT_MS) resolve(false);
    else setTimeout(check, 100);
  };
  check();
});

const place = (strip) => {
  const box = strip.getBoundingClientRect();
  const { width, height } = label.getBoundingClientRect();
  const left = Math.min(Math.max(box.left + box.width / 2 - width / 2, GAP), innerWidth - width - GAP);
  const above = box.top - height - GAP;
  label.style.left = `${left}px`;
  label.style.top = `${above >= GAP ? above : box.bottom + GAP}px`;
};

const show = (event) => {
  const strip = event.target.closest && event.target.closest('.ca-strip[aria-label], [data-tip]');
  if (!strip) return;
  const swatch = strip.dataset.name ? strip : event.target.closest('i[data-name]');
  const lines = [strip.dataset.tip || strip.getAttribute('aria-label'), swatch && swatch.dataset.name, strip.dataset.series, strip.dataset.meta].filter(Boolean);
  current = strip;
  const tip = ensure();
  // shown once its styles apply (at once after the first time), so it is never measured, nor seen, unstyled
  styled(tip).then((ready) => {
    if (!ready || current !== strip) return;
    tip.replaceChildren(h('b', null, lines[0]), ...lines.slice(1).map((text) => h('span', null, text)));
    place(strip);
    tip.style.visibility = 'visible';
    tip.classList.add('is-visible');
    requestAnimationFrame(() => current === strip && place(strip));
  });
};

const hide = (event) => {
  if (event.relatedTarget && current && current.contains(event.relatedTarget)) return;
  current = null;
  if (label) label.classList.remove('is-visible');
};

document.addEventListener('pointerover', show);
document.addEventListener('focusin', show);
document.addEventListener('pointerout', hide);
document.addEventListener('focusout', hide);
addEventListener('scroll', () => current && label && label.classList.contains('is-visible') && place(current), { passive: true });
