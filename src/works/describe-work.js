import { joinNames } from '../color/text.js';
import { vividWord } from '../color/gist.js';

const lean = (work) => work.warm - work.cool - work.violet;

/** Where a painting stands among its series, as phrases ("the warmest of the Maternity works"). */
const standouts = (work, peers, seriesLabel) => {
  if (peers.length < 3) return [];
  const rank = (key, high, low) => {
    const sorted = [...peers].sort((a, b) => key(b) - key(a));
    if (sorted[0].slug === work.slug) return `the ${high} of the ${seriesLabel} works`;
    if (sorted[sorted.length - 1].slug === work.slug) return `the ${low} of the ${seriesLabel} works`;
    return null;
  };
  return [rank(lean, 'warmest', 'coolest'), rank((w) => w.chroma, 'most saturated', 'most muted')].filter(Boolean);
};

/** A plain-language reading of a painting's colors, built from its numbers. */
export const describeWork = (work, peers, seriesLabel) => {
  const names = joinNames(work.palette.slice(0, 3).map(([, name]) => name));
  const temperature = lean(work) >= 40 ? 'warm' : lean(work) <= -25 ? 'cool' : 'balanced';
  const extra = standouts(work, peers, seriesLabel);
  return {
    sentence: `Built mostly from ${names}. A ${vividWord(work.vivid)}, ${temperature} painting.`,
    standout: extra.length ? `It is ${extra.join(' and ')}.` : null,
  };
};
