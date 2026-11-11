/**
 * The sets the artist made together, shown when her sheet cannot be read or has no "Set" column. A set is a few paintings made as a group (a pair or a
 * triplet, a family of frames): their palettes are coordinated, and a painting belongs to at most one set. In her sheet, paintings with the same text in
 * the "Set" column belong together, and what is written there replaces this list. `works` are page addresses, in the order the set is read.
 */
export const DEFAULT_SETS = [
  { label: 'Maternity', works: ['maternity-i', 'maternity-ii', 'maternity-iii'] },
  { label: 'Amore e Pandemia', works: ['amore-e-pandemia-i', 'amore-e-pandemia-ii'] },
  { label: 'Sicilian frames', works: ['carretto', 'pistacchi', 'sole', 'paladino-siciliano', 'santa-rosalia'] },
];
