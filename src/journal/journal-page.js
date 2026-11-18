import { h } from '../lib/elements.js';
import { CARDS, cardPath } from '../print/cards.js';
import { ENTRY_CARDS, PROJECT_ENTRY } from './postcards.js';
import { pagerLink } from '../works/pager-link.js';
import { CATALOGUE } from '../works/catalogue.js';
import { listImage, listPictureAt } from '../works/series-notes.js';
import { seriesInfo } from '../color/scope.js';
import { RELATED } from './related.js';

/*
 * The Journal (/blog and its entries). Squarespace draws a blog with its own layout; this gives it the site's: an index of every entry (the native list
 * shows three at a time and whole entries), and on an entry a reading column with a lede, epigraph, pictures of a sensible size, and the postcard it belongs to.
 * The native markup stays in the page, out of sight from the first paint (journal.css): the index is drawn beside it and hides it for good once it is ready; if the index cannot be drawn the native list is shown.
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

let entriesLoad = null;
/** Every entry that appears in the index, newest first, loaded once for the index, the pager and the related entries. */
const loadEntries = () => { entriesLoad = entriesLoad || fetchEntries().then((items) => items.map(describe).filter((entry) => entry.excerpt)); return entriesLoad; };

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
    tags: item.tags || [],
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
  try { entries = await loadEntries(); } catch (error) { list.setAttribute('data-jl-show', ''); return; }
  if (!entries.length) { list.setAttribute('data-jl-show', ''); return; }
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

/**
 * Marks each picture of an entry with its proportions (`--jl-ratio` and `data-jl-picture` on the picture's block, from the dimensions Squarespace states for the original) so that journal.css
 * sizes every picture alike, whatever size it was uploaded at: no wider than the text, and no taller than the window allows.
 */
const markPictures = (content) => {
  content.querySelectorAll('.sqs-block-image').forEach((block) => {
    const img = block.querySelector('img');
    if (!img) return;
    const stated = (img.getAttribute('data-image-dimensions') || '').match(/^(\d+)\s*x\s*(\d+)$/);
    const width = Number(stated ? stated[1] : img.getAttribute('width'));
    const height = Number(stated ? stated[2] : img.getAttribute('height'));
    if (!width || !height) return;
    block.style.setProperty('--jl-ratio', (width / height).toFixed(3));
    block.setAttribute('data-jl-picture', '');
  });
};

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

/**
 * The bar at the foot of an entry replaces Squarespace's own: the entry written before this one on the left, the one after it on the right, and a way back
 * to the Journal between them. Only entries that appear in the index take part, so a draft or an empty entry is never a neighbor.
 */
const initPager = async (bar) => {
  let entries;
  try { entries = await loadEntries(); } catch (error) { return; }
  const index = entries.findIndex((entry) => entry.path === location.pathname.replace(/\/$/, ''));
  if (index < 0) return;
  const earlier = entries[index + 1];
  const later = entries[index - 1];
  bar.classList.add('em-pager');
  bar.replaceChildren(h('nav', { class: 'em-pager-inner em-pager-inner--journal', 'aria-label': 'Journal entries' },
    earlier ? pagerLink('prev', 'Earlier entry', earlier.title, earlier.path) : h('span'),
    pagerLink('back', 'Back to', 'The Journal', BLOG),
    later ? pagerLink('next', 'Later entry', later.title, later.path) : h('span')));
};

/* ----- links and pictures inside an entry ----- */

const OWN_ADDRESS = /^https?:\/\/(www\.)?elettraministeri\.com(?=\/|$)/i;
const ABOUT = '/about-me';
const IS_POSTCARD_PICTURE = /_final\.|illustrazione|arriverderci/i;
const NEEDS_DESCRIPTION = (alt) => !alt || /\.(jpe?g|png)$/i.test(alt) || alt.length < 12;

/**
 * Entries were written when downloads lived in a shared folder and addresses were absolute. Here the links that went to that folder lead to the postcard of the
 * entry's month (or to the entry's own free print), and a link to this site is an address on this site. A postcard's picture in an entry is described by the
 * postcard's own description.
 */
