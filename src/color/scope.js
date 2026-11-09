import { ATLAS } from './atlas.generated.js';

/**
 * What a block shows. `all` is the whole body of work; `series:<slug>` is one series, with `universe`
 * holding every work so a block can place the series among the rest.
 *
 * @returns {{ id: string, label: string, count: number, accent: string|null, stats: object, hue: number[], palette: string[][], loud: string[][]|null, pair: object|null, works: object[], universe: object[] } | null}
 */
export const resolveScope = (spec = 'all') => {
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

/** The accent color of a series (white for works outside every series). */
export const accentOf = (slug) => (ATLAS.series[slug] ? ATLAS.series[slug].accent : '#faf8f5');

/** Series in display order, for blocks that group works by series. */
export const seriesList = () => Object.entries(ATLAS.series).map(([slug, s]) => ({ slug, label: s.label, path: s.path, accent: s.accent, stats: s }));
