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

/** The chart in the drawer that shows each kind of choice; a choice not listed here has no chart. */
const CHART_OF = { subject: 'subjects', medium: 'subjects', family: 'colors', build: 'colors' };

/**
 * Every work in one list that can be sorted and narrowed by series, set, subject, medium, price, color family and how the colors are built. The same
 * choices narrow the charts in the drawer beside it, because the choices are shared (see filter-state.js). A toolbar stays in view while the list
 * scrolls: the number of works shown, the choices made (each can be taken off there), the sort, the button that opens every choice, and the button
 * that opens the drawer. A choice the drawer has a chart for brings that chart up.
 */
export const renderWorkIndex = (works, seriesData, filter, drawer) => {
  const setLabels = [...new Set(works.map((work) => work.set).filter(Boolean))];
  const items = new Map(works.map((work) => [work, row(work)]));
  const list = h('ul', { class: 'ov-works' });
  const count = h('p', { class: 'ov-count', role: 'status' });
  const labels = {};
  let order = 'title';

  const choice = (key, value, label, groupLabel) => {
    (labels[key] ||= { group: groupLabel, values: {} }).values[value] = label;
    const button = h('button', { type: 'button', class: 'ov-chip' }, label);
    button.addEventListener('click', () => {
      filter.toggle(key, value);
      if (filter.get()[key] === value && CHART_OF[key]) drawer.reveal(CHART_OF[key]);
    });
    filter.subscribe((state) => button.setAttribute('aria-pressed', String(state[key] === value)));
    return button;
  };
  const group = (label, key, choices) => h('div', { class: 'ov-group' }, h('span', { class: 'ov-group-label' }, label),
    h('div', { class: 'ov-chips' }, choices.map(([value, text]) => choice(key, value, text, label))));

  const select = h('select', { id: 'ov-sort', 'aria-label': 'Sort the works' }, Object.entries(SORTS).map(([key, [label]]) => h('option', { value: key }, label)));
  const clear = h('button', { type: 'button', class: 'ov-clear' }, 'Show everything');
  clear.addEventListener('click', () => filter.clear());
  const active = h('div', { class: 'ov-active' });

  const controls = h('div', { class: 'ov-controls', id: 'ov-controls', hidden: true },
    group('Series', 'series', seriesData.map((s) => [s.slug, s.label])),
    ...(setLabels.length ? [group('Set', 'set', setLabels.map((label) => [label, label]))] : []),
    group('Subject', 'subject', SUBJECTS.map((s) => [s.key, s.label])),
    group('Made on', 'medium', MEDIA.filter((m) => works.some((w) => w.medium === m.key)).map((m) => [m.key, m.label])),
    group('Price', 'price', PRICE_BANDS.filter((b) => works.some((w) => w.priceBand === b.key)).map((b) => [b.key, b.label])),
    ...(works.some((w) => w.onSale) ? [group('Sale', 'sale', [['on', 'On sale']])] : []),
    group('Mostly', 'family', Object.entries(FAMILY_LABELS)),
    group('Colors built as', 'build', BUILDS.map((b) => [b.key, b.label])));

  const filtersButton = h('button', { type: 'button', class: 'ov-toggle ov-toggle-filters', 'aria-expanded': 'false', 'aria-controls': 'ov-controls' }, 'Filters');
  const chartsButton = h('button', { type: 'button', class: 'ov-toggle ov-toggle-charts', 'aria-expanded': 'false', 'aria-controls': 'ov-drawer' }, 'Charts');
  const toolbar = h('div', { class: 'ov-toolbar' },
    h('div', { class: 'ov-toolbar-row' }, count, active, clear,
      h('label', { class: 'ov-sort', for: 'ov-sort' }, 'Sort ', select), filtersButton, chartsButton),
    controls);

  const showFilters = (open) => {
    controls.hidden = !open;
    filtersButton.setAttribute('aria-expanded', String(open));
  };
  filtersButton.addEventListener('click', () => showFilters(controls.hidden));
  chartsButton.addEventListener('click', () => drawer.toggle());
  drawer.onChange((open) => chartsButton.setAttribute('aria-expanded', String(open)));
  document.addEventListener('click', (event) => { if (!controls.hidden && !toolbar.contains(event.target)) showFilters(false); });
  toolbar.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !controls.hidden) { showFilters(false); filtersButton.focus(); } });

  const render = (state) => {
    const shown = works.filter((work) => passes(state, work)).sort(SORTS[order][1]);
    list.replaceChildren(...shown.map((work) => items.get(work)));
    count.textContent = shown.length === works.length ? `All ${works.length} works` : `${shown.length} of ${works.length} works`;
    clear.hidden = shown.length === works.length;
    active.replaceChildren(...Object.entries(state).filter(([, value]) => value).map(([key, value]) => {
      const take = h('button', { type: 'button', class: 'ov-active-chip', 'aria-label': `Take off ${labels[key].values[value]}` }, labels[key].values[value], h('span', { 'aria-hidden': 'true' }, ' ×'));
      take.addEventListener('click', () => filter.toggle(key, value));
      return take;
    }));
  };
  select.addEventListener('change', () => { order = select.value; render(filter.get()); });
  filter.subscribe(render);

  return h('div', { class: 'ov-index' }, toolbar, list);
};
