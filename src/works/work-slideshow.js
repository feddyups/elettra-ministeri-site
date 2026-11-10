import { h } from '../lib/elements.js';
import { inSeriesOrder, around } from './series-order.js';

const KEY = 'em-slide';
const MOTION = '(prefers-reduced-motion: no-preference)';
const LEAVE_MS = 220;
const RECENT_MS = 5000;

const typing = (target) => target instanceof Element && Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
const samePath = (href, other) => new URL(href, location.origin).pathname === new URL(other, location.origin).pathname;

/**
 * Moves through the paintings of a series like a slideshow: the arrow keys, and the previous and next links and the strips under
 * "More in <series>", go to the neighboring painting in the order of the series page. The picture slides out the way it is going and
 * the next one slides in from the other side (not when the visitor prefers reduced motion). The neighbors are fetched ahead so the next
 * page is ready when asked for.
 */
export const initWorkSlideshow = ({ host, work, series }) => {
  const ordered = inSeriesOrder(series.slug, series.works, (w) => w.slug);
  if (ordered.length < 2) return;
  const { previous, next } = around(ordered, work.slug);
  const hero = host.querySelector('.wp-hero');
  const root = document.documentElement;
  const animated = () => Boolean(hero) && matchMedia(MOTION).matches;
  let leaving = false;

  const arrive = () => {
    let flag = null;
    try { flag = JSON.parse(sessionStorage.getItem(KEY)); sessionStorage.removeItem(KEY); } catch (error) { flag = null; }
    if (!flag || Date.now() - flag.at > RECENT_MS || !animated()) return;
    const enter = flag.direction === 'next' ? 'wp-enter-from-right' : 'wp-enter-from-left';
    root.classList.add('wp-sliding');
    hero.classList.add(enter);
    hero.addEventListener('animationend', () => { hero.classList.remove(enter); root.classList.remove('wp-sliding'); }, { once: true });
  };

  const go = (target, direction) => {
    if (leaving) return;
    leaving = true;
    const leave = () => {
      try { sessionStorage.setItem(KEY, JSON.stringify({ direction, at: Date.now() })); } catch (error) { /* the slide is a nicety */ }
      location.assign(target.href);
    };
    if (!animated()) { leave(); return; }
    root.classList.add('wp-sliding');
    hero.classList.add(direction === 'next' ? 'wp-leave-to-left' : 'wp-leave-to-right');
    setTimeout(leave, LEAVE_MS);
  };

  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (typing(event.target) || root.classList.contains('wp-lightbox-open')) return;
    event.preventDefault();
    if (event.key === 'ArrowRight') go(next, 'next'); else go(previous, 'previous');
  });

  host.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('.wp-pager a, .ca-strips a') : null;
    if (!link || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const href = link.getAttribute('href');
    const target = ordered.find((w) => samePath(w.href, href));
    if (!target || target.slug === work.slug) return;
    event.preventDefault();
    const direction = link.closest('.wp-pager') ? (link.textContent.startsWith('‹') ? 'previous' : 'next') : (ordered.indexOf(target) > ordered.findIndex((w) => w.slug === work.slug) ? 'next' : 'previous');
    go(target, direction);
  });

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    leaving = false;
    root.classList.remove('wp-sliding');
    hero.classList.remove('wp-leave-to-left', 'wp-leave-to-right');
  });

  arrive();
  (window.requestIdleCallback || setTimeout)(() => [previous, next].forEach((w) => document.head.append(h('link', { rel: 'prefetch', href: w.href }))));
};
