import { WORKS } from './works.config.mjs';
import { loadWorkPixels } from './image.mjs';
import { analyzeWork, poolPalette, summarize, complementaryPair } from './analyze.mjs';

/**
 * Analyses every work in works.config.mjs: a palette per work, a fingerprint and palette per series,
 * and one signature palette and one "loudest colors" palette across all of it (k-means in OKLab).
 *
 * @param {{ catalogueDir?: string, k?: number, onWork?: (work: object, analysis: object) => void }} options
 */
export const runAnalysis = async ({ catalogueDir, k = 5, onWork = () => {} } = {}) => {
  const results = [];
  for (const work of WORKS) {
    const pixels = await loadWorkPixels(work, catalogueDir);
    const analysis = analyzeWork(pixels, { k });
    results.push({ ...work, source: work.catalogue ? `catalogue: ${work.catalogue}` : work.url, ...analysis });
    onWork(work, analysis);
  }

  const seriesIds = [...new Set(results.map((r) => r.series).filter(Boolean))];
  const series = Object.fromEntries(seriesIds.map((id) => {
    const group = results.filter((r) => r.series === id);
    return [id, { ...summarize(group), palette: poolPalette(group, 5) }];
  }));
  // the body of work is the paintings: a textile has its own page and is left out of the overall figures
  const paintings = results.filter((r) => r.material !== 'textile');
  const signature = poolPalette(paintings, 10);
  const accents = poolPalette(paintings, 8, { vivid: true });
  const overall = { ...summarize(paintings), signature, accents, complementary: complementaryPair(accents) };
  return { k, works: results.map(({ samples, ...rest }) => rest), series, overall };
};
