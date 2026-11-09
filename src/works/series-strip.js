import { h } from '../lib/elements.js';
import { renderSwatch } from '../color/swatch.js';
import { createColorFocus } from '../color/color-focus.js';
import { findWork } from '../color/scope.js';

const FOCUS_FORMAT = 'format=500w';

/**
 * Adds a painting's strip of colors under its picture on a series page. Each color is a swatch (name on hover,
 * click copies its code) and pointing at one turns the picture black and white except where that color lives.
 * The painting is found by the id of its entry (`<li class="th-work" id="<page name>">`); an entry that is not
 * in the analysis, or has no linked picture, is left as it is.
 */
export const initSeriesStrip = (item) => {
  const work = findWork(item.id);
  const link = item.querySelector('a.th-img');
  const img = item.querySelector('img');
  if (!work || !link || !img) return;

  const overlay = h('canvas', { class: 'em-focus', 'aria-hidden': 'true' });
  link.append(overlay);
  const focus = createColorFocus({
    canvas: overlay,
    source: img.getAttribute('src').replace(/format=\d+w/, FOCUS_FORMAT),
    hexes: work.palette.map(([hex]) => hex),
  });

  link.after(h('div', { class: 'th-strip', role: 'group', 'aria-label': `Colors of ${work.title}` },
    work.palette.map(([hex, name, share], index) => {
      const chip = renderSwatch({ hex, name, share }, {
        work: work.slug, series: work.series, className: 'em-swatch th-chip', showName: false,
        onEnter: () => focus.show(index), onLeave: () => focus.hide(),
      });
      chip.style.flex = String(share);
      return chip;
    })));
};
