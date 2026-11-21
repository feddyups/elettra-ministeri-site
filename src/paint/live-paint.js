import { LIVE, PAINT } from './config.js';
import { createSourcePixels } from './source-pixels.js';
import { createFlowField } from './flow-field.js';
import { createBrushHand } from './brush-hand.js';
import { createReveal } from './reveal.js';
import { createSketch } from './sketch.js';
import { createZones, placeIn } from './zones.js';
import { advanceStroke, createBristleHand } from './bristles.js';

const smoothstep = (x) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const layer = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

/**
 * Paints a picture the way a painter would work from a drawing: the canvas starts as the picture in pencil on paper, then each of the painting's
 * colors is painted in turn, into the parts of the picture where that color lives, each window overlapping the next. Every color begins with broad
 * translucent washes, goes on to bristle strokes that follow the form, and ends with small opaque touches. Last, the pencil lifts and the real picture is glazed over everything,
 * so the final frame is the picture itself.
 *
 * Called through paintImage (paint-image.js), which cancels a painting that is replaced; `alive()` says whether this one still is the current painting.
 *
 * @param {{ img: HTMLImageElement, canvas: HTMLCanvasElement, W: number, H: number, speed: number, colors: string[], alive: () => boolean }} options
 * @returns {Promise<boolean>} true when the painting finished, false if it was cancelled
 */
export const paintLive = ({ img, canvas, W, H, speed, colors, alive }) => new Promise((resolve) => {
  const ctx = canvas.getContext('2d');
  const source = createSourcePixels(img, W, H);
  const flowField = createFlowField(source.luminance, W, H);
  const sketch = createSketch(source.canvas);
  const zones = createZones(source.canvas, colors);

  // the strokes go on a layer of their own; what shows is the sketch with that layer laid through the colors that have been switched on
  const paint = layer(W, H);
  const pctx = paint.getContext('2d');
  const through = layer(W, H);
  const tctx = through.getContext('2d');
  const veil = layer(zones.width, zones.height);
  const vctx = veil.getContext('2d');

  const count = colors.length;
  const step = LIVE.zonesEnd / (count - 1 + LIVE.windowSteps);
  const length = step * LIVE.windowSteps;
  const startOf = (k) => k * step;

  const scale = Math.sqrt(W * H / LIVE.referenceArea);
  const sizeScale = 0.4 * scale;
  let zone = 0;
  const place = () => {
    const at = placeIn(zones.places[zone]);
    return at ? [at[0] / zones.width * W + (Math.random() - 0.5) * 6, at[1] / zones.height * H + (Math.random() - 0.5) * 6] : null;
  };
  const flight = [];
  let now = 0;
  const wash = createBrushHand({ ctx: pctx, W, H, sizeScale: sizeScale * LIVE.washSize, flowField, source, place, alpha: LIVE.washAlpha });
  const touch = createBrushHand({ ctx: pctx, W, H, sizeScale, flowField, source, place });
  const bristle = createBristleHand({ W, H, scale, flowField, source, place, flight, now: () => now });
  const reveal = createReveal({ ctx: pctx, W, H, source, flowField, sizeScale: Math.max(0.4, Math.min(1, W / 1300)) });

  const hand = (progress) => {
    const a = LIVE.mixStart.map((v, i) => lerp(v, LIVE.mixEnd[i], progress));
    const pick = Math.random() * (a[0] + a[1] + a[2]);
    if (pick < a[0]) wash(progress); else if (pick < a[0] + a[1]) bristle(progress); else touch(progress);
  };

  const total = PAINT.strokesPerMegapixel * (LIVE.referenceArea / 1e6) * LIVE.strokeFactor;
  const sum = zones.areas.reduce((a, b) => a + b, 0) || 1;
  const quota = zones.areas.map((area) => total * area / sum);
  const drawn = zones.areas.map(() => 0);

  let glazed = 0;
  const glaze = (target) => {
    const p = Math.min(1, target);
    if (p <= glazed) return;
    pctx.globalAlpha = (p - glazed) / (1 - glazed);
    pctx.drawImage(source.canvas, 0, 0);
    pctx.globalAlpha = 1;
    glazed = p;
  };

  /** What shows at time t: the sketch, and the strokes through the zones switched on so far (all of it once the pencil lifts). */
  const compose = (t) => {
    vctx.globalCompositeOperation = 'source-over';
    vctx.clearRect(0, 0, veil.width, veil.height);
    vctx.globalCompositeOperation = 'lighter';
    zones.masks.forEach((mask, k) => {
      const on = smoothstep((t - startOf(k)) / LIVE.switchOn);
      if (on > 0) { vctx.globalAlpha = on; vctx.drawImage(mask, 0, 0); }
    });
    const lift = smoothstep((t - LIVE.liftAt) / LIVE.liftSpan);
    if (lift > 0) { vctx.globalAlpha = lift; vctx.fillStyle = '#fff'; vctx.fillRect(0, 0, veil.width, veil.height); }
    vctx.globalAlpha = 1;

    tctx.globalCompositeOperation = 'copy';
    tctx.drawImage(paint, 0, 0);
    tctx.globalCompositeOperation = 'destination-in';
    tctx.drawImage(veil, 0, 0, W, H);
    ctx.globalCompositeOperation = 'copy';
    ctx.drawImage(sketch, 0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(through, 0, 0);
  };

  const duration = PAINT.durationMs / speed;
  let startedAt = 0;
  const frame = (time) => {
    if (!alive()) { resolve(false); return; }
    if (!startedAt) startedAt = time;
    now = Math.min(1, (time - startedAt) / duration);
    for (let k = 0; k < count; k++) {
      const local = (now - startOf(k)) / length;
      if (local <= 0) continue;
      zone = k;
      const wanted = Math.floor(quota[k] * Math.pow(Math.min(1, local), 1.05));
      while (drawn[k] < wanted) { hand(Math.min(1, drawn[k] / quota[k])); drawn[k]++; }
    }
    for (let i = flight.length - 1; i >= 0; i--) if (advanceStroke(pctx, flight[i], now)) flight.splice(i, 1);
    if (now > LIVE.revealStart) reveal((now - LIVE.revealStart) / LIVE.revealSpan);
    if (now > LIVE.glazeStart) glaze(smoothstep((now - LIVE.glazeStart) / (1 - LIVE.glazeStart)));
    if (now >= 1) {
      flight.forEach((stroke) => advanceStroke(pctx, stroke, Infinity));
      glaze(1);
      compose(1);
      resolve(true);
      return;
    }
    compose(now);
    requestAnimationFrame(frame);
  };
  compose(0);
  requestAnimationFrame(frame);
});
