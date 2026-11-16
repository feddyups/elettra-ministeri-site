/*
 * The Journal entries that belong to a monthly postcard of "Scrivo una cartolina" (print/cards.js). An entry shows its postcard at the end, and the
 * postcard's page links to its entries. `english` is the title in English, since the entries are in Italian. `role` is 'story' for the article a card's story comes from (the full text, in Italian) and 'companion' for
 * another piece written around the same month, with `note` saying in a line what it is.
 */
export const ENTRIES = [
  { path: "/blog/2017/9/2/cambio-di-stagione-settembre", title: "Cambio di stagione. Settembre", english: "A change of season. September", card: 'september', role: 'story' },
  { path: "/blog/2017/10/2/poesia-di-ottobre", title: "Poesia di Ottobre", english: "A poem for October", card: 'october', role: 'companion', note: 'A short poem for the month: October and Autumn as two old friends at a bar.' },
  { path: "/blog/2017/10/3/riti-di-passaggio-misteri-eleusini", title: "L'antico culto dei Misteri Eleusini", english: "The ancient cult of the Eleusinian Mysteries", card: 'october', role: 'story' },
  { path: "/blog/2017/10/19/la-vita-eterna-del-ricordo-da-de-muertos-1-crt27", title: "La vita eterna del ricordo", english: "The eternal life of remembrance", card: 'november', role: 'companion', note: 'Where the Day of the Dead comes from: pre-Columbian rites, the Spanish conquest, and why Mexico meets death with joy.' },
  { path: "/blog/2017/10/27/quando-nostalgia-e-divertimento-vanno-di-pari-passo", title: "Día de Muertos", english: "Día de Muertos", card: 'november', role: 'companion', note: 'A walk through Mexico City on the first of November, with a skull to print and color.' },
  { path: "/blog/2017/11/14/tra-il-sacro-e-il-profano-simboli-del-da-de-muertos-kydg3", title: "Tra il sacro e il profano: simboli del Dìa de Muertos", english: "Between the sacred and the profane: symbols of the Día de Muertos", card: 'november', role: 'story' },
  { path: "/blog/2017/11/20/dicembre-magico", title: "La magia della Luce. Dicembre", english: "The magic of Light. December", card: 'december', role: 'story' },
  { path: "/blog/2018/1/8/ogni-nuovo-inizio-proviene-dalla-fine-di-un-altro-inizio-gennaio", title: "Gennaio, ciò che lascio, ciò che trovo", english: "January: what I leave, what I find", card: 'january', role: 'story' },
  { path: "/blog/2018/2/11/kzi0pdcts93bv987nmz4kbxsbyqg19", title: "Stare sulla testa, poi su due piedi ed infine su uno", english: "Standing on your head, then on two feet, then on one", card: 'february', role: 'story' },
];

/** The entry that introduces the project itself, and the filter of the Journal that lists every article written for it. */
export const PROJECT_PATH = '/blog/2017/11/29/scrivo-una-cartolina-il-progetto';
export const PROJECT_ARTICLES = '/blog/category/scrivo+una+cartolina';

const lastPart = (path) => path.replace(/\/$/, '').split('/').filter(Boolean).pop();

export const PROJECT_ENTRY = lastPart(PROJECT_PATH);

/** The postcard (its `slug`) an entry belongs to, by the last part of the entry's address. */
export const ENTRY_CARDS = Object.fromEntries(ENTRIES.map((entry) => [lastPart(entry.path), entry.card]));

/** The entries of a postcard's month, as `{ path, title, english, role, note }`. */
export const entriesOfCard = (slug) => ENTRIES.filter((entry) => entry.card === slug);
