const root = document.documentElement;

/**
 * A side drawer that shows a page in an iframe over the current page.
 * The elements are created the first time the drawer opens.
 * Styled by `.em-drawer*` in enquiry.css.
 *
 * @returns {{ open: (url: URL) => void, close: () => void }}
 */
export const createDrawer = () => {
  let shade;
  let drawer;
  let frame;
  let closeButton;
  let lastFocus;

  const close = () => {
    root.classList.remove('em-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  const build = () => {
    if (drawer) return;
    shade = document.createElement('div');
    shade.className = 'em-drawer-shade';

    drawer = document.createElement('div');
    drawer.className = 'em-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Enquire about a work');

    const bar = document.createElement('div');
    bar.className = 'em-drawer-bar';
    const title = document.createElement('span');
    title.textContent = 'Enquiry';
    closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = 'Close';
    bar.append(title, closeButton);

    frame = document.createElement('iframe');
    frame.title = 'Enquiry form';
    drawer.append(bar, frame);
    document.body.append(shade, drawer);

    shade.addEventListener('click', close);
    closeButton.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('em-open')) close(); });
    window.addEventListener('message', (e) => { if (e.origin === location.origin && e.data === 'em-close') close(); });
  };

  const open = (url) => {
    build();
    lastFocus = document.activeElement;
    const src = `${url.pathname}${url.search ? `${url.search}&` : '?'}modal=1`;
    if (frame.getAttribute('data-src') !== src) {
      frame.setAttribute('data-src', src);
      frame.src = src;
    }
    root.classList.add('em-open');
    closeButton.focus();
  };

  return { open, close };
};
