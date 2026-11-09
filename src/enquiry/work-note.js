/**
 * When the enquiry form is opened for a specific work (`?SQF_WORK=<title>`),
 * shows "Enquiring about: <title>" above the form once the form has rendered.
 */
export const showEnquiringAbout = () => {
  const match = location.search.match(/[?&]SQF_WORK=([^&]*)/);
  if (!match) return;

  let tries = 0;
  const place = () => {
    const form = document.querySelector('.sqs-block-form, form');
    if (!form) {
      if (tries++ < 40) setTimeout(place, 150);
      return;
    }
    if (document.querySelector('.em-ask')) return;

    const note = document.createElement('div');
    note.className = 'em-ask';
    note.appendChild(document.createTextNode('Enquiring about: '));
    const title = document.createElement('b');
    title.textContent = decodeURIComponent(match[1].replace(/\+/g, ' '));
    note.appendChild(title);
    form.parentNode.insertBefore(note, form);
  };
  place();
};
