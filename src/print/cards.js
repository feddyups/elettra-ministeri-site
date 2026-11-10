const CDN = 'https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf';

/**
 * The postcards of "Scrivo una cartolina" ("I write a postcard"): one illustration for each month, with a story behind it. Each card is its own
 * page (/print/<slug>); `dek` is the line under its title, `article` its text, in the artist's voice, and `prompt` a question to start the message on the back. The pictures are in the Asset Library;
 * `src` is the address without a size.
 */
export const CARDS = [
  {
    slug: 'september', month: 'September', title: 'A change of season',
    dek: '“September days are here, with summer’s best of weather and autumn’s best of cheer.” (Helen Hunt Jackson)',
    src: `${CDN}/1512506571294-W8A6I2QG6804JNIJLVEN/Settembre_FINAL.jpg`, width: 827, height: 1102,
    alt: 'September: a white outlined woman with a sunflower for a head, holding an orange cloth, among grapes, autumn leaves, mushrooms and berries, with the sign of Virgo on her belly',
    article: [
      'Summer is slowly drifting away, and I feel a touch of melancholy and a great hurry to say goodbye.',
      'Picture leaving a lover’s room after a few days together. You lift the covers and watch them sleep. You take in every detail, every object in the room. You close your eyes one more time and remember the best moments. Then you get up and walk out quietly, thanking the room and the lover who were yours for a little while.',
      'Summer is like that for me: nights of love. Today I leave its bedroom with my love in my hands, and I take it with me wherever I go, in every season. No winter or rain can put out this passion. Summer lives inside me. I will go back to that warm bed. It is never a goodbye, only a see you soon.',
      'So savor the change of season slowly, the way you savor good things. There will still be days of sun, because summer is so gentle that it leaves little by little. And when we are far from the melancholy of these farewells, we will feel the warmth of autumn and the colors summer left behind, pretending to forget them on the leaves of the great trees whose shade gave us rest in its hottest hours.',
    ],
    prompt: 'What are you taking with you from the summer?',
  },
  {
    slug: 'october', month: 'October', title: 'The Eleusinian Mysteries',
    dek: 'The feast of entering the darkness and coming out toward the light.',
    src: `${CDN}/1512506581811-F9FFQD4GH6I2DFD53MZT/ottobre_FINAL.jpg`, width: 827, height: 1102,
    alt: 'October: two women under a crescent moon, one raising a glowing staff, above a row of pumpkins on a dark ground',
    article: [
      'Autumn is not my favorite season, but I respect it. Long ago, people lived their bond with the Earth very intensely. They felt like children of Nature, and believed that the laws and cycles that turn a seed into fruit were the same ones that govern the seasons of our physical and spiritual lives. When the season changed, one cycle ended and another began, and that passage was celebrated. For centuries one of the greatest of these celebrations took place in Greece: the Eleusinian Mysteries.',
      'At their heart was the myth of Demeter and her daughter Persephone. Persephone was carried off by Hades, the god of the underworld, and Demeter, in her grief, stopped all life on Earth until her daughter was returned. But before letting her go, Hades persuaded Persephone to eat six pomegranate seeds, and so she must spend six months of every year below. Those are the winter months. Demeter is Mother Earth, and Persephone is the breath of life.',
      'The Mysteries were open to everyone, whatever their class, sex or origin. They ended with an ear of wheat, shown in silence, and the words: “In silence, the seed of wisdom is obtained.” The wheat is the whole cycle of rebirth: a grain buried in the dark that is born again in spring, like a soul passing from shadow into light.',
      'I like to think of the cold season as that kind of journey, a trip into the dark that is really a trip inside ourselves. Wine is put into barrels to mature, and we too enter the dark to change and ripen. It is a chance to find our true nature and to ask where we are going, whether by choice or by chance. When the wind blows cold and the days seem to have only beginnings, do not forget to love yourself. Let us not mistake the dark for gloom. When we feel tired and confused, we can look up at the sky: it holds everything, and the stars are perhaps nothing but the shining reflection of our deepest desires. I wish you an autumn full of discoveries.',
    ],
    prompt: 'What is waiting in the dark to grow?',
  },
  {
    slug: 'november', month: 'November', title: 'Between the sacred and the profane',
    dek: 'The symbols of the Day of the Dead.',
    src: `${CDN}/1512506598075-CLNGQQOKNGMM6L0UITCX/novembre_FINAL.jpg`, width: 906, height: 1181,
    alt: 'November: a skeleton lady in a purple hat and a green dress holding a bouquet of marigolds, beside white flower shapes on black',
    article: [
      'According to tradition, every year on the first and second of November the dead return from the other side to embrace their friends and families, and the living welcome them with music, drink and brightly colored food. Nothing in the Mexican Day of the Dead speaks of sorrow. Death is met with sweetness, color, music and dance.',
      'Families build private altars, the ofrendas, in homes, in shops and even in the main squares. An altar is a door between life and death, built in levels that stand for the material world, the immaterial one and the four elements: cut paper for the wind, candles for fire, corn and cacao for earth, drinks for water. The marigold, which lasts for weeks, decorates graves and altars, and its petals are scattered along the path from the grave to the house so the dead can find their way. It belongs to death and to life at once, and in the language of flowers it means sacred, everlasting affection. The little skulls of sugar and chocolate are a tribute to the spirits, and a way of saying that death can be sweet instead of bitter.',
      'And then there is La Catrina, the great lady of death. The Mexican engraver José Guadalupe Posada drew her as a caricature of a woman ashamed of her indigenous roots, who hides behind a wide hat and the clothes of the European aristocracy. Later, Diego Rivera gave her the name Catrina and painted her in a feather boa, on the arm of Posada himself. She walks among ordinary people to remind us that death is the great equalizer: in front of her we are all the same, rich and poor, indigenous and European, women and men.',
    ],
    prompt: 'Whom would you like to remember, and in which color?',
  },
  {
    slug: 'december', month: 'December', title: 'The magic of light',
    dek: 'Small lights in a dark month.',
    src: `${CDN}/1512506625581-4D46KM5PPP9O5WIH0DT0/cartolina_FINAL.jpg`, width: 906, height: 1181,
    alt: 'December: a woman in a long pale blue dress walking with a lantern through a snowy turquoise forest',
    article: [
      'December promises a lot of snow. It isn’t me saying so, or the weather report. It’s the mountains, already white and quiet, the trees that have lost all their leaves, the birds that tap on my kitchen window every morning looking for crumbs. In this dark month there are moments, sometimes only an instant, when I feel as if I were inside a fairy tale: the sun sets early, dragging its last rays across the sky in swirls of light that the clouds slowly swallow.',
      'At six in the evening it is already dark, and I walk through my neighborhood with my dog. The street is empty. Then, one after another, the lights of the houses come on like the lights of a Christmas tree, and the air fills with the smell of wood burning in the fireplaces. I let my imagination carry me inside: the glow of the fire in the living room, a blanket on the sofa, children’s voices and running footsteps, the smell of soup and of cakes just out of the oven. In the cold and the silence I understand that we are surrounded by magic, and that we only have to stop and notice it. The air, a laugh, a smell, a reflection: even the elevators sing and smell of it. It is a good magic, able to warm the coldest winter.',
      'On my way home I always stop in front of the same window. The neighbor on the second floor lights a candle every day and places it against the glass. I stand below in the half dark, and my eyes follow that small living light the way a moth follows the moon. By its glow I can make out a map of the world on one wall and a bookcase on the other. In that dim room I find the symbols of life: a lit candle on the way, to remind me that we are all travelers looking for our destiny.',
      'On this journey called life, when things get dark, I try to turn my thoughts toward the Light and entrust my hopes to it. But beware of anyone who sells light with strings attached: pure light is not a promise sold at the market. We have to trust ourselves, and scrape away the pride that blinds us and keeps us from the people who love us. Let go of the fears that hold us back and the insecurities that make us put things off, and cross the darkness with humility and a great trust in the heart. Forget the hurry to arrive. This is our only journey on Earth, and the greatest thing we can come to understand is that what we know is nothing next to the immensity of the universe. May your journey be full of Light and Love.',
    ],
    prompt: 'Which light will you carry through the dark months?',
  },
  {
    slug: 'january', month: 'January', title: 'What I leave, what I find',
    dek: 'To make room for something new, you have to let something go.',
    src: `${CDN}/1518017809946-204D5HS5L6JKZJIJN853/gennaio_FINAL.jpg`, width: 906, height: 1181,
    alt: 'January: a woman seen from behind opening a deep blue door, a small golden object in her hand, in a room with a pomegranate-patterned wall',
    article: [
      'January opens the door to the new year, which makes it a month of passage and change. To make room for new opportunities you have to accept letting something go. I have learned that to leave a place you have to reach your limits: the limits of what is acceptable, of your strength, of what you can understand.',
      'For years, and still today, I have been spinning like a top, packing the fragments of my past life into boxes. What is inside is like fossils: stones that look worthless, but that mark years and moments of my life. The glasses I took from bars, the secret diaries, the folk clothes I would never wear again, the maps, the university books. When the day came to empty the room of memories, some things were lost, some were given away, some were shipped, and some were never found. What helped me let go was realizing that it was time to make room for something new. There is a hippie saying I try to remember whenever I move: everything you need in life should fit in the trunk of a car.',
      'When I went back to Sicily after a long time away, everything was exactly as I had left it: the same bus driver, the same shops, the same faces, even the same For Sale signs. But I looked for my shadow along the streets and alleys of the old town, and I could not find it. That is how I knew it was time to cut the thread that tied me to the life I had left. I loved my life on the island, and I dreamed a great deal there. As Pirandello wrote: “I was born in Sicily, and there a man is born an island within an island, and he remains one until death, even if he lives far from his harsh native land, surrounded by the vast and jealous sea.”',
      'The door on the card is open. What I leave and what I find are on either side of it.',
    ],
    prompt: 'What will you leave behind to make room?',
  },
  {
    slug: 'february', month: 'February', title: 'Standing on your head, then on two feet, then on one',
    dek: 'A personal reflection on direction and balance.',
    src: `${CDN}/1519169661790-K6UKRLWOJQTKBBFRBETE/febbraio_FINAL.jpg`, width: 906, height: 1181,
    alt: 'February: two mermaids raising their arms to meet above the sea, with the sign of Pisces over them',
    article: [
      'Did you know that when a baby first lifts her head, she is already taking her first steps toward walking? That small, almost trivial discovery made me notice that as we grow we use our heads less and our feet more, until we are running a reckless race against time. Where am I going? Why am I running? And for whom? Running, like walking, feels good: it makes us strong and full of energy. But to avoid wasting our breath, we need a direction.',
      'If life is a journey, direction means goals. We need them to find our way and to draw some satisfaction from the road. Goals that meet only material needs, a house, a car, a new phone, give short pleasures that are soon forgotten. Personal goals, the ones that lead to inner growth, give a voice to the different sides of the person you will carry with you for the whole journey. To reach them, effort is not enough. First you need to know your potential and your strengths, and one of the best ways to know yourself is to try, to meet experience head on, where a mistake costs you something.',
      'Choosing is a responsibility. Many people, crushed by its weight and by the fear of getting it wrong, leave the choosing to others: to their parents, to the system, to chance. But not choosing is also a choice. Every decision you have made or will make has consequences, like a law of physics you cannot escape. Can you go back? No. Every choice is a risk, and a renunciation of something, or someone. Once you have learned to hold up your head and to walk, you have to learn to stand on one foot, in balance with your head. Balance is a constant exercise. Find the right compromise between who you are and your ability to adapt, and remember that the world around you will have to change too, enriched by your own unique and precious qualities.',
      'And the reward for all this effort? It is in front of our eyes every day: the road, which is life itself. In his poem “Ithaca,” Cavafy tells us not to hurry the journey. Let it last for years, and arrive old, rich with everything you gathered on the way. Ithaca gave you the beautiful journey. Without her you would never have set out. What else could you expect?',
    ],
    prompt: 'Which way are you walking, and is it yours?',
  },
];

/** A card from its page name. */
export const cardOf = (slug) => CARDS.find((card) => card.slug === slug);

/** The address of a card's page. */
export const cardPath = (card) => `/print/${card.slug}`;
