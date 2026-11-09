export const PAINT = {
  /** Time from the first stroke to the finished painting, at speed 1. */
  durationMs: 7800,
  /** Total strokes laid down per megapixel of canvas. */
  strokesPerMegapixel: 17000,
  /** Share of the duration by which the strokes have all been laid down. */
  strokesEnd: 0.86,
  /** Extra strokes (as a share of the total) added after that, until the end. */
  extraStrokes: 0.12,
  /** Share of the duration during which soft patches of the real image are laid across the canvas. */
  revealStart: 0.5,
  revealEnd: 0.93,
  /** Patch size in pixels at 1300px canvas width, and how many times over the canvas the patches add up to. */
  patchSize: 30,
  patchCoverage: 2.4,
  /** Share of the duration at which the real image starts to be glazed uniformly, easing in until the end. */
  glazeStart: 0.74,
  /** Stroke size at the start and the end of the painting, in pixels at 1300px canvas width. */
  strokeSizeStart: 26,
  strokeSizeEnd: 3,
  strokeSizeMax: 48,
  strokeSizeMin: 1.8,
  /** Share of strokes drawn as pills and dots; the rest are leaves. */
  pillShare: 0.2,
  dotShare: 0.14,
};