const repairLinks = (content, slug) => {
  const monthly = card(ENTRY_CARDS[slug]);
  const postcards = monthly ? cardPath(monthly) : '/print';
  const freePrint = content.querySelector('img[data-src*="freeprint"]');
  content.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (/goo\.gl\/7uFUmF/.test(href)) { link.setAttribute('href', slug === PROJECT_ENTRY ? '/print' : postcards); return; }
    if (/drive\.google\.com\/drive/.test(href)) {
      link.setAttribute('href', freePrint ? freePrint.getAttribute('data-src') : postcards);
      if (freePrint) { link.setAttribute('target', '_blank'); link.setAttribute('rel', 'noopener'); }
      return;
    }
    if (OWN_ADDRESS.test(href)) {
      const url = new URL(href);
      link.setAttribute('href', url.pathname === '/' && /^blog$/i.test(link.textContent.trim()) ? BLOG : `${url.pathname}${url.search}${url.hash}`);
    }
  });
  if (monthly) {
    content.querySelectorAll('img').forEach((image) => {
      const source = image.getAttribute('data-src') || '';
      if (IS_POSTCARD_PICTURE.test(source) && NEEDS_DESCRIPTION(image.getAttribute('alt'))) image.setAttribute('alt', monthly.alt);
    });
  }
};

/* ----- what an entry leads on to ----- */

const GENERIC_TAGS = new Set(['blog', 'beginning', 'new', 'elettraministeri', 'europe', 'travel']);
const plainTag = (tag) => tag.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const topicsOf = (entry) => new Set(entry.tags.map(plainTag).filter((tag) => tag && !GENERIC_TAGS.has(tag)));

/** The entries that share the most topics with this one, at most three. */
const relatedEntries = (entries, current) => {
  const mine = topicsOf(current);
  return entries
    .filter((entry) => entry.path !== current.path)
    .map((entry) => ({ entry, shared: [...topicsOf(entry)].filter((tag) => mine.has(tag)).length }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3)
    .map(({ entry }) => entry);
};

const workItem = (slug) => {
  const work = CATALOGUE[slug];
  if (!work) return null;
  const series = seriesInfo(work.series);
  const image = listImage(work);
  return h('li', null, h('a', { href: `/paintings/${slug}` },
    h('img', { src: listPictureAt(work, 500), alt: work.alt, width: image.width, height: image.height, loading: 'lazy' }),
    h('b', null, work.title),
    series && h('small', null, series.label)));
};

/** The paintings, the series and the About page an entry leads on to (related.js), and the entries that share its topics, once they are known. */
const renderRelated = (slug, article, after) => {
  const plan = RELATED[slug] || {};
  const works = (plan.works || []).map(workItem).filter(Boolean);
  const series = plan.series && seriesInfo(plan.series);
  const places = [
    series && h('a', { class: 'jl-link', href: series.path }, `The ${series.label} series ›`),
    plan.about && h('a', { class: 'jl-link', href: ABOUT }, 'About Elettra ›'),
  ].filter(Boolean);
  const entries = h('div', { class: 'jl-related-entries', hidden: true });
  const block = h('aside', { class: 'jl-related', 'aria-label': 'More from the studio', hidden: !works.length && !places.length },
    works.length > 0 && h('div', null, h('p', { class: 'jl-kicker-text' }, 'Paintings on the same subject'), h('ul', { class: 'jl-related-list' }, works)),
    places.length > 0 && h('div', { class: 'jl-related-places' }, places),
    entries);
  after.after(block);
  loadEntries().then((all) => {
    const current = all.find((entry) => entry.path === location.pathname.replace(/\/$/, ''));
    const more = current ? relatedEntries(all, current) : [];
    if (!more.length) return;
    entries.append(h('p', { class: 'jl-kicker-text' }, 'More in the Journal'),
      h('ul', { class: 'jl-related-posts' }, more.map((entry) => h('li', null, h('a', { href: entry.path }, h('b', null, entry.title), h('small', null, `${entry.date} · ${entry.category}`))))));
    entries.hidden = false;
    block.hidden = false;
  }).catch(() => {});
};

const initEntry = (article) => {
  const content = article.querySelector('.blog-item-content');
  if (!content) return;
  content.setAttribute('lang', 'it');
  markOpening(content);
  markPoem(content);
  markPictures(content);
  repairLinks(content, lastPart(location.pathname));

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
  renderRelated(lastPart(location.pathname), article, end || content);
  article.setAttribute('data-jl-ready', '');
  const bar = document.querySelector('.item-pagination');
  if (bar) initPager(bar);
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
