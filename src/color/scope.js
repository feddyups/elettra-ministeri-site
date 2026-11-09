import { ATLAS } from './atlas.generated.js';

/**
 * What a block shows. `all` is the whole body of work; `series:<slug>` is one series; `work:<slug>` is one painting.
 * `universe` holds every work so a block can place the scope among the rest.
 *
 * @returns {{ id: string, label: string, count: number, accent: string|null, stats: object, hue: number[], palette: string[][], loud: string[][]|null, pair: object|null, works: object[], universe: object[] } | null}
 */
export const resolveScope = (spec = 'all') => {
  if (spec.startsWith('work:')) {
    const work = findWork(spec.slice(5));
    if (!work) return null;
    return { id: 'work', label: work.title, count: 1, accent: accentOf(work.series), stats: work, hue: [], palette: work.palette, loud: null, pair: null, works: [work], universe: ATLAS.works };
  }
  if (spec === 'all') {
    const { works: count, palette, loud, pair, hue, ...stats } = ATLAS.overall;
    return { id: 'all', label: 'All works', count, accent: null, stats, hue, palette, loud, pair, works: ATLAS.works, universe: ATLAS.works };
  }
  const slug = spec.replace(/^series:/, '');
  const series = ATLAS.series[slug];
  if (!series) return null;
  const { label, works: count, accent, palette, hue, path, ...stats } = series;
  return { id: slug, label, count, accent, stats, hue, palette, loud: null, pair: null, works: ATLAS.works.filter((w) => w.series === slug), universe: ATLAS.works, path };
};

/** A work by its page name (its `slug`), with its palette and numbers. */
export const findWork = (slug) => ATLAS.works.find((w) => w.slug === slug);

/** A series' label, page and works, or undefined. */
export const seriesInfo = (slug) => (ATLAS.series[slug] ? { slug, label: ATLAS.series[slug].label, path: ATLAS.series[slug].path, works: ATLAS.works.filter((w) => w.series === slug) } : undefined);

/** The accent color of a series (white for works outside every series). */
export const accentOf = (slug) => (ATLAS.series[slug] ? ATLAS.series[slug].accent : '#faf8f5');

/** Series in display order, for blocks that group works by series. */
export const seriesList = () => Object.entries(ATLAS.series).map(([slug, s]) => ({ slug, label: s.label, path: s.path, accent: s.accent, stats: s }));
