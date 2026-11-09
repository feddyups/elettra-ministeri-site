import { h } from '../lib/elements.js';

/** Opens `src` full screen; a click, the close button or Escape closes it. */
export const openLightbox = ({ src, alt }) => {
  const previousFocus = document.activeElement;
  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
    document.documentElement.classList.remove('wp-lightbox-open');
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  };
  const onKey = (event) => { if (event.key === 'Escape') close(); };
  const closeButton = h('button', { class: 'wp-lightbox-close', type: 'button', 'aria-label': 'Close' }, '×');
  const overlay = h('div', { class: 'wp-lightbox', role: 'dialog', 'aria-modal': 'true', 'aria-label': alt }, h('img', { src, alt }), closeButton);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.documentElement.classList.add('wp-lightbox-open');
  document.body.appendChild(overlay);
  closeButton.focus();
};
