/*
 * Marks a series page (/paintings/<series>) with data-series="<series>" before the page is first painted,
 * so series-theme.css and tones.generated.css can color it without a flash of the default colors.
 * A classic script on purpose: it has to run before the first paint, and it imports nothing.
 */
(function () {
  var match = location.pathname.match(/^\/paintings\/([a-z0-9-]+)\/?$/);
  if (match) document.documentElement.setAttribute('data-series', match[1]);
})();
