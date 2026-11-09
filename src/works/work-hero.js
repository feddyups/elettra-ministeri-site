import { h } from '../lib/elements.js';
import { createColorReveal } from './color-reveal.js';
import { openLightbox } from './lightbox.js';

const WIDTHS = [500, 1000, 1500, 2500];

/**
 * The top of a painting page: the picture (click to enlarge; pointing at a color below dims the rest of it),
 * its series, title, one line of facts and the way to enquire.
 *
 * @returns {{ element: HTMLElement, showColor: (index: number|null) => void }}
 */
export const renderWorkHero = (info, work, series) => {
  const { src, width, height } = info.image;
  const canvas = h('canvas', { class: 'wp-reveal', 'aria-hidden': 'true' });
  const img = h('img', {
    src: `${src}?format=1500w`,
    srcset: WIDTHS.map((w) => `${src}?format=${w}w ${w}w`).join(', '),
    sizes: '(max-width: 900px) 100vw, 58vw',
    alt: info.alt, width, height,
  });
  const zoom = h('button', { class: 'wp-zoom', type: 'button', 'aria-label': `View ${info.title} larger` }, img, canvas);
  zoom.addEventListener('click', () => openLightbox({ src: `${src}?format=2500w`, alt: info.alt }));

  const facts = [info.medium, info.size, info.year].filter(Boolean).join(' · ');
  const element = h('section', { class: 'wp-hero' },
    h('figure', { class: 'wp-figure' }, zoom),
    h('div', { class: 'wp-info' },
      h('a', { class: 'wp-kicker', href: series.path }, `${series.label} ›`),
      h('h1', null, info.title),
      h('p', { class: 'wp-facts' }, facts),
      h('a', { class: 'wp-cta', href: '#enquire' }, 'Enquire about this painting')));

  return { element, showColor: createColorReveal(canvas, `${src}?format=500w`, work.palette.map(([hex]) => hex)) };
};
