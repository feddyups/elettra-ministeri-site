import { initOnceFor } from '../lib/dom.js';

/**
 * The About page's text ends with a line that links the artist's profile. The Journal is linked on the next line, written in the same form, so the page that
 * introduces the artist leads on to her own writing. Does nothing on any other page, though the profile link also appears elsewhere.
 */
initOnceFor('.sqs-html-content a[href*="artfacts.net/artist"]', 'about-journal', (profile) => {
  if (location.pathname.replace(/\/$/, '') !== '/about-me') return;
  const line = profile.closest('p');
  if (!line) return;
  const journal = line.cloneNode(false);
  const link = document.createElement('a');
  link.href = '/blog';
  link.textContent = 'Journal';
  journal.append(link, ' (notes on travel, poetry and color, mostly in Italian)');
  line.after(journal);
});
