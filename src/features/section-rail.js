import { h } from '../lib/elements.js';
import { prefersReducedMotion } from '../lib/motion.js';

/** What a section is called in the rail: its `data-rail` if it has one, otherwise a name taken from what it is. */
const labelOf = (section) => {
  if (section.dataset.rail) return section.dataset.rail;
  if (section.classList.contains('eh-hero')) return 'Home';
  if (section.id === 'series') return 'Color';
  if (section.classList.contains('chapter')) {
    const heading = section.querySelector('h2');
    return heading ? heading.textContent.trim() : null;
  }
  if (section.id === 'about') return 'The artist';
  if (section.id === 'exhibitions') return 'Exhibitions';
  if (section.classList.contains('foot')) return 'Contact';
  return null;
};

/**
 * A slim vertical rail at the edge of the page, one tick per section: pointing at it names the sections,
 * the current one is highlighted, and choosing one scrolls to it smoothly. Sections without a height or
 * a name are left out. Add `data-rail="Name"` to a section to name it or to include it.
 *
 * `hideOver` is a selector for sections the rail must never lie over (the home page's hero slideshow): the rail
 * fades out while any part of such a section is behind it, and returns once the section has scrolled clear.
 */
export const initSectionRail = (selector, { hideOver } = {}) => {
  const sections = [...document.querySelectorAll(selector)].filter((s) => s.getBoundingClientRect().height > 0 && labelOf(s));
  if (sections.length < 2) return;

  const items = sections.map((section) => {
    const label = labelOf(section);
    const button = h('button', { class: 'em-rail-item', type: 'button', 'aria-label': `Go to ${label}` },
      h('span', { class: 'em-rail-label' }, label), h('i', { class: 'em-rail-tick' }));
    button.addEventListener('click', () => section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' }));
    return { section, button };
  });
  const rail = h('nav', { class: 'em-rail', 'aria-label': 'Sections' }, items.map((i) => i.button));
  document.body.append(rail);

  const setCurrent = (section) => items.forEach((i) => {
    const on = i.section === section;
    i.button.classList.toggle('is-current', on);
    if (on) { i.button.setAttribute('aria-current', 'true'); if (section.dataset.glass) rail.dataset.glass = section.dataset.glass; } else i.button.removeAttribute('aria-current');
  });
  const visible = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visible.set(entry.target, entry.isIntersecting));
    const current = items.find((i) => visible.get(i.section));
    if (current) setCurrent(current.section);
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach((section) => observer.observe(section));

  if (!hideOver) return;
  const keepClear = [...document.querySelectorAll(hideOver)];
  let queued = false;
  const update = () => {
    queued = false;
    const bar = rail.getBoundingClientRect();
    const over = keepClear.some((el) => { const box = el.getBoundingClientRect(); return box.bottom > bar.top && box.top < bar.bottom; });
    rail.classList.toggle('is-hidden', over);
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  update();
};
