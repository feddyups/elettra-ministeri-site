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
  { id: 'wave', anchor: 'wave', title: 'Wave', series: 'mediterranean', onSite: true, url: cdn('1528638173689-P8T0RMNYOWAKAER05R02/wave.jpg') },
  { id: 'flow', anchor: 'flow', title: 'Flow', series: 'mediterranean', onSite: true, catalogue: sent('07 Wave Flow Motion.png') },
  { id: 'pomegranates', anchor: 'pomegranates', title: 'Pomegranates', series: 'mediterranean', onSite: true, catalogue: sent('04 Pomenegrates.png') },
  { id: 'fishfit', anchor: 'fishfit', title: 'FishFit', series: 'mediterranean', onSite: true, url: cdn('1528638232839-OQIJ0LNO8CM609E5DQT3/fish_fit.jpg') },

  { id: 'maternity-1', anchor: 'maternity-i', title: 'Maternity I', series: 'maternity', onSite: true, catalogue: sent('05 Maternity I.png') },
  { id: 'maternity-2', anchor: 'maternity-ii', title: 'Maternity II', series: 'maternity', onSite: true, catalogue: sent('06 Maternity II.png') },
  { id: 'maternity-3', anchor: 'maternity-iii', title: 'Maternity III', series: 'maternity', onSite: true, url: cdn('1706395444458-IDVDZH17PKKRSE1QCNTQ/maternity+III.jpg') },

  { id: 'carretto', anchor: 'carretto', title: 'Carretto siciliano', series: 'sicily', onSite: true, url: cdnLegacy('8b291fd7-893e-4537-b1e8-9aa92c587177/carretto.jpg') },
  { id: 'pistacchi', anchor: 'pistacchi', title: 'Pistacchi', series: 'sicily', onSite: true, url: cdnLegacy('489625cb-1c9d-4bbd-9191-7b925e86ffd8/pistacchi.jpg') },
  { id: 'sole', anchor: 'sole', title: 'Il sole', series: 'sicily', onSite: true, url: cdnLegacy('70b83ee7-7ffe-44c9-a374-0687b055c447/sole.jpg') },

  { id: 'bonding', anchor: 'the-bonding', title: 'The Bonding', series: 'human-figure', onSite: true, catalogue: sent('09 The Bonding.png') },
  { id: 'hug-1', anchor: 'amore-e-pandemia-i', title: 'Amore e Pandemia I', series: 'human-figure', onSite: true, catalogue: sent('01 The Hug.png') },
  { id: 'hug-2', anchor: 'amore-e-pandemia-ii', title: 'Amore e Pandemia II', series: 'human-figure', onSite: true, catalogue: sent('02 The Hug.png') },

  { id: 'help', anchor: 'help', title: 'Help', series: 'archive', onSite: true, url: cdn('1528638090169-3WYNVACGH7G9O9XEUX92/help.jpg') },
  { id: 'messengers', anchor: 'messengers-of-love', title: 'Messengers of Love', series: 'archive', onSite: true, catalogue: sent('03 Messengers of Love.png') },

  { id: 'keep-looking-up', anchor: 'keep-looking-up', title: 'Keep looking up', series: 'human-figure', onSite: true, catalogue: sent('10 Keep looking up.png') },
  { id: 'raining-flowers', anchor: 'hes-raining-flowers', title: "He's raining Flowers", series: 'human-figure', onSite: true, catalogue: sent("11 He's raining Flowers.png") },
  { id: 'shape-of-beauty', anchor: 'the-shape-of-beauty', title: 'The Shape of Beauty', series: 'maternity', onSite: true, catalogue: sent('12 The Shape of Beauty.png') },
  { id: 'rainbow-cacti', anchor: 'rainbow-and-cacti', title: 'Rainbow and cacti', series: 'archive', onSite: true, catalogue: sent('13.png') },
  { id: 'scarab', anchor: 'scarab', title: 'Scarab', series: 'archive', onSite: true, catalogue: '12.jpg', crop: [0.14, 0.11, 0.93, 0.88] },
  { id: 'textile-mask', anchor: 'mask-divine', title: 'Mask Divine', series: 'textiles', onSite: true, material: 'textile', catalogue: sent('08.png'), crop: [0.10, 0.26, 0.90, 0.96] },
];
