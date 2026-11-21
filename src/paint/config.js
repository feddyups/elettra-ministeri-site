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

/**
 * The live painting (live-paint.js), used where a painting's colors are known: the picture starts as a pencil sketch on paper and
 * each of the painting's colors is painted in turn into its own zone of the picture, then the real picture glazes in.
 * Times are shares of PAINT.durationMs.
 */
export const LIVE = {
  /** How far from a color a pixel can be and still belong to its zone (OKLab, as in focus-config.js), the share of that within which it belongs fully, and how often the zone's edge is smoothed. */
  reach: 0.24,
  core: 0.35,
  smoothing: 2,
  /** The working copy the zones are measured on is at most this wide and holds at most this many pixels (a tall picture is measured smaller). */
  zoneWidth: 360,
  zonePixels: 130000,
  /** The same for the working copy the pencil sketch is drawn at (it is scaled up to the canvas). */
  sketchWidth: 720,
  sketchPixels: 260000,
  /** How dark the pencil lines are (higher is darker and fewer), and the two tones of the sketch. */
  pencil: 3,
  ink: [26, 22, 18],
  paper: [240, 234, 221],
  /** The colors are painted one after another, each window as long as this many steps and starting one step after the last; the last window ends at `zonesEnd`. */
  windowSteps: 4 / 3,
  zonesEnd: 0.8,
  /** How long a color takes to switch on in the picture. */
  switchOn: 0.06,
  /** The pencil and zone veil lifts from this moment, over `liftSpan`. */
  liftAt: 0.9,
  liftSpan: 0.09,
  /** The soft patches and the glaze of the real picture begin at these shares of the duration (they end with it). */
  revealStart: 0.55,
  revealSpan: 0.25,
  glazeStart: 0.675,
  /** Strokes laid for a painting of the reference size (a 480 x 767 picture), as a multiple of PAINT.strokesPerMegapixel's share of its area. Larger pictures get larger strokes, not more. */
  referenceArea: 480 * 767,
  strokeFactor: 1.5,
  /** A bristle stroke is drawn along its path over this share of the duration. */
  strokeSpan: 0.03125,
  /** The mix of strokes as a color is painted, from its first stroke to its last: [wash, bristle, touch]. */
  mixStart: [0.6, 0.3, 0.1],
  mixEnd: [0.1, 0.45, 0.4],
  /** Washes: how translucent, and how much smaller than a touch. */
  washAlpha: 0.3,
  washSize: 0.75,
  /** Bristle strokes: length as a multiple of width, how evenly the bristles end, how much they narrow, curve and fade. */
  bristle: { length: [1.5, 3], end: [0.93, 1.03], taper: 0.1, curve: 0.3, fade: 0.3, width: [17, 5], minWidth: 2.2, segments: 8, most: 9 },
};
