import { initOnceFor } from './lib/dom.js';
import { loadStylesheet } from './lib/stylesheet.js';
import { initHero } from './features/hero/hero.js';
import { initChapter } from './features/chapters.js';
import { initVideoFacade } from './features/video-facade.js';
import { trackSectionTone, trackHeaderOnScroll } from './features/page-tone.js';
import { initSectionRail } from './features/section-rail.js';

document.documentElement.classList.add('em-home-page', 'em-hdr-light');

initOnceFor('.em-home .eh-hero', 'hero', initHero);
initOnceFor('.em-home .chapter', 'chapter', initChapter);
loadStylesheet(new URL('./features/video-facade.css', import.meta.url).href);
loadStylesheet(new URL('./color/swatch.css', import.meta.url).href);
loadStylesheet(new URL('./features/home-fold.css', import.meta.url).href);
initOnceFor('.em-home .em-video', 'video', initVideoFacade);
initOnceFor('.em-home > section, .em-home > footer', 'tone', trackSectionTone);
trackHeaderOnScroll();
loadStylesheet(new URL('./features/section-rail.css', import.meta.url).href);
// the sections come from several Squarespace blocks, so the rail is built once the page has settled
addEventListener('load', () => setTimeout(() => initSectionRail('.em-home > section, .em-home > footer', { hideOver: '.eh-hero' }), 600));
