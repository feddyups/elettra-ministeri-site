import { prefersReducedMotion } from '../../lib/motion.js';

/**
 * Adds one dot per slide and a two-part progress line along the bottom of
 * `root`: a first segment for the time the painting takes, a second for the
 * time the finished painting stays up. Each segment is as wide as its share of
 * the cycle. Styled by `.eh-nav`, `.eh-line` and `.eh-seg*` in the site's custom CSS.
 *
 * @param {{ onSelect: (index: number) => void, paintMs: number, cycleMs: number }} options
 * @returns {{ setActive: (index: number) => void, restartProgress: () => void, freezeProgress: () => void, resumeProgress: () => void }}
 */
export const createSlideshowControls = (root, slides, { onSelect, paintMs, cycleMs }) => {
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
  const stages = [
    { name: 'paint', ms: paintMs },
    { name: 'hold', ms: cycleMs - paintMs },
  ].map((stage) => {
    const segment = document.createElement('span');
    segment.className = `eh-seg eh-seg-${stage.name}`;
    segment.style.flexGrow = stage.ms;
    const bar = document.createElement('i');
    segment.appendChild(bar);
    line.appendChild(segment);
    return { ...stage, bar, frozenAt: 0 };
  });
  const [painting, holding] = stages;

  root.append(nav, line);

  const setActive = (active) => {
    [...nav.children].forEach((dot, index) => {
      dot.classList.toggle('on', index === active);
      dot.setAttribute('aria-current', index === active ? 'true' : 'false');
    });
  };

  const reset = () => {
    stages.forEach((stage) => {
      stage.bar.style.transition = 'none';
      stage.bar.style.transform = 'scaleX(0)';
      stage.frozenAt = 0;
    });
  };

  /** Fills the painting segment, then the holding segment, each in the time it has left. */
  const play = (paintLeftMs, holdLeftMs) => {
    void line.offsetWidth;
    painting.bar.style.transition = `transform ${paintLeftMs}ms linear`;
    painting.bar.style.transform = 'scaleX(1)';
    holding.bar.style.transition = `transform ${holdLeftMs}ms linear ${paintLeftMs}ms`;
    holding.bar.style.transform = 'scaleX(1)';
  };

  const restartProgress = () => {
    reset();
    if (prefersReducedMotion) return;
    play(painting.ms, holding.ms);
  };

  /** Stops both segments where they are. */
  const freezeProgress = () => {
    stages.forEach((stage) => {
      const matrix = getComputedStyle(stage.bar).transform;
      stage.frozenAt = matrix === 'none' ? 0 : parseFloat(matrix.slice(7));
      stage.bar.style.transition = 'none';
      stage.bar.style.transform = `scaleX(${stage.frozenAt})`;
    });
  };

  /** Continues from where `freezeProgress` stopped. */
  const resumeProgress = () => {
    play((1 - painting.frozenAt) * painting.ms, (1 - holding.frozenAt) * holding.ms);
  };

  return { setActive, restartProgress, freezeProgress, resumeProgress };
};
