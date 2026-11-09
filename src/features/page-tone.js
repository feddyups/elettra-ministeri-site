const html = document.documentElement;
const INK = '#1c1a18';
const PAPER = '#faf8f5';

/** Sets the page background and foreground, and switches the header between light and ink. */
const setTone = (background, foreground) => {
  html.style.setProperty('--eh-bg', background);
  html.style.setProperty('--eh-fg', foreground);
  const light = foreground !== INK;
  html.style.setProperty('--eh-hdr', light ? PAPER : INK);
  html.classList.toggle('em-hdr-light', light);
  html.classList.toggle('em-hdr-ink', !light);
};

const toneObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const section = entry.target;
    if (section.classList.contains('eh-hero')) setTone(PAPER, PAPER);
    else if (section.classList.contains('foot')) setTone(INK, PAPER);
    else setTone(section.getAttribute('data-bg') || PAPER, section.getAttribute('data-fg') || INK);
  });
}, { threshold: 0.5 });

/** The page tone follows whichever section is in view. */
export const trackSectionTone = (section) => toneObserver.observe(section);

/** Header turns solid after the hero and gains a shadow once the page has scrolled. */
export const trackHeaderOnScroll = () => {
  const update = () => {
    html.classList.toggle('em-hdr-solid', scrollY > innerHeight * 0.9);
    html.classList.toggle('em-scrolled', scrollY > 24);
  };
  addEventListener('scroll', update, { passive: true });
  update();
};
