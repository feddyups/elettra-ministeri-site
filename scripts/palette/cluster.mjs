import { distance } from './color-science.mjs';

/** Small seeded random generator, so the same images always give the same palette. */
const seeded = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Weighted k-means over OKLab points. Returns clusters sorted by share, each with its
 * center and the fraction of the total weight it holds. Clusters that end up closer than
 * `mergeBelow` (perceptual distance) are merged, so a palette never lists the same color twice.
 *
 * @param {number[][]} points  [L, a, b]
 * @param {number[]} weights   one weight per point
 */
export const kmeans = (points, weights, k, { iterations = 20, mergeBelow = 0.06, seed = 7 } = {}) => {
  if (!points.length) return [];
  const rnd = seeded(seed);
  const total = weights.reduce((a, b) => a + b, 0);

  // k-means++ start: each new center is likely to be far from the ones already chosen
  const centers = [points[Math.floor(rnd() * points.length)].slice()];
  while (centers.length < Math.min(k, points.length)) {
    const d2 = points.map((p, i) => weights[i] * Math.min(...centers.map((c) => distance(p, c) ** 2)));
    const sum = d2.reduce((a, b) => a + b, 0);
    if (sum === 0) break;
    let r = rnd() * sum; let pick = 0;
    for (; pick < d2.length - 1; pick++) { r -= d2[pick]; if (r <= 0) break; }
    centers.push(points[pick].slice());
  }

  const assign = new Array(points.length).fill(0);
  for (let it = 0; it < iterations; it++) {
    for (let i = 0; i < points.length; i++) {
      let best = 0; let bestD = Infinity;
      for (let c = 0; c < centers.length; c++) {
        const d = distance(points[i], centers[c]);
        if (d < bestD) { bestD = d; best = c; }
      }
      assign[i] = best;
    }
    const sums = centers.map(() => [0, 0, 0, 0]);
    for (let i = 0; i < points.length; i++) {
      const s = sums[assign[i]]; const w = weights[i];
      s[0] += points[i][0] * w; s[1] += points[i][1] * w; s[2] += points[i][2] * w; s[3] += w;
    }
    sums.forEach((s, c) => { if (s[3] > 0) centers[c] = [s[0] / s[3], s[1] / s[3], s[2] / s[3]]; });
  }

  let clusters = centers.map((center, c) => ({
    center,
    weight: points.reduce((sum, _p, i) => sum + (assign[i] === c ? weights[i] : 0), 0),
  })).filter((c) => c.weight > 0);

  // merge near-duplicates, heaviest first
  clusters.sort((a, b) => b.weight - a.weight);
  const merged = [];
  for (const c of clusters) {
    const near = merged.find((m) => distance(m.center, c.center) < mergeBelow);
    if (near) {
      const w = near.weight + c.weight;
      near.center = near.center.map((v, i) => (v * near.weight + c.center[i] * c.weight) / w);
      near.weight = w;
    } else merged.push({ ...c });
  }
  return merged.sort((a, b) => b.weight - a.weight).map((c) => ({ center: c.center, share: c.weight / total }));
};
