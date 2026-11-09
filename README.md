# elettra-ministeri-site

Front-end modules for [elettraministeri.com](https://www.elettraministeri.com), a Squarespace 7.1 site. The page markup and the stylesheet live in Squarespace; the behaviour lives here as ES modules and is loaded from jsDelivr.

## What it does

- **Painting effect** – the home hero repaints each work stroke by stroke (leaves, pills and dots that follow the contours of the painting), then lays soft patches of the real image across the canvas and eases a uniform glaze in over the top, so the last frame is the picture itself.
- **Hero slideshow** – cycles through the works, with dots to jump to one and a thin two-part line showing the time left on the current slide: a gold segment while the painting is being painted, an off-white one while the finished painting is on show. Hovering the hero with a mouse holds the current work once its painting has been revealed (never while it is still being painted); leaving lets the remaining time run out.
- **Series chapters** – each chapter takes its tone and color swatches from its painting.
- **Page tone** – the page background and header follow the section in view.
- **Color map** – each series has one color, used for its section on the home page and for its own page, so the colors work as a map of the site. One config file drives both.
- **Color infographic** – reusable blocks that show the colors of the work (a hue wheel, the loudest colors, the share of warm and cool, a warm-to-cool map of every painting, and a strip of colors per painting). The same component renders the whole body of work on the About page, one series on each series page, and a compact version on the home page. Every color and painting links to the painting's page.
- **Painting pages** – every painting has its own page (`/paintings/<name>`) with the picture (click to enlarge), its story in the artist's words, the technical details, a reading of its colors (point at a color to see where it lives in the picture; click to copy its code), where it sits among all the work, the paintings closest to it in color, the rest of its series, and the enquiry form inline. Each page is one empty placeholder in Squarespace; everything on it comes from `src/works/catalogue.js` and the generated color data.
- **Color names** – colors are named the way a painter would (vermilion, ochre, bottle green) everywhere they are shown, from one list in `src/lib/color-science.js`.
- **Artist video** – the video in the home page's artist section shows a cover image with a play button; the YouTube player loads only when the visitor presses play.
- **Postcards page** – the standalone "Scrivo una cartolina" landing page gets a link back to the home page and a centered text card.
- **Enquiry drawer** – on every page, links to `/enquire` open the enquiry form in a side drawer so visitors keep their place. The form can arrive with `?SQF_WORK=<title>` and then says which work the enquiry is about.

## Loading it on the site

Two entry points, one `<script type="module">` line each.

Home page code block (painting effect, hero, chapters, page tone):

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.9.3/src/main.js"></script>
```

Site-wide Code Injection, Footer (enquiry drawer):

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.10.2/src/enquiry/main.js"></script>
```

Site-wide Code Injection, Header (series colors; must be in the header so the page is colored before it is first painted):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.9.3/src/themes/tones.generated.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.9.3/src/themes/series-theme.css">
<script src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.9.3/src/themes/series-attr.js"></script>
```

Site-wide Code Injection, Footer (the color infographic and the painting pages; it does nothing on a page without one):

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.10.2/src/blocks.js"></script>
```

Postcards page, Page Settings → Advanced → Page Header Code Injection:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.6.4/src/pages/scrivo.css">
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.6.4/src/pages/scrivo.js"></script>
```

Always pin a release tag (for example `@v1.9.3`). `@main` is cached by jsDelivr for hours, so a tag is the only way to know which code the site runs. To roll out a change: commit, tag a new version, and change the version in that line. To roll back, put the old version back.

## Layout

```
src/
  main.js                     entry point: wires the features to the page
  lib/
    dom.js                    initOnceFor, onFirstVisible
    image.js                  loadImage, sampleImage
    color.js                 palette extraction, hex, tones, swatches
    color-science.js          OKLab math and the list of color names
    elements.js               h() and svg(): build DOM elements
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
  blocks.js                   entry point for the blocks placed from Squarespace: the infographic and the painting pages
  works/
    catalogue.js              THE FILE TO EDIT for a painting: title, series, medium, size, year, frame, image, alt text, story
    work-page.js              renders a painting page into [data-work-page]
    work-hero.js              the picture, series, title, facts and the enquire button
    work-story.js             the story, when there is one
    work-details.js           the technical details that are known
    work-colors.js            the colors, their numbers, the map, and the paintings close in color
    work-series-nav.js        the rest of the series and previous/next
    work-enquiry.js           the inline enquiry form
    describe-work.js          a plain-language reading of a painting's colors
    similar-works.js          the paintings closest in color
    color-reveal.js           shows where a palette color lives in the picture
    lightbox.js               the enlarged view
    main.js                   entry point: renders every [data-work-page] element
    work-page.css             its styles
  color/
    main.js                   entry point: renders every [data-color-atlas] element on the page
    color-atlas.js            composes the blocks for a scope (the whole body of work, or one series)
    color-atlas.css           the infographic's styles
    scope.js                  resolves `all` or `series:<slug>` to the data a block shows
    nearest-work.js           which painting shows a given color most (where a color links to)
    text.js                   joinNames
    atlas.generated.js        generated: every work's palette and every series' color fingerprint
    blocks/
      hue-wheel.js            how much of each hue appears
      palette-bar.js          the main colors, sized by coverage, each linking to a painting
      color-pair.js           the complementary pair the work returns to most
      stat-row.js             warm, green, cool, violet and vivid shares
      warmth-map.js           every work as a dot, warm to cool and quiet to loud
      work-strips.js          each work as a strip of its colors, linking to the work
  themes/
    tones.config.js           THE FILE TO EDIT: which painting gives each series its color, and the global settings
    tones.generated.js        generated: the tones as a JS module (home page sections)
    tones.generated.css       generated: the tones as CSS variables (series pages)
    series-theme.css          maps the tone onto the site's color variables for series pages
    series-attr.js            generated: tags a series or painting page with data-series before it is painted
  scripts/
    build-tones.mjs           generates the two tones.generated files
    build-atlas.mjs           generates atlas.generated.js from the catalogue images
    analyze-palette.mjs       prints and saves the full color analysis
    palette/                  the analysis: works.config.mjs, k-means clustering, image decoding
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
import { paintImage } from 'https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.9.3/src/paint/paint-image.js';
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

## The color infographic

Put an element where the infographic should appear; the site-wide script fills it in:

```html
<div id="colors" data-color-atlas data-scope="all"></div>
<div data-color-atlas data-scope="series:archive"></div>
<div data-color-atlas data-scope="all" data-blocks="wheel,palette,stats" data-heading="none" data-surface="inherit"
     data-more-href="/about-me#colors"></div>
```

- `data-scope`: `all`, or `series:<slug>` (the slugs in `src/themes/tones.config.js`).
- `data-blocks`: which blocks to show (`wheel`, `palette`, `pair`, `stats`, `map`, `strips`); default is all.
- `data-surface`: `plate` (its own dark ground; the default for `all`), `theme` (sits on the series color; the default for a series) or `inherit` (uses the surrounding section's text color).
- `data-heading="none"` drops the heading; `data-more-href` and `data-more-label` add a link below.

A new block is one file in `src/color/blocks/` that takes a scope and returns an element, plus a line in `color-atlas.js`.

**Adding a painting.** Add it to `scripts/palette/works.config.mjs` (its `series`, the `anchor` id of its entry on the series page, and its image), then:

```sh
npm run build:atlas -- --catalogue "/path/to/catalogue"
git add -A && git commit -m "Add <work> to the color atlas"
git tag vX.Y.Z && git push origin main vX.Y.Z
```

and change the version in the footer line above. The work's strip, its dot on the map and the series numbers update, and each links to `<series page>#<anchor>`.

**Renaming colors.** The names come from the list in `src/lib/color-science.js` (`NAMED`); a color is given the nearest name. Edit the list and the names change on the hero, the home chapters and the infographic.

## Painting pages

A painting's page is a Squarespace item in the Paintings collection whose URL is `/paintings/<name>` and whose only content is a code block:

```html
<div data-work-page="lighthouses"></div>
```

`<name>` is the key in `src/works/catalogue.js`. To add or change a painting, edit that file (a section of the page appears only when its field exists, so adding a `story` array, a `year` or a `size` is enough), then run `npm run build:atlas -- --catalogue "/path/to/catalogue"` (it regenerates the colors and the pre-paint theming script), commit, tag and update the version in the footer line. A new painting also needs its entry in `scripts/palette/works.config.mjs`, a placeholder page, and its thumbnail on the series page linking to `/paintings/<name>`.

## Changing the works

Edit `src/features/hero/works.js`, commit, tag a new version and update the version in the script line.
