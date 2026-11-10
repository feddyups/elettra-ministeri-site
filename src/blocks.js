/*
 * One entry point for the blocks that are placed on pages from Squarespace (loaded site-wide in the footer):
 * the color infographic, the painting pages, the grid of works on a series page and the Paintings page. Each does nothing on a page that does not use it.
 * It also keeps the header's states on every page (theme/header.js), puts the palette button in the header of the pages whose background a visitor can choose (theme/tone-control.js), marks the current page in the menus
 * (menu/active.js), and senses whether the page behind the glass is light or dark (theme/glass.js) and makes the header menu's links to this site open in the same tab (menu/links.js).
 */
import './theme/glass.js';
import './theme/header.js';
import './theme/header-hide.js';
import './theme/tone-control.js';
import './menu/active.js';
import './menu/links.js';
import './color/main.js';
import './color/strip-label.js';
import './works/main.js';
import './overview/main.js';
import './print/main.js';
import './features/paint-portrait.js';
