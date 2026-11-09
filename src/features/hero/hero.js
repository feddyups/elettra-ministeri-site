import { paintImage } from '../../paint/paint-image.js';
import { prefersReducedMotion } from '../../lib/motion.js';
import { WORKS } from './works.js';
import { createSlideshowControls } from './slideshow-controls.js';
import { renderColourSamples } from './colour-samples.js';

/** Time each painting stays up, from the first stroke to the next slide. */
const CYCLE_MS = 14000;
const LAST_WORK_KEY = 'em-hero';

/** Starts on the work after the one shown on the previous visit. */
const pickFirstWork = () => {
  try {
    const next = (parseInt(localStorage.getItem(LAST_WORK_KEY) || '-1', 10) + 1) % WORKS.length;
    localStorage.setItem(LAST_WORK_KEY, String(next));
    return next;
  } catch (e) {
    return 0;
  }
};

/** Slideshow of the home page hero: each work repaints itself, then the next one follows. */
export const initHero = (root) => {
  const $ = (selector) => root.querySelector(selector);
  const image = $('#eh-heroImg');
  const canvas = $('#eh-heroCanvas');
  const samples = $('#eh-samples') || $('.samples');
  const wash = $('.wash');
  const copy = $('.copy');
  const title = copy.querySelector('h1');
  const meta = copy.querySelector('.sub');
  let link = copy.querySelector('.hero-link');
  if (!link) {
    link = document.createElement('a');
    link.className = 'btn hero-link';
    copy.appendChild(link);
  }

  let current = pickFirstWork();
  let timer = 0;
  let visible = true;

  const controls = createSlideshowControls(root, WORKS, { cycleMs: CYCLE_MS, onSelect: (index) => show(index) });

  const paint = () => {
    root.classList.remove('done', 'titled');
    if (prefersReducedMotion) {
      canvas.style.opacity = 0;
      root.classList.add('done', 'titled');
      return;
    }
    setTimeout(() => root.classList.add('titled'), 500);
    const W = Math.min(1440, root.clientWidth);
    const H = Math.round(W * root.clientHeight / root.clientWidth);
    paintImage(image, canvas, W, H).then((finished) => { if (finished) root.classList.add('done'); });
  };

  const queueNext = () => {
    clearTimeout(timer);
    controls.restartProgress();
    if (prefersReducedMotion) return;
    timer = setTimeout(() => {
      if (!visible || document.hidden) queueNext();
      else show((current + 1) % WORKS.length);
    }, CYCLE_MS);
  };

  const preloadNext = () => {
    const next = new Image();
    next.crossOrigin = 'anonymous';
    next.src = WORKS[(current + 1) % WORKS.length].image;
  };

  const show = (index) => {
    current = index;
    const work = WORKS[index];
    controls.setActive(index);
    root.classList.remove('done', 'titled');
    canvas.style.opacity = 0;

    const apply = () => {
      title.textContent = work.title;
      meta.textContent = work.meta;
      image.alt = work.alt;
      link.textContent = `View ${work.series}`;
      link.setAttribute('href', work.href);
      renderColourSamples(samples, wash, image);
      paint();
      queueNext();
      preloadNext();
    };

    if (image.getAttribute('src') === work.image && image.complete && image.naturalWidth) { apply(); return; }
    image.onload = () => { image.onload = null; apply(); };
    image.setAttribute('src', work.image);
  };

  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0.3 }).observe(root);
  show(current);

  const replay = $('.replay');
  if (replay) replay.addEventListener('click', () => { paint(); queueNext(); });
};
