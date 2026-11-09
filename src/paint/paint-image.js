import { PAINT } from './config.js';
import { createSourcePixels } from './source-pixels.js';
import { createFlowField } from './flow-field.js';
import { createBrushHand } from './brush-hand.js';

const runs = new WeakMap();

const smoothstep = (x) => x * x * (3 - 2 * x);

/**
 * Repaints `img` onto `canvas` (W x H) stroke by stroke. Part-way through, the
 * real image is glazed over the canvas with an eased fade while the strokes
 * keep going, so the last frame is the picture itself.
 *
 * Starting a new paint on the same canvas cancels the previous one.
 *
 * @param {number} speed 1 is the full duration; 2 takes half as long
 * @returns {Promise<boolean>} true when the painting finished, false if it was cancelled
 */
export const paintImage = (img, canvas, W, H, speed = 1) => new Promise((resolve) => {
  const run = {};
  runs.set(canvas, run);
  canvas.width = W;
  canvas.height = H;
  canvas.style.opacity = 1;
  const ctx = canvas.getContext('2d');

  const source = createSourcePixels(img, W, H);
  const flowField = createFlowField(source.luminance, W, H);
  const sizeScale = Math.max(0.4, Math.min(1, W / 1300));
  const brush = createBrushHand({ ctx, W, H, sizeScale, flowField, source });

  const ground = source.averageColour().map((v) => Math.max(0, Math.min(255, v | 0)));
  ctx.fillStyle = `rgb(${ground.join(',')})`;
  ctx.fillRect(0, 0, W, H);

  const duration = PAINT.durationMs / speed;
  const strokeTotal = PAINT.strokesPerMegapixel * (W * H / 1e6);
  const { strokesEnd, extraStrokes, glazeStart } = PAINT;

  let strokesDrawn = 0;
  let glazed = 0;
  let startedAt = 0;

  /** Composites the real image so that its total opacity over the canvas is `target`. */
  const glaze = (target) => {
    const p = Math.min(1, target);
    if (p <= glazed) return;
    ctx.globalAlpha = (p - glazed) / (1 - glazed);
    ctx.drawImage(source.canvas, 0, 0);
    ctx.globalAlpha = 1;
    glazed = p;
  };

  const frame = (now) => {
    if (runs.get(canvas) !== run) { resolve(false); return; }
    if (!startedAt) startedAt = now;
    const t = Math.min(1, (now - startedAt) / duration);

    const wanted = t < strokesEnd
      ? Math.floor(strokeTotal * Math.pow(t / strokesEnd, 1.05))
      : Math.floor(strokeTotal * (1 + extraStrokes * Math.min(1, (t - strokesEnd) / (1 - strokesEnd))));
    while (strokesDrawn < wanted) { brush(Math.min(1, strokesDrawn / strokeTotal)); strokesDrawn++; }
    if (t > glazeStart) glaze(smoothstep((t - glazeStart) / (1 - glazeStart)));

    if (t >= 1) { glaze(1); resolve(true); return; }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
});
