import { initOnceFor } from '../lib/dom.js';
import { loadStylesheet } from '../lib/stylesheet.js';
import { initWorkPage } from './work-page.js';
import { initSeriesStrip } from './series-strip.js';

/*
 * Entry point for the pages built from the paintings' data: the painting pages ([data-work-page]) and the
 * strips of color under each painting on a series page (.th-work). It does nothing on a page without either,
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

initOnceFor('[data-work-page]', 'work-page', withStyles(['../color/swatch.css', '../color/color-atlas.css', './work-page.css'], initWorkPage));
initOnceFor('.th-work', 'series-strip', withStyles(['../color/swatch.css', './series-strip.css'], initSeriesStrip));
