import { initOnceFor } from '../lib/dom.js';
import { loadStylesheet } from '../lib/stylesheet.js';
import { initWorkPage } from './work-page.js';
import { initSeriesStrip } from './series-strip.js';
import { initSeriesGrid } from './series-grid.js';
import { initFavoritesGrid } from './favorites-grid.js';
import './pager.js';

/*
 * Entry point for the pages built from the paintings' data: the painting pages ([data-work-page]), the grid of works on a series page (`ul.th-grid`), the Favorites page's grid (`ul.th-grid[data-favorites]`) and the
 * strips of color under each painting on a series page (.th-work) and the bar at the bottom of both (pager.js). It does nothing on a page without either,
 * and loads its stylesheets only when it finds one.
 */
const loaded = new Set();
const withStyles = (names, init) => (element) => {
  names.filter((name) => !loaded.has(name)).forEach((name) => {
    loadStylesheet(new URL(name, import.meta.url).href);
    loaded.add(name);
  });
  init(element);
};

initOnceFor('[data-work-page]', 'work-page', withStyles(['../color/swatch.css', '../color/color-strip.css', '../color/color-atlas.css', './work-page.css'], initWorkPage));
initOnceFor('.item-pagination', 'pager-style', withStyles(['./pager.css'], () => {}));
initOnceFor('ul.th-grid', 'series-grid', initSeriesGrid);
initOnceFor('ul.th-grid[data-favorites]', 'favorites-grid', initFavoritesGrid);
initOnceFor('.th-work', 'series-strip', withStyles(['../color/swatch.css', '../color/color-strip.css'], initSeriesStrip));
