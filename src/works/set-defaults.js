/**
 * The sets the artist made together, shown when her sheet cannot be read or has no "Set" column. A set is a few paintings made as a group (a pair or a
 * triplet, a family of frames): their palettes are coordinated, and a painting belongs to at most one set. In her sheet, paintings with the same text in
 * the "Set" column belong together (a "Set description" column gives the set its short text), and what is written there replaces this list. `works` are page addresses, in the order the set is read.
 */
export const DEFAULT_SETS = [
  { label: 'Maternity', description: 'Three paintings on motherhood, made together in one family of colors.', works: ['maternity-i', 'maternity-ii', 'maternity-iii'] },
  { label: 'Amore e Pandemia', description: 'Two paintings made together, on love in the time of the pandemic.', works: ['amore-e-pandemia-i', 'amore-e-pandemia-ii'] },
  { label: 'Icons of Sicily', description: 'Six paintings of the emblems of Sicily: the painted cart and its wheel, pistachios, the sun, the paladino and Santa Rosalia.', works: ['carretto', 'cart-wheel', 'pistacchi', 'sole', 'paladino-siciliano', 'santa-rosalia'] },
];
