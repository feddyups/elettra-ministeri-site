/**
 * The sets the artist made together, shown when her sheet cannot be read or has no "Set" column. A set is a few paintings made as a group (a pair or a
 * triplet, a family of frames, or one painting given a heading of its own): the palettes of a set are coordinated, and a painting belongs to at most one set. In her sheet, paintings with the same text in
 * the "Set" column belong together (a "Set description" column gives the set its short text), and what is written there replaces this list. `works` are page addresses, in the order the set is read.
 */
export const DEFAULT_SETS = [
  { label: 'Maternity', description: 'Pregnancy as it is lived: strength, change and tenderness, without idealizing.', works: ['maternity-i', 'maternity-ii', 'maternity-iii'] },
  { label: 'Bonds', description: 'What passes between two people: the embrace, the shared weight, the gesture that holds.', works: ['amore-e-pandemia-i', 'amore-e-pandemia-ii', 'the-bonding'] },
  { label: 'Talismans', description: 'Small charms for luck and protection, glittering against the night.', works: ['heart-in-hand', 'scarab', 'scio'] },
  { label: 'Messengers of Love', description: 'A message of love, arriving when it is needed most.', works: ['messengers-of-love'] },
  { label: 'Works on Paper', description: 'Color on paper: small, intimate works where the hand stays close to the surface.', works: ['cactus-in-the-desert', 'help', 'lemons', 'lilies', 'rainbow-and-cacti', 'rainbow-shell', 'seahorse', 'swan-in-a-shell'] },
  { label: 'Icons of Sicily', description: 'The island\'s emblems, painted as vividly as Sicily itself.', works: ['carretto', 'cart-wheel', 'pistacchi', 'sole', 'paladino-siciliano', 'santa-rosalia'] },
];
