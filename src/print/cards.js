const CDN = 'https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf';

/**
 * The postcards of "Scrivo una cartolina" ("I write a postcard"): one illustration for each month, with a story behind it. Each card is its own
 * page (/print/<slug>); `dek` is the line under its title, `article` its text, in the artist's voice, and `prompt` a question to start the message on the back. The pictures are in the Asset Library;
 * `src` is the address without a size.
 */
export const CARDS = [
  {
    slug: 'september', year: 2017, month: 'September', title: 'A change of season',
    dek: "A goodbye to summer, and a welcome to the autumn that follows.",
    src: `${CDN}/1512506571294-W8A6I2QG6804JNIJLVEN/Settembre_FINAL.jpg`, width: 827, height: 1102,
    alt: 'September: a white outlined woman with a sunflower for a head, holding an orange cloth, among grapes, autumn leaves, mushrooms and berries, with the sign of Virgo on her belly',
    article: [
      { quote: ["September days are here,", "with summer’s best of weather", "and autumn’s best of cheer."], by: "Helen Hunt Jackson" },
      "This is the postcard for September, the first of Scrivo una cartolina (“I write a postcard”), a project I began in September 2017. Every month I draw one illustration, write about the month it belongs to, and share both for you to print. September is when summer gives way to autumn, and this card is my goodbye to summer.",
      "Summer is slowly drifting away, and I feel a touch of melancholy and a great hurry to say goodbye to it.",
      { quote: ["Lift the covers and watch your lover sleep.", "Look closely at every detail, every object in the room.", "Close your eyes. One more time.", "Remember the most beautiful moments when you made love.", "Then get up and leave slowly, saying goodbye to that room and that lover who were yours for a few days."] },
      "Summers are like nights of love. Today I leave summer’s bedroom with my love in my hands, and I carry it with me wherever I go, in whatever season I find myself: no winter or rain will put out this passion. Summer lives inside me. I will go back to that warm bed. It is never a goodbye, only a see you soon.",
      "So savor the change of season slowly, the way you savor good things. We will still have days of sun, because summer is so gentle that it leaves little by little. And when we are far from this melancholy of farewells and pretend goodbyes, we will feel the warmth of autumn and the colors summer left us, pretending to forget them on the leaves of the great trees whose shade gave us rest in its hottest hours.",
    ],
    prompt: 'What are you taking with you from the summer?',
  },
  {
    slug: 'october', year: 2017, month: 'October', title: 'The Eleusinian Mysteries',
    dek: "The ancient Greek feast of entering the darkness and coming out toward the light.",
    src: `${CDN}/1512506581811-F9FFQD4GH6I2DFD53MZT/ottobre_FINAL.jpg`, width: 827, height: 1102,
    alt: 'October: two women under a crescent moon, one raising a glowing staff, above a row of pumpkins on a dark ground',
    article: [
      { quote: ["The ant found a grain of wheat and took it.", "The wheat, feeling itself taken, cried out:", "“If you do me the favor of letting me have my wish to be born,", "I will give you a hundred of myself.”", "And so it was done."], by: "Leonardo da Vinci" },
      "This is the postcard for October in my monthly series Scrivo una cartolina (“I write a postcard”): each month I research a subject, write about it, and draw the card from it. For October, when autumn has fully arrived, I chose the Eleusinian Mysteries, a festival that for more than two thousand years marked this season in ancient Greece.",
      "Autumn is not my favorite season, but I respect it. Long ago people still felt like children of Nature, and believed that the cycles that turn a seed into fruit were the same ones that governed the seasons of their own lives. A change of season ended one cycle and began another, and that passage was celebrated.",
      "The Mysteries were held at Eleusis, a city of ancient Greece, from mid-September to mid-October, and they go back to the Mother Goddesses who have been present all around the Mediterranean since time immemorial. We know little about the ritual itself, because the participants were sworn to secrecy. Everyone was welcome, whatever their class, sex, race or religion, slaves and foreigners included, as long as they spoke Greek and had not committed murder. A procession set out from Athens along the sacred way to Eleusis, and there a torchlit celebration of music, song and dance staged the myth of Demeter.",
      "It is the story of a mother and a daughter. Persephone was carried off by Hades, the god of the underworld, and Demeter, who brought life and the seasons, searched for her in despair and then withdrew from the world, so that life on Earth stopped. Zeus ordered Hades to give the girl back, but before letting her go, Hades persuaded her to eat six magic pomegranate seeds. So Persephone must spend six months of every year in the underworld, and those are the winter months. Demeter is Mother Earth, and Persephone is the breath of life.",
      "The ceremony ended with an ear of wheat, shown in silence, and the words: “In silence, the seed of wisdom is obtained.” The wheat is the whole cycle of rebirth: a grain buried in the dark that is born again in spring, like a soul passing from shadow into light.",
      "I like to think of the cold season as that kind of journey, a trip into the dark that is really a trip inside ourselves. Wine is put into barrels to mature, and we too enter the dark to change and ripen. When the wind blows cold and the days seem to have only beginnings, do not forget to love yourself. Let us not mistake the dark for gloom. When we feel tired and confused, we can look up at the sky: it holds everything, and the stars are perhaps nothing but the shining reflection of our deepest desires. I wish you an autumn full of discoveries.",
    ],
    prompt: 'What is waiting in the dark to grow?',
  },
  {
    slug: 'november', year: 2017, month: 'November', title: 'Between the sacred and the profane',
    dek: "The symbols of the Mexican Day of the Dead, and the story of La Catrina.",
    src: `${CDN}/1512506598075-CLNGQQOKNGMM6L0UITCX/novembre_FINAL.jpg`, width: 906, height: 1181,
    alt: 'November: a skeleton lady in a purple hat and a green dress holding a bouquet of marigolds, beside white flower shapes on black',
    article: [
      "This is the postcard for November in my monthly series Scrivo una cartolina (“I write a postcard”): each month I research a subject, write about it, and draw the card from it. November opens with the Day of the Dead, and I chose to write about how Mexico celebrates it. The elegant skeleton lady on the card is La Catrina, its most famous figure.",
      "According to tradition, every year on the first and second of November the dead return from the other side to embrace their friends and families, and the living welcome them with music, drink and colorful food. Families build private altars, the ofrendas, in homes, in shops and even in the main squares. An altar is a door between life and death, built in levels that stand for the material world, the immaterial one and the four elements: cut tissue paper for the wind, candles for fire, corn and cacao for earth, drinks for water.",
      "Marigolds are everywhere. They decorate graves and altars, and their petals are scattered along the path from the grave to the house, to show the dead the way and keep them from getting lost. The peoples of Mexico used them for their dead long before the Spanish arrived. In India, Nepal and Thailand they also belong to sacred feasts and weddings, and in Ukraine they are a national symbol. In the language of flowers, the marigold stands for divination and for sacred, eternal affection.",
      "The decorated skull, the calavera, is the best-known symbol of Mexican culture, and it too comes from this festival. People give each other little skulls made of sugar or chocolate, as a tribute to the spirits of the dead and a reminder that death can be sweet, not bitter. Nothing about the Day of the Dead evokes sadness or mourning: death is chased away with sweetness, bright colors, music and dance.",
      "La Catrina, the great lady of death, began as a caricature. The engraver José Guadalupe Posada, who drew the everyday life and dramas of his people around the turn of the twentieth century, created La Calavera Garbancera: a woman ashamed of her indigenous roots, who disguises herself in a wide hat and the clothes of the European aristocracy. It was a criticism of those who imitated Europe and denied their own culture, and at the end of the nineteenth century it became a symbol of resistance against the dictatorship of Porfirio Díaz. Years later Diego Rivera renamed her La Catrina and painted her, arm in arm with Posada himself, in his 1947 mural “Dream of a Sunday Afternoon in the Alameda Central.” She lives among ordinary people as a reminder that death makes us all equal, rich and poor, European and indigenous, men and women. In 2003 UNESCO recognized the Day of the Dead as part of the oral and intangible heritage of humanity.",
    ],
    prompt: 'Whom would you like to remember, and in which color?',
  },
  {
    slug: 'december', year: 2017, month: 'December', title: 'The magic of light',
    dek: "On a winter evening walk, a candle in a window and what it teaches about light.",
    src: `${CDN}/1512506625581-4D46KM5PPP9O5WIH0DT0/cartolina_FINAL.jpg`, width: 906, height: 1181,
    alt: 'December: a woman in a long pale blue dress walking with a lantern through a snowy turquoise forest',
    article: [
      "This is the postcard for December in my monthly series Scrivo una cartolina (“I write a postcard”): each month I write about a subject and draw the card from it. December is the darkest month of the year, and this story is about one winter evening, and the small light that taught me something about it.",
      "December promises a lot of snow this year. It isn’t me saying so, or the weather report on television: it’s the mountains, already white and quiet, and the trees that have lost all their leaves. The birds tap on my kitchen window every morning looking for crumbs, and the squirrel told me too, handing me a little hazelnut. In this dark month there are moments when I feel I am in a fairy tale, like when the sun sets early and the last rays draw swirls of light in the sky, slowly swallowed by the clouds.",
      "It is six in the evening and already dark. I walk through my neighborhood with my devoted dog, and the street is empty. Then, one after another, the lights of the houses come on like the lights of a Christmas tree, and the air fills with the unmistakable smell of wood burning in the fireplaces. I let my imagination carry me inside: the fire lighting the living room, the plaid on the sofa, the voices and running of children, the smell of soup and cakes just out of the oven. In the silence and cold of that street I understand that we are surrounded by magic. We only have to stop and look at it, and a laugh, a footstep, a smell, even the crack under a door will sing of it. A good magic, able to warm the coldest of winters.",
      "On the way home I always stop in front of the same window. The neighbor on the second floor lights a candle every day and sets it against the glass. Like a moth that uses the moon to find its way in the dark, my eyes follow that small, living light. From below, in the half dark, I can make out a map of the world on the right-hand wall and a bookcase on the left. In that room I find the symbols of life: a lit candle on the path, to remind me that we are all travelers searching for our destiny.",
      "On this journey called life, when things get dark, I try to turn my thoughts toward the Light and entrust my hopes to it. But beware of anyone who sells light with strings attached: pure Light is not a promise sold at the market. We have to trust ourselves, scrape off the pride that makes us blind, and let go of the fears and insecurities that make us put things off. Let us forget the hurry to arrive, because this life is our only journey on Earth, and the greatest awareness we can reach is that our knowledge is nothing next to the immensity of the universe. May this journey be full of Light and Love.",
    ],
    prompt: 'Which light will you carry through the dark months?',
  },
  {
    slug: 'january', year: 2018, month: 'January', title: 'What I leave, what I find',
    dek: "To make room for something new, you have to let something go.",
    src: `${CDN}/1518017809946-204D5HS5L6JKZJIJN853/gennaio_FINAL.jpg`, width: 906, height: 1181,
    alt: 'January: a woman seen from behind opening a deep blue door, a small golden object in her hand, in a room with a pomegranate-patterned wall',
    article: [
      "This is the postcard for January in my monthly series Scrivo una cartolina (“I write a postcard”): each month I write about a subject and draw the card from it. January opens the door of the new year, a month of passage and change, and this time I wrote about it personally, because the end of 2017 closed a chapter of my own life: my years in Sicily.",
      "I spent the Christmas holidays in Sicily, to see friends and a few relatives and to finish something left hanging for months, the last stage of my move to Switzerland. The last stage was not only about the things left behind, but about realizing that my life had changed. I had to empty the room where I kept my memories by the thirty-first of December: the glasses I took from bars, the secret diaries, the folk clothes I would never wear again, the Lonely Planet maps, the university books. My husband and I emptied it in four days. Some things were lost, some given away, some shipped, and some were never found. What helped me was realizing that it was time to make room for something new. There is a hippie saying I try to remember whenever I move: everything you need in life should fit in the trunk of a car.",
      "In the spring of 2016, my husband, our dog Selly and I had boarded the Freccia del Sud, the train that carries you from the most remote Sicilian town to the north of Italy in about twenty hours, to begin a new life in Switzerland. Through the long months in the Swiss mountains I always felt a thread tying me to my life on the island, as if I could go back at any moment and take it up where I had left it. Two years later I went back, and I understood that it was time to cut that thread. I knew because of a shadow. In Sicilian summers shade is something you look for like water in the desert, but I came in winter. In Agrigento everything was exactly as I had left it, the same bus driver, the same shops and faces, even the same For Sale signs. But walking through the streets and empty alleys of the old town, I could not find my shadow.",
      { quote: ["I was born in Sicily, and there a man is born an island within an island,", "and he remains one until death, even if he lives far from his harsh native land,", "surrounded by the vast and jealous sea."], by: "Luigi Pirandello" },
      "I loved my life in Sicily. After five university years in Florence I went back to live on an island full of unemployment and disorganization, and everyone thought I was crazy. But in that chaos I found myself again, and I strengthened my spirit and my love for the man who is now my husband. I dreamed a great deal there. And the end of 2017 closed another chapter too, the one in Lucerne, which I perhaps never really began to write. Exactly two years after arriving, I am moving again, to a city that will be just as cold and German, but bigger: Zurich.",
    ],
    prompt: 'What will you leave behind to make room?',
  },
  {
    slug: 'february', year: 2018, month: 'February', title: 'Standing on your head, then on two feet, then on one',
    dek: "A personal reflection on direction, choice and balance, written as a journey to Ithaca.",
    src: `${CDN}/1519169661790-K6UKRLWOJQTKBBFRBETE/febbraio_FINAL.jpg`, width: 906, height: 1181,
    alt: 'February: two mermaids raising their arms to meet above the sea, with the sign of Pisces over them',
    article: [
      { quote: ["When you set out for Ithaca,", "pray that the road is long.", "(…)", "Always keep Ithaca in your mind.", "Reaching it is your constant thought."], by: "Constantine Cavafy" },
      "This is the postcard for February in my monthly series Scrivo una cartolina (“I write a postcard”): each month I write about a subject and draw the card from it. For February I wrote about how to find your direction in life. It is not an academic essay or a yoga text, just a personal reflection that I chose to share with you.",
      "Did you know that when a baby starts lifting her head, she is already making her first attempts to walk? That small, almost trivial discovery made me notice that as we grow we use our heads less and our feet more, until we are running a reckless race against time. Where am I going? Why am I running? And for whom? Running, like walking, makes us feel strong and full of energy, but to avoid wasting our breath we need a direction.",
      "If life is a journey, direction means goals. We need them to find our way and to draw some satisfaction from the road. Goals that meet only material needs, a house, a car, a new phone, give short pleasures that are soon forgotten. Personal goals, the ones that lead to inner growth, give a voice to the different sides of the person you will carry with you for the whole journey. To reach them, effort is not enough. First you need to know your strengths, and one of the best ways to know yourself is to meet experience head on, where a mistake costs you something.",
      "Choosing is a responsibility. Many people, crushed by its weight and by the fear of getting it wrong, leave the choosing to others: to their parents, to the system, to chance. But not choosing is also a choice. Every decision you have made or will make has consequences, like a law of physics you cannot escape. Can you go back? No. Every choice is a risk, and a renunciation of something, or someone.",
      "You have learned to hold up your head, to move your feet and to walk. Now you must learn to stand on one foot, in balance with your head. Balance is a constant exercise: find the right compromise between who you are and your ability to adapt, and remember that your surroundings will have to change too, enriched by your own unique and precious qualities. And the reward for the effort? It is in front of our eyes every day. It is the road. It is life.",
      { quote: ["Above all, do not hurry the journey.", "Let it last for many years, and may you, old,", "set foot on the island rich", "with the treasures gathered on the way,", "not expecting riches from Ithaca.", "Ithaca gave you the beautiful journey.", "Without her you would never have set out.", "What else do you expect?"], by: "Constantine Cavafy" },
    ],
    prompt: 'Which way are you walking, and is it yours?',
  },
];

/** A card from its page name. */
export const cardOf = (slug) => CARDS.find((card) => card.slug === slug);

/** The address of a card's page. */
export const cardPath = (card) => `/print/${card.slug}`;
