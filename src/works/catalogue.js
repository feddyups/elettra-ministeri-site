/**
 * What is known about each painting, written by hand (everything about its colors is generated; see src/color/).
 * Keyed by the work's page name: its page is /paintings/<key> and its entry on the series page has the same id.
 * Every field but title, series, medium, image and alt is optional, and a section of the page appears only when
 * its field exists: add 'story' (one string per paragraph), 'year', 'size' or 'frame' as the artist provides them.
 */
export const CATALOGUE = {
  lighthouses: {
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
  wave: {
    title: "Wave",
    series: "mediterranean",
    medium: "Acrylic on canvas",
    size: "60 × 60 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1528638173689-P8T0RMNYOWAKAER05R02/wave.jpg",
      width: 1000,
      height: 1000
    },
    alt: "Wave: a patterned blue wave above a shoal of colorful fish and jellyfish, acrylic on canvas"
  },
  flow: {
    title: "Flow",
    series: "mediterranean",
    medium: "Acrylic on canvas",
    size: "80 × 80 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1528637939887-YJZX423ATYQ6OB9W65L4/flow.jpg",
      width: 1000,
      height: 1000
    },
    alt: "Flow: a red seahorse among shells and swirling currents on a green ground, acrylic on canvas"
  },
  pomegranates: {
    title: "Pomegranates",
    series: "mediterranean",
    medium: "Acrylic on canvas",
    size: "40 × 60 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/f91235b4-3558-4730-acf4-fd999724c8e3/pomegranates.jpg",
      width: 1000,
      height: 667
    },
    alt: "Pomegranates: a cut pomegranate and a whole one beside a blue bowl on a table, with soft clouds behind, acrylic on canvas"
  },
  fishfit: {
    title: "FishFit",
    series: "mediterranean",
    medium: "Acrylic on canvas",
    size: "40 × 30 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1528638232839-OQIJ0LNO8CM609E5DQT3/fish_fit.jpg",
      width: 1000,
      height: 750
    },
    alt: "FishFit: patterned fish in pink, green and blue swimming in a dark starry sea, acrylic on canvas"
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
      "One of three paintings that reflect my own pregnancy journey. They show the real experience of pregnancy and avoid idealized images: the challenges, the strength and the beauty of maternity."
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
      "One of three paintings that reflect my own pregnancy journey. They show the real experience of pregnancy and avoid idealized images: the challenges, the strength and the beauty of maternity."
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
      "One of three paintings that reflect my own pregnancy journey. They show the real experience of pregnancy and avoid idealized images: the challenges, the strength and the beauty of maternity."
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
    alt: "The Shape of Beauty: a pink figure kneeling with its back turned, against warm oranges and rust-striped hills, acrylic on canvas"
  },
  carretto: {
    title: "Carretto siciliano",
    series: "sicily",
    medium: "Acrylic on canvas",
    frame: "Hand-painted frame, part of the work",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/8b291fd7-893e-4537-b1e8-9aa92c587177/carretto.jpg",
      width: 1000,
      height: 850
    },
    alt: "Carretto siciliano: a painted Sicilian cart and a plumed horse inside a hand-painted red and cream frame"
  },
  pistacchi: {
    title: "Pistacchi",
    series: "sicily",
    medium: "Acrylic on canvas",
    frame: "Hand-painted frame, part of the work",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/489625cb-1c9d-4bbd-9191-7b925e86ffd8/pistacchi.jpg",
      width: 1000,
      height: 850
    },
    alt: "Pistacchi: three pistachios on a blue disc surrounded by a mandala, inside a hand-painted yellow and blue frame"
  },
  sole: {
    title: "Il sole",
    series: "sicily",
    medium: "Acrylic on canvas",
    frame: "Hand-painted frame, part of the work",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/70b83ee7-7ffe-44c9-a374-0687b055c447/sole.jpg",
      width: 1000,
      height: 850
    },
    alt: "Il sole: a smiling sun in a blue diamond on a red, orange and green geometric field, inside a hand-painted cream frame with blue and red arches"
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
    alt: "The Bonding: two intertwined figures, one orange-red and one yellow-green, lifting a blue sphere against a deep blue ground, acrylic on canvas"
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
    alt: "Keep looking up: a brown figure kneeling on a rainbow and lifting a smiling sun with golden rays above her head, acrylic on canvas pad"
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
    alt: "He’s raining Flowers: a green torso with raised arms, with small red flowers and clovers falling on either side against a pale yellow and pink ground, acrylic on canvas"
  },
  help: {
    title: "Help",
    series: "archive",
    medium: "Acrylic on textured paper",
    size: "32 × 25 cm",
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1528638090169-3WYNVACGH7G9O9XEUX92/help.jpg",
      width: 1000,
      height: 750
    },
    alt: "Help: a red hand and a blue hand reaching towards each other through green jungle leaves, acrylic on textured paper"
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
  scarab: {
    title: "Scarab",
    series: "archive",
    medium: "Acrylic on canvas",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/04609aa9-05d7-4834-9165-8e5681125efc/scarab.jpg",
      width: 1000,
      height: 1346
    },
    alt: "Scarab: a red and brown scarab beetle with pale blue wings lifting a golden sun, on a green field of stars and gems, acrylic on canvas"
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
    alt: "Rainbow and cacti: two round green cacti in dark pots joined by a rainbow, on a terracotta floor under a pale peach sky, acrylic on paper"
  }
};
