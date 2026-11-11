# elettra-ministeri-site

Front-end modules for [elettraministeri.com](https://www.elettraministeri.com), a Squarespace 7.1 site. The page markup and the stylesheet live in Squarespace; the behaviour lives here as ES modules and is loaded from jsDelivr.

## What it does

- **Painting effect** – the home hero repaints each work stroke by stroke (leaves, pills and dots that follow the contours of the painting), then lays soft patches of the real image across the canvas and eases a uniform glaze in over the top, so the last frame is the picture itself.
- **Hero slideshow** – every visit gets a new random selection of six paintings from the whole body of work (never more than two from one series, never opening on the painting the last visit opened on; `hero/works.js`), cycled with dots to jump to one and a thin two-part line showing the time left on the current slide: a gold segment while the painting is being painted, an off-white one while the finished painting is on show. Hovering the hero with a mouse holds the current work once its painting has been revealed (never while it is still being painted); leaving lets the remaining time run out.
- **Series chapters** – each chapter takes its tone and color swatches from its painting.
- **Page tone** (each home section carries its own background and text color, and fades in from the color of the section before it as the page scrolls; `--em-tone-fade` sets how far) – the page background and header follow the section in view.
- **Color map** – each series has one color, used for its section on the home page and for its own page, so the colors work as a map of the site. One config file drives both.
- **Color infographic** – reusable blocks that show the colors of the work (the main colors and a strip of colors per painting). The same component renders the whole body of work on the About page, one series on each series page, and a compact version on the home page. Every color and painting links to the painting's page.
- **Strips of color** – each painting has a thin strip of its colors under its picture, on its series page and on its own page; pointing at a color turns that picture black and white except where the color lives, and clicking copies its code.
- **Painting pages** – every painting has its own page (`/paintings/<name>`) with the picture (painted stroke by stroke as it comes into view, like the home hero; click to enlarge) with its strip of colors beneath, its story in the artist's words, the technical details, a story in the artist's words (written by hand in `catalogue.js`), where a work has one, a section on where it comes from, in the artist's voice with linked museum sources (the `context` field; Mask Divine has one), a reading of its colors (point at a color to see where it lives in the picture; click to copy its code), where it sits among all the work, the paintings closest to it in color, the rest of its series, and the enquiry form inline. Each page is one empty placeholder in Squarespace; everything on it comes from `src/works/catalogue.js` and the generated color data.
- **One theme** – every stylesheet is built on `src/theme/tokens.css`: the colors, type, spacing, shadows and durations are defined once, so changing the look of the site, or adding to it, starts there (see "The theme").
- **Color focus** – pointing at a color (with a soft, configurable reach: neighboring shades keep part of their color and the edge fades; see `src/color/focus-config.js`) (a hero tile, a chip on a home section, or a color on a painting page) turns the rest of the picture black and white, leaving only that color's cluster in color, so you can see where a color lives.
- **Copyable colors** – every swatch (the hero's tiles, the chips on each home chapter, a painting page's colors) is one reusable component: it shows the color's name, copies its hex code when clicked, and uses the same analysed palette as the infographic. It carries its data in the page and announces what people look at and take, so colors can be gathered for further analysis (see "Gathering colors").
- **Color names** – colors are named the way a painter would (vermilion, ochre, bottle green) everywhere they are shown, from one list in `src/lib/color-science.js`.
    color-harmony.js          how a painting's colors relate (gathered hues, opposite accent, one color carrying it), and the same measured against chance
- **Glass** – floating surfaces and buttons (the Paintings dropdown, the rail's labels, every "View ..." and enquire button) share one material in the theme: a blurred, saturated view of what is behind, a faint gradient, a bright thin edge and a soft drop, with a tint and text color that adapt to a light or dark surface, so it looks right on any background. A home section sets `data-glass` from its own text color, so glass in a cream section is light and in a dark one is dark.
- **Section rail** – a slim vertical rail on the home page (never over the hero slideshow: it fades out while the hero is behind it), one tick per section: pointing at it names the sections, the current one is highlighted and choosing one scrolls to it smoothly (`data-rail="Name"` on a section names or includes it).
- **Artist video** – the video in the home page's artist section shows a cover image with a play button; the YouTube player loads only when the visitor presses play.
- **Print page** – `/print` (formerly the Downloads page; `/scrivo-una-cartolina` redirects to it) lists the postcards of "Scrivo una cartolina" (`src/print/cards.js`): one card for each month, each with its own page (`/print/<month>`, an item in the Paintings collection reached through a URL mapping, like the textiles) holding an English article, the card, a plain printable back (`card-back.js`: ruled space for a message, a stamp box, address lines, no text), and a question to start the message with and the way to the other cards (arrow keys and swipe, `work-slideshow.js`). "Print" prints the card and its back on two pages. The page is a code block holding a `.th` header and `<ul class="th-grid" data-print>`, which `src/print/main.js` fills.
- **Enquiry drawer** – on every page, links to `/enquire` open the enquiry form in a side drawer so visitors keep their place. The form can arrive with `?SQF_WORK=<title>` and then says which work the enquiry is about.

## Loading it on the site

Two entry points, one `<script type="module">` line each.

Home page code block (painting effect, hero, chapters, page tone):

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.22.82/src/main.js"></script>
```

Site-wide Code Injection, Footer (enquiry drawer):

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.22.82/src/enquiry/main.js"></script>
```

Site-wide Code Injection, Header (series colors; must be in the header so the page is colored before it is first painted):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.9.3/src/themes/tones.generated.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.9.3/src/themes/series-theme.css">
<script src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.9.3/src/themes/series-attr.js"></script>
```

Site-wide Code Injection, Footer (the color infographic and the painting pages; it does nothing on a page without one):

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@v1.22.82/src/blocks.js"></script>
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
    scroll-blend.js           locateBlend, readingLine: where a scrolling page stands between stacked sections
    color-mix.js              parseColor, mixColors: blend two CSS colors in OKLab
    scroll-direction.js       watchScrollDirection(onChange, options): "up" or "down" once the page has moved a set distance
    hover-focus-hold.js       holdWhileEngaged(element, onChange): is the pointer over it or focus inside it
  paint/
    paint-image.js            paintImage(img, canvas, W, H, speed): the timeline
    config.js                 duration, stroke counts, sizes, shape mix
    source-pixels.js          cover-fitted pixel access to the source image
    flow-field.js             contour directions for strokes to follow
    brush-hand.js             where, how big and which way the next mark goes
    shapes.js                 leaf, pill and dot marks
    reveal.js                 soft patches of the real image laid across the canvas
  menu/
    active.js                 marks the current page (and its folder) in the header menus
    links.js                  makes the header menu's links to this site open in the same tab
  features/
    hero/
      hero.js                 the slideshow
      works.js                draws a random selection of paintings for each visit
      works.js                the works it cycles through
      slideshow-controls.js   dots and progress line
      color-samples.js       color swatches that wash the hero
    chapters.js
    section-rail.js           the vertical rail of sections on the home page
    section-rail.css          its styles
    home-fold.css             keeps every home section within one screen
    paint-portrait.js         paints the picture of an image block stroke by stroke on listed pages (About me)
    page-tone.js              the page background and text color follow the scroll position, section to section
    video-facade.js           click-to-play YouTube video (cover image + play button)
    video-facade.css
  blocks.js                   entry point for the blocks placed from Squarespace: the infographic and the painting pages
  works/
    catalogue.js              THE FILE TO EDIT for a painting: title, series, medium, size, year, frame, image, alt text, story
    work-page.js              renders a painting page into [data-work-page]
    work-hero.js              the picture, series, title, facts and the enquire button
    work-story.js             the story, when there is one
    work-context.js           where a work comes from (with linked sources), when it has a `context`
    work-details.js           the technical details that are known
    work-colors.js            the colors, their numbers, the map, and the paintings close in color
    work-series-nav.js        the rest of the series and previous/next
    work-enquiry.js           the inline enquiry form
    describe-work.js          a plain-language reading of a painting's colors
    walk.js                   where to look next: three paintings suggested by color, each with a reason, staying in the series unless another is clearly closer, leaving out what this visit has seen
    work-slideshow.js         the arrow keys (and the previous/next links and strips) move through a series in the order of its page, sliding the picture out and in
    series-order.js           the order of a series' paintings, shared by the series page and the painting pages
    work-next.js              renders that suggestion: each painting's picture, strip of colors and reason, on a band
    next-tone.js              the band's color, worked out from the three paintings it offers (deep, nearly neutral, a little of the series color)
    pager.js                  the bar at the bottom: previous/next series on a series page, a link back to the series on a painting page
    pager.css                 its styles
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
    carriers.js               which paintings carry a given color (how widely a pooled color is shared)
    swatch.js                 a clickable color: name, hex copy, data attributes and events
    swatch.css                its base styles
    copy-color.js             copies a hex code and announces it
    text.js                   joinNames
    atlas.generated.js        generated: every work's palette and every series' color fingerprint
    blocks/
      palette-bar.js          the main colors, sized by coverage, each linking to a painting
      gist.js                 a one-line gist of what a set of works does with color
      work-strips.js          each work as a strip of its colors, linking to the work
  theme/
    buttons.css               glass buttons: the hero and section links, the enquire and repaint buttons
    header.css                the header on every page: fixed, transparent, and a floating glass pill once scrolled
    header.js                 its scroll and tone states on every page but the home page
    header-hide.js            slides it away on the way down, back on the way up (built on lib/scroll-direction.js and lib/hover-focus-hold.js)
    glass.css                 the pointer-following highlight of the glass
    glass.js                  senses a light or dark surface behind the glass (html[data-glass])
    tone-control.js           the palette button in the header and the panel of backgrounds it opens (tone-control.css styles them)
    menu.css                  the header menu: its order (named numbers at the top), spacing and the Paintings dropdown
    tokens.css                THE THEME (one variable, --em-radius, sets every box's corner radius): colors, type, spacing, shadows, motion and layout, in three layers
  themes/
    tone-choice.js            reads and keeps a visitor's choice of background (localStorage) and gives the tone in force
    tones.config.js           THE FILE TO EDIT: the settings that derive each background from the colors, and the old hand-set map (MANUAL_TONES)
    tones.generated.js        generated: the tones as a JS module (home page sections)
    tones.generated.css       generated: the tones as CSS variables (series pages)
    series-theme.css          maps the tone onto the site's color variables for series pages
    series-attr.js            generated: tags a series or painting page with data-series before it is painted
  scripts/
    build-tones.mjs           works out each series' background from its colors and generates the two tones.generated files
    palette/series-ground.mjs the rule that makes a background from the cast of a group's colors (see Colors)
    build-atlas.mjs           generates atlas.generated.js from the catalogue images
    sync.mjs                  rebuilds every generated file (colors, atlas, series attributes) in one command
    pins.mjs                  prints the lines to paste into the three Squarespace places after a release
    check-site.mjs            compares the live site with the catalogue and lists what is out of date
    analyze-palette.mjs       prints and saves the full color analysis
    rectify.mjs               straightens a photo of a painting: its four corners become a flat rectangle cropped at the frame
    trim-border.mjs           cuts the pale border (white mat, scanner margin) off a picture of a painting
    tone-photo.mjs            tonal correction for a phone photo of a painting: white balance from the bed sheet, levels, midtones, vibrance, sharpening
    palette/                  the analysis: works.config.mjs, k-means clustering, image decoding
  print/
    cards.js                  the postcards of "Scrivo una cartolina": month, picture, the blog post of its story
    card-page.js              the page of one postcard: card, article, back, links to the others
    card-back.js              the plain back of a postcard, to print and use
    print-actions.js          prints a card, its back, or both, on sheets of their own
    print-page.js             fills the Print page's grid
    print.css                 the grid, the card pages, the back, and the print layout of the sheets
    main.js                   loads the stylesheet and fills the grid on the Print page
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

Every series has one background, and so does the page of every painting (`data-series="all"`, the All paintings page). The home page section for a series and the series page itself both use it. The backgrounds are worked out from the colors the series are made of, so they follow the works. One rule applies to all of them, with no exception for any series or page.

`npm run sync` does it: the color analysis first, then `scripts/build-tones.mjs`, which hands the result to `scripts/palette/series-ground.mjs`.

**The rule.** Every sampled color of every painting is a point in three dimensions (lightness and the two color axes of OKLab). The *cast* of a group of works is the centre of mass of those points: the direction in which its colors lean away from neutral (`cast` in `atlas.generated.js`). The ground is the hue of that cast, made deep: the same hue at a fixed lightness (lowered until the text color reads on it) and a chroma taken from how colorful the colors are.

**Why that rule.** It was learned from the artist's own paintings and checked against them. Across 35 paintings, two colors of one painting sit less than 60 degrees apart in 51% of pairs (38% by chance), and two vivid colors set opposite each other occur in 4 paintings (13 by chance). Hiding each of 174 colors in turn and predicting its hue from the others, the hue of the cast is wrong by about 70 degrees (82 by chance) while the opposite of the cast is wrong by 110, so she works in neighbouring hues and not in opposites. Against her actual grounds, the hue of the cast is closer than its opposite in every series.

**Choosing a background.** A palette button in the header (`theme/tone-control.js`) lets a visitor choose between four backgrounds for the page they are on: on a series page or a painting page it sets that series' background, on the All paintings page that page's; pages with no presets (About me, Print, Artist picks) have no button. The four presets are made for every page by `scripts/build-tones.mjs`:

- **Chosen** (the default): the backgrounds picked by Elettra for each page (`CHOSEN_TONES` in `tones.config.js`: the hand-set map the site had before backgrounds were worked out from the colors, and for the All paintings page the pick made on the capture page);
- **Tonal:** the hue of the cast, made deep (the rule above);
- **Contrast:** the opposite hue;
- **Night:** the neutral near-black of the Print page.

Each preset keeps the text readable: the build fails if the text color has less than 7:1 contrast on a preset's background or second tone. The choice is kept in the browser (`localStorage`, one key `em-tone-<series>` holding the preset's name, never a color) and shown before the first paint (`themes/series-attr.js` sets `data-tone` on the page; `tones.generated.css` holds one rule per preset), so there is no flash. Where storage is blocked the default preset (`DEFAULT_TONE`) shows. The parts of the page that draw their own colors read the choice through `themes/tone-choice.js`.

All of it is set in `src/themes/tones.config.js`:

- **All series at once:** change `TONE_SETTINGS.ground` (lightness, chroma range and share, contrast).
- **The presets:** edit `TONE_PRESETS` (names and notes), `DEFAULT_TONE` (the preset shown until a visitor chooses), `CHOSEN_TONES` and `NIGHT_TONE`.
- **A new series:** add one line with the series' page name and label.
- **One series pinned by hand:** give it `bg: '#1f3a2e'`.
- **The hand-set colors:** `MANUAL_TONES` keeps the map that was set by hand; it is the `chosen` preset.

Then regenerate and release:

```sh
npm install                # once
npm run build:tones        # prints each series' background, the hand-set one it replaces and why the new one was chosen
git add -A && git commit -m "Update series colors"
git tag vX.Y.Z && git push origin main vX.Y.Z
```

Then check that jsDelivr serves the new tag and change the version in the two places that load it: the home page code block (`src/main.js`) and the site-wide Header Code Injection (the three tags above). The text colors used on the tones are variables in the site's Custom CSS (`--em-bg`, `--em-ink`, `--em-muted`, `--em-line`, `--em-body`).

## The color infographic

Put an element where the infographic should appear; the site-wide script fills it in:

```html
<div id="colors" data-color-atlas data-scope="all"></div>
<div data-color-atlas data-scope="series:archive"></div>
<div data-color-atlas data-scope="all" data-blocks="palette" data-heading="none" data-surface="inherit"
     data-more-href="/about-me#colors"></div>
```

- `data-scope`: `all`, or `series:<slug>` (the slugs in `src/themes/tones.config.js`).
- `data-blocks`: which blocks to show (`palette`, `strips`); default is both.
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

## Artist picks

The page `/paintings/artist-picks` (a page in the unlinked Paintings collection, holding the `.th` markup of a series page with `<ul class="th-grid" data-picks>`) lists the paintings the artist marks as picks, in the layout of a series page and in its smooth path through color. She marks them in a Google Sheet (the `Artist picks.xlsx` made in the catalogue folder's `picks/` directory, uploaded to her Google Drive): an Artist pick column with Yes (a column headed Favorite also works), next to each painting's page address. The sheet is shared so that anyone with the link can view it (only she can edit), and the site reads its `Paintings` sheet as CSV through the `gviz` address set in `src/works/picks-source.js`; every change she makes shows on the page within minutes, with no release. A new painting needs a new row in the sheet.

### Sales

The same sheet carries a **Discount (%)** column (also read as "Sale", "Discount %" or "Percent off"; 15, 15% and 12,5 all work; a value of 90 or less). A work with a discount is on sale: its list price (its own price plus the frame when the frame is part of it) is reduced by that percentage, rounded to a whole euro (`works/price.js`, `works/offers.js`). Series pages, the picks page, a work's page, the Paintings index (its price filter and sorting use the price now, and an **On sale** choice appears while any work is on sale) and the enquiry all show the list price struck through, the price now and the percentage (`works/price-view.js`); the enquiry records "listed at €510 (was €600, 15% off) on <date>". A work on sale also appears on the Artist picks page whether or not it is marked as a pick; only the picks carry the star. A page waits a moment for the sheet before drawing its prices; if the sheet cannot be read in time it shows the list prices, never an unconfirmed discount. Works the sheet does not list cannot be put on sale, so the sheet needs a row for every new work (the template in `picks/Artist picks.xlsx` lists them all).
### Sets

A **set** is a few paintings the artist made together (a pair or a triplet of a theme, a family of frames); their palettes are coordinated, so the site shows them together. The same sheet declares them in a **Set** column (also read as "Sets" or "Group"): paintings with the same text there belong together, in the order of the sheet's rows (to change the order inside a set, move the rows). A painting belongs to at most one set, a set needs one painting or more (a painting alone in a set has a heading and a description of its own, with no "n of N" and no "Part of a set" block), and a blank cell means no set. A **Set description** column (also read as "Set note") holds the set's short text: the first filled cell among a set's rows is used, and it shows under the set's name on the series page and on each member's page. Nothing needs a release: she types the same word on two or three rows.

A set shows as a grid of its own on its series page (members marked "2 of 3"; "Part of Maternity · 2 of 3" where it is listed with others), as a "Part of a set" block with the set's paintings on each member's page (`works/work-set.js`), and as a **Set** filter in the index on the Paintings page. A set is not a page and not a menu entry.

**Order.** The groups come first in the order of a series (`works/series-order.js`): each set has a grid of its own under its name (a heading, "N paintings made together" and the set's description), its paintings in the order of its rows in the sheet; the sets follow a smooth path through color (`works/harmony-order.js`), each placed by the colors of the set as a whole; the paintings in no set follow under "Also in <series>", in their own path through color. A series with no set, or one whose paintings are all a single set (Maternity), is one grid with no heading. Every grid of paintings is masonry that reads left to right (`works/masonry.js`): each painting, in the order of the sequence, goes to the shortest column (the leftmost when they are level), so the first row is 1, 2, 3 across and the next paintings fall into the gaps below, in three columns on a wide screen, two on a tablet and one on a phone. On a series page each picture also takes a share of its card's width that follows the painting's real size (`works/picture-scale.js`): the longest side stated in the painting's size, relative to the largest painting of the series, raised to 0.6 and never under 45%, so a 60 cm painting looks larger than a 40 cm one but the smallest stay easy to see; the strip of colors and the caption under it always span the card's full width. A series of paintings of one size looks as it did, and so does any series on a phone, where the paintings are stacked in one column and every picture takes the full width. Painting pages and the Artist picks page show every picture at full width. The same order lays out the Artist picks page (as one grid), the strips under "More in <series>", the way to the previous and next painting, and the arrow keys.

The sets are read with the discounts, in one request (`works/picks.js`, `works/offers.js`), so a page never shows two different sets in one visit. When the sheet cannot be read in time, or has no Set column, the sets in `works/set-defaults.js` show instead; once the column exists, the sheet decides (an empty column means no sets).

### The Paintings page

The All paintings page (`<div data-paintings-overview>`, built by `src/overview/paintings-overview.js` from the catalogue and the color analysis) opens on the **index** of every work, so the work can start at once. A toolbar stays in view while the list scrolls: the number of works shown, the choices made (each can be taken off there), a sort, a **Filters** button that opens every choice (series, set, subject, made on, price, sale, mostly, colors built as) over the list, and a **Charts** button. The charts that answer to the choices (subjects and materials, and the mosaic of every main color) live in a **drawer** (`overview/chart-drawer.js`): on a screen wider than 1100 px it sits beside the index and narrows it, and a choice it has a chart for (a subject, a material, a color family, how the colors are built) brings that chart up; on a narrower screen it is a sheet over the bottom of the window, opened by the Charts button only, and it and the Filters panel never show together. Under the index come the series tiles, the series compared, and the colors of the whole body of work. The choices are shared by all of it (`overview/filter-state.js`), so a bar in the drawer and a chip in the index are the same choice.

## Changing the works

Edit `src/features/hero/works.js`, commit, tag a new version and update the version in the script line.

## Adding or changing a work

1. **Photograph to picture.** `scripts/rectify.mjs` (flatten and crop a phone photo to the frame), `scripts/trim-border.mjs` (cut a pale border off a scan or an export), `scripts/tone-photo.mjs` (white balance from the bed sheet, levels, vibrance). Keep the finished file in the catalogue folder under `rectified/`.
2. **Upload** it in Squarespace (Assets → Upload) and copy its address into `src/works/catalogue.js` (a new work also needs its entry there: title, series, medium, size, year, image, alt; `price` is whole euros and, when present, appears on the painting page and in the enquiry the work is named in) and into `scripts/palette/works.config.mjs`.
3. **Rebuild the data**: `npm run sync -- --catalogue "<catalogue folder>"`. This recomputes every work's colors, the series fingerprints, the overall statistics and the series colors (the color relations are worked out in the browser from each work's palette, `src/lib/color-harmony.js`). Every infographic, the hero and the painting pages read this one result.
4. **Release**: commit, tag `vX.Y.Z`, push, wait until jsDelivr serves every changed file, then run `npm run pins` and paste the version into the header injection, the footer injection and the home code block.
5. **Squarespace pieces**: a textile is shown at `/textiles/<name>`: its page lives in the Paintings collection and a URL mapping (Settings → Developer Tools → URL Mappings, `/textiles/<name> -> /paintings/<name> 301`) leads to it, after which the page rewrites the address bar to `/textiles/<name>` (`series-attr.js`). A new work needs its painting page (duplicate the template item in the Paintings collection, set title, slug, Published), a thumbnail in its series page's code block, and the "N works" counts on `/paintings` and the home chapter.
6. **Check**: `npm run check:site` compares the live site with the catalogue (release in use, painting pages, series pages, counts) and lists what is left.
