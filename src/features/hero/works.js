const CDN = 'https://images.squarespace-cdn.com/content';
const SITE = '596fbc34c534a5fa937bd9bf';
const v1 = (path) => `${CDN}/v1/${SITE}/${path}`;
const v0 = (path) => `${CDN}/${SITE}/${path}`;

/** The paintings the hero slideshow cycles through, in order. */
export const WORKS = [
  {
    series: 'Mediterranean',
    title: 'Lighthouses in the open sea',
    meta: 'Acrylic on canvas · 100 × 50 cm · Zürich, 2020',
    href: '/paintings/mediterranean',
    image: v1('f579f6ec-e9d0-4f53-a90e-01a221511ff5/Lighthouses_in_the_open_sea.jpg?format=2500w'),
    alt: 'Lighthouses in the open sea, acrylic on canvas by Elettra Ministeri',
  },
  {
    series: 'Maternity',
    title: 'Maternity II',
    meta: 'Acrylic on canvas · 50 × 70 cm',
    href: '/paintings/maternity',
    image: v1('9973033c-2b50-4c30-8ff6-89088a5f9c7b/maternity+II.jpg?format=2000w'),
    alt: 'Maternity II, acrylic on canvas by Elettra Ministeri',
  },
  {
    series: 'Sicily',
    title: 'Carretto siciliano',
    meta: 'Acrylic on canvas · hand-painted frame',
    href: '/paintings/sicily',
    image: v0('d0403442-5dd2-4b6c-8c1b-93b9b2388298/carretto-siciliano-v2.jpg?format=2000w'),
    alt: 'Carretto siciliano, a painted Sicilian cart and horse in a hand-painted frame, by Elettra Ministeri',
  },
  {
    series: 'Human figure',
    title: 'The Bonding',
    meta: 'Acrylic on canvas · 116 × 73 cm',
    href: '/paintings/human-figure',
    image: v1('1619440724228-0ZEOJ7JXZYDOZFJ4UK4M/thebonding_1.jpg?format=2000w'),
    alt: 'The Bonding, two intertwined figures lifting a blue sphere, acrylic on canvas by Elettra Ministeri',
  },
  {
    series: 'Archive',
    title: 'Help',
    meta: 'Acrylic on textured paper · 32 × 25 cm',
    href: '/paintings/archive',
    image: v1('1528638090169-3WYNVACGH7G9O9XEUX92/help.jpg?format=2000w'),
    alt: 'Help, a red hand and a blue hand reaching through green leaves, acrylic on textured paper, by Elettra Ministeri',
  },
];
