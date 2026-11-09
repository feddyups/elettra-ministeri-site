import { h } from '../lib/elements.js';
import { copyColor } from './copy-color.js';

/**
 * A color you can point at and click: clicking copies its hex code, and it shows its name. The same
 * swatch is used wherever a painting's colors appear (hero, home chapters, painting pages).
 *
 * The element carries what it knows as data attributes (`data-hex`, `data-name`, `data-share`, `data-work`,
 * `data-series`), and pointing at it announces an `em:color` event with `detail.action` "hover", as clicking
 * announces "copy" (see copy-color.js), so the colors people look at and take can be gathered later.
 *
 * @param {{ hex: string, name: string, share?: number }} color
 * @param {{ work?: string, series?: string, className?: string, nameFirst?: boolean, showName?: boolean, showHex?: boolean, onEnter?: () => void, onLeave?: () => void }} [options]
 *   `work` and `series` say where the color was found; `showName` / `showHex` put them in the swatch as text
 *   (the name is always its tooltip and its accessible name).
 */
export const renderSwatch = (color, options = {}) => {
  const { work, series, className = 'em-swatch', nameFirst = false, showName = true, showHex = false, onEnter, onLeave } = options;
  const detail = { hex: color.hex, name: color.name, share: color.share, work, series };
  const label = showName ? h('span', null, color.name) : null;
  const chip = h('i', { style: { background: color.hex } });
  const code = showHex ? h('small', null, color.hex) : null;
  const button = h('button', {
    class: className, type: 'button', title: `${color.name} ${color.hex}`,
    'aria-label': `${color.name}, ${color.hex}. Copy the color code`,
    'data-hex': color.hex, 'data-name': color.name, 'data-share': color.share, 'data-work': work, 'data-series': series,
  }, nameFirst ? [label, chip, code] : [chip, label, code]);

  const announce = () => document.dispatchEvent(new CustomEvent('em:color', { detail: { action: 'hover', ...detail } }));
  button.addEventListener('pointerenter', () => { announce(); if (onEnter) onEnter(); });
  button.addEventListener('focus', () => { announce(); if (onEnter) onEnter(); });
  button.addEventListener('pointerleave', () => { if (onLeave) onLeave(); });
  button.addEventListener('blur', () => { if (onLeave) onLeave(); });
  button.addEventListener('click', () => {
    const ms = copyColor(detail);
    const previous = label && label.textContent;
    button.classList.add('is-copied');
    if (label) label.textContent = `Copied ${color.hex}`;
    setTimeout(() => { button.classList.remove('is-copied'); if (label) label.textContent = previous; }, ms);
  });
  return button;
};
