import { initOnceFor } from '../lib/dom.js';

/**
 * Links in the header menus that lead to this site open in the same tab. Squarespace adds `target="_blank"`
 * to menu entries that were created as external links (the series under Paintings are), which opens a new tab
 * for a page on the same site. Links to other sites are left alone.
 */
const openHere = (link) => {
  if (link.target !== '_blank') return;
  let url;
  try { url = new URL(link.href, location.href); } catch (err) { return; }
  if (url.origin !== location.origin) return;
  link.removeAttribute('target');
  link.removeAttribute('rel');
};

initOnceFor('.header-nav a[href], .header-menu a[href], .header-nav-folder-content a[href], .header-menu-nav-item a[href]', 'menu-link', openHere);
