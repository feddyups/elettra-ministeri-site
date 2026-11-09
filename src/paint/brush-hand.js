import { PAINT } from './config.js';
import { drawMark } from './shapes.js';

/**
 * The painter's hand: it works a small cluster of marks, then jumps
 * elsewhere. Marks shrink as `progress` goes from 0 to 1, and drift
 * toward the contours of the painting.
 *
 * @param {number} sizeScale canvas-width factor so marks scale with the canvas
 */
export const createBrushHand = ({ ctx, W, H, sizeScale, flowField, source }) => {
  const hand = { x: W / 2, y: H / 2, marksLeft: 0, angle: 0 };
  const { strokeSizeStart, strokeSizeEnd, strokeSizeMax, strokeSizeMin } = PAINT;

  return (progress) => {
    if (hand.marksLeft <= 0) {
      hand.x = Math.random() * W;
      hand.y = Math.random() * H;
      hand.marksLeft = 4 + Math.floor(Math.random() * 20);
      hand.angle = Math.random() * Math.PI;
    }
    hand.marksLeft--;

    const target = (strokeSizeStart - (strokeSizeStart - strokeSizeEnd) * Math.pow(progress, 0.55)) * sizeScale;
    const width = Math.max(strokeSizeMin, Math.min(strokeSizeMax * sizeScale, target * Math.exp((Math.random() - 0.5) * 1.6)));
    const length = width * (3.4 + Math.random() * 2.8);

    const edgeBias = Math.pow(progress, 1.1);
    let x;
    let y;
    let flow;
    for (let tries = 0; tries < 6; tries++) {
      x = Math.max(0, Math.min(W, hand.x + (Math.random() + Math.random() - 1) * width * 2.2));
      y = Math.max(0, Math.min(H, hand.y + (Math.random() + Math.random() - 1) * width * 2.2));
      flow = flowField(x, y);
      if (Math.random() < (1 - edgeBias) + edgeBias * (0.1 + 0.9 * flow.edge)) break;
    }
    hand.x += (Math.random() - 0.5) * width * 0.9;
    hand.y += (Math.random() - 0.5) * width * 0.9;

    const angle = (flow.angle === null ? hand.angle : flow.angle) + (Math.random() - 0.5) * (0.5 - 0.3 * progress);
    const colour = width > 14 ? source.mean(x, y, width * 0.4) : (width > 7 ? source.mean(x, y, width * 0.25) : source.pixel(x, y));
    drawMark(ctx, { x, y, angle, length, width, colour, alpha: 0.97, jitter: (Math.random() - 0.5) * (12 - 6 * progress) });
  };
};
