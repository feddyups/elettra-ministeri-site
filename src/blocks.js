/*
 * One entry point for the blocks that are placed on pages from Squarespace (loaded site-wide in the footer):
 * the color infographic and the painting pages. Each does nothing on a page that does not use it.
 * It also senses whether the page behind the glass is light or dark (theme/glass.js) and makes the header menu's links to this site open in the same tab (menu/links.js).
 */
import './theme/glass.js';
import './menu/links.js';
import './color/main.js';
import './works/main.js';
