import { CATALOGUE } from '../../works/catalogue.js';
import { allWorks, seriesInfo } from '../../color/scope.js';

const WIDTH = 2000;
const MAX_PER_SERIES = 2;

/** One slide of the hero for a painting: what its caption says and where its button leads. */
const slideFor = (atlasWork) => {
  const work = CATALOGUE[atlasWork.slug];
  const series = seriesInfo(atlasWork.series);
  return {
    id: atlasWork.slug,
    colorKey: atlasWork.title,
    series: series.label,
    title: work.title,
    meta: [work.medium, work.size].filter(Boolean).join(' · '),
    href: series.path,
    image: `${work.image.src}?format=${WIDTH}w`,
    alt: work.alt,
  };
};

const shuffled = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/** Every work on paper or canvas (not the felt mask or the wooden wheel) that has a page of its own. */
const paintings = () => allWorks().filter((work) => CATALOGUE[work.slug] && !/felt|wood/i.test(CATALOGUE[work.slug].medium));

/**
 * The paintings one visit's hero slideshow cycles through: `count` different ones drawn at random from the whole
 * body of work, in random order, never more than two from the same series, and never starting on `notFirst`.
 *
 * @param {number} count
 * @param {string} [notFirst] the id of the painting the previous visit started with
 */
export const heroPlaylist = (count, notFirst) => {
  const perSeries = {};
  const chosen = shuffled(paintings()).filter((work) => {
    perSeries[work.series] = (perSeries[work.series] || 0) + 1;
    return perSeries[work.series] <= MAX_PER_SERIES;
  }).slice(0, count);
  if (chosen.length > 1 && chosen[0].slug === notFirst) chosen.push(chosen.shift());
  return chosen.map(slideFor);
};
