import { PAINT } from './config.js';

/**
 * Reveals the real image through soft-edged patches laid in random order over
 * the whole canvas. Each patch is the source image multiplied by a feathered,
 * contour-aligned elliptical mask, so patches blend into the strokes around them.
 *
 * @returns {(progress: number) => void} call with 0 to 1; lays the patches due by then
 */
export const createReveal = ({ ctx, W, H, source, flowField, sizeScale }) => {
  const cell = Math.max(24, PAINT.patchSize * sizeScale);
  const stretch = 1.5;
  const maxRadius = cell * 1.7;
  const reach = Math.ceil(maxRadius * stretch) + 2;

  const centers = [];
  for (let y = 0; y < H + cell; y += cell) {
    for (let x = 0; x < W + cell; x += cell) {
      centers.push([x + (Math.random() - 0.5) * cell * 0.8, y + (Math.random() - 0.5) * cell * 0.8]);
    }
  }
  for (let i = centers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [centers[i], centers[j]] = [centers[j], centers[i]];
  }
  /* A feathered patch opacifies about 55% of its elliptical area, so the count follows the canvas area. */
  const meanRadius = cell * 1.3;
  const patchArea = Math.PI * meanRadius * meanRadius * stretch * 0.55;
  const total = Math.floor(PAINT.patchCoverage * W * H / patchArea);

  const scratch = document.createElement('canvas');
  scratch.width = reach * 2;
  scratch.height = reach * 2;
  const sctx = scratch.getContext('2d');

  const lay = (cx, cy) => {
    const flow = flowField(cx, cy);
    const angle = flow.angle === null ? Math.random() * Math.PI : flow.angle + (Math.random() - 0.5) * 0.5;
    const radius = cell * (0.9 + Math.random() * 0.8);
    const x0 = Math.max(0, Math.floor(cx - reach));
    const y0 = Math.max(0, Math.floor(cy - reach));
    const x1 = Math.min(W, Math.ceil(cx + reach));
    const y1 = Math.min(H, Math.ceil(cy + reach));
    const w = x1 - x0;
    const h = y1 - y0;
    if (w < 1 || h < 1) return;

    sctx.globalCompositeOperation = 'source-over';
    sctx.clearRect(0, 0, scratch.width, scratch.height);
    sctx.drawImage(source.canvas, x0, y0, w, h, 0, 0, w, h);

    sctx.globalCompositeOperation = 'destination-in';
    sctx.save();
    sctx.translate(cx - x0, cy - y0);
    sctx.rotate(angle);
    sctx.scale(stretch, 1);
    const mask = sctx.createRadialGradient(0, 0, radius * 0.25, 0, 0, radius);
    mask.addColorStop(0, 'rgba(0,0,0,1)');
    mask.addColorStop(1, 'rgba(0,0,0,0)');
    sctx.fillStyle = mask;
    sctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    sctx.restore();

    ctx.drawImage(scratch, 0, 0, w, h, x0, y0, w, h);
  };

  let laid = 0;
  return (progress) => {
    const due = Math.floor(total * Math.min(1, progress));
    while (laid < due) { const c = centers[laid % centers.length]; lay(c[0], c[1]); laid++; }
  };
};
