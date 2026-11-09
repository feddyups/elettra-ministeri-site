import { h } from '../lib/elements.js';
import { SUBJECTS, MEDIA } from './subjects.js';

/**
 * A list of bars, one per group, as long as the number of works in it; choosing a bar sets that choice for every chart
 * (choosing it again clears it). Groups with no work are left out.
 */
const renderBars = (title, groups, works, key, filter, note) => {
  const counted = groups.map((group) => ({ ...group, count: works.filter((w) => (key === 'subject' ? w.subjects.includes(group.key) : w.medium === group.key)).length })).filter((g) => g.count > 0).sort((a, b) => b.count - a.count);
  const most = Math.max(...counted.map((g) => g.count));
  return h('div', { class: 'ov-bars' },
    h('h3', null, title),
    h('ul', null, counted.map((group) => {
      const button = h('button', { type: 'button', class: 'ov-bar', style: { '--size': group.count / most } },
        h('span', { class: 'ov-bar-label' }, group.label), h('i', null), h('b', null, group.count));
      button.addEventListener('click', () => filter.toggle(key, group.key));
      filter.subscribe((state) => button.setAttribute('aria-pressed', String(state[key] === group.key)));
      return h('li', null, button);
    })),
    note && h('p', { class: 'ov-note' }, note));
};

export const renderSubjectBars = (works, filter) => renderBars('What I paint', SUBJECTS, works, 'subject', filter,
  'Read from each title and description, so a work can belong to several.');
export const renderMediumBars = (works, filter) => renderBars('What I paint on', MEDIA, works, 'medium', filter);
