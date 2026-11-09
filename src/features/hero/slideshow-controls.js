import { prefersReducedMotion } from '../../lib/motion.js';

/**
 * Adds one dot per slide and a thin progress line along the bottom of `root`.
 * Styled by `.eh-nav` and `.eh-line` in the site's custom CSS.
 *
 * @param {{ onSelect: (index: number) => void, cycleMs: number }} options
 * @returns {{ setActive: (index: number) => void, restartProgress: () => void, freezeProgress: () => void, resumeProgress: (remainingMs: number) => void }}
 */
export const createSlideshowControls = (root, slides, { onSelect, cycleMs }) => {
  const nav = document.createElement('div');
  nav.className = 'eh-nav';
  nav.setAttribute('role', 'group');
  nav.setAttribute('aria-label', 'Choose a painting');
  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show ${slide.title}`);
    dot.addEventListener('click', () => onSelect(index));
    nav.appendChild(dot);
  });

  const line = document.createElement('div');
  line.className = 'eh-line';
  line.setAttribute('aria-hidden', 'true');
  const bar = document.createElement('i');
  line.appendChild(bar);

  root.append(nav, line);

  const setActive = (active) => {
    [...nav.children].forEach((dot, index) => {
      dot.classList.toggle('on', index === active);
      dot.setAttribute('aria-current', index === active ? 'true' : 'false');
    });
  };

  const restartProgress = () => {
    bar.style.transition = 'none';
    bar.style.transform = 'scaleX(0)';
    if (prefersReducedMotion) return;
    void bar.offsetWidth;
    bar.style.transition = `transform ${cycleMs}ms linear`;
    bar.style.transform = 'scaleX(1)';
  };

  /** Stops the progress line where it is. */
  const freezeProgress = () => {
    const matrix = getComputedStyle(bar).transform;
    const scale = matrix === 'none' ? 0 : parseFloat(matrix.slice(7));
    bar.style.transition = 'none';
    bar.style.transform = `scaleX(${scale})`;
  };

  /** Continues the progress line from where it stopped, finishing in `remainingMs`. */
  const resumeProgress = (remainingMs) => {
    void bar.offsetWidth;
    bar.style.transition = `transform ${remainingMs}ms linear`;
    bar.style.transform = 'scaleX(1)';
  };

  return { setActive, restartProgress, freezeProgress, resumeProgress };
};
