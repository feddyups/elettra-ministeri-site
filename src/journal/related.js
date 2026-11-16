/*
 * Where each Journal entry leads on to, beyond its postcard: the paintings that share its subject (slugs of src/works/catalogue.js), the series they come from, and
 * whether it is a personal piece that belongs beside the About page. Entries are keyed by the last part of their address. Related entries are not listed here: they
 * are worked out from the tags the entries share (journal-page.js).
 */
export const RELATED = {
  'ognuno-di-noi-porta-dentro-un-seme': { works: ['help', 'hes-raining-flowers', 'keep-looking-up'], about: true },
  'kzi0pdcts93bv987nmz4kbxsbyqg19': { series: 'human-figure', works: ['the-shape-of-beauty', 'the-bonding', 'keep-looking-up'], about: true },
  'ogni-nuovo-inizio-proviene-dalla-fine-di-un-altro-inizio-gennaio': { series: 'sicily', works: ['carretto', 'sole', 'santa-rosalia'], about: true },
  'dicembre-magico': { works: ['lighthouses', 'cloudy-lighthouse', 'sunburst'] },
  'cambio-di-stagione-settembre': { works: ['salty-sun', 'pomegranates', 'lemons'] },
  'riti-di-passaggio-misteri-eleusini': { works: ['pomegranates', 'scarab'] },
  'mare-storia-e-vitigni': { series: 'mediterranean', works: ['aegean-sea', 'lighthouses'] },
  'prima-della-partenza': { series: 'mediterranean', works: ['wave', 'sea-treasures'] },
  '1a-lezione-la-bandiera-della-croazia-1': { series: 'mediterranean', works: ['lighthouses', 'wave'] },
  'paese-che-vai-misteri-che-trovi': { series: 'mediterranean' },
  'blob-log-grog-and-smog': { about: true },
};
