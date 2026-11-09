const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const gap = (a, b) => Math.hypot(...rgb(a).map((v, i) => v - rgb(b)[i]));

/** The work that shows `hex` most: a close color in its palette, weighted by how much of the work it covers. */
export const nearestWork = (hex, works) => {
  let best = null; let bestScore = -1;
  for (const work of works) {
    for (const [other, , share] of work.palette) {
      const score = share / (1 + gap(hex, other) / 40);
      if (score > bestScore) { bestScore = score; best = work; }
    }
  }
  return best;
};
