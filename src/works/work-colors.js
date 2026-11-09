import { h } from '../lib/elements.js';
import { renderStatRow } from '../color/blocks/stat-row.js';
import { renderWarmthMap } from '../color/blocks/warmth-map.js';
import { describeWork } from './describe-work.js';
import { similarWorks } from './similar-works.js';

const COPIED_MS = 1400;

const swatches = (work, host) => {
  const status = h('p', { class: 'wp-copied', 'aria-live': 'polite' });
  const items = work.palette.map(([hex, name, share], index) => {
    const button = h('button', { class: 'wp-swatch', type: 'button', style: { '--color': hex, '--share': share }, 'aria-label': `${name}, ${hex}. Copy the color code` },
      h('i'), h('span', null, name), h('small', null, hex));
    const show = () => host.dispatchEvent(new CustomEvent('wp:color', { detail: { index } }));
    const hide = () => host.dispatchEvent(new CustomEvent('wp:color', { detail: { index: null } }));
    button.addEventListener('pointerenter', show);
    button.addEventListener('focus', show);
    button.addEventListener('pointerleave', hide);
    button.addEventListener('blur', hide);
    button.addEventListener('click', () => {
      if (navigator.clipboard) navigator.clipboard.writeText(hex);
      status.textContent = `${name} ${hex} copied`;
      setTimeout(() => { status.textContent = ''; }, COPIED_MS);
    });
    return button;
  });
  return h('div', { class: 'wp-swatches' }, h('div', { class: 'wp-swatch-row' }, items), status);
};

/** The colorimetric reading of one painting: its colors (point at one to see where it lives), the numbers, where it sits among all works, and the works closest to it in color. */
export const renderWorkColors = ({ host, work, scope, series }) => {
  const { sentence, standout } = describeWork(work, series.works, series.label);
  const similar = similarWorks(work, scope.universe);
  return h('section', { class: 'wp-section wp-colors' },
    h('p', { class: 'ca-label' }, 'The colors of this painting'),
    h('p', { class: 'wp-reading' }, sentence, standout && ` ${standout}`),
    swatches(work, host),
    renderStatRow(scope),
    h('div', { class: 'wp-where' },
      h('p', { class: 'ca-label' }, 'Where it sits among all of my work'),
      renderWarmthMap(scope)),
    h('div', { class: 'wp-similar' },
      h('p', { class: 'ca-label' }, 'Close in color'),
      h('div', { class: 'ca-strips' }, similar.map((other) => h('a', { class: 'ca-strip', href: other.href, title: other.title, 'aria-label': other.title },
        other.palette.map(([hex, name, share]) => h('i', { style: { '--share': share, '--color': hex }, title: name })))))));
};
