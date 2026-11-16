import { h } from '../../lib/elements.js';
import { colorFamilies } from '../families.js';

/** Families that cover less than this share of an average painting are left out of the bar (a single painting's touch of violet is not a family of the work). */
const SHOWN_FROM = 0.01;

/**
 * A bar of the families of similar colors, each as wide as the share of an average painting it covers, and each in one tint, the blend of all the shades
 * in the family, so the colors that sit close to each other read as one. Each family says how many of the paintings carry it, and pointing at it (or tapping it) lights
 * those paintings among the strips of color on the page, as the palette bar does (the `ca:light` event, handled by color-atlas.js).
 */
export const renderFamilyBar = (scope) => {
  const families = colorFamilies(scope).filter((family) => family.share >= SHOWN_FROM);
  const total = families.reduce((sum, family) => sum + family.share, 0);
  const segments = families.map((family) => {
    const shades = [...new Set(family.shades.map(([, name]) => name))].join(', ');
    const many = `${Math.round(family.share * 100)}% of an average painting · in ${family.carriers.length} of ${scope.works.length} paintings`;
    const segment = h('button', {
      type: 'button', class: 'ca-family', style: { '--share': family.share / total },
      'data-tip': family.label, 'data-meta': many, 'aria-label': `${family.label} (${shades}), ${many}`,
    }, h('i', { style: { '--color': family.tint, '--share': 1 } }));
    const ids = family.carriers.map((work) => String(work.id));
    const light = (lit) => segment.dispatchEvent(new CustomEvent('ca:light', { bubbles: true, detail: { ids: lit } }));
    segment.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') light(ids); });
    segment.addEventListener('pointerleave', (event) => { if (event.pointerType === 'mouse') light(null); });
    segment.addEventListener('focus', () => light(ids));
    segment.addEventListener('blur', () => light(null));
    segment.addEventListener('click', () => light(ids));
    return segment;
  });
  const names = families.map((family) => h('li', { style: { '--color': family.tint } }, `${family.label} ${Math.round(family.share * 100)}%`));
  return h('div', { class: 'ca-palette ca-families' }, h('div', { class: 'ca-bar' }, segments), h('ul', { class: 'ca-names' }, names));
};
