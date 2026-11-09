import { h } from '../lib/elements.js';

/** The painting's story in the artist's words; absent when there is none yet. */
export const renderWorkStory = (info) => info.story && info.story.length
  ? h('section', { class: 'wp-section wp-story' }, h('p', { class: 'ca-label' }, 'The story'), info.story.map((paragraph) => h('p', null, paragraph)))
  : null;
