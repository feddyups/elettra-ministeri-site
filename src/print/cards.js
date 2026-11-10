const CDN = 'https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf';

/**
 * The postcards of "Scrivo una cartolina" ("I write a postcard"), the monthly project: one postcard for each month, with a story behind it.
 * Each card is its own page (/print/<slug>); `article` is that page's text, `prompt` is the line that opens the writing space on the back of the
 * card, and `post` is the original article on the blog (in Italian). The pictures are in the Asset Library; `src` is the address without a size.
 */
export const CARDS = [
  {
    slug: 'september', month: 'September', title: 'A change of season', dek: 'Leaving the summer without saying goodbye.',
    src: `${CDN}/1512506571294-W8A6I2QG6804JNIJLVEN/Settembre_FINAL.jpg`, width: 827, height: 1102,
    alt: 'September: a white outlined woman with a sunflower for a head, holding an orange cloth, among grapes, autumn leaves, mushrooms and berries, with the sign of Virgo on her belly',
    article: [
      'Summer is slowly going away, and I feel a little melancholy and a great hurry to say goodbye. I imagine leaving the room of a lover: you lift the cover, look at the one who sleeps, remember every detail of the room, close your eyes once more, and walk out quietly, thanking the days that were yours.',
      'That is how summer feels to me: a few nights of love. I take it out of the room in my hands and carry it with me, wherever I go and in any season. No winter or rain can put out that passion. Summer stays inside me, and it is never a goodbye, only a see you soon.',
      'So enjoy the change of season the way you enjoy good things, slowly. There will still be days of sun, because summer is so gentle that it leaves little by little. And when the melancholy of farewells has passed, you will feel the warmth of autumn and the colors summer left behind, pretending to forget them on the leaves of the big trees that gave us shade in its hottest hours.',
    ],
    prompt: 'What are you taking with you from the summer?',
    post: { href: '/blog/2017/9/2/cambio-di-stagione-settembre' },
  },
  {
    slug: 'october', month: 'October', title: 'The Eleusinian Mysteries', dek: 'A festival of going into the dark and coming back to the light.',
    src: `${CDN}/1512506581811-F9FFQD4GH6I2DFD53MZT/ottobre_FINAL.jpg`, width: 827, height: 1102,
    alt: 'October: two women under a crescent moon, one raising a glowing staff, above a row of pumpkins on a dark ground',
    article: [
      'Autumn is not my favorite season, but I respect it. Long ago people felt like children of nature: the laws that turned a seed into fruit were the same ones that ruled the seasons of their own lives, and the turn of the season, the end of one cycle and the beginning of another, was celebrated. One of those celebrations, kept for a very long time in Greece, was the Eleusinian Mysteries.',
      'They told the myth of Demeter and her daughter Persephone. Persephone was taken by Hades, the god of the underworld, and in her grief Demeter stopped all life on earth until her daughter was returned. But Persephone had eaten six pomegranate seeds, so she has to spend six months of every year below, and those months are winter. Demeter is Mother Earth and Persephone is the breath of life. The festival ended with the showing of an ear of wheat, a sign of rebirth: a grain stays buried in the dark so that it can be born again.',
      'Its closing words were: “In silence, the seed of wisdom is obtained.” I like to think of the cold season as that kind of journey, a trip into the dark that is also a trip into ourselves, the way wine is kept in barrels to mature. Darkness and dark are not the same thing. When we feel confused and tired we can look at the sky, which holds everything, and remember that the stars are the light of our deepest wishes. And don’t forget to love yourself.',
    ],
    prompt: 'What is waiting in the dark to grow?',
    post: { href: '/blog/2017/10/3/riti-di-passaggio-misteri-eleusini' },
  },
  {
    slug: 'november', month: 'November', title: 'Between the sacred and the profane', dek: 'The symbols of the Day of the Dead.',
    src: `${CDN}/1512506598075-CLNGQQOKNGMM6L0UITCX/novembre_FINAL.jpg`, width: 906, height: 1181,
    alt: 'November: a skeleton lady in a purple hat and a green dress holding a bouquet of marigolds, beside white flower shapes on black',
    article: [
      'In the Mexican festival of the Day of the Dead, the dead are said to come back to embrace their friends and families, and nothing in it speaks of sadness: death is met with sweetness, bright colors, music and dance. Families build private altars, the ofrendas, a door between life and death, with levels for the material and the immaterial world and for the four elements: cut paper for the wind, candles for fire, corn and cacao for earth, drinks for water.',
      'The marigold is everywhere, on graves and altars and scattered in a path from the grave to the house so that the dead do not lose their way. It belongs to death and to life at once, to a sacred and lasting affection. The sugar skulls given as sweets are a tribute to the spirits and a reminder that death can be sweet instead of bitter.',
      'And then there is the Catrina, the elegant lady of death, on this card. The Mexican engraver José Guadalupe Posada first drew her as a caricature of a woman ashamed of her origins, dressed in a wide hat and European clothes. Later the painter Diego Rivera gave her the name La Catrina, with a feather boa, and put her in a mural. She lives among ordinary people to remind us that in front of death we are all equal, rich and poor, women and men.',
    ],
    prompt: 'Whom would you like to remember, and in which color?',
    post: { href: '/blog/2017/11/14/tra-il-sacro-e-il-profano-simboli-del-da-de-muertos-kydg3' },
  },
  {
    slug: 'december', month: 'December', title: 'The magic of light', dek: 'Small lights in a dark month.',
    src: `${CDN}/1512506625581-4D46KM5PPP9O5WIH0DT0/cartolina_FINAL.jpg`, width: 906, height: 1181,
    alt: 'December: a woman in a long pale blue dress walking with a lantern through a snowy turquoise forest',
    article: [
      'December is a dark month, and sometimes I feel I am inside a fairy tale: the sun sets early and the sky draws swirls of light that the clouds slowly swallow. At six in the evening I walk the streets of my neighborhood with my dog and nobody is out. Then the lights of the houses come on, one after another like the lights of a Christmas tree, and the street fills with the smell of wood burning in the fireplaces. Behind the windows I imagine the fire, the blankets, the children running, the soups and the cakes just out of the oven.',
      'On the way home I always stop at the same window. The neighbor on the second floor lights a candle every day and puts it in front of the glass. Standing below in the half dark, my eyes follow it the way a moth follows the moon. In the room I can see a map of the world and a bookcase, and a lit candle that reminds me that we are all travelers looking for our destiny.',
      'In the dark moments of this journey called life I try to turn my thoughts toward the light, and I trust it with my hopes. Pure light is not a promise sold at the market. Let go of the fear, the hurry and the pride that make us blind, and cross the dark with modesty and trust.',
    ],
    prompt: 'Which light will you carry through the dark months?',
    post: { href: '/blog/2017/11/20/dicembre-magico' },
  },
  {
    slug: 'january', month: 'January', title: 'What I leave, what I find', dek: 'To let something new in, you have to let something go.',
    src: `${CDN}/1518017809946-204D5HS5L6JKZJIJN853/gennaio_FINAL.jpg`, width: 906, height: 1181,
    alt: 'January: a woman seen from behind opening a deep blue door, a small golden object in her hand, in a room with a pomegranate-patterned wall',
    article: [
      'January opens the door of the new year, which makes it a month of passage and change. For me it was a month of letting go. To make room for new opportunities you have to accept leaving something behind, and I learned that to leave a place you have to reach your limits: the limits of what is acceptable, of your strength, of what you can understand.',
      'I spent days emptying a room of memories. The boxes held things like fossils, stones without value to anyone else that marked years of my life. Some were lost, some given away, some sent, some never found again. There is a hippie saying I try to remember whenever I move: everything you need in life should fit in the trunk of a car.',
      'When I went back to the island where I was born, I looked for my shadow in its streets and could not find it. That is how I knew it was time to cut the thread that tied me to the life I had left. I am grateful to the place that made me who I am, and ready to begin somewhere new. The door on the card is open, and what I leave and what I find are on either side of it.',
    ],
    prompt: 'What will you leave behind to make room?',
    post: { href: '/blog/2018/1/8/ogni-nuovo-inizio-proviene-dalla-fine-di-un-altro-inizio-gennaio' },
  },
  {
    slug: 'february', month: 'February', title: 'Standing on your head, then on two feet, then on one', dek: 'A reflection on direction and balance.',
    src: `${CDN}/1519169661790-K6UKRLWOJQTKBBFRBETE/febbraio_FINAL.jpg`, width: 906, height: 1181,
    alt: 'February: two mermaids raising their arms to meet above the sea, with the sign of Pisces over them',
    article: [
      'A baby who starts to lift her head is taking the first steps toward walking. Look at it this way: as we grow we use the head less and the feet more, and we end up running a reckless race against time. Where am I going? Why am I running? And for whom? Running is good, but to not waste your breath you need a direction, and a direction means goals, the kind that lead to inner growth more than a new phone or a new car, whose satisfaction is quickly forgotten.',
      'Choosing is a responsibility. Not choosing is also a choice, and every decision has consequences you cannot take back; every choice is a risk and a renunciation. And once you can walk, you have to learn to stand on one foot, in balance with your head. Balance is a constant exercise: find the compromise between who you are and your ability to adapt, and remember that the environment will have to change too, enriched by your own unique qualities.',
      'What is the reward for all this effort? It is in front of our eyes every day: the road itself. As Cavafy writes in his poem about Ithaca, do not hurry the journey; let it last for years, and arrive old, rich with everything you have gathered along the way. Ithaca gave you the beautiful journey. What else do you expect?',
    ],
    prompt: 'Which way are you walking, and is it yours?',
    post: { href: '/blog/2018/2/11/kzi0pdcts93bv987nmz4kbxsbyqg19' },
  },
];

/** A card from its page name. */
export const cardOf = (slug) => CARDS.find((card) => card.slug === slug);

/** The address of a card's page. */
export const cardPath = (card) => `/print/${card.slug}`;
