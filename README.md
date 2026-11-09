# elettra-ministeri-site

Front-end modules for [elettraministeri.com](https://www.elettraministeri.com), a Squarespace 7.1 site. The page markup and the stylesheet live in Squarespace; the behaviour lives here as ES modules and is loaded from jsDelivr.

## What it does

- **Painting effect** – the home hero repaints each work stroke by stroke (leaves, pills and dots that follow the contours of the painting), then lays soft patches of the real image across the canvas and eases a uniform glaze in over the top, so the last frame is the picture itself.
- **Hero slideshow** – cycles through the works, with dots to jump to one and a thin two-part line showing the time left on the current slide: a gold segment while the painting is being painted, an off-white one while the finished painting is on show. Hovering the hero with a mouse holds the current work once its painting has been revealed (never while it is still being painted); leaving lets the remaining time run out.
- **Series chapters** – each chapter takes its tone and color swatches from its painting.
- **Page tone** – the page background and header follow the section in view.
- **Enquiry drawer** – on every page, links to `/enquire` open the enquiry form in a side drawer so visitors keep their place. The form can arrive with `?SQF_WORK=<title>` and then says which work the enquiry is about.

## Loading it on the site

Two entry points, one `<script type="module">` line each.

Home page code block (painting effect, hero, chapters, page tone):

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.5.1/src/main.js"></script>
```

Site-wide Code Injection, Footer (enquiry drawer):

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.1.0/src/enquiry/main.js"></script>
```

Always pin a release tag (for example `@v1.5.1`). `@main` is cached by jsDelivr for hours, so a tag is the only way to know which code the site runs. To roll out a change: commit, tag a new version, and change the version in that line. To roll back, put the old version back.

## Layout

```
src/
  main.js                     entry point: wires the features to the page
  lib/
    dom.js                    initOnceFor, onFirstVisible
    image.js                  loadImage, sampleImage
    color.js                 palette extraction, hex, tones, swatches
    motion.js                 prefersReducedMotion
  paint/
    paint-image.js            paintImage(img, canvas, W, H, speed): the timeline
    config.js                 duration, stroke counts, sizes, shape mix
    source-pixels.js          cover-fitted pixel access to the source image
    flow-field.js             contour directions for strokes to follow
    brush-hand.js             where, how big and which way the next mark goes
    shapes.js                 leaf, pill and dot marks
    reveal.js                 soft patches of the real image laid across the canvas
  features/
    hero/
      hero.js                 the slideshow
      works.js                the works it cycles through
      slideshow-controls.js   dots and progress line
      color-samples.js       color swatches that wash the hero
    chapters.js
    page-tone.js
  enquiry/
    main.js                   entry point for every page: drawer links, embedded form, work note
    drawer.js                 the side drawer
    work-note.js              "Enquiring about: <work>" above the form
    enquiry.css               styles for the drawer, the note and the embedded form
```

`paintImage` knows nothing about the page, so any page can import it:

```js
import { paintImage } from 'https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.5.1/src/paint/paint-image.js';
```

## Expected markup

The modules look for `.em-home` with `.eh-hero` (containing `#eh-heroImg`, `#eh-heroCanvas`, `.samples`, `.wash`, `.copy`, `.replay`) and `.chapter` elements with a `data-img` attribute and a `.frame` holding an `img`. The styles for these, and for `.eh-nav`, `.eh-line` and `.eh-seg*`, are in the site's Custom CSS.

## Changing the works

Edit `src/features/hero/works.js`, commit, tag a new version and update the version in the script line.
