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
    if (/ · listed at /.test(title.textContent)) {
      const caveat = document.createElement('small');
      caveat.textContent = ' Prices are in US dollars and may change; the price shown today is recorded with your enquiry.';
      note.append(document.createElement('br'), caveat);
    }
    form.parentNode.insertBefore(note, form);
  };
  place();
};
