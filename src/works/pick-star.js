import { h, svg } from '../lib/elements.js';
import { readPickSlugs } from './picks.js';

const STAR = 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z';
const LABEL = 'One of the artist’s picks';

/** The star drawing. */
export const starIcon = () => svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, svg('path', { d: STAR }));

/** Puts a small star on the picture of every entry of a series grid whose painting is in `slugs`. */
export const markSlugs = (list, slugs) => {
  list.querySelectorAll('.th-work').forEach((entry) => {
    const picture = entry.querySelector('a.th-img');
    if (!slugs.includes(entry.id) || !picture || picture.querySelector('.th-star')) return;
    picture.append(h('span', { class: 'th-star', role: 'img', title: LABEL, 'aria-label': LABEL },
      starIcon()));
  });
};

/** Marks the paintings the artist has chosen as picks (see picks.js); nothing is marked when her sheet cannot be read. */
export const markPicks = async (list) => {
  const slugs = await readPickSlugs();
  if (slugs && slugs.length) markSlugs(list, slugs);
};
