/** Columns within this many pixels of each other in height count as level, so the next painting goes to the leftmost of them. */
const LEVEL = 2;

/**
 * Lays the entries of a grid of paintings out as masonry that reads from left to right: each entry, in the order of the list, goes to the column that is
 * shortest at that moment (the leftmost when columns are level), so the first row is 1, 2, 3 across and every following painting falls into the gap
 * under the row above. The entries keep their place in the list, so the order of the page, of the arrow keys and of the screen reader is the order of
 * the sequence. The number of columns is the grid's `--th-columns` (series-theme.css), the space between them its `column-gap`. The layout follows
 * the width of the grid and the height of every entry, which changes as pictures, fonts and strips of color arrive.
 */
export const masonry = (list) => {
  if (list.hasAttribute('data-masonry')) return;
  list.setAttribute('data-masonry', '');
  let queued = false;
  const layout = () => {
    queued = false;
    const items = [...list.children].filter((item) => item.classList.contains('th-work'));
    if (!items.length) return;
    const style = getComputedStyle(list);
    const columns = Math.max(1, Number.parseInt(style.getPropertyValue('--th-columns'), 10) || 1);
    const gap = Number.parseFloat(style.columnGap) || 0;
    const width = (list.clientWidth - gap * (columns - 1)) / columns;
    items.forEach((item) => { item.style.width = `${width}px`; });
    const tops = new Array(columns).fill(0);
    items.forEach((item) => {
      const shortest = Math.min(...tops);
      const column = tops.findIndex((top) => top - shortest <= LEVEL);
      item.style.transform = `translate(${column * (width + gap)}px, ${tops[column]}px)`;
      tops[column] += item.offsetHeight + gap;
    });
    list.style.height = `${Math.max(...tops) - gap}px`;
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(layout);
  };
  layout();
  const watcher = new ResizeObserver(queue);
  watcher.observe(list);
  [...list.children].forEach((item) => watcher.observe(item));
};
