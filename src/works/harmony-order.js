import { colorDistance } from './walk.js';

/*
 * The order of the paintings on a series page, by one chromatic rule: a smooth path through color. The distance between two paintings
 * is the one "Where to look next" uses (how far apart their colors are, in OKLab, weighted by how much of the picture each covers).
 * The paintings are laid out as the shortest path that visits every one, so each painting is followed by one close to it in color
 * and the page never jumps from one palette to a very different one and back. The path is found the same way every time: the best of
 * the nearest-neighbor paths from each starting painting, each tidied by reversing stretches while that shortens it. It starts at the
 * warmer end.
 */
const lean = (work) => work.warm - work.cool - work.violet;

/** The works (each with a `palette`, `warm`, `cool` and `violet`) in the order of their shortest color path. */
export const harmonicOrder = (works) => {
  const n = works.length;
  if (n < 3) return works.slice();
  const d = works.map((a, i) => works.map((b, j) => (j < i ? 0 : i === j ? 0 : colorDistance(a, b))));
  for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) d[i][j] = d[j][i];
  const length = (path) => path.slice(1).reduce((sum, to, i) => sum + d[path[i]][to], 0);

  let best = null;
  for (let start = 0; start < n; start++) {
    const path = [start];
    const left = new Set([...Array(n).keys()].filter((i) => i !== start));
    while (left.size) {
      const last = path[path.length - 1];
      let pick = null;
      left.forEach((i) => { if (pick === null || d[last][i] < d[last][pick]) pick = i; });
      path.push(pick);
      left.delete(pick);
    }
    let improved = true;
    while (improved) {
      improved = false;
      for (let i = 0; i < n - 1 && !improved; i++) {
        for (let j = i + 1; j < n && !improved; j++) {
          const trial = [...path.slice(0, i), ...path.slice(i, j + 1).reverse(), ...path.slice(j + 1)];
          if (length(trial) < length(path) - 1e-9) { path.splice(0, n, ...trial); improved = true; }
        }
      }
    }
    if (!best || length(path) < length(best) - 1e-9) best = path;
  }
  const ordered = best.map((i) => works[i]);
  return lean(ordered[0]) >= lean(ordered[ordered.length - 1]) ? ordered : ordered.reverse();
};
