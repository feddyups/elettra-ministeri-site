import { paintImage } from '../../paint/paint-image.js';
import { PAINT } from '../../paint/config.js';
import { prefersReducedMotion } from '../../lib/motion.js';
import { WORKS } from './works.js';
import { createSlideshowControls } from './slideshow-controls.js';
import { renderColorSamples } from './color-samples.js';

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
  const label = copy.querySelector('p.label');
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
  let hovering = false;
  let paused = false;
  let timeLeft = CYCLE_MS;
  let scheduledAt = 0;

  const controls = createSlideshowControls(root, WORKS, { paintMs: PAINT.durationMs, cycleMs: CYCLE_MS, onSelect: (index) => show(index) });

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
    paintImage(image, canvas, W, H).then((finished) => {
      if (!finished) return;
      root.classList.add('done');
      pause();
    });
  };

  const schedule = (ms) => {
    clearTimeout(timer);
    timeLeft = ms;
    scheduledAt = performance.now();
    if (prefersReducedMotion) return;
    timer = setTimeout(() => {
      if (!visible || document.hidden) queueNext();
      else show((current + 1) % WORKS.length);
    }, ms);
  };

  const queueNext = () => {
    paused = false;
    controls.restartProgress();
    schedule(CYCLE_MS);
  };

  /** Holds the slide while the pointer is over the hero, but only once the painting has been revealed. */
  const pause = () => {
    if (!hovering || paused || prefersReducedMotion || !root.classList.contains('done')) return;
    paused = true;
    clearTimeout(timer);
    timeLeft -= performance.now() - scheduledAt;
    controls.freezeProgress();
  };

  const resume = () => {
    if (!paused) return;
    paused = false;
    controls.resumeProgress();
    schedule(timeLeft);
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
      if (label) label.textContent = work.series;
      title.textContent = work.title;
      meta.textContent = work.meta;
      image.alt = work.alt;
      link.textContent = `View ${work.series}`;
      link.setAttribute('href', work.href);
      renderColorSamples(samples, wash, image, work);
      paint();
      queueNext();
      preloadNext();
    };

    if (image.getAttribute('src') === work.image && image.complete && image.naturalWidth) { apply(); return; }
    image.onload = () => { image.onload = null; apply(); };
    image.setAttribute('src', work.image);
  };

  root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hovering = true; pause(); } });
  root.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { hovering = false; resume(); } });

  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0.3 }).observe(root);
  show(current);

  const replay = $('.replay');
  if (replay) replay.addEventListener('click', () => { paint(); queueNext(); });
};
