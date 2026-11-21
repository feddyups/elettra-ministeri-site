import { LIVE } from './config.js';

const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));

/** A stroke made of fine bristles that follow one gently curving path, each bristle in a slightly different shade of the picture's color there. */
const makeStroke = (x, y, angle, length, width, scale, source, start) => {
  const { end, taper, curve: bend, fade, segments, most } = LIVE.bristle;
  const count = Math.max(4, Math.min(most, Math.round(width / scale / 1.3)));
  const curve = (Math.random() - 0.5) * bend;
  const bristles = [];
  for (let b = 0; b < count; b++) {
    const offset = ((b + 0.5) / count - 0.5) * width + (Math.random() - 0.5) * width / count;
    const reach = length * (end[0] + Math.random() * (end[1] - end[0]));
    let px = x + Math.cos(angle + Math.PI / 2) * offset;
    let py = y + Math.sin(angle + Math.PI / 2) * offset;
    let heading = angle;
    const points = [];
    for (let i = 0; i <= segments; i++) {
      points.push([px, py]);
      heading += curve / segments + (Math.random() - 0.5) * 0.07;
      px += Math.cos(heading) * reach / segments;
      py += Math.sin(heading) * reach / segments;
    }
    const c = source.mean(points[0][0], points[0][1], Math.max(2, width * 0.4));
    const shade = (Math.random() - 0.5) * 26;
    bristles.push({
      points,
      color: `rgb(${clamp(c[0] + shade)},${clamp(c[1] + shade)},${clamp(c[2] + shade)})`,
      lineWidth: Math.max(0.8 * scale, width / count * (1 + Math.random() * 0.5)),
      alpha: 0.4 + Math.random() * 0.45,
    });
  }
  return { bristles, start, next: 0, taper, fade };
};

/**
 * Lays the part of a stroke that has been drawn by time `at` (a share of the duration); a stroke takes LIVE.strokeSpan to draw, from its start to its tail.
 * @returns {boolean} true once the whole stroke is down
 */
export const advanceStroke = (ctx, stroke, at) => {
  const segments = LIVE.bristle.segments;
  const to = Math.min(segments, Math.floor(Math.max(0, (at - stroke.start) / LIVE.strokeSpan) * segments) + 1);
  ctx.lineCap = 'butt';
  for (let i = stroke.next; i < to; i++) {
    const f = i / segments;
    stroke.bristles.forEach((b) => {
      ctx.globalAlpha = b.alpha * (1 - stroke.fade * f);
      ctx.strokeStyle = b.color;
      ctx.lineWidth = b.lineWidth * (1 - stroke.taper * f * f);
      ctx.beginPath();
      ctx.moveTo(b.points[i][0], b.points[i][1]);
      ctx.lineTo(b.points[i + 1][0], b.points[i + 1][1]);
      ctx.stroke();
    });
  }
  ctx.globalAlpha = 1;
  stroke.next = Math.max(stroke.next, to);
  return stroke.next >= segments;
};

/**
 * The hand that makes bristle strokes: it works a small cluster of strokes, then jumps to a new place (`place()` gives [x, y] in canvas pixels, or null for anywhere);
 * strokes shrink as `progress` goes from 0 to 1 and follow the picture's contours. Each new stroke is added to `flight` to be drawn by `advanceStroke`.
 *
 * @param {number} scale canvas size factor, 1 for the reference size (see LIVE.referenceArea)
 */
export const createBristleHand = ({ W, H, scale, flowField, source, place, flight, now }) => {
  const hand = { x: W / 2, y: H / 2, left: 0, angle: 0 };
  const [thick, thin] = LIVE.bristle.width;
  return (progress) => {
    if (hand.left <= 0) {
      const at = place();
      hand.x = at ? at[0] : Math.random() * W;
      hand.y = at ? at[1] : Math.random() * H;
      hand.left = 3 + Math.floor(Math.random() * 8);
      hand.angle = Math.random() * Math.PI;
    }
    hand.left--;
    const width = Math.max(LIVE.bristle.minWidth * scale, (thick - (thick - thin) * Math.pow(progress, 0.6)) * scale * Math.exp((Math.random() - 0.5) * 0.7));
    const [short, long] = LIVE.bristle.length;
    const length = width * (short + Math.random() * (long - short));
    const x = Math.max(0, Math.min(W, hand.x + (Math.random() + Math.random() - 1) * width * 1.6));
    const y = Math.max(0, Math.min(H, hand.y + (Math.random() + Math.random() - 1) * width * 1.6));
    const flow = flowField(x, y);
    hand.x += (Math.random() - 0.5) * width * 0.8;
    hand.y += (Math.random() - 0.5) * width * 0.8;
    const angle = (flow.angle === null ? hand.angle : flow.angle) + (Math.random() - 0.5) * 0.45;
    flight.push(makeStroke(x, y, angle, length, width, scale, source, now()));
  };
};
