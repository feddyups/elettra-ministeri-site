const LISTED = / · listed at (€[\d,]+) on (\d{4}-\d{2}-\d{2})$/;

/**
 * When the enquiry form is opened for a specific work (`?SQF_WORK=<title>`, or `<title> · listed at €600 on 2026-11-10` when the
 * work has a price), shows "Enquiring about: <title>" above the form once the form has rendered, with the price and the day it was
 * listed on a quieter line beneath. The form's own hidden field keeps the full text, so the sheet records the price listed at the time.
 */
export const showEnquiringAbout = () => {
  const match = location.search.match(/[?&]SQF_WORK=([^&]*)/);
  if (!match) return;
  const topic = decodeURIComponent(match[1].replace(/\+/g, ' '));
  const listed = topic.match(LISTED);
  const name = listed ? topic.replace(LISTED, '') : topic;

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
    title.textContent = name;
    note.appendChild(title);
    if (listed) {
      const day = new Date(`${listed[2]}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
      const price = document.createElement('small');
      price.textContent = `Listed at ${listed[1]} on ${day}. Prices may change.`;
      note.append(price);
    }
    form.parentNode.insertBefore(note, form);
  };
  place();
};
