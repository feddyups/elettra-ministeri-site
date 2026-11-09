import { CATALOGUE } from './catalogue.js';
import { resolveScope, seriesInfo } from '../color/scope.js';
import { renderWorkHero } from './work-hero.js';
import { renderWorkStory } from './work-story.js';
import { renderWorkDetails } from './work-details.js';
import { renderWorkColors } from './work-colors.js';
import { renderWorkSeriesNav } from './work-series-nav.js';
import { renderWorkEnquiry } from './work-enquiry.js';

/**
 * Renders a painting's page into `<div data-work-page></div>`: the painting is the page's own address
 * (/paintings/<name>), or the page name given as the attribute's value. The content comes from
 * src/works/catalogue.js and the colors from src/color/atlas.generated.js; a section appears only when
 * there is something to show in it.
 */
export const initWorkPage = (host) => {
  const fromAddress = location.pathname.split('/').filter(Boolean).pop();
  const slug = CATALOGUE[fromAddress] ? fromAddress : host.dataset.workPage;
  const info = CATALOGUE[slug];
  const scope = resolveScope(`work:${slug}`);
  const series = info && seriesInfo(info.series);
  if (!info || !scope || !series) return;

  const work = scope.works[0];
  host.classList.add('ca', 'wp');
  host.dataset.surface = 'theme';

  const hero = renderWorkHero(info, work, series);
  host.addEventListener('wp:color', (event) => hero.showColor(event.detail.index));

  host.replaceChildren(...[
    hero.element,
    renderWorkStory(info),
    renderWorkDetails(info, series),
    renderWorkColors({ host, work, scope, series }),
    renderWorkSeriesNav(work, series),
    renderWorkEnquiry(info),
  ].filter(Boolean));
};
