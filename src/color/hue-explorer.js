import { h } from '../lib/elements.js';
import { readSlice } from './hue-slices.js';

/**
 * Makes a hue wheel explain itself. Pointing at a slice (or moving to it with the arrow keys, or tapping it) shows what the hue means
 * for these paintings: two short lines in the middle of the wheel, the full reading in a panel beside it, and the paintings that
 * hold the hue lit among the strips of color elsewhere on the page (the `ca:light` event, handled by the atlas). Choosing the slice again, or pressing Escape, lets go.
 *
 * @param {object} scope the paintings the wheel is about
 * @param {HTMLElement} wheel the figure from renderHueWheel
 * @returns {{ panel: HTMLElement }}
 */
export const createHueExplorer = (scope, wheel) => {
  const prompt = `Point at a slice of the wheel to see where that hue lives in ${scope.label}.`;
  const panel = h('p', { class: 'ca-hue-panel', 'aria-live': 'polite' }, prompt);
  const word = wheel.querySelector('.ca-wheel-center b');
  const note = wheel.querySelector('.ca-wheel-center span');

  const show = (index) => {
    if (index == null) {
      panel.textContent = prompt;
      word.textContent = '';
      note.textContent = '';
      wheel.dispatchEvent(new CustomEvent('ca:light', { bubbles: true, detail: { ids: null } }));
      return;
    }
    const slice = readSlice(scope, index);
    panel.textContent = slice.text;
    word.textContent = slice.word;
    note.textContent = slice.held ? `${slice.held} of ${slice.total}` : 'none';
    wheel.dispatchEvent(new CustomEvent('ca:light', { bubbles: true, detail: { ids: slice.works.map((work) => String(work.id)) } }));
  };
  wheel.addEventListener('hue:select', (event) => show(event.detail.index));
  return { panel };
};
