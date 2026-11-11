/**
 * The sets the artist made together, shown when her sheet cannot be read or has no "Set" column. A set is a few paintings made as a group (a pair or a
 * triplet, a family of frames, or one painting given a heading of its own): the palettes of a set are coordinated, and a painting belongs to at most one set. In her sheet, paintings with the same text in
 * the "Set" column belong together (a "Set description" column gives the set its short text), and what is written there replaces this list. `works` are page addresses, in the order the set is read.
 */
export const DEFAULT_SETS = [
  { label: 'Maternity', description: 'Three paintings on motherhood, made together in one family of colors.', works: ['maternity-i', 'maternity-ii', 'maternity-iii'] },
  { label: 'Bonds', description: 'Three paintings of two figures together, in one key of red, green and blue: two embraces and a sphere lifted by both.', works: ['amore-e-pandemia-i', 'amore-e-pandemia-ii', 'the-bonding'] },
  { label: 'Talismans', description: 'Three small paintings of luck and protection: a horn, a hand holding a heart, and a scarab lifting the sun, on green nights of stars and gems.', works: ['heart-in-hand', 'scarab', 'scio'] },
  { label: 'Messengers of Love', description: 'Two doves shaped like hands, facing each other inside a red heart: a message arriving in a time of great deprivation.', works: ['messengers-of-love'] },
  { label: 'Icons of Sicily', description: 'Six paintings of the emblems of Sicily: the painted cart and its wheel, pistachios, the sun, the paladino and Santa Rosalia.', works: ['carretto', 'cart-wheel', 'pistacchi', 'sole', 'paladino-siciliano', 'santa-rosalia'] },
];
