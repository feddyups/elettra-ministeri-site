import { PRESETS, PRESET_IDS, DEFAULT_PRESET } from './tones.generated.js';

/**
 * A visitor's choice of background for a page (the palette button in the header, theme/tone-control.js).
 * The choice is made per series (and for the page of all paintings) and is kept in the browser: the preset's name is stored, never a color, so a
 * change to a preset reaches everyone who chose it. Storage can be blocked or empty (a private window), so every read and write is guarded and the
 * default preset is shown when there is nothing to read.
 */
const keyOf = (series) => `em-tone-${series}`;

/** The preset a visitor chose for a series, or null when they have not chosen (or storage cannot be read). */
export const storedPreset = (series) => {
  try {
    const id = localStorage.getItem(keyOf(series));
    return PRESET_IDS.includes(id) ? id : null;
  } catch (e) { return null; }
};

/** The preset in force for a series: the visitor's choice, else the default. */
export const presetOf = (series) => storedPreset(series) || DEFAULT_PRESET;

/** The tone (`bg`, `alt`, `fg`) in force for a series or for `all`, or undefined for a page that has none. */
export const toneOf = (series) => (PRESETS[series] ? PRESETS[series][presetOf(series)] : undefined);

/** Whether a page has presets to choose between. */
export const hasPresets = (series) => Boolean(PRESETS[series]);

/**
 * Shows a preset on the page at once, keeps it for the next visit, and tells the parts of the page that draw their own colors
 * (the `em-tone-change` event carries the series and the preset).
 */
export const choosePreset = (series, id) => {
  if (!PRESET_IDS.includes(id) || !hasPresets(series)) return;
  const root = document.documentElement;
  if (id === DEFAULT_PRESET) root.removeAttribute('data-tone'); else root.setAttribute('data-tone', id);
  try { localStorage.setItem(keyOf(series), id); } catch (e) { /* the choice still holds for this visit */ }
  dispatchEvent(new CustomEvent('em-tone-change', { detail: { series, preset: id } }));
};
