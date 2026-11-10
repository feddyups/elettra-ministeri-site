import { CATALOGUE } from '../works/catalogue.js';

/**
 * What each work is about, read from its title, its description and its series. These are rules, not hand-made tags:
 * a work can match several subjects or none. Change the rules here and every chart on the Paintings page follows.
 */
export const SUBJECTS = [
  { key: 'sea', label: 'The sea and its shells', test: (text) => /\b(sea|waves?|fish|shells?|seahorse|jellyfish|coral|lighthouses?|swan)\b/i.test(text) },
  { key: 'figures', label: 'Figures and bodies', test: (text, work) => work.series === 'maternity' || work.series === 'human-figure' || /\b(figures?|woman|man|body|bodies|hug|bonding|hands?|face|santa|rosalia|head)\b/i.test(text) },
  { key: 'plants', label: 'Plants and fruit', test: (text) => /\b(flowers?|lil(?:y|ies)|lemons?|pomegranates?|pistachios?|cactus|cacti|leaf|leaves|jungle|garden|fruit|roses?)\b/i.test(text) },
  { key: 'animals', label: 'Animals', test: (text) => /\b(horse|seahorse|fish|swan|doves?|birds?|scarab|beetle|donkey)\b/i.test(text) },
  { key: 'sun', label: 'Sun, sky and rainbows', test: (text) => /\b(sun|sole|rainbow|clouds?|sky|stars?)\b/i.test(text) },
  { key: 'folk', label: 'Sicilian folk art', test: (text, work) => work.series === 'sicily' || /\b(sicil\w*|carretto|cart)\b/i.test(text) },
];

/** The subjects a work matches, as keys. */
export const subjectsOf = (slug) => {
  const work = CATALOGUE[slug];
  if (!work) return [];
  // the frame is not the subject: the description is read up to where it starts describing the frame
  const described = (work.alt || '').split(/\b(?:inside|in) (?:a |an )?(?:hand-painted|red frame|deep blue frame)/i)[0];
  const text = `${work.title}. ${described}`;
  return SUBJECTS.filter((subject) => subject.test(text, work)).map((subject) => subject.key);
};

/** The way a work was made, in a few plain groups. */
export const MEDIA = [
  { key: 'canvas', label: 'Acrylic on canvas', test: (m) => /canvas/i.test(m) && !/paper/i.test(m) },
  { key: 'paper', label: 'Acrylic on paper', test: (m) => /acrylic/i.test(m) && /paper/i.test(m) },
  { key: 'watercolor', label: 'Watercolor on vintage paper', test: (m) => /watercolor/i.test(m) },
  { key: 'pastel', label: 'Oil pastel on handmade paper', test: (m) => /pastel/i.test(m) },
  { key: 'felt', label: 'Felt, buttons and linen', test: (m) => /felt/i.test(m) },
  { key: 'wood', label: 'Painted wood', test: (m) => /wood/i.test(m) },
];

export const mediumOf = (slug) => {
  const work = CATALOGUE[slug];
  const kind = work && MEDIA.find((m) => m.test(work.medium));
  return kind ? kind.key : null;
};
