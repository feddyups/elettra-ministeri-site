/**
 * Structure-tensor flow field: for any point it gives the direction of the
 * nearest contour in the painting (so strokes can follow it) and how strong
 * the local edge is.
 */
export const createFlowField = (luminance, W, H) => {
  const cell = Math.max(16, Math.round(W / 56));
  const gx = Math.ceil(W / cell);
  const gy = Math.ceil(H / cell);
  let jxx = new Float32Array(gx * gy);
  let jyy = new Float32Array(gx * gy);
  let jxy = new Float32Array(gx * gy);

  for (let y = 2; y < H - 2; y += 3) {
    for (let x = 2; x < W - 2; x += 3) {
      const dx = luminance(x + 2, y) - luminance(x - 2, y);
      const dy = luminance(x, y + 2) - luminance(x, y - 2);
      const i = ((y / cell) | 0) * gx + ((x / cell) | 0);
      jxx[i] += dx * dx;
      jyy[i] += dy * dy;
      jxy[i] += dx * dy;
    }
  }

  const blur = (grid) => {
    const out = new Float32Array(grid.length);
    for (let cy = 0; cy < gy; cy++) {
      for (let cx = 0; cx < gx; cx++) {
        let sum = 0;
        let count = 0;
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const ax = cx + ox;
            const ay = cy + oy;
            if (ax >= 0 && ay >= 0 && ax < gx && ay < gy) {
              sum += grid[ay * gx + ax];
              count++;
            }
          }
        }
        out[cy * gx + cx] = sum / count;
      }
    }
    return out;
  };
  jxx = blur(jxx);
  jyy = blur(jyy);
  jxy = blur(jxy);

  let maxEnergy = 1;
  for (let i = 0; i < jxx.length; i++) maxEnergy = Math.max(maxEnergy, jxx[i] + jyy[i]);

  /** @returns {{ angle: number | null, edge: number }} edge is 0 to 1; angle is null where there is no clear direction. */
  return (x, y) => {
    const i = Math.min(gy - 1, Math.max(0, (y / cell) | 0)) * gx + Math.min(gx - 1, Math.max(0, (x / cell) | 0));
    const a = jxx[i];
    const b = jyy[i];
    const c = jxy[i];
    const trace = a + b;
    const coherence = trace > 1 ? Math.sqrt((a - b) * (a - b) + 4 * c * c) / trace : 0;
    return {
      angle: coherence > 0.18 ? 0.5 * Math.atan2(2 * c, a - b) + Math.PI / 2 : null,
      edge: Math.sqrt(trace / maxEnergy),
    };
  };
};
