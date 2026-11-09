import { h } from '../../lib/elements.js';
import { extractPalette, toHex } from '../../lib/color.js';
import { nameColors, rgbToOklab } from '../../lib/color-science.js';
import { sampleImage } from '../../lib/image.js';
import { renderSwatch } from '../../color/swatch.js';
import { createColorFocus } from '../../color/color-focus.js';
import { workColors } from '../../color/scope.js';

const FOCUS_WIDTH = 480;

/** The colors to show for `work`: the analysed palette (the same one its page and the infographic use), or, for a work that is not in the analysis, colors sampled from the image. */
const colorsFor = (work, img) => {
  const analysed = work && workColors(work.colorKey || work.title);
  if (analysed) return analysed;
  const palette = extractPalette(sampleImage(img));
  const names = nameColors(palette.map((color) => rgbToOklab(...color)));
  return { colors: palette.map((color, i) => ({ hex: toHex(color), name: names[i] })) };
};

/**
 * Shows the painting's main colors as buttons in `container`, each labeled with its name. Pointing at one
 * turns the rest of the hero black and white so only that color's cluster stays in color; clicking copies its hex code.
 *
 * @param {HTMLElement} container the row of swatches
 * @param {{ root: HTMLElement, canvas: HTMLCanvasElement, image: HTMLImageElement }} hero the hero, its painting canvas and its image
 * @param {{ title: string }} work the work being shown
 */
export const renderColorSamples = (container, { root, canvas, image }, work) => {
  container.querySelectorAll('button').forEach((button) => button.remove());
  let overlay = root.querySelector('canvas.em-focus'); // above the image, so it works once the real picture shows as well as while it is painted
  if (!overlay) {
    overlay = h('canvas', { class: 'em-focus', 'aria-hidden': 'true' });
    image.after(overlay);
  }
  overlay.classList.remove('is-on');

  const { colors, slug, series } = colorsFor(work, image);
  const focus = createColorFocus({
    canvas: overlay, source: image, hexes: colors.map((color) => color.hex),
    width: FOCUS_WIDTH, height: Math.round(FOCUS_WIDTH * root.clientHeight / root.clientWidth), cover: true,
  });
  colors.forEach((color, index) => {
    container.appendChild(renderSwatch(color, { work: slug, series, nameFirst: true, onEnter: () => focus.show(index), onLeave: () => focus.hide() }));
  });
};
