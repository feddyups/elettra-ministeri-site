import { overviewWorks } from '../overview/works.js';

/**
 * The small line above the home page's color charts, worked out from the catalogue so it always matches what the charts measure:
 * how many paintings, in how many series ("35 paintings · 5 series").
 */
export const initWorksSummary = (element) => {
  const works = overviewWorks();
  if (!works.length) return;
  const parts = [`${works.length} paintings`, `${new Set(works.map((work) => work.series)).size} series`];
  element.textContent = parts.join(' · ');
};
