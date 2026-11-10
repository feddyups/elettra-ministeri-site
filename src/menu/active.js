import { initOnceFor } from '../lib/dom.js';
import { CATALOGUE } from '../works/catalogue.js';
import { seriesInfo } from '../color/scope.js';

/**
 * Marks where the visitor is in the header menus: `is-current` on the entry for the page, and on the folder that holds
 * it. Squarespace marks only some entries (the dropdown's links are plain links under Paintings), so the page is
 * matched by its address. A painting page marks its series.
 */
const trim = (path) => path.replace(/\/$/, '') || '/';
const here = trim(location.pathname);
const seriesPath = (() => {
  if (here.startsWith('/print/')) return '/print';
  const painting = CATALOGUE[here.split('/').pop()];
  const series = painting && (here.startsWith('/paintings/') || here.startsWith('/textiles/')) ? seriesInfo(painting.series) : null;
  return series ? trim(series.path) : null;
})();

const hrefOf = (item) => {
  const link = item.querySelector(':scope > a[href]');
  const folder = item.querySelector(':scope > .header-nav-folder-title[data-href]');
  const raw = link ? link.getAttribute('href') : folder ? folder.dataset.href : '';
  try { return trim(new URL(raw, location.href).pathname); } catch (err) { return ''; }
};

const mark = (item) => {
  const href = hrefOf(item);
  if (!href) return;
  const isFolder = item.classList.contains('header-nav-item--folder');
  const exact = href === here;
  const holdsHere = (isFolder && here.startsWith('/paintings')) || (seriesPath !== null && href === seriesPath);
  if (!exact && !holdsHere) return;
  item.classList.add('is-current');
  const link = item.querySelector(':scope > a[href]');
  if (link) link.setAttribute('aria-current', exact ? 'page' : 'true');
};

initOnceFor('.header-nav-item, .header-nav-folder-item, .header-menu-nav-item', 'menu-current', mark);
