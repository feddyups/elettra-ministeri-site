/**
 * Reports which way the page is being scrolled, ignoring small movements.
 *
 * `onChange(direction, y)` runs when the page has moved `travel` pixels in a new direction ('down' or 'up'), and
 * once with 'up' whenever `y` falls to `top` or less (the page is at its start, so there is nothing to hide for).
 * Returns a function that stops listening.
 *
 * @param {(direction: 'up'|'down', y: number) => void} onChange
 * @param {{ travel?: number, top?: number, target?: Window }} [options]
 */
export const watchScrollDirection = (onChange, { travel = 8, top = 0, target = window } = {}) => {
  let anchor = target.scrollY;
  let direction = null;

  const report = (next, y) => {
    anchor = y;
    if (next === direction) return;
    direction = next;
    onChange(next, y);
  };

  const onScroll = () => {
    const y = target.scrollY;
    if (y <= top) return report('up', y);
    if (Math.abs(y - anchor) < travel) return;
    report(y > anchor ? 'down' : 'up', y);
  };

  target.addEventListener('scroll', onScroll, { passive: true });
  return () => target.removeEventListener('scroll', onScroll);
};
