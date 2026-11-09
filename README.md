# elettra-ministeri-site

Front-end modules for [elettraministeri.com](https://www.elettraministeri.com), a Squarespace 7.1 site. The page markup and the stylesheet live in Squarespace; the behaviour lives here as ES modules and is loaded from jsDelivr.

## What it does

- **Painting effect** – the home hero repaints each work stroke by stroke (leaves, pills and dots that follow the contours of the painting), then glazes the real image over the canvas so the last frame is the picture itself.
- **Hero slideshow** – cycles through the works, with dots to jump to one and a thin line showing the time left on the current slide.
- **Series chapters** – each chapter takes its tone and colour swatches from its painting.
- **Page tone** – the page background and header follow the section in view.

## Loading it on the site

One line in the home page's code block:

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.0.0/src/main.js"></script>
```

Always pin a release tag (`@v1.0.0`). `@main` is cached by jsDelivr for hours, so a tag is the only way to know which code the site runs. To roll out a change: commit, tag a new version, and change the version in that line. To roll back, put the old version back.

## Layout

```
src/
  main.js                     entry point: wires the features to the page
  lib/
    dom.js                    initOnceFor, onFirstVisible
    image.js                  loadImage, sampleImage
    colour.js                 palette extraction, hex, tones, swatches
    motion.js                 prefersReducedMotion
  paint/
    paint-image.js            paintImage(img, canvas, W, H, speed): the timeline
    config.js                 duration, stroke counts, sizes, shape mix
    source-pixels.js          cover-fitted pixel access to the source image
    flow-field.js             contour directions for strokes to follow
    brush-hand.js             where, how big and which way the next mark goes
    shapes.js                 leaf, pill and dot marks
  features/
    hero/
      hero.js                 the slideshow
      works.js                the works it cycles through
      slideshow-controls.js   dots and progress line
      colour-samples.js       colour swatches that wash the hero
    chapters.js
    page-tone.js
```

`paintImage` knows nothing about the page, so any page can import it:

```js
import { paintImage } from 'https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.0.0/src/paint/paint-image.js';
```

## Expected markup

The modules look for `.em-home` with `.eh-hero` (containing `#eh-heroImg`, `#eh-heroCanvas`, `.samples`, `.wash`, `.copy`, `.replay`) and `.chapter` elements with a `data-img` attribute and a `.frame` holding an `img`. The styles for these, and for `.eh-nav` and `.eh-line`, are in the site's Custom CSS.

## Changing the works

Edit `src/features/hero/works.js`, commit, tag a new version and update the version in the script line.
