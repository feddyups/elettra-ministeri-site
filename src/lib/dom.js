/**
 * Runs `init` once for every element matching `selector`, now and whenever
 * Squarespace adds blocks to the page. Each element is flagged with
 * `data-em-<name>` so it is never initialised twice.
 */
export const initOnceFor = (selector, name, init) => {
  const run = () => {
    document.querySelectorAll(selector).forEach((el) => {
      const flag = `data-em-${name}`;
      if (el.getAttribute(flag)) return;
      el.setAttribute(flag, '1');
      init(el);
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
};

/** Calls `callback` once, the first time `element` is at least `threshold` visible. */
export const onFirstVisible = (element, threshold, callback) => {
  new IntersectionObserver((entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    callback();
  }, { threshold }).observe(element);
};
