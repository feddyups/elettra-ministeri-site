import { initOnceFor } from '../lib/dom.js';
import { loadStylesheet } from '../lib/stylesheet.js';
import { initWorkPage } from './work-page.js';

/*
 * Entry point for the painting pages. It does nothing on a page without a `[data-work-page]` element, and
 * loads its stylesheets (its own and the infographic's, whose blocks it reuses) only when it finds one.
 */
let styled = false;
initOnceFor('[data-work-page]', 'work-page', (host) => {
  if (!styled) {
    loadStylesheet(new URL('../color/color-atlas.css', import.meta.url).href);
    loadStylesheet(new URL('./work-page.css', import.meta.url).href);
    styled = true;
  }
  initWorkPage(host);
});
