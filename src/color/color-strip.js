import { h } from '../lib/elements.js';
import { renderSwatch } from './swatch.js';

/**
 * A painting's colors as a thin strip, each color sized by how much of the painting it covers. Every color is a
 * swatch (its name on hover, a click copies its code). Used under a painting's picture on its series page and
 * on its own page.
 *
 * @param {{ title: string, slug: string, series: string, palette: [string, string, number][] }} work
 * @param {{ onEnter?: (index: number) => void, onLeave?: (index: number) => void }} [handlers] called as a color is pointed at and left
 */
export const renderColorStrip = (work, { onEnter, onLeave } = {}) =>
  h('div', { class: 'em-strip', role: 'group', 'aria-label': `Colors of ${work.title}` },
    work.palette.map(([hex, name, share], index) => {
      const chip = renderSwatch({ hex, name, share }, {
        work: work.slug, series: work.series, className: 'em-swatch em-strip-chip', showName: false,
        onEnter: () => onEnter && onEnter(index), onLeave: () => onLeave && onLeave(index),
      });
      chip.style.flex = String(share);
      return chip;
    }));
