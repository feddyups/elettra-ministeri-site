import { h, svg } from '../lib/elements.js';
import { PRESET_IDS, PRESET_INFO, PRESETS, DEFAULT_PRESET } from '../themes/tones.generated.js';
import { presetOf, hasPresets, choosePreset } from '../themes/tone-choice.js';
import { seriesInfo } from '../color/scope.js';

/**
 * The palette button in the header and the panel it opens: the backgrounds a visitor can choose between for the page they are on. On a series page,
 * a painting page or the page of a series' works it changes that series' background; on the All paintings page it changes that page's. A page that
 * has no presets (About me, Print, Artist picks) gets no button. The choice is kept in the browser (themes/tone-choice.js) and shown at once.
 * On a phone, where the menu holds the header's buttons out of sight, a series page and the All paintings page also carry a row of the same backgrounds
 * under their introduction (hidden from wider screens, see tone-control.css).
 */
const series = document.documentElement.dataset.series;

const ICON = () => svg('svg', { viewBox: '0 0 24 24', width: '20', height: '20', 'aria-hidden': 'true', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  svg('path', { d: 'M12 3a9 9 0 1 0 0 18c1.3 0 1.9-.8 1.9-1.8 0-1-.9-1.4-.9-2.3 0-.9.7-1.6 1.7-1.6H17a4 4 0 0 0 4-4c0-4.2-4-8.3-9-8.3z' }),
  svg('circle', { cx: '7.8', cy: '11.2', r: '1', fill: 'currentColor', stroke: 'none' }),
  svg('circle', { cx: '10.6', cy: '7.4', r: '1', fill: 'currentColor', stroke: 'none' }),
  svg('circle', { cx: '15', cy: '7.6', r: '1', fill: 'currentColor', stroke: 'none' }));

const initToneControl = () => {
  const label = series === 'all' ? 'All paintings' : (seriesInfo(series) || { label: series }).label;
  const title = `Colors of ${label}`;
  const options = [];

  const panel = h('div', { class: 'em-tone-panel', role: 'dialog', 'aria-label': title, hidden: true },
    h('p', { class: 'em-tone-title' }, title),
    h('div', { class: 'em-tone-options', role: 'radiogroup', 'aria-label': 'Background' },
      PRESET_IDS.map((id) => {
        const tone = PRESETS[series][id];
        const option = h('button', { class: 'em-tone-option', type: 'button', role: 'radio', 'data-preset': id, style: { '--tone-bg': tone.bg, '--tone-alt': tone.alt } },
          h('span', { class: 'em-tone-swatch', 'aria-hidden': 'true' }),
          h('span', { class: 'em-tone-text' },
            h('b', null, PRESET_INFO[id].label, id === DEFAULT_PRESET && h('i', null, ' · default')),
            h('small', null, PRESET_INFO[id].note)));
        option.addEventListener('click', () => { choosePreset(series, id); sync(); });
        options.push(option);
        return option;
      })));
  document.body.append(panel);

  const chips = [];
  const head = document.querySelector('.th-head');
  if (head) {
    head.after(h('div', { class: 'em-tone-row', role: 'radiogroup', 'aria-label': title },
      h('p', { class: 'em-tone-row-title' }, 'Background'),
      h('div', { class: 'em-tone-chips' }, PRESET_IDS.map((id) => {
        const tone = PRESETS[series][id];
        const chip = h('button', { class: 'em-tone-chip', type: 'button', role: 'radio', 'data-preset': id, style: { '--tone-bg': tone.bg, '--tone-alt': tone.alt } },
          h('span', { class: 'em-tone-swatch', 'aria-hidden': 'true' }),
          h('span', null, PRESET_INFO[id].label));
        chip.addEventListener('click', () => choosePreset(series, id));
        chips.push(chip);
        return chip;
      }))));
  }

  const triggers = [];
  const sync = () => {
    const current = presetOf(series);
    options.forEach((option) => {
      const on = option.dataset.preset === current;
      option.setAttribute('aria-checked', String(on));
      option.tabIndex = on ? 0 : -1;
    });
    chips.forEach((chip) => chip.setAttribute('aria-checked', String(chip.dataset.preset === current)));
  };

  const isOpen = () => !panel.hidden;
  const visibleTrigger = () => triggers.find((t) => t.offsetParent !== null) || triggers[0];
  let scrolledFrom = 0;
  const close = (focusBack = false) => {
    if (!isOpen()) return;
    panel.hidden = true;
    triggers.forEach((t) => t.setAttribute('aria-expanded', 'false'));
    if (focusBack) visibleTrigger().focus();
  };
  const open = () => {
    const trigger = visibleTrigger();
    const box = trigger.getBoundingClientRect();
    panel.style.top = `${Math.round(box.bottom + 12)}px`;
    panel.style.right = `${Math.max(16, Math.round(innerWidth - box.right))}px`;
    sync();
    panel.hidden = false;
    scrolledFrom = scrollY;
    triggers.forEach((t) => t.setAttribute('aria-expanded', 'true'));
    (options.find((o) => o.tabIndex === 0) || options[0]).focus();
  };

  const place = () => {
    document.querySelectorAll('.header-actions--right').forEach((actions) => {
      if (actions.querySelector('.em-tone-button')) return;
      const trigger = h('button', { class: 'em-tone-button', type: 'button', 'aria-label': 'Change the colors of this page', 'aria-haspopup': 'dialog', 'aria-expanded': 'false' }, ICON());
      trigger.addEventListener('click', (event) => { event.stopPropagation(); if (isOpen()) close(); else open(); });
      actions.append(trigger);
      triggers.push(trigger);
    });
  };
  place();
  addEventListener('load', place);

  panel.addEventListener('keydown', (event) => {
    const i = options.indexOf(document.activeElement);
    const move = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (move && i > -1) { event.preventDefault(); const next = options[(i + move + options.length) % options.length]; next.focus(); choosePreset(series, next.dataset.preset); sync(); next.tabIndex = 0; }
    if (event.key === 'Escape') { event.preventDefault(); close(true); }
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(true); });
  document.addEventListener('click', (event) => { if (isOpen() && !panel.contains(event.target) && !triggers.some((t) => t.contains(event.target))) close(); });
  addEventListener('scroll', () => { if (isOpen() && Math.abs(scrollY - scrolledFrom) > 80) close(); }, { passive: true });
  addEventListener('resize', () => close());
  addEventListener('em-tone-change', sync);
  sync();
};

if (series && hasPresets(series)) initToneControl();
