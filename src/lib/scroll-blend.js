/**
 * Where a scrolling page stands between its stacked sections, for effects that follow scroll position.
 *
 * Given the top edge of each section (viewport coordinates, in page order), a reading line (`focus`) and the
 * length of scroll over which one section hands over to the next (`span`), says which two sections are being
 * blended and how far: `t` is 0 while the reading line is `span / 2` or more above the next section's top edge,
 * 1 once it is `span / 2` or more below, and moves steadily in between. Outside a hand-over `from` and `to`
 * are the same section.
 *
 * @param {number[]} tops   top edge of each section relative to the viewport
 * @param {number} focus    the reading line, in the same coordinates
 * @param {number} span     scroll distance of one hand-over
 * @returns {{ from: number, to: number, t: number }}
 */
export const locateBlend = (tops, focus, span) => {
  let current = 0;
  for (let i = 1; i < tops.length; i += 1) {
    const t = (focus - tops[i]) / span + 0.5;
    if (t > 0 && t < 1) return { from: i - 1, to: i, t };
    if (t >= 1) current = i;
  }
  return { from: current, to: current, t: 0 };
};

/**
 * The reading line for a page of this size at this scroll position: the middle of the window, sliding to the
 * window's bottom edge over the last window of scrolling so that a short last section is fully reached at the end.
 */
export const readingLine = ({ viewport, scrolled, scrollable, middle = 0.5 }) => {
  const toEnd = scrollable - scrolled;
  const reach = Math.min(1, Math.max(0, 1 - toEnd / viewport));
  return viewport * (middle + (1 - middle) * reach);
};
