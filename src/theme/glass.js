/**
 * Tells the glass material (see the glass tokens in tokens.css) whether the surface behind it is light or dark, by
 * setting html[data-glass="light" | "dark"], so its tint and text color adapt the way Apple's glass does.
 *
 * Over the home page the surface is the current section's tone (--eh-bg / --eh-fg, set by the page-tone engine; light
 * text means a dark surface). Elsewhere it is the page's background color.
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

const sense = () => {
  const style = getComputedStyle(root);
  const text = style.getPropertyValue('--eh-fg').trim();
  const surface = style.getPropertyValue('--eh-bg').trim();
  const dark = text ? luminance(text) > 0.5 : luminance(surface || getComputedStyle(document.body).backgroundColor) < 0.4;
  const value = dark ? 'dark' : 'light';
  if (root.getAttribute('data-glass') !== value) root.setAttribute('data-glass', value);
};

sense();
addEventListener('load', sense);
new MutationObserver(sense).observe(root, { attributes: true, attributeFilter: ['style', 'class'] });
