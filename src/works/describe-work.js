import { joinNames } from '../color/text.js';
import { readPalette } from '../lib/color-harmony.js';

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
  const intensity = work.vivid >= 40 ? 'vivid' : work.vivid >= 15 ? 'lively' : 'muted';
  const extra = standouts(work, peers, seriesLabel);
  const reading = readPalette(work.palette);
  const percent = Math.round(reading.dominantShare * 100);
  const build = [
    reading.partner && `its ${reading.dominant.name} is met by an opposite of nearly equal weight, ${reading.partner.name}`,
    reading.accent && `a small ${reading.accent.name} accent set against its ${reading.dominant.name}`,
    reading.gathered && 'colors gathered in neighboring hues',
    reading.carried && `${reading.dominant.name} alone covers ${percent}% of it`,
  ].filter(Boolean);
  return {
    build: build.length ? `In how it is built: ${build.join('; ')}.` : null,
    sentence: `Built mostly from ${names}. A ${intensity}, ${temperature} painting: ${work.warm}% warm, ${work.cool + work.violet}% cool, ${work.vivid}% vivid.`,
    standout: extra.length ? `It is ${extra.join(' and ')}.` : null,
  };
};
