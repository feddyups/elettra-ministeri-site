import { glassFor } from '../theme/glass.js';

const html = document.documentElement;
const INK = '#1c1a18';
const PAPER = '#faf8f5';

/** Sets the page background and foreground, and switches the header between light and ink. */
const setTone = (background, foreground) => {
  html.style.setProperty('--eh-bg', background);
  html.style.setProperty('--eh-fg', foreground);
  const light = foreground !== INK;
  html.style.setProperty('--eh-hdr', light ? PAPER : INK);
  html.classList.toggle('em-hdr-light', light);
  html.classList.toggle('em-hdr-ink', !light);
};

/** The background a section is designed for: the footer is ink, a section names its own with `data-bg`, anything else is paper. */
const backgroundOf = (section) => {
  if (section.classList.contains('foot')) return INK;
  return section.getAttribute('data-bg') || (section.classList.contains('chapter') ? null : PAPER);
};

/** The text color a section is designed for: paper on the footer, the section's `data-fg` if it has one, otherwise ink. */
const foregroundOf = (section) => (section.classList.contains('foot') ? PAPER : section.getAttribute('data-fg') || INK);

/**
 * Paints a section with its own background and text color, so its text always sits on the color it was designed for, even while
 * the page behind it changes tone (the footer comes into view long before the section above it has left). The hero is
 * its picture; a chapter waits until its tone is known.
 */
export const paintSection = (section) => {
  if (section.classList.contains('eh-hero')) return;
  const background = backgroundOf(section);
  if (!background) return;
  const foreground = foregroundOf(section);
  section.style.backgroundColor = background;
  section.style.color = foreground;
  // text inside the section that is colored from the page-wide tone follows the section's own instead
  section.style.setProperty('--eh-bg', background);
  section.style.setProperty('--eh-fg', foreground);
  // glass inside the section (buttons, labels) adapts to the section's own surface
  section.setAttribute('data-glass', glassFor(foreground));
};

const toneObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const section = entry.target;
    if (section.classList.contains('eh-hero')) setTone(PAPER, PAPER);
    else if (section.classList.contains('foot')) setTone(INK, PAPER);
    else setTone(section.getAttribute('data-bg') || PAPER, section.getAttribute('data-fg') || INK);
  });
}, { threshold: 0.5 });

/** The page tone follows whichever section is in view. */
export const trackSectionTone = (section) => {
  paintSection(section);
  toneObserver.observe(section);
};

/** Header turns solid after the hero and gains a shadow once the page has scrolled. */
export const trackHeaderOnScroll = () => {
  const update = () => {
    html.classList.toggle('em-hdr-solid', scrollY > innerHeight * 0.9);
    html.classList.toggle('em-scrolled', scrollY > 24);
  };
  addEventListener('scroll', update, { passive: true });
  update();
};
