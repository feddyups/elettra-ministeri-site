/**
 * What is known about each painting, written by hand (everything about its colors is generated; see src/color/).
 * Keyed by the work's page name: its page is /paintings/<key> and its entry on the series page has the same id.
 * Every field but title, series, medium, image and alt is optional, and a section of the page appears only when
 * its field exists: add 'story' (one string per paragraph), 'year', 'size' or 'frame' as the artist provides them.
 */
export const CATALOGUE = {
  'lighthouses': {
    title: "Lighthouses in the open sea",
    series: "mediterranean",
    medium: "Acrylic on canvas",
    size: "100 × 50 cm",
    year: 2020,
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1661718213586-IY1YAQJHTLOTSGYWKJV6/main.jpg",
      width: 1000,
      height: 505
    },
    alt: "Lighthouses in the open sea: red and white lighthouses among bright green, blue and orange waves, acrylic on canvas",
    story: [
      "I painted this scene in 2020, while Covid-19 was forcing us to accept how fragile the system we used to live in really was.",
      "At the mercy of the waves, carried away by the currents: we were not ready for a pandemic. In my painting, the scene is held together by the lighthouses, bearers of hope and strongholds among the waves. In their stillness they light up our future, while the effort to reach them is evident."
    ]
  },
  'wave': {
    title: "Wave",
    series: "mediterranean",
    medium: "Acrylic on canvas",
    size: "60 × 60 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1528638173689-P8T0RMNYOWAKAER05R02/wave.jpg",
      width: 1000,
      height: 1000
    },
    alt: "Wave: a patterned blue wave above a shoal of colorful fish and jellyfish, acrylic on canvas",
    story: [
      "The sea is a pattern before it is a picture. In Wave I let the water curl into scales, rings and stripes, and set a shoal of small fish moving beneath it, so that you feel the surface and the depth at once.",
      "Under the wave the colors turn from sky to turquoise to a deep, inky blue. I wanted calm and force to share one canvas, the way they do in the sea I grew up beside."
    ]
  },
  'flow': {
    title: "Flow",
    series: "mediterranean",
    medium: "Acrylic on canvas",
    size: "80 × 80 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1528637939887-YJZX423ATYQ6OB9W65L4/flow.jpg",
      width: 1000,
      height: 1000
    },
    alt: "Flow: a red seahorse among shells and swirling currents on a green ground, acrylic on canvas",
    story: [
      "A red seahorse rides a current that is part water and part fire. Shells, spirals and ribbons of paint pull around it, and the green behind them keeps everything moving.",
      "Flow is about letting go of the shore: not choosing a direction, but trusting the current to carry the shapes. I wanted the whole canvas to feel carried, every shape moving a little ahead of the next."
    ]
  },
  'pomegranates': {
    title: "Pomegranates",
    series: "mediterranean",
    medium: "Acrylic on canvas",
    size: "40 × 60 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/f91235b4-3558-4730-acf4-fd999724c8e3/pomegranates.jpg",
      width: 1000,
      height: 667
    },
    alt: "Pomegranates: a cut pomegranate and a whole one beside a blue bowl on a table, with soft clouds behind, acrylic on canvas",
    story: [
      "A table set in the sun: a blue bowl, a pomegranate split open, another one whole, and clouds drifting behind as if the room had no walls.",
      "The pomegranate is an old symbol of abundance and of things shared, and a Mediterranean table is where the two meet. I painted the fruit like a small jewel box, every seed its own red."
    ]
  },
  'fishfit': {
    title: "FishFit",
    series: "mediterranean",
    medium: "Acrylic on canvas",
    size: "40 × 30 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1528638232839-OQIJ0LNO8CM609E5DQT3/fish_fit.jpg",
      width: 1000,
      height: 750
    },
    alt: "FishFit: patterned fish in pink, green and blue swimming in a dark starry sea, acrylic on canvas",
    story: [
      "Fish in pink, green and blue turn through a dark, starry water, each one wearing its own pattern. It is a crowded, joyful picture, and a little confusing on purpose.",
      "I like how a shoal can be many and one at the same time. The patterns repeat, but no two fish are alike."
    ]
  },
  'maternity-i': {
    title: "Maternity I",
    series: "maternity",
    medium: "Acrylic on canvas",
    size: "50 × 70 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1706395437954-VXOD34RJGX8YZ2L05HR3/maternity+I.jpg",
      width: 1000,
      height: 1435
    },
    alt: "Maternity I: a pregnant body in profile, pink and orange with black outlines, on a yellow ground in a blue frame, acrylic on canvas",
    story: [
      "A body in profile, round and unhurried, drawn with a heavy black line and held inside a blue frame on a warm yellow ground. I wanted the pregnant body to look the way it is: strong, ordinary and very much present.",
      "Maternity I is the first of three paintings from my own pregnancy."
    ]
  },
  'maternity-ii': {
    title: "Maternity II",
    series: "maternity",
    medium: "Acrylic on canvas",
    size: "50 × 70 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1706395438108-49N60VM3SQ8D7HBOKEWW/maternity+II.jpg",
      width: 1000,
      height: 1430
    },
    alt: "Maternity II: a pregnant torso seen from the front in vivid red and orange, outlined in deep blue, acrylic on canvas",
    story: [
      "A torso seen from the front, so close that the body becomes the whole picture: red and orange pressed against a deep blue edge. There is nothing to look past, and no idealized image to measure it against.",
      "Maternity II is the loudest of the three, and the most direct about the intensity of that time."
    ]
  },
  'maternity-iii': {
    title: "Maternity III",
    series: "maternity",
    medium: "Acrylic on canvas",
    size: "50 × 70 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1706395444458-IDVDZH17PKKRSE1QCNTQ/maternity+III.jpg",
      width: 1000,
      height: 1447
    },
    alt: "Maternity III: a seated pregnant figure in orange against pink and crimson, in a deep blue frame, acrylic on canvas",
    story: [
      "A figure sits, orange against pink and crimson, and takes up the space she needs. Her posture says what the whole series says: this body has agency.",
      "Maternity III is the third of the paintings from my pregnancy."
    ]
  },
  'the-shape-of-beauty': {
    title: "The Shape of Beauty",
    series: "maternity",
    medium: "Acrylic on canvas",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/9463b35a-6c44-4768-89cb-d2a74a3f0d32/the-shape-of-beauty.jpg",
      width: 1000,
      height: 1393
    },
    alt: "The Shape of Beauty: a pink figure kneeling with its back turned, against warm oranges and rust-striped hills, acrylic on canvas",
    story: [
      "A figure kneels with her back to us, pink and soft against warm oranges and rust-striped hills. We usually meet a body from the front, as something to be judged; here I turned it around.",
      "Beauty has a shape, and it is not always the one we are shown."
    ]
  },
  'carretto': {
    title: "Carretto siciliano",
    series: "sicily",
    medium: "Acrylic on canvas",
    frame: "Hand-painted frame, part of the work",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/8b291fd7-893e-4537-b1e8-9aa92c587177/carretto.jpg",
      width: 1000,
      height: 850
    },
    alt: "Carretto siciliano: a painted Sicilian cart and a plumed horse inside a hand-painted red and cream frame",
    story: [
      "The painted cart is one of Sicily’s best-loved images: a horse in a plume of red and blue feathers, a cart covered in small scenes, wheels turning in color. I painted it the way the carts themselves are decorated, with nothing left plain.",
      "The frame is part of the work. I painted it by hand so the whole object would feel as bright and crowded as the island."
    ]
  },
  'pistacchi': {
    title: "Pistacchi",
    series: "sicily",
    medium: "Acrylic on canvas",
    frame: "Hand-painted frame, part of the work",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/489625cb-1c9d-4bbd-9191-7b925e86ffd8/pistacchi.jpg",
      width: 1000,
      height: 850
    },
    alt: "Pistacchi: three pistachios on a blue disc surrounded by a mandala, inside a hand-painted yellow and blue frame",
    story: [
      "Three pistachios rest on a blue disc, and a mandala opens around them as if the nut were a flower. Pistachios are one of the island’s treasures, and I wanted to treat them like jewels.",
      "The yellow and blue frame, painted by hand, carries the pattern outward, so the picture has no clear edge."
    ]
  },
  'sole': {
    title: "Il sole",
    series: "sicily",
    medium: "Acrylic on canvas",
    frame: "Hand-painted frame, part of the work",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/70b83ee7-7ffe-44c9-a374-0687b055c447/sole.jpg",
      width: 1000,
      height: 850
    },
    alt: "Il sole: a smiling sun in a blue diamond on a red, orange and green geometric field, inside a hand-painted cream frame with blue and red arches",
    story: [
      "A sun with a wide smile sits inside a blue diamond, over a field of red, orange and green. It is the Sicilian sun as I carry it: warm, a little loud, impossible to ignore.",
      "The cream frame, painted by hand with blue and red arches, makes the picture feel like a tile, or a doorway."
    ]
  },
  'the-bonding': {
    title: "The Bonding",
    series: "human-figure",
    medium: "Acrylic on canvas",
    size: "116 × 73 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1619440724228-0ZEOJ7JXZYDOZFJ4UK4M/thebonding_1.jpg",
      width: 1000,
      height: 1500
    },
    alt: "The Bonding: two intertwined figures, one orange-red and one yellow-green, lifting a blue sphere against a deep blue ground, acrylic on canvas",
    story: [
      "Two figures, one orange-red and one yellow-green, twist around each other and lift a blue sphere together. Their faces fall away, and what remains is the gesture of effort shared.",
      "I think of the sphere as whatever two people carry between them: a home, a child, a worry. It is lighter because there are two pairs of hands."
    ]
  },
  'amore-e-pandemia-i': {
    title: "Amore e Pandemia I",
    series: "human-figure",
    medium: "Acrylic on canvas",
    size: "50 × 70 cm",
    year: 2021,
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1661723960416-YL4284WHMOEKYM77FYZR/01+The+Hug.jpg",
      width: 1000,
      height: 1364
    },
    alt: "Amore e Pandemia I: a red figure and a green figure in an embrace against a blue and black ground, acrylic on canvas",
    story: [
      "At the end of August 2021, my three-year-old son and I had a bad accident. Luckily we got out alive, but the wounds left on the soul were deep.",
      "After a month of physical and mental inability, and with the guilt of a mother who was unable to protect her own child, I finally managed to forgive myself by mixing colors, and I transformed my anguish into an embrace.",
      "In a historical moment, amid the pandemic and the isolation it brought upon us all, the simple gesture of a hug became a revolutionary act. I painted this series to give back to the world, and to myself, the importance of that human gesture."
    ]
  },
  'amore-e-pandemia-ii': {
    title: "Amore e Pandemia II",
    series: "human-figure",
    medium: "Acrylic on canvas",
    size: "50 × 70 cm",
    year: 2021,
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1661723893566-A50LFYP3717C8TB31ZGH/02+The+Hug.png",
      width: 1000,
      height: 1395
    },
    alt: "Amore e Pandemia II: a red figure and a green figure embracing in deep blue light, acrylic on canvas",
    story: [
      "At the end of August 2021, my three-year-old son and I had a bad accident. Luckily we got out alive, but the wounds left on the soul were deep.",
      "After a month of physical and mental inability, and with the guilt of a mother who was unable to protect her own child, I finally managed to forgive myself by mixing colors, and I transformed my anguish into an embrace.",
      "In a historical moment, amid the pandemic and the isolation it brought upon us all, the simple gesture of a hug became a revolutionary act. I painted this series to give back to the world, and to myself, the importance of that human gesture."
    ]
  },
  'keep-looking-up': {
    title: "Keep looking up",
    series: "human-figure",
    medium: "Acrylic on canvas pad",
    size: "22.9 × 30.5 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/fe245f61-06bf-4313-b829-fff12b517468/keep-looking-up.jpg",
      width: 1000,
      height: 1393
    },
    alt: "Keep looking up: a brown figure kneeling on a rainbow and lifting a smiling sun with golden rays above her head, acrylic on canvas pad",
    story: [
      "A woman kneels on a rainbow and lifts the sun above her head. The sun has a face, and under its eyes a few lines that look a little like tears.",
      "Keep looking up is a reminder I give myself: that light is something you can hold up, even when it is heavy."
    ]
  },
  'hes-raining-flowers': {
    title: "He’s raining Flowers",
    series: "human-figure",
    medium: "Acrylic on canvas",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/93237161-ce98-4d7b-9495-8083840f045c/hes-raining-flowers.jpg",
      width: 1000,
      height: 1393
    },
    alt: "He’s raining Flowers: a green torso with raised arms, with small red flowers and clovers falling on either side against a pale yellow and pink ground, acrylic on canvas",
    story: [
      "A green torso with raised arms, strong and without a face, and small red flowers and clovers falling down both sides of it. The body could be a plant, or a tree, or a person standing in a shower of petals.",
      "I like that it is not clear whether the flowers are falling or growing. Gentleness and strength share the same body."
    ]
  },
  'help': {
    title: "Help",
    series: "archive",
    medium: "Acrylic on textured paper",
    size: "32 × 25 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1528638090169-3WYNVACGH7G9O9XEUX92/help.jpg",
      width: 1000,
      height: 750
    },
    alt: "Help: a red hand and a blue hand reaching towards each other through green jungle leaves, acrylic on textured paper",
    story: [
      "A red hand and a blue hand reach toward each other through a thick tangle of green leaves. They have not touched yet.",
      "Help is the moment before: the decision to reach, and the hope that someone else is reaching too."
    ]
  },
  'messengers-of-love': {
    title: "Messengers of Love",
    series: "archive",
    medium: "Acrylic on canvas",
    size: "80 × 100 cm",
    year: 2020,
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1656237965944-U8RGHTQWV9TP2Z9NC7FT/03+Messengers+of+Love.jpg",
      width: 1000,
      height: 800
    },
    alt: "Messengers of Love: two doves shaped like hands facing each other inside a red heart, with strawberry branches above, acrylic on canvas",
    story: [
      "In November 2020, I envisioned two doves under a branch of ripe strawberries, set against a pulsating red heart. The Greeks and Romans considered the dove the emblem of cosmic harmony, and in medieval and Renaissance art the strawberry branch is a symbol of the Earthly Paradise.",
      "It was one year since the beginning of the pandemic, and surprisingly nature was already starting to reap the benefits of reduced human activity. I read this image as a message arriving at a time of great deprivation, when new ways for people and nature to live together were emerging.",
      "Once again nature has shown benevolence, but are we ready to reach out and change our ways, even without the danger of an imminent catastrophe?"
    ]
  },
  'scarab': {
    title: "Scarab",
    series: "archive",
    medium: "Acrylic on canvas",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/04609aa9-05d7-4834-9165-8e5681125efc/scarab.jpg",
      width: 1000,
      height: 1346
    },
    alt: "Scarab: a red and brown scarab beetle with pale blue wings lifting a golden sun, on a green field of stars and gems, acrylic on canvas",
    story: [
      "A scarab, red and brown with pale blue wings, lifts a golden sun over a green sky of stars. In ancient Egypt the scarab pushed the sun across the sky; I wanted that old image to feel new, with gems and glitter for stars.",
      "It is meant as an amulet: renewal you can hold in your hand."
    ]
  },
  'rainbow-and-cacti': {
    title: "Rainbow and cacti",
    series: "archive",
    medium: "Acrylic on paper",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/e09a6489-1047-4ba6-a75c-87885fba59a7/rainbow-and-cacti.jpg",
      width: 1000,
      height: 697
    },
    alt: "Rainbow and cacti: two round green cacti in dark pots joined by a rainbow, on a terracotta floor under a pale peach sky, acrylic on paper",
    story: [
      "Two round cacti in dark pots stand on either side of an empty space, and a rainbow bridges the gap between them. They do not touch, but they are clearly together.",
      "Even the prickliest things can be joined by color."
    ]
  }
};
