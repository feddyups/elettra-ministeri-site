import { loadImage, sampleImage } from '../lib/image.js';
import { extractPalette, backgroundTone, renderSwatches } from '../lib/color.js';
import { onFirstVisible } from '../lib/dom.js';
import { paintSections } from './page-tone.js';
import { TONES } from '../themes/tones.generated.js';
import { h } from '../lib/elements.js';
import { renderSwatch } from '../color/swatch.js';
import { createColorFocus } from '../color/color-focus.js';
import { seriesColors } from '../color/scope.js';

/** The series a chapter belongs to, from the link to its page (/paintings/<series>). */
const seriesOf = (chapter) => {
  const link = chapter.querySelector('a[href^="/paintings/"]');
  return link ? link.getAttribute('href').split('/').filter(Boolean).pop() : null;
};

/**
 * A series chapter: takes its section tone from the site's color map (the same
 * tone its series page uses) and its swatches from the series' analysed palette (the
 * one its page and the infographic show; clicking one copies its code), falling back to the painting's own colors for a
 * series that is not in the map, and reveals the image the first time the
 * chapter scrolls into view.
 */
export const initChapter = (chapter) => {
  const frame = chapter.querySelector('.frame');
  const img = frame.querySelector('img');

  loadImage(img, chapter.getAttribute('data-img')).then(() => {
    const palette = extractPalette(sampleImage(img));
    const tone = TONES[seriesOf(chapter)];
    chapter.setAttribute('data-bg', tone ? tone.bg : `rgb(${backgroundTone(palette).map(Math.round).join(',')})`);
    chapter.setAttribute('data-fg', tone ? tone.fg : '#faf8f5');
    paintSections();
    const chips = chapter.querySelector('.chips');
    const analysed = seriesColors(seriesOf(chapter));
    if (analysed && chips) {
      const overlay = h('canvas', { class: 'em-focus', 'aria-hidden': 'true' });
      frame.append(overlay);
      const focus = createColorFocus({ canvas: overlay, source: img, hexes: analysed.map((color) => color.hex) });
      chips.replaceChildren(...analysed.map((color, index) => renderSwatch(color, {
        series: seriesOf(chapter), showName: false, onEnter: () => focus.show(index), onLeave: () => focus.hide(),
      })));
    } else renderSwatches(chips, palette);
    frame.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    frame.style.setProperty('--ratio', img.naturalWidth / img.naturalHeight);
    onFirstVisible(chapter, 0.35, () => frame.classList.add('done'));
  });
};
