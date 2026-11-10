import { CATALOGUE } from './catalogue.js';

/**
 * The address of a work's page: a textile is shown at /textiles/<name> (its page lives in the Paintings collection and
 * /textiles/<name> is a URL mapping to it, see README), every other work at /paintings/<name>.
 */
export const workPath = (slug) => `${CATALOGUE[slug] && CATALOGUE[slug].series === 'textiles' ? '/textiles' : '/paintings'}/${slug}`;
