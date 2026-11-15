import { createDrawer } from './drawer.js';
import { showEnquiringAbout } from './work-note.js';
import { initSmartForm } from './smart-form.js';

const ENQUIRY_PATH = '/enquire';
const trimSlash = (path) => path.replace(/\/$/, '');

const loadStylesheet = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./enquiry.css', import.meta.url).href;
  document.head.appendChild(link);
};

/** The parts of the page that make up the form: what is above its first field and below its last (a confirmation takes the form's place) is not counted. */
const FORM_PARTS = '.em-ask, .form-wrapper, .form-submission-text, .form-submission-html';
const BREATHING_ROOM = 24;

/**
 * The enquiry form shown inside an iframe (the drawer, or inline on a painting page): hide the site chrome and let Escape close the drawer.
 * Inline (`inline=1`) the frame is exactly as tall as the form: the page inside has no height of its own (enquiry.css), so the height reported to the
 * painting page is the bottom of the form's own parts, and follows every change of the form (fields that appear, errors, the confirmation, fonts, a new width).
 */
const initEmbeddedForm = () => {
  document.documentElement.classList.add('em-embed');
  const inline = /[?&]inline=1/.test(location.search);
  if (inline) document.documentElement.classList.add('em-inline');
  showEnquiringAbout();
  initSmartForm();
  const parts = () => [...document.querySelectorAll(FORM_PARTS)].filter((el) => el.getClientRects().length);
  const contentHeight = () => Math.ceil(Math.max(0, ...parts().map((el) => el.getBoundingClientRect().bottom)) + window.scrollY + BREATHING_ROOM);
  let reported = 0;
  const reportHeight = () => {
    const height = contentHeight();
    if (height === reported) return;
    reported = height;
    window.parent.postMessage({ type: 'em-height', height }, location.origin);
  };
  if (inline) {
    const resizes = new ResizeObserver(reportHeight);
    const watch = () => parts().forEach((el) => resizes.observe(el));
    watch();
    new MutationObserver(() => { watch(); reportHeight(); }).observe(document.body, { childList: true, subtree: true, attributes: true });
    document.fonts && document.fonts.ready.then(reportHeight);
    window.addEventListener('load', reportHeight);
    window.addEventListener('resize', reportHeight);
    reportHeight();
  }
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
else if (trimSlash(location.pathname) === ENQUIRY_PATH) { showEnquiringAbout(); initSmartForm(); }
else initDrawerLinks();
