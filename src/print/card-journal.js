import { h } from '../lib/elements.js';
import { entriesOfCard } from '../journal/postcards.js';

/**
 * What the Journal holds for a postcard's month: the article its story comes from, the original of the story, and any piece written around the same month,
 * each with a line on what it is. The entries are in Italian, so each link carries its title in English and says so. Null for a card with no entries.
 */
export const renderCardJournal = (card) => {
  const entries = entriesOfCard(card.slug);
  if (!entries.length) return null;
  const stories = entries.filter((entry) => entry.role === 'story');
  const companions = entries.filter((entry) => entry.role !== 'story');
  return h('div', { class: 'pr-journal' },
    h('p', { class: 'ca-label' }, 'In the Journal'),
    stories.length > 0 && h('p', null, 'This story began as an article in my Journal. The original is in Italian: ',
      stories.map((entry, i) => [i > 0 && ' · ', h('a', { href: entry.path, hreflang: 'it' }, entry.english), ' (in Italian)'])),
    companions.length > 0 && h('div', { class: 'pr-journal-more' },
      h('p', null, 'Written around the same month:'),
      h('ul', null, companions.map((entry) => h('li', null, h('a', { href: entry.path, hreflang: 'it' }, entry.english), ' (in Italian) — ', entry.note)))));
};
