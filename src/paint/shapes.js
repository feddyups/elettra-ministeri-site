import { PAINT } from './config.js';

const clamp = (v) => Math.max(0, Math.min(255, v | 0));
const rgb = (c, jitter) => `rgb(${clamp(c[0] + jitter)},${clamp(c[1] + jitter)},${clamp(c[2] + jitter)})`;

const leafPath = (ctx, x, y, ca, sa, len, wid, bendX, bendY) => {
  const hx = ca * len / 2;
  const hy = sa * len / 2;
  ctx.moveTo(x - hx, y - hy);
  ctx.quadraticCurveTo(x - sa * wid + bendX, y + ca * wid + bendY, x + hx, y + hy);
  ctx.quadraticCurveTo(x + sa * wid + bendX, y - ca * wid + bendY, x - hx, y - hy);
};

const pillPath = (ctx, x, y, angle, ca, sa, len, wid) => {
  const half = len * 0.4;
  const radius = wid * 0.5;
  ctx.arc(x + ca * half, y + sa * half, radius, angle - Math.PI / 2, angle + Math.PI / 2);
  ctx.arc(x - ca * half, y - sa * half, radius, angle + Math.PI / 2, angle + 3 * Math.PI / 2);
  ctx.closePath();
};

const bristles = (ctx, x, y, ca, sa, len, wid, bendX, bendY, colour, alpha, jitter) => {
  const hx = ca * len / 2;
  const hy = sa * len / 2;
  ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(1, wid * 0.07);
  for (let i = 0; i < 3; i++) {
    const offset = (Math.random() - 0.5) * wid * 0.55;
    const ox = -sa * offset;
    const oy = ca * offset;
    ctx.globalAlpha = alpha * 0.22;
    ctx.strokeStyle = rgb(colour, jitter + (Math.random() < 0.5 ? 20 : -20));
    ctx.beginPath();
    ctx.moveTo(x - hx * 0.85 + ox, y - hy * 0.85 + oy);
    ctx.quadraticCurveTo(x + bendX * 0.5 + ox, y + bendY * 0.5 + oy, x + hx * 0.85 + ox, y + hy * 0.85 + oy);
    ctx.stroke();
  }
};

/**
 * Lays one brush mark on the canvas: mostly tapered leaves, some elongated
 * pills and round dots. Leaves wider than 10px also get faint bristle lines.
 */
export const drawMark = (ctx, { x, y, angle, length, width, colour, alpha, jitter }) => {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const bend = (Math.random() - 0.5) * length * 0.25;
  const bendX = -sa * bend;
  const bendY = ca * bend;
  const roll = Math.random();
  const isPill = roll < PAINT.pillShare;
  const isDot = !isPill && roll < PAINT.pillShare + PAINT.dotShare;

  ctx.beginPath();
  if (isPill) pillPath(ctx, x, y, angle, ca, sa, length, width);
  else if (isDot) ctx.arc(x, y, width * 0.8, 0, 2 * Math.PI);
  else leafPath(ctx, x, y, ca, sa, length, width, bendX, bendY);

  ctx.globalAlpha = alpha;
  ctx.fillStyle = rgb(colour, jitter);
  ctx.fill();
  if (!isPill && !isDot && width > 10) bristles(ctx, x, y, ca, sa, length, width, bendX, bendY, colour, alpha, jitter);
  ctx.globalAlpha = 1;
};
