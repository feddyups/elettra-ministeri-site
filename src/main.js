import { initOnceFor } from './lib/dom.js';
import { loadStylesheet } from './lib/stylesheet.js';
import { initHero } from './features/hero/hero.js';
import { initChapter } from './features/chapters.js';
import { initVideoFacade } from './features/video-facade.js';
import { trackSectionTone, trackHeaderOnScroll } from './features/page-tone.js';

document.documentElement.classList.add('em-home-page', 'em-hdr-light');

initOnceFor('.em-home .eh-hero', 'hero', initHero);
initOnceFor('.em-home .chapter', 'chapter', initChapter);
loadStylesheet(new URL('./features/video-facade.css', import.meta.url).href);
loadStylesheet(new URL('./color/swatch.css', import.meta.url).href);
loadStylesheet(new URL('./features/home-fold.css', import.meta.url).href);
initOnceFor('.em-home .em-video', 'video', initVideoFacade);
initOnceFor('.em-home > section, .em-home > footer', 'tone', trackSectionTone);
trackHeaderOnScroll();
