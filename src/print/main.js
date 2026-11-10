import { initOnceFor } from '../lib/dom.js';
import { loadStylesheet } from '../lib/stylesheet.js';
import { initPrintPage } from './print-page.js';

/* The Print page: its grid (`ul.th-grid[data-print]`) is filled with the postcards once the stylesheet has loaded. Does nothing on any other page. */
initOnceFor('ul.th-grid[data-print]', 'print-grid', (list) => {
  loadStylesheet(new URL('./print.css', import.meta.url).href).then(() => { initPrintPage(list); list.setAttribute('data-ready', ''); });
});
