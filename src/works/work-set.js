import { h } from '../lib/elements.js';
import { CATALOGUE } from './catalogue.js';
import { pictureAt } from './series-notes.js';
import { setOf } from './sets.js';
import { workPath } from './work-path.js';

/**
 * "Part of a set": the paintings the artist made together with this one (works/sets.js), each as its picture and title, this one marked. Nothing for a painting
 * that is in no set.
 */
export const renderWorkSet = (slug) => {
  const set = setOf(slug);
  if (!set) return null;
  return h('section', { class: 'wp-section wp-set' },
    h('p', { class: 'ca-label' }, 'Part of a set'),
    h('h2', { class: 'wp-set-title' }, set.label),
    h('ul', { class: 'wp-set-list' }, set.works.map((member) => {
      const entry = CATALOGUE[member];
      const current = member === slug;
      return h('li', { class: current ? 'is-current' : null },
        h('a', { href: workPath(member), 'aria-current': current ? 'page' : false },
          h('img', { src: pictureAt(entry, 500), alt: '', loading: 'lazy', width: entry.image.width, height: entry.image.height }),
          h('span', null, entry.title)));
    })));
};
