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

/** The enquiry form shown inside an iframe (the drawer, or inline on a painting page): hide the site chrome, report its height so an inline frame can fit it, and let Escape close the drawer. */
const initEmbeddedForm = () => {
  document.documentElement.classList.add('em-embed');
  showEnquiringAbout();
  const reportHeight = () => window.parent.postMessage({ type: 'em-height', height: document.documentElement.scrollHeight }, location.origin);
  new ResizeObserver(reportHeight).observe(document.documentElement);
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
