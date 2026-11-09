import { paintImage } from '../paint/paint-image.js';
import { loadImage } from '../lib/image.js';
import { initOnceFor, onFirstVisible } from '../lib/dom.js';
import { loadStylesheet } from '../lib/stylesheet.js';
import { prefersReducedMotion } from '../lib/motion.js';
import { h } from '../lib/elements.js';

const PAGES = ['/about-me'];
const MAX_WIDTH = 1100;
const GIVE_UP_MS = 9000;

/**
 * On the pages listed above, the picture in each Squarespace image block is painted stroke by stroke the first time
 * it scrolls into view (the effect of the home hero and the painting pages), then the real photograph shows.
 * Visitors who prefer reduced motion, or whose browser cannot read the image, simply see the photograph.
 */
const paintBlockImage = (img) => {
  const host = img.parentElement;
  const base = (img.currentSrc || img.src).split('?')[0];
  const canvas = h('canvas', { class: 'em-portrait-paint', 'aria-hidden': 'true' });
  host.append(canvas);
  host.classList.add('em-portrait-host', 'is-painting');
  const show = () => host.classList.remove('is-painting');

  const source = new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), GIVE_UP_MS);
    loadImage(new Image(), `${base}?format=1500w`).then((loaded) => { clearTimeout(timeout); resolve(loaded); });
  });
  onFirstVisible(host, 0.35, async () => {
    const loaded = await source;
    if (!loaded) return show();
    const W = Math.min(MAX_WIDTH, Math.round(host.clientWidth)) || MAX_WIDTH;
    const H = Math.round(W * host.clientHeight / host.clientWidth);
    const finished = await paintImage(loaded, canvas, W, H);
    if (!finished) return;
    show();
    canvas.style.opacity = 0;
  });
};

if (PAGES.includes(location.pathname.replace(/\/$/, '')) && !prefersReducedMotion) {
  loadStylesheet(new URL('./paint-portrait.css', import.meta.url).href);
  initOnceFor('.sqs-block-image .sqs-image-shape-container-element img', 'portrait-paint', paintBlockImage);
}
