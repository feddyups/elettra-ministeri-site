import { h } from '../lib/elements.js';
import { createColorFocus } from '../color/color-focus.js';
import { renderColorStrip } from '../color/color-strip.js';
import { openLightbox } from './lightbox.js';
import { createWorkPaint } from './work-paint.js';
import { priceOf } from './price.js';
import { readFavoriteSlugs } from './favorites.js';
import { starIcon } from './favorite-star.js';

const WIDTHS = [500, 1000, 1500, 2500];

/**
 * The top of a painting page: the picture (painted stroke by stroke as it comes into view; click to enlarge;
 * pointing at a color, in the strip beneath it or below, turns the rest of it black and white),
 * its series, title, one line of facts and the way to enquire.
 *
 * @returns {{ element: HTMLElement, showColor: (index: number|null) => void }}
 */
export const renderWorkHero = (info, work, series) => {
  const { src, width, height } = info.image;
  const paintCanvas = h('canvas', { class: 'wp-paint', 'aria-hidden': 'true' });
  const focusCanvas = h('canvas', { class: 'em-focus', 'aria-hidden': 'true' });
  const img = h('img', {
    src: `${src}?format=1500w`,
    srcset: WIDTHS.map((w) => `${src}?format=${w}w ${w}w`).join(', '),
    sizes: '(max-width: 900px) 100vw, 58vw',
    alt: info.alt, width, height,
  });
  const zoom = h('button', { class: 'wp-zoom', type: 'button', 'aria-label': `View ${info.title} larger` }, img, paintCanvas, focusCanvas);
  zoom.addEventListener('click', () => openLightbox({ src: `${src}?format=2500w`, alt: info.alt }));

  const facts = [info.medium, info.size].filter(Boolean).join(' · ');
  const stage = h('div', { class: 'wp-stage' }, zoom);
  const figure = h('figure', { class: 'wp-figure', style: { '--ratio': width / height } }, stage);
  const painter = createWorkPaint({ figure, zoom, canvas: paintCanvas, url: `${src}?format=1500w`, width, height });
  const repaint = painter.ready && h('button', { class: 'wp-repaint', type: 'button' }, 'Repaint');
  if (repaint) { repaint.addEventListener('click', painter.replay); stage.append(repaint); }
  const focus = createColorFocus({ canvas: focusCanvas, source: `${src}?format=500w`, hexes: work.palette.map(([hex]) => hex) });
  figure.append(renderColorStrip(work, { onEnter: (index) => focus.show(index), onLeave: () => focus.hide() }));
  const kicker = h('a', { class: 'wp-kicker', href: series.path }, `${series.label} ›`);
  // a painting the artist has marked as a favorite says so, beside its series, and leads to the page of her favorites
  readFavoriteSlugs().then((slugs) => {
    if (slugs && slugs.includes(work.slug)) kicker.after(h('a', { class: 'wp-kicker wp-pick', href: '/paintings/favorites' }, starIcon(), 'Artist pick ›'));
  });
  const element = h('section', { class: 'wp-hero' },
    figure,
    h('div', { class: 'wp-info' },
      kicker,
      h('h1', null, info.title),
      h('p', { class: 'wp-facts' }, facts),
      priceOf(info) && h('p', { class: 'wp-price' }, priceOf(info)),
      h('a', { class: 'wp-cta', href: '#enquire' }, 'Enquire about this work')));

  return { element, showColor: (index) => (index == null ? focus.hide() : focus.show(index)) };
};
