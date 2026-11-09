import { h } from '../lib/elements.js';

/**
 * The cultural reading of a work, in a neutral voice (it is not the artist's own account): an introduction, what the
 * figure shows, the traditions it echoes (each with linked museum sources) and a closing note. Absent when the work has no `context`.
 */
export const renderWorkContext = (info) => {
  const context = info.context;
  if (!context) return null;
  return h('section', { class: 'wp-section wp-context' },
    h('p', { class: 'ca-label' }, context.heading || 'Context'),
    (context.intro || []).map((paragraph) => h('p', { class: 'wp-lede' }, paragraph)),
    context.figure && h('dl', { class: 'wp-figure-notes' }, context.figure.map(([term, text]) => h('div', null, h('dt', null, term), h('dd', null, text)))),
    context.echoes && h('div', { class: 'wp-echoes' }, context.echoes.map((echo) => h('article', { class: 'wp-echo' },
      h('h3', null, echo.name, h('small', null, echo.place)),
      h('p', null, echo.text),
      echo.sources && h('p', { class: 'wp-sources' }, 'Sources: ', echo.sources.map((source, i) => [i ? ', ' : '', h('a', { href: source.url, rel: 'noopener', target: '_blank' }, source.label)]))))),
    context.closing && h('p', { class: 'wp-closing' }, context.closing));
};
