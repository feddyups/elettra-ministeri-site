/**
 * How generously the color focus (color-focus.js) selects around a color. Distances are perceptual (OKLab:
 * about 0.02 is barely noticeable, 0.1 is clearly another shade, 0.3 is another color). Change a value here
 * to change it everywhere, or pass the same names as options to `createColorFocus` to change one use.
 */
export const FOCUS = {
  /** Distance from the chosen color at which a pixel has faded completely to gray. Larger selects more neighboring shades. */
  reach: 0.21,
  /** The share of `reach` (0 to 1) within which a pixel keeps its full color; beyond it the color fades smoothly to gray. */
  core: 0.35,
  /** How many times the edge of the selection is smoothed (a 3 x 3 average each time). 0 leaves it as the pixels fall. */
  smoothing: 2,
  /** How bright the black-and-white part is, from 0 (black) to 1 (the picture's own brightness). */
  grayLevel: 0.92,
  /** Width in pixels of the working copy of the picture; larger is crisper and slower. */
  width: 360,
};
