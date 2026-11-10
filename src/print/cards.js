const CDN = 'https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf';

/**
 * The postcards of "Scrivo una cartolina", the monthly project of September 2017 to August 2018: one postcard a month, each with the
 * story behind it on the blog (`post`). The pictures are in the Asset Library; `src` is the address without a size.
 */
export const CARDS = [
  {
    month: 'September', year: 2017,
    src: `${CDN}/1512506571294-W8A6I2QG6804JNIJLVEN/Settembre_FINAL.jpg`, width: 827, height: 1102,
    alt: 'September: a white outlined woman with a sunflower for a head, holding an orange cloth, among grapes, autumn leaves, mushrooms and berries, with the sign of Virgo on her belly',
    post: { title: 'Cambio di stagione. Settembre', href: '/blog/2017/9/2/cambio-di-stagione-settembre' },
  },
  {
    month: 'October', year: 2017,
    src: `${CDN}/1512506581811-F9FFQD4GH6I2DFD53MZT/ottobre_FINAL.jpg`, width: 827, height: 1102,
    alt: 'October: two women under a crescent moon, one raising a glowing staff, above a row of pumpkins on a dark ground',
    post: { title: 'L’antico culto dei Misteri Eleusini', href: '/blog/2017/10/3/riti-di-passaggio-misteri-eleusini' },
  },
  {
    month: 'November', year: 2017,
    src: `${CDN}/1512506598075-CLNGQQOKNGMM6L0UITCX/novembre_FINAL.jpg`, width: 906, height: 1181,
    alt: 'November: a skeleton lady in a purple hat and a green dress holding a bouquet of marigolds, beside white flower shapes on black',
    post: { title: 'Tra il sacro e il profano: simboli del Dìa de Muertos', href: '/blog/2017/11/14/tra-il-sacro-e-il-profano-simboli-del-da-de-muertos-kydg3' },
  },
  {
    month: 'December', year: 2017,
    src: `${CDN}/1512506625581-4D46KM5PPP9O5WIH0DT0/cartolina_FINAL.jpg`, width: 906, height: 1181,
    alt: 'December: a woman in a long pale blue dress walking with a lantern through a snowy turquoise forest',
    post: { title: 'La magia della Luce. Dicembre', href: '/blog/2017/11/20/dicembre-magico' },
  },
  {
    month: 'January', year: 2018,
    src: `${CDN}/1518017809946-204D5HS5L6JKZJIJN853/gennaio_FINAL.jpg`, width: 906, height: 1181,
    alt: 'January: a woman seen from behind opening a deep blue door, a small golden object in her hand, in a room with a pomegranate-patterned wall',
    post: { title: 'Gennaio, ciò che lascio, ciò che trovo', href: '/blog/2018/1/8/ogni-nuovo-inizio-proviene-dalla-fine-di-un-altro-inizio-gennaio' },
  },
  {
    month: 'February', year: 2018,
    src: `${CDN}/1519169661790-K6UKRLWOJQTKBBFRBETE/febbraio_FINAL.jpg`, width: 906, height: 1181,
    alt: 'February: two mermaids raising their arms to meet above the sea, with the sign of Pisces over them',
    post: { title: 'Stare sulla testa, poi su due piedi ed infine su uno', href: '/blog/2018/2/11/kzi0pdcts93bv987nmz4kbxsbyqg19' },
  },
];
