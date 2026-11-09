import { extractPalette, toHex } from '../../lib/color.js';
import { nameColors, rgbToOklab } from '../../lib/color-science.js';
import { sampleImage } from '../../lib/image.js';
import { renderSwatch } from '../../color/swatch.js';
import { workColors } from '../../color/scope.js';

/** The colors to show for `work`: the analysed palette (the same one its page and the infographic use), or, for a work that is not in the analysis, colors sampled from the image. */
const colorsFor = (work, img) => {
  const analysed = work && workColors(work.title);
  if (analysed) return analysed;
  const palette = extractPalette(sampleImage(img));
  const names = nameColors(palette.map((color) => rgbToOklab(...color)));
  return { colors: palette.map((color, i) => ({ hex: toHex(color), name: names[i] })) };
};

/**
 * Shows the painting's main colors as buttons in `container`, each labeled with its name. Hovering one
 * washes the hero in that color; clicking copies its hex code.
 */
export const renderColorSamples = (container, wash, img, work) => {
  container.querySelectorAll('button').forEach((button) => button.remove());
  const { colors, slug, series } = colorsFor(work, img);
  colors.forEach((color) => {
    container.appendChild(renderSwatch(color, {
      work: slug, series, nameFirst: true,
      onEnter: () => { wash.style.background = color.hex; wash.style.opacity = 0.55; },
      onLeave: () => { wash.style.opacity = 0; },
    }));
  });
};
