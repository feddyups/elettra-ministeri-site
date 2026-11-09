/*
 * Marks a series page (/paintings/<series>, or the /textiles page) with data-series="<series>" before the page
 * is first painted, so series-theme.css and tones.generated.css can color it without a flash of the default colors.
 * A classic script on purpose: it has to run before the first paint, and it imports nothing.
 */
(function () {
  var match = location.pathname.match(/^\/(?:paintings\/)?([a-z0-9-]+)\/?$/);
  if (!match) return;
  var isPaintingSeries = location.pathname.indexOf('/paintings/') === 0;
  if (isPaintingSeries || match[1] === 'textiles') document.documentElement.setAttribute('data-series', match[1]);
})();
