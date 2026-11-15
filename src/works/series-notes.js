import { CATALOGUE } from './catalogue.js';

/**
 * What the site says about each series in one place: a line about it and the painting that stands for it
 * (its tile on the Paintings page, its chapter on the home page); `intro` holds the paragraphs under the heading of its page and `media` the line of materials under its home chapter; `home` is a line for the home chapter when it should say something other than `note`. Everything else about a series (its works, counts,
 * colors, media) is worked out from the catalogue and the color analysis.
 */
export const SERIES_NOTES = {
  mediterranean: { media: "Acrylic on canvas", intro: ["The Mediterranean is the sea I grew up beside, and the sea that joins the places around it. Waves, fish, shells, lighthouses, whitewashed islands and a table set in the sun come back again and again, painted in saturated color the way the Mediterranean feels rather than the way it looks."], cover: 'wave', note: 'The sea I grew up beside and the places around it: waves, shells, fish, whitewashed islands and a table set in the sun.', home: 'The sea I grew up beside and the places around it: waves, shells and fish, lighthouses, whitewashed islands and a table set in the sun.' },
  maternity: { media: "Watercolor on watercolor paper", intro: ["These paintings, Maternity I, Maternity II, and Maternity III, reflect my own pregnancy journey. They show the real experiences of pregnancy, avoiding idealized images.", "These artworks boldly show the challenges, strength, and beauty of maternity. They aim to start conversations and help people appreciate the diverse experiences of pregnancy.", "As a woman artist, I believe art can challenge stereotypes and empower people. Through the Maternity Series, I want to discuss body positivity, agency, and the different aspects of womanhood."], cover: 'maternity-ii', note: 'Pregnancy as it is lived: body, strength and agency.' },
  sicily: { media: "Acrylic on canvas and painted wood · frames painted by hand", intro: ["This series is a tribute to the island where I was born: Sicily. A land of fire and sea at the center of the Mediterranean, a blend of cultures and peoples, through the centuries and for centuries.", "Free, chaotic, colorful, warm, curious and loud, the Sicilian style is a form of folk art, established and unmistakable.", "To strengthen and enhance the vividness of its elements, the frame has become an integral part of the work. **The frames in this collection are painted by hand.**"], cover: 'carretto', note: 'A tribute to the island of my birth, set in hand-painted frames.' },
  'human-figure': { media: "Acrylic on canvas and canvas pad", intro: ["These figures have no faces, and I paint them in colors chosen for the feeling rather than the likeness. What remains is the gesture."], cover: 'amore-e-pandemia-i', note: 'Figures without faces, painted in colors chosen for the feeling, not the likeness. What remains is the gesture.' },
  archive: { media: "Acrylic, watercolor and pastel", intro: ["An exploration of many styles and themes: works that stand on their own, outside a series. This page grows as more of the studio is catalogued."], cover: 'help', note: 'An exploration of many styles and themes: works that stand on their own, outside a series.' },
  textiles: { cover: 'mask-divine', note: 'Color you can touch: felt, buttons and thread.' },
};

/** The works of a series, in catalogue order: `[slug, work]` pairs. */
export const worksOfSeries = (series) => Object.entries(CATALOGUE).filter(([, work]) => work.series === series);

/** The address of a work's picture at a given width. */
export const pictureAt = (work, width) => `${work.image.src}?format=${width}w`;

/** The picture that stands for a series, at a given width (the first work of the series if the chosen cover is gone). */
export const coverOf = (series, width) => {
  const chosen = CATALOGUE[(SERIES_NOTES[series] || {}).cover];
  const work = chosen && chosen.series === series ? chosen : (worksOfSeries(series)[0] || [])[1];
  return work ? pictureAt(work, width) : null;
};

/** A work of the series chosen at random, as `[slug, work]` (or null for a series without works): a different one on each visit. */
export const randomWorkOf = (series) => {
  const works = worksOfSeries(series);
  return works.length ? works[Math.floor(Math.random() * works.length)] : null;
};
