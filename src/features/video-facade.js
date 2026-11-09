/**
 * A YouTube video shown as a cover image with a play button. The player is
 * only created when the visitor presses play, so the page loads no YouTube
 * code or cookies until then.
 *
 * Expected markup: `<button class="em-video" data-youtube="<id>" data-title="<title>">` containing the cover `<img>`.
 * Styled by video-facade.css.
 */
export const initVideoFacade = (button) => {
  const id = button.getAttribute('data-youtube');
  if (!id) return;

  button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.className = 'em-video-frame';
    frame.title = button.getAttribute('data-title') || 'Video';
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1`;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    button.replaceWith(frame);
    frame.focus();
  }, { once: true });
};
