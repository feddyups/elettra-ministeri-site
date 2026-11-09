import { initOnceFor } from './lib/dom.js';
import { initHero } from './features/hero/hero.js';
import { initChapter } from './features/chapters.js';
import { trackSectionTone, trackHeaderOnScroll } from './features/page-tone.js';

document.documentElement.classList.add('em-home-page', 'em-hdr-light');

initOnceFor('.em-home .eh-hero', 'hero', initHero);
initOnceFor('.em-home .chapter', 'chapter', initChapter);
initOnceFor('.em-home > section, .em-home > footer', 'tone', trackSectionTone);
trackHeaderOnScroll();
