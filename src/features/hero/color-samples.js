import { extractPalette, toHex } from '../../lib/color.js';
import { nameColors, rgbToOklab } from '../../lib/color-science.js';
import { sampleImage } from '../../lib/image.js';

/**
 * Shows the painting's main colors as buttons in `container`, each labeled with its name. Hovering one
 * washes the hero in that color; clicking copies its hex code.
 */
export const renderColorSamples = (container, wash, img) => {
  container.querySelectorAll('button').forEach((button) => button.remove());
  const palette = extractPalette(sampleImage(img));
  const names = nameColors(palette.map((color) => rgbToOklab(...color)));
  palette.forEach((color, i) => {
    const hex = toHex(color);
    const button = document.createElement('button');
    button.setAttribute('aria-label', `Color sample: ${names[i]}. Copies ${hex}`);
    button.innerHTML = `<span>${names[i]}</span><i style="background:${hex}"></i>`;
    button.addEventListener('mouseenter', () => { wash.style.background = hex; wash.style.opacity = 0.55; });
    button.addEventListener('mouseleave', () => { wash.style.opacity = 0; });
    button.addEventListener('click', () => { if (navigator.clipboard) navigator.clipboard.writeText(hex); });
    container.appendChild(button);
  });
};
