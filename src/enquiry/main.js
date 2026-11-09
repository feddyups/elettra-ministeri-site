import { createDrawer } from './drawer.js';
import { showEnquiringAbout } from './work-note.js';

const ENQUIRY_PATH = '/enquire';
const trimSlash = (path) => path.replace(/\/$/, '');

const loadStylesheet = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./enquiry.css', import.meta.url).href;
  document.head.appendChild(link);
};

/** The enquiry form shown inside the drawer's iframe: hide the site chrome and let Escape close the drawer. */
const initEmbeddedForm = () => {
  document.documentElement.classList.add('em-embed');
  showEnquiringAbout();
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.parent.postMessage('em-close', location.origin);
  });
};

/** Links to /enquire on any page open the form in a drawer instead of navigating away. */
const initDrawerLinks = () => {
  const drawer = createDrawer();
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    let url;
    try { url = new URL(link.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin || trimSlash(url.pathname) !== ENQUIRY_PATH) return;
    e.preventDefault();
    drawer.open(url);
  });
};

loadStylesheet();

const embedded = window.self !== window.top && /[?&]modal=1/.test(location.search);
if (embedded) initEmbeddedForm();
else if (trimSlash(location.pathname) === ENQUIRY_PATH) showEnquiringAbout();
else initDrawerLinks();
