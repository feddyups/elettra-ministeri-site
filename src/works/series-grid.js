import { h } from '../lib/elements.js';
import { worksOfSeries, pictureAt } from './series-notes.js';
import { factsLine } from './facts.js';
import { enquiryTopic } from './price.js';

const WIDTHS = [500, 1000, 1500];
const SIZES = '(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw';

/** One entry of a series page: the picture, its title and facts, and the way to enquire. */
const renderEntry = (slug, work) => {
  const page = `/paintings/${slug}`;
  const { width, height } = work.image;
  return h('li', { class: 'th-work', id: slug },
    h('a', { class: 'th-img', href: page },
      h('img', {
        src: pictureAt(work, 1000), srcset: WIDTHS.map((w) => `${pictureAt(work, w)} ${w}w`).join(', '), sizes: SIZES,
        alt: work.alt, width: 1000, height: Math.round(1000 * height / width), loading: 'lazy',
      })),
    h('div', { class: 'th-cap' },
      h('div', null, h('b', null, h('a', { href: page }, work.title)), h('small', null, factsLine(work))),
      h('a', { href: `/enquire?SQF_WORK=${encodeURIComponent(enquiryTopic(work.title, work))}` }, 'Enquire')));
};

/**
 * Fills a series page's grid of works from the catalogue, so adding a work to the catalogue is enough to put it on its series' page:
 * every `<ul class="th-grid">` is filled for the series the page belongs to (the page's `data-series`, or its own `data-series-grid="archive"`). The strips of color and the hover labels are added to each entry afterwards
 * (works/series-strip.js). Whatever the page already held in the list stays as it was if the series is unknown.
 */
export const initSeriesGrid = (list) => {
  const series = list.dataset.seriesGrid || document.documentElement.dataset.series;
  const works = worksOfSeries(series);
  if (!works.length) return;
  list.replaceChildren(...works.map(([slug, work]) => renderEntry(slug, work)));
};
