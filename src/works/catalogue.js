/**
 * What is known about each painting, written by hand (everything about its colors is generated; see src/color/).
 * Keyed by the work's page name: its page is /paintings/<key> and its entry on the series page has the same id.
 * Every field but title, series, medium, image and alt is optional ('colorNote' adds paragraphs to the reading of the painting's colors; a 'context' adds a section about where a work comes from: intro, echoes with sources, closing), and a section of the page appears only when
 * its field exists: add 'story' (one string per paragraph), 'size', 'frame' or 'price' (whole euros for the work itself; a frame is added on top of it automatically (200 by default, or the work's own `framePrice`; `frameNote` is the short label for the facts line), see works/price.js; a work without one shows no price) as they become known.
 */
export const CATALOGUE = {
  'lighthouses': {
    title: "Lighthouses in the open sea",
    series: "mediterranean",
    medium: "Acrylic on canvas",
    size: "100 × 50 cm",
    price: 750,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/80fe7bd2-f0e7-4ff0-b22b-bd5f5e4a1750/mediterranean-lighthouses.jpg",
      width: 2476,
      height: 1242
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
    price: 600,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/0b1d1e51-8576-4b9e-a2c5-99787967a690/mediterranean-wave.jpg",
      width: 2404,
      height: 2407
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
    price: 875,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/0d0224e8-438d-487a-8a13-f381c7c6a4d7/mediterranean-flow.jpg",
      width: 2474,
      height: 2476
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
    price: 475,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/ee822018-8643-4294-bfc5-2e4d34ec1c35/mediterranean-pomegranates.jpg",
      width: 2476,
      height: 1634
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
    price: 300,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/54bf4da4-8e49-48d0-8b7c-312a76934e89/mediterranean-fishfit.jpg",
      width: 2424,
      height: 1815
    },
    alt: "FishFit: patterned fish in pink, green and blue swimming in a dark starry sea, acrylic on canvas",
    story: [
      "Fish in pink, green and blue turn through a dark, starry water, each one wearing its own pattern. It is a crowded, joyful picture, and a little confusing on purpose.",
      "I like how a shoal can be many and one at the same time. The patterns repeat, but no two fish are alike."
    ]
  },
  'medusa': {
    title: "Medusa",
    series: "mediterranean",
    medium: "Acrylic on canvas",
    size: "18 × 24 cm",
    price: 150,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/0d5fc474-fa9a-43b1-b832-9d3bd62a02a0/mediterranean-medusa.jpg",
      width: 2400,
      height: 3202
    },
    alt: "Medusa: a calm, pale blue face with snakes coiled in her hair, painted entirely in blues, acrylic on canvas",
    story: [
      "Medusa with no face to read, only a calm, pale blue one, and snakes knotted into her hair.",
      "I painted her entirely in blues, so the one who turned people to stone looks quiet, almost serene."
    ]
  },
  'vacanze-in-santorini': {
    title: "Vacanze in Santorini",
    series: "mediterranean",
    medium: "Acrylic on canvas",
    size: "50 × 60 cm",
    price: 550,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/c3ce4efb-0589-432c-b0b3-4a35a85f7154/archive-donkey-in-santorini.jpg",
      width: 2400,
      height: 2898
    },
    alt: "Vacanze in Santorini: a brown donkey with roses and an evil eye on its saddle climbing white stone steps below a blue dome and the sea, acrylic",
    story: [
      "A little donkey climbing the white stone steps of Santorini under a blue dome, with roses and an evil eye on its saddle.",
      "Dome, whitewashed walls, steps and sea are flat shapes held together by black outlines."
    ]
  },
  'maternity-i': {
    title: "Maternity I",
    series: "maternity",
    medium: "Acrylic on watercolor canvas",
    size: "18 × 25.5 cm",
    price: 125,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/2db645de-d443-4619-b04d-50616c099d4f/maternity-i-v2.jpg",
      width: 1000,
      height: 1433
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
    medium: "Acrylic on watercolor canvas",
    size: "18 × 25.5 cm",
    price: 125,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/219f0475-e346-4f9a-ba1e-fa51b336d487/maternity-ii-v2.jpg",
      width: 1000,
      height: 1433
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
    price: 600,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/0b1d79c4-2ded-4f2e-87a6-509427c4da84/maternity-iii-v3.jpg",
      width: 2400,
      height: 3438
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
    size: "21 × 29.7 cm (A4)",
    price: 200,
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
    size: "33 × 42 cm with frame",
    price: 325,
    frame: "Hand-painted frame, part of the work",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/d0403442-5dd2-4b6c-8c1b-93b9b2388298/carretto-siciliano-v2.jpg",
      width: 2400,
      height: 1845
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
    size: "33 × 42 cm with frame",
    price: 325,
    frame: "Hand-painted frame, part of the work",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/34d3cfec-6b34-4410-9aee-d191daad4102/pistacchi-v2.jpg",
      width: 2400,
      height: 1833
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
    size: "33 × 42 cm with frame",
    price: 325,
    frame: "Hand-painted frame, part of the work",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/3daf7474-cbdc-4815-a08a-1949bf772d23/il-sole-v2.jpg",
      width: 2400,
      height: 1833
    },
    alt: "Il sole: a smiling sun in a blue diamond on a red, orange and green geometric field, inside a hand-painted cream frame with blue and red arches",
    story: [
      "A sun with a wide smile sits inside a blue diamond, over a field of red, orange and green. It is the Sicilian sun as I carry it: warm, a little loud, impossible to ignore.",
      "The cream frame, painted by hand with blue and red arches, makes the picture feel like a tile, or a doorway."
    ]
  },
  'testa-di-moro': {
    title: "Testa di moro",
    series: "sicily",
    medium: "Acrylic on canvas",
    size: "60 × 60 cm without frame",
    frame: "Red painted frame, part of the work",
    frameNote: "red painted frame",
    framePrice: 50,
    price: 600,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/cd277713-b540-46f1-9c76-14f249705704/sicily-moor-head-v2.jpg",
      width: 2400,
      height: 2401
    },
    alt: "Testa di moro: a smiling man's head in profile, with a yellow headscarf and a red curl, beside a prickly pear and a red cart wheel inside a ring of red and blue eyes, with lemons in the four corners of a blue and white tiled ground, in a red frame",
    story: [
      "The testa di moro is one of Sicily’s oldest images: a painted ceramic head, a man with a mustache and a turban, set on a balcony with basil growing out of it. The story told about it is a dark love story, and I wanted to keep the face and let the color say what is bright about the island.",
      "Around his head I put what I see when I think of home: the prickly pear with its red fruit, lemons in the four corners, the wheel of a Sicilian cart, and a ring of the same painted eyes that run along the carts’ sides."
    ]
  },
  'santa-rosalia': {
    title: "Santa Rosalia",
    series: "sicily",
    medium: "Acrylic on canvas",
    size: "42 × 33 cm with frame",
    price: 325,
    frame: "Hand-painted frame, part of the work",
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/63077b44-b92a-44af-824e-52d0a57003c3/sicily-lilies-v2.jpg",
      width: 2400,
      height: 3129
    },
    alt: "Santa Rosalia, the protector of Palermo: a woman with a crown of roses and long fair hair, in a brown mantle and a pink dress, holding white lilies against a green ground, inside a hand-painted frame of red, green and blue panels with shells and suns",
    story: [
      "Santa Rosalia is the protector of Palermo. She lived as a hermit on Monte Pellegrino, and her bones, found there in 1624, are remembered as the end of a plague that had gripped the city. Every July Palermo still celebrates her, with a procession and a night of fireworks.",
      "I painted her as she is shown in so many Sicilian images: young, with a crown of roses and white lilies in her hand. The frame carries her world outward, with shells, suns and stars, and, as in the rest of this series, it is painted by hand."
    ]
  },
  'cart-wheel': {
    title: "Cart wheel",
    series: "sicily",
    medium: "Painted wood",
    size: "52 cm diameter",
    price: 425,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/d78134ef-a644-4aca-98a2-16e0c64c2b66/sicilian-wheel-on-sheet.jpg",
      width: 2000,
      height: 2048
    },
    alt: "Cart wheel: a red wooden wheel with twelve yellow and red spokes, a blue, white and green flower at the hub and a ring of rainbow arches and lotus flowers on the rim",
    story: [
      "A Sicilian cart is painted all over, and its wheels are some of the most carefully painted parts: spokes in red and yellow, a flower at the hub, small arches of color around the rim. This one is a wheel on its own.",
      "It is wood, not canvas, and I painted it the same way as the paintings in this series: flat color, no shading, every part given its own bright patch."
    ]
  },
  'sunburst': {
    title: "Sunburst",
    series: "sicily",
    medium: "Acrylic on canvas",
    size: "30 × 30 cm without frame",
    frame: "Yellow painted frame",
    frameNote: "yellow painted frame",
    framePrice: 50,
    price: 250,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/f06bd180-1605-4cf7-8253-1877952765aa/sicily-sunburst.jpg",
      width: 2400,
      height: 2400
    },
    alt: "Sunburst: a golden sun at the center of rays in rust, gold, violet and sky blue, acrylic on canvas in a yellow frame",
    story: [
      "A sun at the center and its rays running out to the edges, in rust, gold, violet and a cool sky blue.",
      "The frame is painted the yellow of the sun, so the light carries on past the canvas."
    ]
  },
  'the-bonding': {
    title: "The Bonding",
    series: "human-figure",
    medium: "Acrylic on canvas",
    size: "116 × 73 cm",
    price: 1075,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/b12f2950-9731-48af-b9ca-cf07dbab8a3d/the-bonding-clean.jpg",
      width: 1551,
      height: 2480
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
    price: 600,
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1661723960416-YL4284WHMOEKYM77FYZR/01+The+Hug.jpg",
      width: 1000,
      height: 1364
    },
    alt: "Amore e Pandemia I: a red figure and a green figure in an embrace against a blue and black ground, acrylic on canvas",
    colorNote: [
      "Red and green are opposites on the traditional artist's color wheel, and here they are pressed together. The green figure is the larger mass and the red one holds on from behind, so the opposite is the smaller color, as in most of this body of work, but in contact with the main color, not set apart from it.",
      "Neither figure has a face. The blue behind them runs from light on the left to near black on the right, and the only warm color in the picture is the one inside the embrace."
    ],
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
    price: 600,
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/596fbc34c534a5fa937bd9bf/1661723893566-A50LFYP3717C8TB31ZGH/02+The+Hug.png",
      width: 1000,
      height: 1395
    },
    alt: "Amore e Pandemia II: a red figure and a green figure embracing in deep blue light, acrylic on canvas",
    colorNote: [
      "The roles of the first painting are reversed: the red figure is now the larger one and the green figure holds on. The two colors cover almost equal amounts, the nearest this body of work comes to treating two opposite hues as equal partners.",
      "The blue behind them is reversed too, near black at the left and a clear blue at the right, so the light falls on the other side of the embrace."
    ],
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
    price: 175,
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
    size: "21 × 29.7 cm (A4)",
    price: 200,
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
    price: 20,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/50112205-332a-418a-a6ca-d360f2b04d91/archive-help-v2.jpg",
      width: 2430,
      height: 1801
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
    price: 1025,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/0979d960-fe28-469a-858d-36d96a14375b/archive-messengers-of-love-v2.jpg",
      width: 2437,
      height: 1918
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
    size: "18 × 24 cm",
    price: 150,
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
    size: "25.5 × 18 cm",
    price: 15,
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
  },
  'lilies': {
    title: "Lilies",
    series: "archive",
    medium: "Watercolor on vintage paper",
    size: "26 × 20 cm",
    price: 15,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/8573e1e8-5e8e-4ebb-89d6-4bfaaf1f7675/archive-lilies-v3.jpg",
      width: 2000,
      height: 2600
    },
    alt: "Lilies: two white calla lilies with yellow centers and teal leaves, painted in loose watercolor strokes over a page of an old Italian book"
  },
  'lemons': {
    title: "Lemons",
    series: "archive",
    medium: "Watercolor on vintage paper",
    size: "26 × 20 cm",
    price: 15,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/8deedb6b-8664-4834-9b9e-d7b41429aec0/archive-lemons-v3.jpg",
      width: 2000,
      height: 1538
    },
    alt: "Lemons: a whole lemon and a halved one above a band of deep blue, painted in watercolor over a page of an old Italian book"
  },
  'cactus-in-the-desert': {
    title: "Cactus in the desert",
    series: "archive",
    medium: "Acrylic on paper",
    size: "30 × 20.5 cm",
    price: 15,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/fbefe225-5643-4268-bd12-008e6da26dba/archive-cactus-in-the-desert-v3.jpg",
      width: 1880,
      height: 2608
    },
    alt: "Cactus in the desert: a green prickly pear on scaled hills under a large yellow sun with rays of orange, pink and cream"
  },
  'seahorse': {
    title: "Seahorse",
    series: "archive",
    medium: "Acrylic on paper",
    size: "18 × 26.5 cm",
    price: 15,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/cada1a4c-bf8b-4b4d-b405-d5f1cf5b6d65/archive-seahorse-v3.jpg",
      width: 1978,
      height: 2929
    },
    alt: "Seahorse: a green and yellow seahorse inside a green oval, ringed by green marks, on a ground split between yellow and orange"
  },
  'swan-in-a-shell': {
    title: "Swan inside a shell",
    series: "archive",
    medium: "Oil pastels on handmade recycled cotton paper",
    size: "30 × 21 cm",
    price: 15,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/800f31e7-f56e-452f-af89-3c0d58745e19/archive-swan-in-a-shell-v3.jpg",
      width: 2000,
      height: 1400
    },
    alt: "Swan inside a shell: a white swan with open wings resting in a teal scalloped shell, on handmade grey-brown paper"
  },
  'rainbow-shell': {
    title: "Rainbow shell",
    series: "archive",
    medium: "Oil pastels on handmade recycled cotton paper",
    size: "30 × 21 cm",
    price: 15,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/cadea2a3-13ce-41ac-a2bd-16c4e227f367/archive-rainbow-shell-v3.jpg",
      width: 2000,
      height: 1400
    },
    alt: "Rainbow shell: a spiral shell with wide bands of red, ochre, blue, violet and yellow, outlined in black, on handmade grey-brown paper"
  },
  'heart-in-hand': {
    title: "Heart in hand",
    series: "archive",
    medium: "Acrylic on canvas",
    size: "18 × 24 cm",
    price: 150,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/e3df0049-fb04-4803-bbe1-4c06b076ba16/archive-heart-in-hand.jpg",
      width: 2400,
      height: 3204
    },
    alt: "Heart in hand: a pink open hand with a red heart in its palm on a deep green ground, with small gems and gold and red stars, acrylic on canvas",
    story: [
      "An open hand with a heart in its palm, pink on a deep green, with small gems and gold and red stars around it.",
      "Each finger carries a small symbol: an arrow, diamonds, circles. A hand that offers."
    ]
  },
  'scio': {
    title: "Sciò",
    series: "archive",
    medium: "Acrylic on canvas",
    size: "18 × 24 cm",
    price: 150,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/46420d68-f5b4-4955-a6ae-d8415dbb7186/archive-scio.jpg",
      width: 2400,
      height: 3190
    },
    alt: "Sciò: a red horn wearing a golden crown among stars on a green ground, with the word Sciò in white, acrylic on canvas",
    story: [
      "A red horn wearing a golden crown, under stars on a green night. It is the lucky charm of southern Italy, made king.",
      "I wrote “Sciò” beside it, to send the bad luck out."
    ],
    context: {
      heading: "Where this horn comes from",
      intro: [
        "The red horn is a charm you see all over the south of Italy, hung in houses and cars and worn on a chain, always against the evil eye and bad luck. I crowned mine and let it stand among the stars."
      ],
      echoes: [
        {
          name: "The cornicello",
          place: "Naples and the south of Italy",
          text: "A small twisted horn, worn or hung against the evil eye and bad luck. In Neapolitan it is the curniciello; elsewhere it is called cornetto or corno. It is made of red coral, gold, silver, bone or terracotta, and it is found across the south, in Campania, Sicily, Calabria and Apulia. In Naples it is still made by hand in the shops of San Gregorio Armeno, and people buy it there to give as a present.",
          sources: [
            {
              label: "Cornicello (Wikipedia)",
              url: "https://en.wikipedia.org/wiki/Cornicello"
            },
            {
              label: "Visit Naples",
              url: "https://visitnaples.eu/en/neapolitanity/tales-of-naples/what-is-the-curniciello-how-did-it-come-about-history-and-meaning"
            }
          ]
        },
        {
          name: "A shape older than its red",
          place: "Mediterranean folk belief",
          text: "The red makes people think of a chili pepper, but chili peppers only reached Europe after the voyages of Columbus, so the shape is much older than that likeness. Some accounts trace the horn back to prehistoric times, as a sign of strength and fertility, and link it to the horn of plenty of Greek myth. Those older origins are not firmly documented.",
          sources: [
            {
              label: "Cornicello (Wikipedia)",
              url: "https://en.wikipedia.org/wiki/Cornicello"
            },
            {
              label: "Visit Naples",
              url: "https://visitnaples.eu/en/neapolitanity/tales-of-naples/what-is-the-curniciello-how-did-it-come-about-history-and-meaning"
            }
          ]
        },
        {
          name: "The word",
          place: "Italian",
          text: "“Sciò” is an Italian call, usually said twice, used to chase something away.",
          sources: [
            {
              label: "Treccani, Vocabolario",
              url: "https://www.treccani.it/vocabolario/scio/"
            }
          ]
        }
      ]
    }
  },
  'mask-divine': {
    title: "Mask Divine",
    series: "textiles",
    medium: "Felt, buttons and linen",
    size: "41 × 50 cm",
    price: 375,
    image: {
      src: "https://images.squarespace-cdn.com/content/596fbc34c534a5fa937bd9bf/7dca847c-fdb9-4619-8b03-e8f6fcb84afa/textile-mask.jpg",
      width: 1000,
      height: 1400
    },
    alt: "Mask Divine: a yellow felt face with a white stitched border, black hair in two lobes, red lips and five small buttons on the forehead, hung from a branch between two green monstera leaves on cream linen with blue and violet squares",
    story: [
      "A face made of felt, stitched by hand, in the yellow of a lit window. A black coiffure rises above it in two soft lobes, five buttons sit on the forehead like a jewel, and the whole mask hangs from a branch against two squares of blue and violet linen, between a pair of green monstera leaves.",
      "I made it slowly, one piece of felt at a time, so that color could be something you touch. It is a mask in the oldest sense: not something to hide behind, but a face that holds a presence."
    ],
    context: {
      heading: "Where this face comes from",
      intro: [
        "I did not set out to copy a mask, but I know where this face comes from. It is the face I keep meeting in the masks of West and Central Africa: a woman, calm, almost too perfect to be real, with her hair built up like architecture and her forehead marked.",
        "Everything I put on her has a cousin there: the pale rim stitched around the face, the two dark lobes of hair with their white bands, the five buttons set like a jewel between the brows, the red mouth. I made mine in felt and thread because I wanted to be able to touch it. Looking at it now, I can see the older faces standing behind it."
      ],
      echoes: [
        {
          name: "The Punu masks of Gabon",
          place: "Gabon",
          text: "These are the ones I think of first. The face is painted white with kaolin, the color of the spirit world, and the hair rises in two dark lobes. On the forehead there is a diamond, like the marks Punu women once wore, and the lips are often red. The mask is danced on stilts at funerals and celebrations, and the woman it shows is both a real beauty of the village and an ancestor: someone to honor, and to see on her way.",
          sources: [
            {
              label: "Brooklyn Museum",
              url: "https://www.brooklynmuseum.org/objects/4806"
            },
            {
              label: "Art Institute of Chicago",
              url: "https://www.artic.edu/artworks/20578/mask-mukudj"
            },
            {
              label: "The Metropolitan Museum of Art",
              url: "https://www.metmuseum.org/art/collection/search/318667"
            }
          ]
        },
        {
          name: "The Baule portrait masks",
          place: "Côte d’Ivoire",
          text: "A Baule mask is not a likeness. It is a double, the person as she should be seen: a high forehead, lowered eyes, hair carefully arranged. It is made to honor someone who is alive, often a woman, and I love that idea of a face made as a gift.",
          sources: [
            {
              label: "The Metropolitan Museum of Art",
              url: "https://metmuseum.org/art/collection/search/317834"
            },
            {
              label: "Cleveland Museum of Art",
              url: "https://clevelandart.org/art/1974.203"
            }
          ]
        },
        {
          name: "The Gelede masks of the Yoruba",
          place: "Nigeria and Benin",
          text: "Gelede is danced to honor women, above all the powerful Mothers. Their faces are calm and “cool”, the way women are expected to be, under hair worn in three lobes. The Mothers are honored, entertained and appeased, and I like that a woman’s power is something a whole village dances for.",
          sources: [
            {
              label: "Hofstra University Museum",
              url: "https://www.hofstra.edu/pdf/community/museum/gelede.pdf"
            },
            {
              label: "Princeton University Art Museum",
              url: "https://artmuseum.princeton.edu/art/collections/objects/61091"
            }
          ]
        }
      ],
      closing: "In all of them a woman’s face is made to be honored. That is what I wanted from mine: something calm, a little beyond the human, that you can look at for a long time. It is the same thing I keep coming back to in my work, my idea of femininity and womanhood. I came to these masks through museum collections, not through the people who made them, and I do not want to speak for them."
    }
  }
};
