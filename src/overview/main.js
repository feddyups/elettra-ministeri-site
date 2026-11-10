import { initOnceFor } from '../lib/dom.js';
import { loadStylesheet } from '../lib/stylesheet.js';
import { initPaintingsOverview } from './paintings-overview.js';
import { offersReady } from '../works/offers.js';

/*
 * Entry point for the Paintings page. Loaded site-wide; it does nothing on a page without a `[data-paintings-overview]`
 * element, and loads its stylesheets only when it finds one.
 */
let styled = false;
initOnceFor('[data-paintings-overview]', 'paintings-overview', (host) => {
  if (!styled) {
    ['../color/color-atlas.css', './paintings-overview.css'].forEach((name) => loadStylesheet(new URL(name, import.meta.url).href));
    styled = true;
  }
  offersReady().then(() => initPaintingsOverview(host));
});
