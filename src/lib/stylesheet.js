/** Adds a stylesheet to the page. */
export const loadStylesheet = (url) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
};
