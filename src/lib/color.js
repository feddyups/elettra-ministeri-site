/** The `count` most common distinct colors of RGBA pixel data, as [r, g, b] arrays. */
export const extractPalette = (data, count = 5) => {
  const buckets = {};
  for (let i = 0; i < data.length; i += 4) {
    const key = ((data[i] >> 5) << 6) | ((data[i + 1] >> 5) << 3) | (data[i + 2] >> 5);
    const bucket = buckets[key] || (buckets[key] = { n: 0, r: 0, g: 0, b: 0 });
    bucket.n++;
    bucket.r += data[i];
    bucket.g += data[i + 1];
    bucket.b += data[i + 2];
  }
  const byFrequency = Object.values(buckets).sort((a, b) => b.n - a.n);
  const palette = [];
  for (let i = 0; i < byFrequency.length && palette.length < count; i++) {
    const b = byFrequency[i];
    const color = [b.r / b.n, b.g / b.n, b.b / b.n];
    const distinct = palette.every((p) => Math.hypot(p[0] - color[0], p[1] - color[1], p[2] - color[2]) > 64);
    if (distinct) palette.push(color);
  }
  return palette;
};

export const toHex = (color) => `#${color.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

/** A deep background tone derived from the most saturated color of the palette. */
export const backgroundTone = (palette) => {
  const saturation = (c) => Math.max(...c) - Math.min(...c);
  const richest = [...palette].sort((a, b) => saturation(b) - saturation(a))[0];
  return richest.map((v) => v * 0.42);
};

/** Fills `container` with one swatch per palette color. */
export const renderSwatches = (container, palette) => {
  if (!container) return;
  container.innerHTML = palette.map((c) => `<i title="${toHex(c)}" style="background:${toHex(c)}"></i>`).join('');
};
