import { mixColors } from '../lib/color-mix.js';
import { locateBlend, readingLine } from '../lib/scroll-blend.js';

const html = document.documentElement;
const INK = '#1c1a18';
const PAPER = '#faf8f5';
const SECTIONS = '.em-home > section, .em-home > footer';

/** Fraction of the window's height over which one section's color hands over to the next's. */
const HAND_OVER = 0.5;

/** The tone a section is designed for: the hero is its picture (light header text), the footer is ink, a section names its own with `data-bg` and `data-fg`, anything else is paper. A chapter has none until its picture is analyzed. */
const toneOf = (section) => {
  if (section.classList.contains('eh-hero')) return { bg: PAPER, fg: PAPER };
  if (section.classList.contains('foot')) return { bg: INK, fg: PAPER };
  const bg = section.getAttribute('data-bg') || (section.classList.contains('chapter') ? null : PAPER);
  return bg && { bg, fg: section.getAttribute('data-fg') || INK };
};

const last = {};
const publish = (name, value) => {
  if (last[name] === value) return;
  last[name] = value;
  html.style.setProperty(name, value);
};

/** Sets the page background and text color, the header's link color, and its light or ink state. */
const setTone = (background, foreground) => {
  publish('--eh-bg', background);
  publish('--eh-fg', foreground);
  const light = foreground !== INK;
  publish('--eh-hdr', light ? PAPER : INK);
  html.classList.toggle('em-hdr-light', light);
  html.classList.toggle('em-hdr-ink', !light);
};

const sections = new Set();

/**
 * The page's background follows the scroll position: the section at the reading line sets it, and while one
 * section hands over to the next it moves steadily from the color of the one to the color of the other
 * (mixed in OKLab) as the page is scrolled. Text and header links take the color of whichever side is nearer.
 */
export const updateTone = () => {
  const known = [...sections].filter((section) => section.offsetHeight && toneOf(section));
  if (!known.length) return;
  const tops = known.map((section) => section.getBoundingClientRect().top);
  const focus = readingLine({ viewport: innerHeight, scrolled: scrollY, scrollable: document.documentElement.scrollHeight - innerHeight });
  const { from, to, t } = locateBlend(tops, focus, innerHeight * HAND_OVER);
  const a = toneOf(known[from]);
  const b = toneOf(known[to]);
  setTone(mixColors(a.bg, b.bg, t), (t < 0.5 ? a : b).fg);
};

/** Adds a section to the ones the page tone follows. */
export const trackSectionTone = (section) => {
  sections.add(section);
  updateTone();
};

/** Header turns solid after the hero and gains a shadow once the page has scrolled; the tone follows the scroll. */
export const trackHeaderOnScroll = () => {
  const update = () => {
    html.classList.toggle('em-hdr-solid', scrollY > innerHeight * 0.9);
    html.classList.toggle('em-scrolled', scrollY > 24);
    updateTone();
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
};
