import { h } from '../lib/elements.js';

/** The enquiry form, inline: the site's /enquire page in its embedded mode, told which painting it is about; the frame grows to fit the form. */
export const renderWorkEnquiry = (info) => {
  const frame = h('iframe', { src: `/enquire?modal=1&SQF_WORK=${encodeURIComponent(info.title)}`, title: `Enquire about ${info.title}`, loading: 'lazy' });
  window.addEventListener('message', (event) => {
    const { data } = event;
    if (event.origin === location.origin && event.source === frame.contentWindow && data && data.type === 'em-height') frame.style.height = `${data.height}px`;
  });
  return h('section', { class: 'wp-section wp-enquiry', id: 'enquire' },
    h('p', { class: 'ca-label' }, 'Enquire'),
    h('h2', null, `Interested in ${info.title}?`),
    h('p', { class: 'wp-enquiry-note' }, 'Tell me a little about yourself and what you have in mind, and I will write back.'),
    frame);
};
