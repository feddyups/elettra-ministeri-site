import { h } from '../lib/elements.js';
import { CARDS, cardPath } from '../print/cards.js';
import { ENTRY_CARDS, PROJECT_ENTRY } from './postcards.js';

/*
 * The Journal (/blog and its entries). Squarespace draws a blog with its own layout; this gives it the site's: an index of every entry (the native list
 * shows three at a time and whole entries), and on an entry a reading column with a lede, epigraph, pictures of a sensible size, and the postcard it belongs to.
 * The native markup stays in the page: the index is drawn beside it and hides it only once it is ready.
 */
const WORDS_PER_MINUTE = 200;
const EXCERPT_LENGTH = 170;
const BLOG = '/blog';

const lastPart = (path) => path.replace(/\/$/, '').split('/').filter(Boolean).pop();
const sentence = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const plain = (html) => { const div = document.createElement('div'); div.innerHTML = html; return div.textContent.replace(/\s+/g, ' ').trim(); };
const dateOf = (ms) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(ms));
const minutesOf = (text) => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE));
const shorten = (text) => (text.length <= EXCERPT_LENGTH ? text : `${text.slice(0, EXCERPT_LENGTH).replace(/\s+\S*$/, '')}…`);
const CATEGORY_ORDER = ['Scrivo una cartolina', 'Travel', 'About me', 'Versi liberi'];
const card = (slug) => CARDS.find((c) => c.slug === slug);

/* ----- the index ----- */

const fetchEntries = async () => {
  const entries = new Map();
  let offset = '';
  for (let page = 0; page < 12; page++) {
    const response = await fetch(`${BLOG}?format=json${offset}`);
    if (!response.ok) break;
    const data = await response.json();
    (data.items || []).forEach((item) => entries.set(item.id, item));
    const next = data.pagination;
    if (next && next.nextPage && next.nextPageOffset) offset = `&offset=${next.nextPageOffset}`; else break;
  }
  return [...entries.values()].sort((a, b) => b.addedOn - a.addedOn);
};

const coverOf = (item) => {
  const body = new DOMParser().parseFromString(item.body || '', 'text/html');
  const first = body.querySelector('img');
  const src = (first && (first.getAttribute('data-src') || first.getAttribute('src'))) || item.assetUrl;
  return src ? `${src}${src.includes('?') ? '&' : '?'}format=300w` : null;
};

