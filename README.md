# elettra-ministeri-site

Front-end modules for [elettraministeri.com](https://www.elettraministeri.com), a Squarespace 7.1 site. The page markup and the stylesheet live in Squarespace; the behaviour lives here as ES modules and is loaded from jsDelivr.

## What it does

- **Painting effect** – the home hero repaints each work stroke by stroke (leaves, pills and dots that follow the contours of the painting), then lays soft patches of the real image across the canvas and eases a uniform glaze in over the top, so the last frame is the picture itself.
- **Hero slideshow** – cycles through the works, with dots to jump to one and a thin two-part line showing the time left on the current slide: a gold segment while the painting is being painted, an off-white one while the finished painting is on show. Hovering the hero with a mouse holds the current work once its painting has been revealed (never while it is still being painted); leaving lets the remaining time run out.
- **Series chapters** – each chapter takes its tone and color swatches from its painting.
- **Page tone** – the page background and header follow the section in view.
- **Color map** – each series has one color, used for its section on the home page and for its own page, so the colors work as a map of the site. One config file drives both.
- **Artist video** – the video in the home page's artist section shows a cover image with a play button; the YouTube player loads only when the visitor presses play.
- **Postcards page** – the standalone "Scrivo una cartolina" landing page gets a link back to the home page and a centered text card.
- **Enquiry drawer** – on every page, links to `/enquire` open the enquiry form in a side drawer so visitors keep their place. The form can arrive with `?SQF_WORK=<title>` and then says which work the enquiry is about.

## Loading it on the site

Two entry points, one `<script type="module">` line each.

Home page code block (painting effect, hero, chapters, page tone):

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.7.0/src/main.js"></script>
```

Site-wide Code Injection, Footer (enquiry drawer):

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.1.0/src/enquiry/main.js"></script>
```

Site-wide Code Injection, Header (series colors; must be in the header so the page is colored before it is first painted):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.7.1/src/themes/tones.generated.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.7.1/src/themes/series-theme.css">
<script src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.7.1/src/themes/series-attr.js"></script>
```

Postcards page, Page Settings → Advanced → Page Header Code Injection:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.6.4/src/pages/scrivo.css">
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.6.4/src/pages/scrivo.js"></script>
```

Always pin a release tag (for example `@v1.7.0`). `@main` is cached by jsDelivr for hours, so a tag is the only way to know which code the site runs. To roll out a change: commit, tag a new version, and change the version in that line. To roll back, put the old version back.

## Layout

```
src/
  main.js                     entry point: wires the features to the page
  lib/
    dom.js                    initOnceFor, onFirstVisible
    image.js                  loadImage, sampleImage
    color.js                 palette extraction, hex, tones, swatches
    motion.js                 prefersReducedMotion
    stylesheet.js             loadStylesheet
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
    video-facade.js           click-to-play YouTube video (cover image + play button)
    video-facade.css
  themes/
    tones.config.js           THE FILE TO EDIT: which painting gives each series its color, and the global settings
    tones.generated.js        generated: the tones as a JS module (home page sections)
    tones.generated.css       generated: the tones as CSS variables (series pages)
    series-theme.css          maps the tone onto the site's color variables for series pages
    series-attr.js            tags a series page with data-series before it is painted
  scripts/
    build-tones.mjs           generates the two tones.generated files
  pages/
    scrivo.js                 back link for the standalone postcards page
    scrivo.css                its centered card layout
  enquiry/
    main.js                   entry point for every page: drawer links, embedded form, work note
    drawer.js                 the side drawer
    work-note.js              "Enquiring about: <work>" above the form
    enquiry.css               styles for the drawer, the note and the embedded form
```

`paintImage` knows nothing about the page, so any page can import it:

```js
import { paintImage } from 'https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.7.0/src/paint/paint-image.js';
```

## Expected markup

The modules look for `.em-home` with `.eh-hero` (containing `#eh-heroImg`, `#eh-heroCanvas`, `.samples`, `.wash`, `.copy`, `.replay`) and `.chapter` elements with a `data-img` attribute and a `.frame` holding an `img`. The styles for these, and for `.eh-nav`, `.eh-line` and `.eh-seg*`, are in the site's Custom CSS.

## Colors

Every series has one color. The home page section for a series and the series page itself both use it, so a visitor learns that Mediterranean is deep sea blue, Maternity is rust, and so on.

All of it comes from `src/themes/tones.config.js`:

- **One series:** give it `pick: 2` to use another color from its painting, or `bg: '#1f3a2e'` to set the color directly.
- **All series at once:** change `TONE_SETTINGS`, for example a lower `darkness` for darker tones.
- **A new series:** add one line with the series' page name and the painting its color should come from.

Then regenerate and release:

```sh
npm install                # once
npm run build:tones        # prints each series' color and the alternative palette colors to pick from
git add -A && git commit -m "Update series colors"
git tag vX.Y.Z && git push origin main vX.Y.Z
```

Then check that jsDelivr serves the new tag and change the version in the two places that load it: the home page code block (`src/main.js`) and the site-wide Header Code Injection (the three tags above). The text colors used on the tones are variables in the site's Custom CSS (`--em-bg`, `--em-ink`, `--em-muted`, `--em-line`, `--em-body`).

## Changing the works

Edit `src/features/hero/works.js`, commit, tag a new version and update the version in the script line.
