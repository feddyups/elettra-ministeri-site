import { watchScrollDirection } from '../lib/scroll-direction.js';
import { holdWhileEngaged } from '../lib/hover-focus-hold.js';

/**
 * Slides the header away while the page is scrolled down and brings it back as soon as the page is scrolled up
 * (html.em-hdr-hidden; theme/header.css does the sliding). It stays in view near the top of the page, while the
 * menu is open, while the pointer is over it and while focus is inside it. Works the same on every page and device.
 */
const HIDE_AFTER = 120;  // the header never hides before the page has scrolled this far
const root = document.documentElement;
const header = document.querySelector('#header');

if (header) {
  const menuOpen = () => document.body.classList.contains('header--menu-open');
  const hold = holdWhileEngaged(header, (held) => held && root.classList.remove('em-hdr-hidden'));
  watchScrollDirection((direction, y) => {
    const hide = direction === 'down' && y > HIDE_AFTER && !hold.isHeld() && !menuOpen();
    root.classList.toggle('em-hdr-hidden', hide);
  }, { top: HIDE_AFTER });
}