const describe = (item) => {
  const text = plain(item.body || '');
  const body = new DOMParser().parseFromString(item.body || '', 'text/html');
  const lead = [...body.querySelectorAll('p')].map((p) => p.textContent.replace(/\s+/g, ' ').trim()).find((t) => t.length > 60 && !/^["“«\-–—]/.test(t));
  return {
    path: new URL(item.fullUrl, location.origin).pathname,
    title: item.title,
    date: dateOf(item.addedOn),
    category: sentence((item.categories || [])[0] || 'notes'),
    minutes: text ? minutesOf(text) : null,
    excerpt: shorten(plain(item.excerpt || '') || lead || ''),
    cover: coverOf(item),
  };
};

const renderRow = (entry) => h('li', { class: 'jl-row', 'data-category': entry.category },
  h('a', { href: entry.path },
    h('span', { class: 'jl-row-meta' }, entry.date, h('span', null, entry.category)),
    h('span', { class: 'jl-row-text' }, h('b', null, entry.title), entry.excerpt && h('small', null, entry.excerpt)),
    entry.cover && h('span', { class: 'jl-row-picture' }, h('img', { src: entry.cover, alt: '', loading: 'lazy' }))));

const initIndex = async (list) => {
  let entries;
  try { entries = (await fetchEntries()).map(describe).filter((entry) => entry.excerpt); } catch (error) { return; }
  if (!entries.length) return;
  const present = [...new Set(entries.map((entry) => entry.category))];
  const categories = [...CATEGORY_ORDER.filter((c) => present.includes(c)), ...present.filter((c) => !CATEGORY_ORDER.includes(c))];
  const start = decodeURIComponent((location.pathname.match(/\/blog\/category\/([^/]+)/) || [])[1] || '').replace(/\+/g, ' ');
  let current = categories.find((c) => c.toLowerCase() === start.toLowerCase()) || null;

  const rows = h('ul', { class: 'jl-list' });
  const count = h('p', { class: 'jl-count' });
  const chips = [null, ...categories].map((category) => {
    const chip = h('button', { type: 'button', class: 'jl-chip', 'aria-pressed': 'false' }, category || 'All entries');
    chip.addEventListener('click', () => { current = category; paint(); });
    return { category, chip };
  });
  const paint = () => {
    const shown = entries.filter((entry) => !current || entry.category === current);
    rows.replaceChildren(...shown.map(renderRow));
    count.textContent = `${shown.length} ${shown.length === 1 ? 'entry' : 'entries'}`;
    chips.forEach(({ category, chip }) => chip.setAttribute('aria-pressed', String(category === current)));
  };
  paint();

  const project = h('a', { class: 'jl-project', href: '/print' },
    h('span', { class: 'jl-kicker-text' }, 'Scrivo una cartolina'),
    h('b', null, 'One postcard a month, drawn to be printed and sent'),
    h('span', { class: 'jl-project-go' }, 'See the postcards ›'));

  const overview = h('section', { class: 'jl-overview' },
    h('header', { class: 'jl-head' },
      h('div', null, h('p', { class: 'jl-kicker-text' }, 'Elettra Ministeri'), h('h1', null, 'Journal')),
      h('div', null, h('p', { class: 'jl-lede' }, 'Notes on travel, poetry and color: the seasons, the places I go to, and the postcard I draw each month. Most entries are in Italian, my first language.'))),
    h('div', { class: 'jl-tools' }, h('div', { class: 'jl-chips', role: 'group', 'aria-label': 'Filter the entries' }, chips.map(({ chip }) => chip)), count),
    rows,
    project);
  list.before(overview);
  list.setAttribute('data-jl-hidden', '');
};

/* ----- an entry ----- */

const isQuoteStart = (text) => /^["“«‘\-–—]/.test(text);
const hasAttribution = (text) => /\([A-ZÀ-Ý][^()]{2,40}\)\s*$/.test(text);
const looksLikeName = (text) => text.length < 48 && !/[.!?:;]$/.test(text) && text.split(/\s+/).length <= 5;

/** The opening quotation of an entry, its attribution if it has one, and the paragraph that follows as the lede. */
const markOpening = (content) => {
  const paragraphs = [...content.querySelectorAll('.sqs-html-content > p')].filter((p) => p.textContent.trim());
  let i = 0;
  const first = paragraphs[0];
  if (first && first.textContent.trim().length < 520 && (isQuoteStart(first.textContent.trim()) || hasAttribution(first.textContent.trim()))) {
    first.classList.add('jl-epigraph');
    i = 1;
    if (paragraphs[1] && looksLikeName(paragraphs[1].textContent.trim())) { paragraphs[1].classList.add('jl-epigraph-by'); i = 2; }
  }
  if (paragraphs[i]) paragraphs[i].classList.add('jl-lede');
};

/** An entry that is mostly headings is a poem: its lines are set as verse. */
const markPoem = (content) => { if (content.querySelectorAll('h3').length >= 8) content.classList.add('jl-poem'); };

const postcardEnd = (path) => {
  const slug = lastPart(path);
  const monthly = card(ENTRY_CARDS[slug]);
  if (monthly) {
    return h('aside', { class: 'jl-card' },
      h('a', { class: 'jl-card-picture', href: cardPath(monthly), 'aria-label': `${monthly.title}, the postcard for ${monthly.month}` }, h('img', { src: `${monthly.src}?format=500w`, alt: monthly.alt, loading: 'lazy' })),
      h('div', { class: 'jl-card-text' },
        h('p', { class: 'jl-kicker-text' }, `The postcard for ${monthly.month}`),
        h('b', null, monthly.title),
        h('p', null, monthly.dek),
        h('a', { class: 'jl-link', href: cardPath(monthly) }, 'See, print and send it ›')));
  }
  if (slug === PROJECT_ENTRY) {
    return h('aside', { class: 'jl-card jl-card--text' }, h('div', { class: 'jl-card-text' },
      h('p', { class: 'jl-kicker-text' }, 'Scrivo una cartolina'),
      h('b', null, 'All the postcards'),
      h('a', { class: 'jl-link', href: '/print' }, 'See the postcards ›')));
  }
  return null;
};

const initEntry = (article) => {
  const content = article.querySelector('.blog-item-content');
  if (!content) return;
  content.setAttribute('lang', 'it');
  markOpening(content);
  markPoem(content);

  const top = article.querySelector('.blog-item-top-wrapper');
  const title = article.querySelector('.entry-title, h1');
  const category = sentence(((article.querySelector('a[href*="/blog/category/"]') || {}).textContent || '').trim() || 'notes');
  const date = (article.querySelector('time.dt-published, time') || {}).textContent;
  const minutes = minutesOf(content.textContent);
  if (top && title) {
    top.prepend(h('a', { class: 'jl-kicker', href: BLOG }, 'Journal ›'));
    title.after(h('p', { class: 'jl-meta' }, [date && date.trim(), category, `${minutes} min read`].filter(Boolean).join(' · ')));
  }
  const end = postcardEnd(location.pathname);
  if (end) { content.after(end); article.setAttribute('data-jl-card', ''); }
  article.setAttribute('data-jl-ready', '');
};

/* ----- start ----- */

if (document.documentElement.dataset.series === 'journal') {
  const path = location.pathname.replace(/\/$/, '');
  const run = () => {
    const list = document.querySelector('.blog-list');
    if (list && !list.hasAttribute('data-jl-hidden')) initIndex(list);
    else if (/^\/blog\/\d{4}\//.test(path)) { const article = document.querySelector('article.hentry'); if (article && !article.hasAttribute('data-jl-ready')) initEntry(article); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
}
