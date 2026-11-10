import { overviewWorks } from '../overview/works.js';

/**
 * The small line above the home page's color charts, worked out from the catalogue so it always matches what the charts measure:
 * how many paintings, in how many series, over which years ("36 paintings · 5 series · 2013–2026"; the years are those that are known).
 */
export const initWorksSummary = (element) => {
  const works = overviewWorks();
  if (!works.length) return;
  const years = works.map((work) => work.year).filter(Boolean);
  const parts = [`${works.length} paintings`, `${new Set(works.map((work) => work.series)).size} series`];
  if (years.length) parts.push(`${Math.min(...years)}–${Math.max(...years)}`);
  element.textContent = parts.join(' · ');
};
