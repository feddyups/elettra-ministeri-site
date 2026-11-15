import { pictureAt } from './series-notes.js';
import { priceValue, isSoldWork } from './price.js';

const SITE = 'Elettra Ministeri';

/** The one-sentence description of a work for search results and link previews: what the picture shows, its size, and who made it. */
export const seoDescription = (info) => [info.alt.replace(/\.$/, ''), info.size, `Original work by ${SITE}`].filter(Boolean).join('. ') + '.';

/** Sets (or creates) a `<meta>` tag in the head, keyed by its `name` or `property`. */
const setMeta = (key, value, content) => {
  let tag = document.head.querySelector(`meta[${key}="${value}"]`);
  if (!tag) { tag = document.createElement('meta'); tag.setAttribute(key, value); document.head.append(tag); }
  tag.setAttribute('content', content);
};

/**
 * The tags a search engine or a link preview reads, filled in from the catalogue when a work's page is drawn: the meta description, the description and picture of the
 * social cards, and structured data (schema.org VisualArtwork and Product, with the price and whether it is still available). Squarespace's own
 * tags stay: its title, canonical address and anything set in the page's SEO panel is replaced here only where the page's description is empty.
 */
export const applyWorkSeo = (info) => {
  const description = seoDescription(info);
  const existing = document.head.querySelector('meta[name="description"]');
  if (!existing || !existing.getAttribute('content')) setMeta('name', 'description', description);
  const used = (existing && existing.getAttribute('content')) || description;
  setMeta('property', 'og:description', used);
  setMeta('name', 'twitter:description', used);
  const picture = pictureAt(info, 1500);
  const card = document.head.querySelector('meta[property="og:image"]');
  if (!card || /template|imgg-/.test(card.getAttribute('content') || '')) { setMeta('property', 'og:image', picture); setMeta('name', 'twitter:image', picture); }
  setMeta('property', 'og:image:alt', info.alt);

  const data = {
    '@context': 'https://schema.org',
    '@type': ['VisualArtwork', 'Product'],
    name: info.title,
    description,
    image: picture,
    artMedium: info.medium,
    creator: { '@type': 'Person', name: SITE },
    url: location.origin + location.pathname,
  };
  const price = priceValue(info);
  if (price || isSoldWork(info)) {
    data.offers = {
      '@type': 'Offer',
      url: data.url,
      priceCurrency: 'EUR',
      ...(price ? { price: String(price) } : {}),
      availability: isSoldWork(info) ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    };
  }
  document.head.querySelectorAll('script[data-em-work-ld]').forEach((node) => node.remove());
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.emWorkLd = '';
  script.textContent = JSON.stringify(data);
  document.head.append(script);
};
