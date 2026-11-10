/**
 * The body of work analysed for the color infographic.
 *
 * Each work names where its image comes from. A catalogue file (a path inside the
 * catalogue folder) is preferred because it is high resolution; otherwise the image
 * on the site is used. `crop` trims a photo that shows more than the artwork, as
 * fractions [left, top, right, bottom] of the image.
 *
 * `series` matches the series pages (see src/themes/tones.config.js). `anchor` is the id of the
 * work's entry on its series page, so a color can link to `<series page>#<anchor>`.
 */
const IMG = 'https://images.squarespace-cdn.com/content';
const SITE = '596fbc34c534a5fa937bd9bf';
const cdn = (path) => `${IMG}/v1/${SITE}/${path}?format=1500w`;
const cdnLegacy = (path) => `${IMG}/${SITE}/${path}?format=1500w`;

const sent = (file) => `sent/png/${file}`;

export const WORKS = [
  { id: 'lighthouses', anchor: 'lighthouses', title: 'Lighthouses in the open sea', series: 'mediterranean', onSite: true, catalogue: sent('14 Lighthouses in the open sea.png') },
  { id: 'wave', anchor: 'wave', title: 'Wave', series: 'mediterranean', onSite: true, catalogue: 'rectified/mediterranean-wave.jpg' },
  { id: 'flow', anchor: 'flow', title: 'Flow', series: 'mediterranean', onSite: true, catalogue: sent('07 Wave Flow Motion.png') },
  { id: 'pomegranates', anchor: 'pomegranates', title: 'Pomegranates', series: 'mediterranean', onSite: true, catalogue: sent('04 Pomenegrates.png') },
  { id: 'fishfit', anchor: 'fishfit', title: 'FishFit', series: 'mediterranean', onSite: true, catalogue: 'rectified/mediterranean-fishfit.jpg' },
  { id: 'medusa', anchor: 'medusa', title: 'Medusa', series: 'mediterranean', onSite: true, catalogue: 'rectified/mediterranean-medusa.jpg' },
  { id: 'vacanze-in-santorini', anchor: 'vacanze-in-santorini', title: 'Vacanze a Santorini', series: 'mediterranean', onSite: true, catalogue: 'rectified/archive-donkey-in-santorini.jpg' },

  { id: 'maternity-1', anchor: 'maternity-i', title: 'Maternity I', series: 'maternity', onSite: true, catalogue: 'rectified/maternity-i-v2.jpg' },
  { id: 'maternity-2', anchor: 'maternity-ii', title: 'Maternity II', series: 'maternity', onSite: true, catalogue: 'rectified/maternity-ii-v2.jpg' },
  { id: 'maternity-3', anchor: 'maternity-iii', title: 'Maternity III', series: 'maternity', onSite: true, catalogue: 'rectified/maternity-iii-v3.jpg' },

  { id: 'carretto', anchor: 'carretto', title: 'Carretto siciliano', series: 'sicily', onSite: true, catalogue: 'rectified/carretto-siciliano.jpg' },
  { id: 'pistacchi', anchor: 'pistacchi', title: 'Pistacchi', series: 'sicily', onSite: true, catalogue: 'rectified/pistacchi.jpg' },
  { id: 'sole', anchor: 'sole', title: 'Il sole', series: 'sicily', onSite: true, catalogue: 'rectified/il-sole.jpg' },
  { id: 'paladino-siciliano', anchor: 'paladino-siciliano', title: 'Paladino siciliano', series: 'sicily', onSite: true, catalogue: 'rectified/sicily-moor-head.jpg' },
  { id: 'santa-rosalia', anchor: 'santa-rosalia', title: 'Santa Rosalia', series: 'sicily', onSite: true, catalogue: 'rectified/sicily-lilies.jpg' },
  { id: 'cart-wheel', anchor: 'cart-wheel', title: 'Cart wheel', series: 'sicily', onSite: true, catalogue: 'rectified/sicilian-wheel-masked-for-analysis.jpg' },
  { id: 'sunburst', anchor: 'sunburst', title: 'Sunburst', series: 'sicily', onSite: true, catalogue: 'rectified/sicily-sunburst.jpg' },

  { id: 'bonding', anchor: 'the-bonding', title: 'The Bonding', series: 'human-figure', onSite: true, catalogue: sent('09 The Bonding.png') },
  { id: 'hug-1', anchor: 'amore-e-pandemia-i', title: 'Amore e Pandemia I', series: 'human-figure', onSite: true, catalogue: sent('01 The Hug.png') },
  { id: 'hug-2', anchor: 'amore-e-pandemia-ii', title: 'Amore e Pandemia II', series: 'human-figure', onSite: true, catalogue: sent('02 The Hug.png') },

  { id: 'help', anchor: 'help', title: 'Help', series: 'archive', onSite: true, catalogue: 'rectified/archive-help.jpg' },
  { id: 'messengers', anchor: 'messengers-of-love', title: 'Messengers of Love', series: 'archive', onSite: true, catalogue: 'rectified/archive-messengers-of-love.jpg' },

  { id: 'keep-looking-up', anchor: 'keep-looking-up', title: 'Keep looking up', series: 'human-figure', onSite: true, catalogue: 'rectified/keep-looking-up-v2.jpg' },
  { id: 'raining-flowers', anchor: 'hes-raining-flowers', title: "He's raining Flowers", series: 'human-figure', onSite: true, catalogue: sent("11 He's raining Flowers.png") },
  { id: 'shape-of-beauty', anchor: 'the-shape-of-beauty', title: 'The Shape of Beauty', series: 'maternity', onSite: true, catalogue: sent('12 The Shape of Beauty.png') },
  { id: 'rainbow-cacti', anchor: 'rainbow-and-cacti', title: 'Rainbow and cacti', series: 'archive', onSite: true, catalogue: sent('13.png') },
  { id: 'lilies', anchor: 'lilies', title: 'Lilies', series: 'archive', onSite: true, catalogue: 'rectified/archive-lilies.jpg' },
  { id: 'lemons', anchor: 'lemons', title: 'Lemons', series: 'archive', onSite: true, catalogue: 'rectified/archive-lemons.jpg' },
  { id: 'cactus-in-the-desert', anchor: 'cactus-in-the-desert', title: 'Cactus in the desert', series: 'archive', onSite: true, catalogue: 'rectified/archive-cactus-in-the-desert.jpg' },
  { id: 'seahorse', anchor: 'seahorse', title: 'Seahorse', series: 'archive', onSite: true, catalogue: 'rectified/archive-seahorse.jpg' },
  { id: 'swan-in-a-shell', anchor: 'swan-in-a-shell', title: 'Swan inside a shell', series: 'archive', onSite: true, catalogue: 'rectified/archive-swan-in-a-shell.jpg' },
  { id: 'rainbow-shell', anchor: 'rainbow-shell', title: 'Rainbow shell', series: 'archive', onSite: true, catalogue: 'rectified/archive-rainbow-shell.jpg' },
  { id: 'heart-in-hand', anchor: 'heart-in-hand', title: 'Heart in hand', series: 'archive', onSite: true, catalogue: 'rectified/archive-heart-in-hand.jpg' },
  { id: 'scio', anchor: 'scio', title: 'Sciò', series: 'archive', onSite: true, catalogue: 'rectified/archive-scio.jpg' },
  { id: 'scarab', anchor: 'scarab', title: 'Scarab', series: 'archive', onSite: true, catalogue: '12.jpg', crop: [0.14, 0.11, 0.93, 0.88] },
  { id: 'textile-mask', anchor: 'mask-divine', title: 'Mask Divine', series: 'textiles', onSite: true, material: 'textile', catalogue: sent('08.png'), crop: [0.10, 0.26, 0.90, 0.96] },
  { id: 'saguaro', anchor: 'saguaro', title: 'Saguaro', series: 'textiles', onSite: true, material: 'textile', catalogue: 'rectified/textile-saguaro-v2.jpg', crop: [0.08, 0.04, 0.94, 0.80] },
  { id: 'by-the-window', anchor: 'by-the-window', title: 'By the window', series: 'textiles', onSite: true, material: 'textile', catalogue: 'rectified/textile-seated-figure-v2.jpg', crop: [0.05, 0.14, 0.93, 0.91] },
];
