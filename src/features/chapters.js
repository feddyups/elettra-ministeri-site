import { loadImage, sampleImage } from '../lib/image.js';
import { extractPalette, backgroundTone, renderSwatches } from '../lib/color.js';
import { onFirstVisible } from '../lib/dom.js';

/**
 * A series chapter: takes its section tone and swatches from the painting,
 * and reveals the image the first time the chapter scrolls into view.
 */
export const initChapter = (chapter) => {
  const frame = chapter.querySelector('.frame');
  const img = frame.querySelector('img');

  loadImage(img, chapter.getAttribute('data-img')).then(() => {
    const palette = extractPalette(sampleImage(img));
    chapter.setAttribute('data-bg', `rgb(${backgroundTone(palette).map(Math.round).join(',')})`);
    chapter.setAttribute('data-fg', '#faf8f5');
    renderSwatches(chapter.querySelector('.chips'), palette);
    frame.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    onFirstVisible(chapter, 0.35, () => frame.classList.add('done'));
  });
};
