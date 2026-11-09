const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const gap = (a, b) => Math.hypot(...rgb(a).map((v, i) => v - rgb(b)[i]));

/** How far `from`'s colors are from `to`'s: each color's distance to the nearest color of `to`, weighted by how much of `from` it covers. */
const reach = (from, to) => from.palette.reduce((sum, [hex, , share]) => sum + share * Math.min(...to.palette.map(([other]) => gap(hex, other))), 0);

/** The `count` works whose colors are closest to this work's, nearest first. */
export const similarWorks = (work, universe, count = 3) => universe
  .filter((other) => other.slug && other.slug !== work.slug)
  .map((other) => ({ other, distance: reach(work, other) + reach(other, work) }))
  .sort((a, b) => a.distance - b.distance)
  .slice(0, count)
  .map(({ other }) => other);
