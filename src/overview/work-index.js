import { h } from '../lib/elements.js';
import { workPath } from '../works/work-path.js';
import { passes } from './filter-state.js';
import { FAMILY_LABELS } from './works.js';
import { SUBJECTS, MEDIA } from './subjects.js';
import { BUILDS } from '../lib/color-harmony.js';
import { PRICE_BANDS } from '../works/price.js';
import { renderPrice } from '../works/price-view.js';

const SORTS = {
  title: ['A to Z', (a, b) => a.title.localeCompare(b.title)],
  warm: ['Warmest first', (a, b) => (b.warm - b.cool - b.violet) - (a.warm - a.cool - a.violet)],
  vivid: ['Most saturated first', (a, b) => b.chroma - a.chroma],
  priceLow: ['Lowest price first', (a, b) => (a.price || Infinity) - (b.price || Infinity) || a.title.localeCompare(b.title)],
  priceHigh: ['Highest price first', (a, b) => b.price - a.price || a.title.localeCompare(b.title)],
};

const row = (work) => {
  const entry = work.entry;
  const picture = `${entry.image.src}?format=500w`;
  return h('li', { class: 'ov-work' },
    h('a', { href: workPath(work.slug), 'data-tip': work.title, 'data-series': work.seriesLabel, 'data-meta': `${work.warm}% warm · ${work.vivid}% vivid` },
      h('span', { class: 'ov-work-picture' }, h('img', { src: picture, alt: '', loading: 'lazy' })),
      h('span', { class: 'ov-work-title' }, work.title),
      h('span', { class: 'ov-work-series' }, work.seriesLabel),
      h('span', { class: 'ov-work-facts' }, [entry.medium, entry.size].filter(Boolean).join(' · ')),
      renderPrice(entry, { className: 'ov-work-price', percent: true }) || h('span', { class: 'ov-work-price' }),
      h('span', { class: 'ov-work-colors', 'aria-hidden': 'true' }, work.palette.map(([hex, , share]) => h('i', { style: { '--color': hex, '--share': share } })))));
};

/**
 * Every work in one list that can be sorted and narrowed by series, subject, medium, price and color family. The same choices
 * narrow the charts above it, because the choices are shared (see filter-state.js).
 */
export const renderWorkIndex = (works, seriesData, filter) => {
  const items = new Map(works.map((work) => [work, row(work)]));
  const list = h('ul', { class: 'ov-works' });
  const count = h('p', { class: 'ov-count', role: 'status' });
  let order = 'title';

  const choice = (key, value, label) => {
    const button = h('button', { type: 'button', class: 'ov-chip' }, label);
    button.addEventListener('click', () => filter.toggle(key, value));
    filter.subscribe((state) => button.setAttribute('aria-pressed', String(state[key] === value)));
    return button;
  };
  const group = (label, buttons) => h('div', { class: 'ov-group' }, h('span', { class: 'ov-group-label' }, label), h('div', { class: 'ov-chips' }, buttons));

  const select = h('select', { id: 'ov-sort', 'aria-label': 'Sort the works' }, Object.entries(SORTS).map(([key, [label]]) => h('option', { value: key }, label)));
  const clear = h('button', { type: 'button', class: 'ov-clear' }, 'Show everything');
  clear.addEventListener('click', () => filter.clear());

  const render = (state) => {
    const shown = works.filter((work) => passes(state, work)).sort(SORTS[order][1]);
    list.replaceChildren(...shown.map((work) => items.get(work)));
    count.textContent = shown.length === works.length ? `All ${works.length} works` : `${shown.length} of ${works.length} works`;
    clear.hidden = shown.length === works.length;
  };
  select.addEventListener('change', () => { order = select.value; render(filter.get()); });
  filter.subscribe(render);

  return h('div', { class: 'ov-index' },
    h('div', { class: 'ov-controls' },
      group('Series', seriesData.map((s) => choice('series', s.slug, s.label))),
      group('Subject', SUBJECTS.map((s) => choice('subject', s.key, s.label))),
      group('Made on', MEDIA.filter((m) => works.some((w) => w.medium === m.key)).map((m) => choice('medium', m.key, m.label))),
      group('Price', [
        ...PRICE_BANDS.filter((b) => works.some((w) => w.priceBand === b.key)).map((b) => choice('price', b.key, b.label)),
        ...(works.some((w) => w.onSale) ? [choice('sale', 'on', 'On sale')] : []),
      ]),
      group('Mostly', Object.entries(FAMILY_LABELS).map(([key, label]) => choice('family', key, label))),
      group('Colors built as', BUILDS.map((b) => choice('build', b.key, b.label)))),
    h('div', { class: 'ov-bar-row' }, count, h('label', { for: 'ov-sort' }, 'Sort ', select), clear),
    list);
};
