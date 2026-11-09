/**
 * Tells the glass material (see the glass tokens in tokens.css) whether the surface behind it is light or dark, by
 * setting html[data-glass="light" | "dark"], so its tint and text color adapt the way Apple's glass does.
 *
 * The surface is the one directly under the header (a home section declares its own); over the hero's picture it is
 * the page tone (--eh-fg: light text means a dark surface), and on other pages the page's background color.
 */
const root = document.documentElement;
const canvas = document.createElement('canvas').getContext('2d');

/** Relative luminance, 0 (black) to 1 (white), of any CSS color. */
const luminance = (css) => {
  canvas.fillStyle = '#000';
  canvas.fillStyle = css;
  const hex = canvas.fillStyle;
  const channel = (i) => { const v = parseInt(hex.slice(i, i + 2), 16) / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
};

/** 'dark' for a surface that carries light text, otherwise 'light': the value for a `data-glass` attribute. */
export const glassFor = (textColor) => (luminance(textColor) > 0.5 ? 'dark' : 'light');

/**
 * The surface the header's glass sits on: whatever section is under the header's dropdown. A home section
 * declares its own data-glass; over anything else (the hero's picture, a series page) the page itself decides.
 */
const surfaceUnderHeader = () => {
  const stack = document.elementsFromPoint(innerWidth * 0.66, Math.min(140, innerHeight / 4));
  const behind = stack.find((el) => !el.closest('header, .em-rail'));
  const holder = behind && behind.closest('[data-glass]');
  return holder && holder !== root ? holder.getAttribute('data-glass') : null;
};

const sense = () => {
  const style = getComputedStyle(root);
  const text = style.getPropertyValue('--eh-fg').trim();
  const surface = style.getPropertyValue('--eh-bg').trim();
  const page = text ? glassFor(text) : (luminance(surface || getComputedStyle(document.body).backgroundColor) < 0.4 ? 'dark' : 'light');
  const value = surfaceUnderHeader() || page;
  if (root.getAttribute('data-glass') !== value) root.setAttribute('data-glass', value);
};

let queued = false;
const senseSoon = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; sense(); });
};

sense();
addEventListener('load', sense);
addEventListener('scroll', senseSoon, { passive: true });
addEventListener('resize', senseSoon);
new MutationObserver(senseSoon).observe(root, { attributes: true, attributeFilter: ['style', 'class'] });

/*
 * The pointer highlight: while the pointer moves over a glass surface, its position inside the surface is written to
 * --gx and --gy, which glass.css turns into a light that follows it.
 */
const SURFACES = '.header-nav-folder-content, .em-home a.btn, .em-home button.replay, .wp a.wp-cta, .wp button.wp-repaint';
let pending = null;
addEventListener('pointermove', (event) => {
  const surface = event.target.closest && event.target.closest(SURFACES);
  if (!surface) return;
  pending = { surface, x: event.clientX, y: event.clientY };
  requestAnimationFrame(() => {
    if (!pending) return;
    const { surface: el, x, y } = pending;
    pending = null;
    const box = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${x - box.left}px`);
    el.style.setProperty('--gy', `${y - box.top}px`);
  });
}, { passive: true });
