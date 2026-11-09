export const PAINT = {
  /** Time from the first stroke to the finished painting, at speed 1. */
  durationMs: 7800,
  /** Total strokes laid down per megapixel of canvas. */
  strokesPerMegapixel: 17000,
  /** Share of the duration spent stroking before the real image is glazed over the canvas. */
  glazeStart: 0.86,
  /** Extra strokes (as a share of the total) added while the glaze fades in. */
  glazeExtraStrokes: 0.12,
  /** Stroke size at the start and the end of the painting, in pixels at 1300px canvas width. */
  strokeSizeStart: 26,
  strokeSizeEnd: 3,
  strokeSizeMax: 48,
  strokeSizeMin: 1.8,
  /** Share of strokes drawn as pills and dots; the rest are leaves. */
  pillShare: 0.2,
  dotShare: 0.14,
};
