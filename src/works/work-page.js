import { CATALOGUE } from './catalogue.js';
import { resolveScope, seriesInfo } from '../color/scope.js';
import { renderWorkHero } from './work-hero.js';
import { renderWorkStory } from './work-story.js';
import { renderWorkContext } from './work-context.js';
import { renderWorkDetails } from './work-details.js';
import { renderWorkColors } from './work-colors.js';
import { renderWorkSeriesNav } from './work-series-nav.js';
import { renderWorkNext } from './work-next.js';
import { initWorkSlideshow } from './work-slideshow.js';
import { renderWorkEnquiry } from './work-enquiry.js';

/**
 * Renders a painting's page into `<div data-work-page></div>`: the painting is the page's own address
 * (/paintings/<name>), or the page name given as the attribute's value. The content comes from
 * src/works/catalogue.js and the colors from src/color/atlas.generated.js; a section appears only when
 * there is something to show in it. The arrow keys move through the series (work-slideshow.js).
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

  host.replaceChildren(...[
    hero.element,
    renderWorkStory(info),
    renderWorkContext(info),
    renderWorkDetails(info, series),
    renderWorkSeriesNav(work, series),
    renderWorkNext({ work, scope, intro: renderWorkColors({ work, series }) }),
    renderWorkEnquiry(info),
  ].filter(Boolean));
  initWorkSlideshow({ host, work, series });
};
