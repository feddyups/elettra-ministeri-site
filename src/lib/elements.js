const SVG_NS = 'http://www.w3.org/2000/svg';

const build = (node, attrs, children) => {
  for (const [name, value] of Object.entries(attrs || {})) {
    if (value === false || value == null) continue;
    if (name === 'style' && typeof value === 'object') Object.entries(value).forEach(([k, v]) => node.style.setProperty(k, v));
    else node.setAttribute(name, value === true ? '' : value);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child);
  }
  return node;
};

/** Creates an HTML element: `h('a', { href: '/x' }, 'text', h('b', null, 'more'))`. */
export const h = (tag, attrs, ...children) => build(document.createElement(tag), attrs, children);

/** Creates an SVG element, same shape as `h`. */
export const svg = (tag, attrs, ...children) => build(document.createElementNS(SVG_NS, tag), attrs, children);
