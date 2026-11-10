const loading = new Map();

/** Adds a stylesheet to the page, once. Returns a promise that settles when the stylesheet has loaded, failed, or taken too long to answer, so a caller can wait for it before drawing what it styles. */
export const loadStylesheet = (url) => {
  if (!loading.has(url)) {
    loading.set(url, new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.addEventListener('load', resolve);
      link.addEventListener('error', resolve);
      setTimeout(resolve, 4000);
      document.head.appendChild(link);
    }));
  }
  return loading.get(url);
};
