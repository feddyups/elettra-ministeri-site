import { paintImage } from '../../paint/paint-image.js';
import { PAINT } from '../../paint/config.js';
import { prefersReducedMotion } from '../../lib/motion.js';
import { heroPlaylist } from './works.js';
import { createSlideshowControls } from './slideshow-controls.js';
import { renderColorSamples } from './color-samples.js';

/** Time each painting stays up, from the first stroke to the next slide. */
const CYCLE_MS = 14000;
const SLIDES_PER_VISIT = 6;
const LAST_WORK_KEY = 'em-hero-first';

/** Swiping sideways over the hero changes the slide: at least this far, mostly horizontal, within this time, and not from the screen's edge (where a phone's own back gesture lives). */
const SWIPE_MIN = 60;
const SWIPE_MS = 900;
const EDGE = 24;

/** A new random selection of paintings for every visit, which never opens on the painting the previous visit opened on. */
const pickPlaylist = () => {
  try {
    const playlist = heroPlaylist(SLIDES_PER_VISIT, localStorage.getItem(LAST_WORK_KEY) || undefined);
    localStorage.setItem(LAST_WORK_KEY, playlist[0].id);
    return playlist;
  } catch (e) {
    return heroPlaylist(SLIDES_PER_VISIT);
  }
};

/** Slideshow of the home page hero: each work repaints itself, then the next one follows; the selection is random for every visit. */
export const initHero = (root) => {
  const WORKS = pickPlaylist();
  const $ = (selector) => root.querySelector(selector);
  const image = $('#eh-heroImg');
  const canvas = $('#eh-heroCanvas');
  const samples = $('#eh-samples') || $('.samples');
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

  let current = 0;
  let timer = 0;
  let visible = true;
  let hovering = false;
  let paused = false;
  let colors = [];
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
    paintImage(image, canvas, W, H, 1, { colors }).then((finished) => {
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
      colors = renderColorSamples(samples, { root, canvas, image }, work).map((color) => color.hex);
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

  const swipe = { x: 0, y: 0, at: 0, active: false };
  let swipedAt = 0;
  root.addEventListener('touchstart', (event) => {
    swipe.active = false;
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    if (touch.clientX < EDGE || touch.clientX > innerWidth - EDGE) return;
    Object.assign(swipe, { x: touch.clientX, y: touch.clientY, at: Date.now(), active: true });
  }, { passive: true });
  root.addEventListener('touchmove', (event) => {
    if (!swipe.active) return;
    if (Math.abs(event.touches[0].clientY - swipe.y) > Math.abs(event.touches[0].clientX - swipe.x)) swipe.active = false;
  }, { passive: true });
  root.addEventListener('touchend', (event) => {
    if (!swipe.active) return;
    swipe.active = false;
    const dx = event.changedTouches[0].clientX - swipe.x;
    const dy = event.changedTouches[0].clientY - swipe.y;
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) <= Math.abs(dy) * 1.5 || Date.now() - swipe.at > SWIPE_MS) return;
    swipedAt = Date.now();
    show((current + (dx < 0 ? 1 : WORKS.length - 1)) % WORKS.length);
  });
  root.addEventListener('touchcancel', () => { swipe.active = false; });
  // lifting a finger at the end of a swipe over a link or color sample must not also follow it
  root.addEventListener('click', (event) => { if (Date.now() - swipedAt < 400) { event.preventDefault(); event.stopPropagation(); } }, true);

  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0.3 }).observe(root);
  show(current);

  const replay = $('.replay');
  if (replay) replay.addEventListener('click', () => { paint(); queueNext(); });
};
