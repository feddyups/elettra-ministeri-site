const CDN = 'https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf';

/**
 * The postcards of "Scrivo una cartolina" ("I write a postcard"): one illustration for each month, with a story behind it. Each card is its own
 * page (/print/<slug>); `dek` is the line under its title, `epigraph` a quotation that opens its story (as a book chapter may), `article` the story in a few sentences, in the artist's voice, and `prompt` a question to start the message on the back. The pictures are in the Asset Library;
 * `src` is the address without a size.
 */
export const CARDS = [
  {
    slug: 'september', year: 2017, month: 'September', title: 'A change of season',
    dek: "A goodbye to summer, and a welcome to the autumn that follows.",
    epigraph: { lines: ["September days are here,", "with summer’s best of weather", "and autumn’s best of cheer."], by: "Helen Hunt Jackson" },
    src: `${CDN}/1512506571294-W8A6I2QG6804JNIJLVEN/Settembre_FINAL.jpg`, width: 827, height: 1102,
    alt: 'September: a white outlined woman with a sunflower for a head, holding an orange cloth, among grapes, autumn leaves, mushrooms and berries, with the sign of Virgo on her belly',
    article: [
      "September is when summer gives way to autumn, and this card is my goodbye to summer. I write about leaving it the way you leave a lover’s room after a few days together: you look at everything one last time, then walk out slowly, carrying the love with you. Summer is never a goodbye, only a see you soon, and its colors stay behind on the leaves of autumn.",
    ],
    prompt: 'What are you taking with you from the summer?',
  },
  {
    slug: 'october', year: 2017, month: 'October', title: 'The Eleusinian Mysteries',
    dek: "The ancient Greek feast of entering the darkness and coming out toward the light.",
    epigraph: { lines: ["The ant found a grain of wheat and took it.", "The wheat, feeling itself taken, cried out:", "“If you do me the favor of letting me have my wish to be born,", "I will give you a hundred of myself.”", "And so it was done."], by: "Leonardo da Vinci" },
    src: `${CDN}/1512506581811-F9FFQD4GH6I2DFD53MZT/ottobre_FINAL.jpg`, width: 827, height: 1102,
    alt: 'October: two women under a crescent moon, one raising a glowing staff, above a row of pumpkins on a dark ground',
    article: [
      "For October I looked into the Eleusinian Mysteries, the festival that for more than two thousand years marked autumn in ancient Greece. It retold the myth of Demeter and Persephone: while Persephone spends six months of every year in the underworld the earth lies bare, and when she returns it blooms again. The rite ended with an ear of wheat shown in silence, a seed buried in the dark and born again. I see the cold season the same way, as a journey into the dark that is really a journey inside ourselves.",
    ],
    prompt: 'What is waiting in the dark to grow?',
  },
  {
    slug: 'november', year: 2017, month: 'November', title: 'Between the sacred and the profane',
    dek: "The symbols of the Mexican Day of the Dead, and the story of La Catrina.",
    epigraph: { lines: ["It is incredible how this country talks to death, jokes with it, teases it,", "and through it celebrates life!"], by: "Elettra Ministeri, in her Journal" },
    src: `${CDN}/1512506598075-CLNGQQOKNGMM6L0UITCX/novembre_FINAL.jpg`, width: 906, height: 1181,
    alt: 'November: a skeleton lady in a purple hat and a green dress holding a bouquet of marigolds, beside white flower shapes on black',
    article: [
      "For November I wrote about how Mexico celebrates the Day of the Dead on the first and second of November, when the dead are believed to return and the living welcome them with altars, marigold petals, sugar skulls, music and food. Nothing about it is sad: death is met with sweetness and color. The lady on the card is La Catrina, who began as the engraver José Guadalupe Posada’s caricature of a woman ashamed of her indigenous roots, and became, in Diego Rivera’s mural, a reminder that death makes everyone equal.",
    ],
    prompt: 'Whom would you like to remember, and in which color?',
  },
  {
    slug: 'december', year: 2017, month: 'December', title: 'The magic of light',
    dek: "On a winter evening walk, a candle in a window and what it teaches about light.",
    epigraph: { lines: ["Pure Light is not a promise sold at the market."], by: "Elettra Ministeri, in her Journal" },
    src: `${CDN}/1512506625581-4D46KM5PPP9O5WIH0DT0/cartolina_FINAL.jpg`, width: 906, height: 1181,
    alt: 'December: a woman in a long pale blue dress walking with a lantern through a snowy turquoise forest',
    article: [
      "December is the darkest month, and my story is about one evening walk with my dog. The lights of the houses come on one by one, the smell of burning wood fills the street, and I imagine the warm rooms behind the windows. Then I stop at a candle that a neighbor sets in his window every day, and it reminds me that we are all travelers, and that when it gets dark we can turn toward the light.",
    ],
    prompt: 'Which light will you carry through the dark months?',
  },
  {
    slug: 'january', year: 2018, month: 'January', title: 'What I leave, what I find',
    dek: "To make room for something new, you have to let something go.",
    epigraph: { lines: ["Someday, girl, I don’t know when,", "we’re going to get to that place where we really want to go,", "and we’ll walk in the sun.", "But until then, tramps like us were born to run."], by: "Bruce Springsteen" },
    src: `${CDN}/1518017809946-204D5HS5L6JKZJIJN853/gennaio_FINAL.jpg`, width: 906, height: 1181,
    alt: 'January: a woman seen from behind opening a deep blue door, a small golden object in her hand, in a room with a pomegranate-patterned wall',
    article: [
      "January is a month of passage, and this time my story is personal. At Christmas I went back to Sicily to empty the last boxes of my old life, and I understood that to make room for something new you have to let something go. I knew it was time to cut the thread to the island when I walked through Agrigento in winter and could not find my shadow. Two years after arriving in Lucerne, I am moving again, to Zurich.",
    ],
    prompt: 'What will you leave behind to make room?',
  },
  {
    slug: 'february', year: 2018, month: 'February', title: 'Standing on your head, then on two feet, then on one',
    dek: "A personal reflection on direction, choice and balance, written as a journey to Ithaca.",
    epigraph: { lines: ["When you set out for Ithaca,", "pray that the road is long."], by: "Constantine Cavafy" },
    src: `${CDN}/1519169661790-K6UKRLWOJQTKBBFRBETE/febbraio_FINAL.jpg`, width: 906, height: 1181,
    alt: 'February: two mermaids raising their arms to meet above the sea, with the sign of Pisces over them',
    article: [
      "For February I wrote a personal reflection on finding your direction in life, framed by Cavafy’s poem about the journey to Ithaca. We learn to hold up our head, then to walk, then to run, often without asking where we are going. Goals give the journey a direction, choosing is a responsibility because not choosing is also a choice, and the reward is not the arrival but the road itself.",
    ],
    prompt: 'Which way are you walking, and is it yours?',
  },
];

/** A card from its page name. */
export const cardOf = (slug) => CARDS.find((card) => card.slug === slug);

/** The address of a card's page. */
export const cardPath = (card) => `/print/${card.slug}`;
