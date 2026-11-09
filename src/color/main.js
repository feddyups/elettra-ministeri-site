import { initOnceFor } from '../lib/dom.js';
import { loadStylesheet } from '../lib/stylesheet.js';
import { initAtlas } from './color-atlas.js';

/*
 * Entry point for the color infographic. Loaded site-wide; it does nothing on a page without a
 * `[data-color-atlas]` element, and loads its stylesheet only when it finds one.
 */
let styled = false;
initOnceFor('[data-color-atlas]', 'atlas', (host) => {
  if (!styled) {
    loadStylesheet(new URL('./color-atlas.css', import.meta.url).href);
    styled = true;
  }
  initAtlas(host);
});
