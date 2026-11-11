import { h } from '../lib/elements.js';

/** From this width the drawer sits beside the index and narrows it; below it the drawer is a sheet over the bottom of the window. */
const DOCKED = '(min-width: 68.75em)';

/**
 * The drawer of charts on the Paintings page: tabs of charts that answer to the index's choices (and set them), kept beside the index so both can be
 * worked together. `panels` are `{ id, label, content }`. The drawer starts closed; the toolbar's button opens it (`toggle`), and a choice in the index
 * that a chart shows brings that chart up (`reveal`, which only acts where the drawer sits beside the index, so a phone's sheet never covers the
 * list by itself). Its state is on the workbench (`data-drawer`), which gives the index its width.
 */
export const renderChartDrawer = (workbench, panels) => {
  const docked = matchMedia(DOCKED);
  const listeners = new Set();
  let current = panels[0].id;
  let opened = false;

  const tabs = panels.map((panel) => h('button', { class: 'ov-drawer-tab', type: 'button', role: 'tab', id: `ov-tab-${panel.id}`, 'aria-controls': `ov-panel-${panel.id}` }, panel.label));
  const bodies = panels.map((panel) => h('div', { class: 'ov-drawer-panel', role: 'tabpanel', id: `ov-panel-${panel.id}`, 'aria-labelledby': `ov-tab-${panel.id}` }, panel.content));
  const close = h('button', { class: 'ov-drawer-close', type: 'button', 'aria-label': 'Close the charts' }, '×');
  const element = h('aside', { class: 'ov-drawer', id: 'ov-drawer', 'aria-label': 'Charts', hidden: true },
    h('div', { class: 'ov-drawer-head' }, h('div', { class: 'ov-drawer-tabs', role: 'tablist', 'aria-label': 'Charts' }, tabs), close),
    bodies);

  const paint = () => {
    panels.forEach((panel, i) => {
      const on = panel.id === current;
      tabs[i].setAttribute('aria-selected', String(on));
      tabs[i].tabIndex = on ? 0 : -1;
      bodies[i].hidden = !on;
    });
    element.hidden = !opened;
    workbench.dataset.drawer = opened ? 'open' : 'closed';
    listeners.forEach((fn) => fn(opened));
  };

  const api = {
    element,
    isOpen: () => opened,
    open(id) { if (id) current = id; opened = true; paint(); },
    close() { opened = false; paint(); },
    toggle() { if (opened) api.close(); else api.open(); },
    /** Brings a chart up beside the index; does nothing where the drawer would cover the list. */
    reveal(id) { if (docked.matches) api.open(id); },
    onChange(fn) { listeners.add(fn); fn(opened); },
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => api.open(panels[i].id));
    tab.addEventListener('keydown', (event) => {
      const move = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!move) return;
      event.preventDefault();
      const next = (i + move + panels.length) % panels.length;
      api.open(panels[next].id);
      tabs[next].focus();
    });
  });
  close.addEventListener('click', () => api.close());
  element.addEventListener('keydown', (event) => { if (event.key === 'Escape') api.close(); });
  paint();
  return api;
};
