import { glassFor } from './glass.js';

/**
 * The header's states on every page except the home page (which sets its own, per section, in features/page-tone.js):
 * html.em-scrolled once the page has scrolled a little, and html.em-hdr-light or em-hdr-ink according to whether the
 * page behind the header is dark or light. theme/header.css turns these into the floating pill.
 */
const root = document.documentElement;
const SCROLLED_AFTER = 24;

const update = () => {
  if (root.classList.contains('em-home-page')) return;
  root.classList.toggle('em-scrolled', scrollY > SCROLLED_AFTER);
  const ink = getComputedStyle(root).getPropertyValue('--em-ink').trim();
  const light = ink ? glassFor(ink) === 'dark' : false; // pale text on the page means a dark page
  root.classList.toggle('em-hdr-light', light);
  root.classList.toggle('em-hdr-ink', !light);
};

update();
addEventListener('load', update);
addEventListener('scroll', update, { passive: true });
