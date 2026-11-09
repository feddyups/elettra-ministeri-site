# elettra-ministeri-site

Front-end modules for [elettraministeri.com](https://www.elettraministeri.com), a Squarespace 7.1 site. The page markup and the stylesheet live in Squarespace; the behaviour lives here as ES modules and is loaded from jsDelivr.

## What it does

- **Painting effect** – the home hero repaints each work stroke by stroke (leaves, pills and dots that follow the contours of the painting), then lays soft patches of the real image across the canvas and eases a uniform glaze in over the top, so the last frame is the picture itself.
- **Hero slideshow** – cycles through the works, with dots to jump to one and a thin two-part line showing the time left on the current slide: a gold segment while the painting is being painted, an off-white one while the finished painting is on show. Hovering the hero with a mouse holds the current work once its painting has been revealed (never while it is still being painted); leaving lets the remaining time run out.
- **Series chapters** – each chapter takes its tone and color swatches from its painting.
- **Page tone** – the page background and header follow the section in view.
- **Color map** – each series has one color, used for its section on the home page and for its own page, so the colors work as a map of the site. One config file drives both.
- **Color infographic** – reusable blocks that show the colors of the work (a hue wheel, the loudest colors, the share of warm and cool, a warm-to-cool map of every painting, and a strip of colors per painting). The same component renders the whole body of work on the About page, one series on each series page, and a compact version on the home page. Every color and painting links to the painting's page.
- **Strips of color** – each painting has a thin strip of its colors under its picture, on its series page and on its own page; pointing at a color turns that picture black and white except where the color lives, and clicking copies its code.
- **Painting pages** – every painting has its own page (`/paintings/<name>`) with the picture (painted stroke by stroke as it comes into view, like the home hero; click to enlarge) with its strip of colors beneath, its story in the artist's words, the technical details, a story in the artist's words (written by hand in `catalogue.js`), where a work has one a "roots and echoes" reading in a neutral voice with linked museum sources (the `context` field; Mask Divine has one), a reading of its colors (point at a color to see where it lives in the picture; click to copy its code), where it sits among all the work, the paintings closest to it in color, the rest of its series, and the enquiry form inline. Each page is one empty placeholder in Squarespace; everything on it comes from `src/works/catalogue.js` and the generated color data.
- **One theme** – every stylesheet is built on `src/theme/tokens.css`: the colors, type, spacing, shadows and durations are defined once, so changing the look of the site, or adding to it, starts there (see "The theme").
- **Color focus** – pointing at a color (with a soft, configurable reach: neighboring shades keep part of their color and the edge fades; see `src/color/focus-config.js`) (a hero tile, a chip on a home section, or a color on a painting page) turns the rest of the picture black and white, leaving only that color's cluster in color, so you can see where a color lives.
- **Copyable colors** – every swatch (the hero's tiles, the chips on each home chapter, a painting page's colors) is one reusable component: it shows the color's name, copies its hex code when clicked, and uses the same analysed palette as the infographic. It carries its data in the page and announces what people look at and take, so colors can be gathered for further analysis (see "Gathering colors").
- **Color names** – colors are named the way a painter would (vermilion, ochre, bottle green) everywhere they are shown, from one list in `src/lib/color-science.js`.
- **Artist video** – the video in the home page's artist section shows a cover image with a play button; the YouTube player loads only when the visitor presses play.
- **Postcards page** – the standalone "Scrivo una cartolina" landing page gets a link back to the home page and a centered text card.
- **Enquiry drawer** – on every page, links to `/enquire` open the enquiry form in a side drawer so visitors keep their place. The form can arrive with `?SQF_WORK=<title>` and then says which work the enquiry is about.

## Loading it on the site

Two entry points, one `<script type="module">` line each.

Home page code block (painting effect, hero, chapters, page tone):

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.15.0/src/main.js"></script>
```

Site-wide Code Injection, Footer (enquiry drawer):

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.15.0/src/enquiry/main.js"></script>
```

Site-wide Code Injection, Header (series colors; must be in the header so the page is colored before it is first painted):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.9.3/src/themes/tones.generated.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.9.3/src/themes/series-theme.css">
<script src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.9.3/src/themes/series-attr.js"></script>
```

Site-wide Code Injection, Footer (the color infographic and the painting pages; it does nothing on a page without one):

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.15.0/src/blocks.js"></script>
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
    work-context.js           the cultural reading (roots and echoes, with linked sources), when a work has a `context`
    work-details.js           the technical details that are known
    work-colors.js            the colors, their numbers, the map, and the paintings close in color
    work-series-nav.js        the rest of the series and previous/next
    work-enquiry.js           the inline enquiry form
    describe-work.js          a plain-language reading of a painting's colors
    similar-works.js          the paintings closest in color
    series-strip.js           puts a painting's strip of colors under its picture on a series page
    work-paint.js             the brushing effect on the picture, with Repaint
    lightbox.js               the enlarged view
    main.js                   entry point: renders every [data-work-page] and adds the strips on series pages
    work-page.css             its styles
  color/
    main.js                   entry point: renders every [data-color-atlas] element on the page
    color-atlas.js            composes the blocks for a scope (the whole body of work, or one series)
    color-atlas.css           the infographic's styles
    color-strip.js            a painting's colors as a thin strip (swatches sized by coverage)
    color-strip.css           its styles
    palette.js                merges palette colors that are too close to be separate swatches
    focus-config.js           how far the color focus reaches and how softly it fades, and how close two colors may be before they show as one swatch (reach, core, smoothing, gray level, merge)
    color-focus.js            turns a picture black and white except one palette color's cluster
    scope.js                  resolves `all` or `series:<slug>` to the data a block shows
    nearest-work.js           which painting shows a given color most (where a color links to)
    swatch.js                 a clickable color: name, hex copy, data attributes and events
    swatch.css                its base styles
    copy-color.js             copies a hex code and announces it
    text.js                   joinNames
    atlas.generated.js        generated: every work's palette and every series' color fingerprint
    blocks/
      hue-wheel.js            how much of each hue appears
      palette-bar.js          the main colors, sized by coverage, each linking to a painting
      color-pair.js           the complementary pair the work returns to most
      stat-row.js             warm, green, cool, violet and vivid shares
      warmth-map.js           every work as a dot, warm to cool and quiet to loud
      work-strips.js          each work as a strip of its colors, linking to the work
  theme/
    tokens.css                THE THEME: colors, type, spacing, shadows, motion and layout, in three layers
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

## The theme

`src/theme/tokens.css` holds every design decision the other stylesheets use. It has three layers, each built on the one before:

1. **Primitives** – raw scales: colors (`--em-paper`, `--em-night`, `--em-accent`), type (`--em-text-xs` to `--em-text-xl`, `--em-display-sm` to `--em-display-lg`, weights, leading, tracking), space (`--em-space-3xs` to `--em-space-5xl`, on a 4px grid), radii, shadows, durations, stacking.
2. **Roles** – named uses: `--em-gutter`, `--em-measure`, `--em-section-gap`, `--em-block-gap`, `--em-plate-padding`.
3. **Components** – custom properties a component declares at the top of its own stylesheet, in rem, built on layers 1 and 2 (for example `--ca-strip-width` in `color-atlas.css`).

Rules for every stylesheet:

- Start with `@import url('../theme/tokens.css');` (a path relative to the file).
- No raw pixel values in a rule: use a token, or a component property declared in rem at the top of the file. The only pixel values are the hairline and stroke widths in the theme.
- No raw colors in a rule: use a token, or the site's own `--em-bg`, `--em-ink`, `--em-muted`, `--em-line` and `--em-body`, which a series page remaps to its series color.
- Breakpoints cannot be variables, so media queries use em and only these three: `56.25em` (the layout stacks), `48em` (the phone line Squarespace uses) and `37.5em` (small phones).
- Everything is in rem, so it scales with the visitor's text size.

To change the look site-wide, change a primitive; to restyle one thing, change its component property.

## Gathering colors


`renderSwatch(color, options)` in `src/color/swatch.js` is the one way a color is shown and copied. Each swatch carries `data-hex`, `data-name`, `data-share` (how much of the painting it covers), `data-work` and `data-series`, and announces two events on `document`:

```js
document.addEventListener('em:color', (event) => {
  const { action, hex, name, share, work, series } = event.detail; // action is "hover" or "copy"
});
```

Nothing is recorded or sent anywhere; the events are the place to attach it (for example to count which colors are copied most, per painting) if that is ever wanted. The same component takes the colors of any source: the analysed palettes (`seriesColors(slug)`, `workColors(title)` in `src/color/scope.js`) or colors sampled from an image.

## Painting pages

A painting's page is a Squarespace item in the Paintings collection whose URL is `/paintings/<name>` and whose only content is a code block:

```html
<div data-work-page></div>
```

The painting is read from the page's own address, so `<name>` is the key in `src/works/catalogue.js` and every painting page has identical content: a new one is a duplicate of an existing page with a new title and URL slug. (A page can name its painting instead with `data-work-page="<name>"`.) To add or change a painting, edit that file (a section of the page appears only when its field exists, so adding a `story` array, a `year` or a `size` is enough), then run `npm run build:atlas -- --catalogue "/path/to/catalogue"` (it regenerates the colors and the pre-paint theming script), commit, tag and update the version in the footer line. A new painting also needs its entry in `scripts/palette/works.config.mjs`, a placeholder page, and its thumbnail on the series page linking to `/paintings/<name>`.

## Changing the works

Edit `src/features/hero/works.js`, commit, tag a new version and update the version in the script line.
