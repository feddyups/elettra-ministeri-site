import { h } from '../../lib/elements.js';
import { harmonyOf } from '../../lib/color-harmony.js';
import { findAccentPattern } from '../accent-pattern.js';
import { renderStrip } from './work-strips.js';

const percent = (share) => `${Math.round(share * 100)}%`;

/**
 * How the colors of the whole body of work relate, measured against chance (see lib/color-harmony.js): hues gather in
 * neighbors far more than chance would, opposites are used no more than chance would give, and where an opposite does
 * appear it is a small accent. Below the words, every painting that does it, as its strip of colors.
 */
export const renderColorPair = (scope) => {
  if (scope.id !== 'all') return null;
  const harmony = harmonyOf(scope.works);
  const pattern = findAccentPattern(scope.works);
  if (!pattern) return null;
  return h('div', { class: 'ca-pair' },
    h('span', { class: 'ca-dots' }, h('i', { style: { background: pattern.dominant.hex } }), h('i', { style: { background: pattern.accent.hex } })),
    h('div', { class: 'ca-pair-body' },
      h('p', null, h('b', null, `A mass of one hue, a small opposite held back.`),
        ` In ${harmony.accented} of my ${harmony.works} paintings a small patch of an opposite hue sits against the main color, most often a ${pattern.accentFamily} accent on a ${pattern.dominantFamily} mass (${pattern.works.length} of them, below).`),
      h('p', { class: 'ca-pair-proof' },
        `Neighboring hues make up ${percent(harmony.adjacent)} of the color I put side by side, against ${percent(harmony.chanceAdjacent)} if hues were drawn at random. Opposites make up ${percent(harmony.opposite)}, which is what chance alone gives (${percent(harmony.chanceOpposite)}): I gather related hues, and keep opposites for accents.`),
      h('div', { class: 'ca-strips ca-pair-works' }, pattern.works.map(renderStrip))));
};
