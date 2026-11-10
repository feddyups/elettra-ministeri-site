import { h } from '../lib/elements.js';

const COMMISSION = 'Commission';
const COMMISSION_PLACEHOLDER = 'Tell me the size you have in mind, the colors you love and the space it is for.';

const fieldNamed = (form, legend) => [...form.querySelectorAll('fieldset.field')].find((f) => (f.querySelector('legend')?.textContent || '').trim().startsWith(legend));

const optionText = (input) => (input.closest('.option')?.textContent || input.value || '').trim();

/**
 * Makes the enquiry form ask only what applies: the budget question and a short explanation of how a commission works
 * appear once "Commission" is ticked under "Type of enquiry"; for a purchase, an exhibition or press enquiry, or anything else,
 * the budget stays out of the way (a purchase already has the listed price). A budget chosen and then hidden is cleared so it is not sent.
 */
export const initSmartForm = () => {
  let tries = 0;
  const place = () => {
    const form = document.querySelector('form.react-form-contents, .sqs-block-form form, form');
    const type = form && fieldNamed(form, 'Type of enquiry');
    const budget = form && fieldNamed(form, 'Budget');
    if (!type || !budget) {
      if (tries++ < 40) setTimeout(place, 150);
      return;
    }
    if (form.dataset.emSmart) return;
    form.dataset.emSmart = 'true';

    const panel = h('div', { class: 'em-commission', role: 'note', hidden: true },
      h('b', null, 'How a commission works'),
      h('p', null, 'A commission is a new painting made for you. Tell me in your message the size, the colors and the space it is for. I will write back with a proposal that includes a price and how long it would take, and nothing begins until you say yes.'),
      h('p', null, 'Because the painting does not exist yet, its price depends mainly on its size. Your budget, if you choose one, helps me suggest what is possible.'));
    type.after(panel);

    const message = form.querySelector('textarea');
    const defaultPlaceholder = message && message.placeholder;

    const update = () => {
      const commission = [...type.querySelectorAll('input:checked')].some((i) => optionText(i) === COMMISSION);
      panel.hidden = !commission;
      if (commission) budget.removeAttribute('data-em-off'); else budget.setAttribute('data-em-off', '');
      if (!commission) budget.querySelectorAll('input:checked').forEach((i) => i.click());
      if (message) message.placeholder = commission ? COMMISSION_PLACEHOLDER : defaultPlaceholder;
    };
    form.addEventListener('change', update);
    update();
  };
  place();
};
