/*
 * The Journal entries that belong to a monthly postcard of "Scrivo una cartolina" (print/cards.js). An entry shows its postcard at the end, and the
 * postcard's page links to its entries.
 */
export const ENTRIES = [
  { path: "/blog/2017/9/2/cambio-di-stagione-settembre", title: "Cambio di stagione. Settembre", card: 'september' },
  { path: "/blog/2017/10/2/poesia-di-ottobre", title: "Poesia di Ottobre", card: 'october' },
  { path: "/blog/2017/10/3/riti-di-passaggio-misteri-eleusini", title: "L'antico culto dei Misteri Eleusini", card: 'october' },
  { path: "/blog/2017/11/14/tra-il-sacro-e-il-profano-simboli-del-da-de-muertos-kydg3", title: "Tra il sacro e il profano: simboli del Dìa de Muertos", card: 'november' },
  { path: "/blog/2017/11/20/dicembre-magico", title: "La magia della Luce. Dicembre", card: 'december' },
  { path: "/blog/2018/1/8/ogni-nuovo-inizio-proviene-dalla-fine-di-un-altro-inizio-gennaio", title: "Gennaio, ciò che lascio, ciò che trovo", card: 'january' },
  { path: "/blog/2018/2/11/kzi0pdcts93bv987nmz4kbxsbyqg19", title: "Stare sulla testa, poi su due piedi ed infine su uno", card: 'february' },
];

/** The entry that introduces the project itself. */
export const PROJECT_ENTRY = 'scrivo-una-cartolina-il-progetto';

const lastPart = (path) => path.replace(/\/$/, '').split('/').filter(Boolean).pop();

/** The postcard (its `slug`) an entry belongs to, by the last part of the entry's address. */
export const ENTRY_CARDS = Object.fromEntries(ENTRIES.map((entry) => [lastPart(entry.path), entry.card]));

/** The entries of a postcard's month, as `{ path, title }`. */
export const entriesOfCard = (slug) => ENTRIES.filter((entry) => entry.card === slug);
