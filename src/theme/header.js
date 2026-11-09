import { glassFor } from './glass.js';

/**
 * The header's states on every page except the home page (which sets its own, per section, in features/page-tone.js):
 * html.em-scrolled once the page has scrolled a little, and html.em-hdr-light or em-hdr-ink according to whether the
 * page behind the header is dark or light. theme/header.css turns these into the floating pill.
 *
 * On every page, including the home page, the header slides away while the page is scrolled down and returns as
 * soon as it is scrolled up (html.em-hdr-hidden). It stays in view at the top of the page, while the menu is open,
 * while the pointer is over it, and while focus is inside it.
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

const HIDE_AFTER = 120;  // scrolled further than this before the header may hide
const TRAVEL = 8;        // how far the page must move in one direction before the header reacts
let lastY = scrollY;
let held = false;        // pointer over the header, or focus inside it

const menuOpen = () => document.body.classList.contains('header--menu-open');
const setHidden = (hidden) => root.classList.toggle('em-hdr-hidden', hidden);

const follow = () => {
  const y = scrollY;
  if (y <= HIDE_AFTER || held || menuOpen()) { setHidden(false); lastY = y; return; }
  if (Math.abs(y - lastY) < TRAVEL) return;
  setHidden(y > lastY);
  lastY = y;
};

const header = document.querySelector('#header');
if (header) {
  const hold = (value) => () => { held = value; if (value) setHidden(false); };
  header.addEventListener('pointerenter', hold(true));
  header.addEventListener('pointerleave', hold(false));
  header.addEventListener('focusin', hold(true));
  header.addEventListener('focusout', hold(false));
}
addEventListener('scroll', follow, { passive: true });
