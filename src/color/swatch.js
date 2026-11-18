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
/** How long a tapped color stays lit on a touch screen once the finger is up (a mouse lights a color only while it points at it). */
const TOUCH_HOLD_MS = 2500;

/**
 * The one color a finger has just let go of, still lit: lifting a finger over a swatch fires `pointerleave` at once, which would put the light out before it could be seen,
 * so a touch keeps it lit for a moment, and another touch puts it out first.
 */
let held = null;
const releaseHeld = () => {
  if (!held) return;
  clearTimeout(held.timer);
  held.leave();
  held = null;
};

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
  button.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse') releaseHeld();
    announce();
    if (onEnter) onEnter();
  });
  button.addEventListener('focus', () => { announce(); if (onEnter) onEnter(); });
  button.addEventListener('pointerleave', (event) => {
    if (!onLeave) return;
    if (event.pointerType === 'mouse') { onLeave(); return; }
    releaseHeld();
    held = { leave: onLeave, timer: setTimeout(releaseHeld, TOUCH_HOLD_MS) };
  });
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
