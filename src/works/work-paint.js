import { paintImage } from '../paint/paint-image.js';
import { loadImage } from '../lib/image.js';
import { onFirstVisible } from '../lib/dom.js';
import { prefersReducedMotion } from '../lib/motion.js';

const MAX_WIDTH = 1100;
const GIVE_UP_MS = 9000;

/**
 * Paints the picture stroke by stroke the first time it scrolls into view (the same effect as the home hero),
 * then lets the real image show; `replay` paints it again. If the image cannot be read, or the visitor prefers
 * reduced motion, the picture is simply shown.
 *
 * @param {{ figure: HTMLElement, zoom: HTMLElement, canvas: HTMLCanvasElement, url: string, width: number, height: number }} parts
 */
export const createWorkPaint = ({ figure, zoom, canvas, url, width, height }) => {
  const show = () => figure.classList.remove('is-painting');
  if (prefersReducedMotion) return { replay: () => {}, ready: false };

  figure.classList.add('is-painting');
  const source = new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), GIVE_UP_MS);
    loadImage(new Image(), url).then((img) => { clearTimeout(timeout); resolve(img); });
  });

  const paint = async () => {
    const img = await source;
    if (!img) { show(); return; }
    figure.classList.add('is-painting');
    const W = Math.min(MAX_WIDTH, Math.round(zoom.clientWidth)) || MAX_WIDTH;
    const H = Math.round(W * height / width);
    canvas.style.opacity = 1;
    const finished = await paintImage(img, canvas, W, H);
    if (!finished) return;
    show();
    canvas.style.opacity = 0;
  };

  onFirstVisible(zoom, 0.35, paint);
  return { replay: paint, ready: true };
};
