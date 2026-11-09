/**
 * The "Scrivo una cartolina" page is a standalone landing page with no site
 * header, so this adds a link back to the home page.
 * Styled by scrivo.css.
 */
const back = document.createElement('a');
back.className = 'scrivo-back';
back.href = '/';
back.textContent = '← Elettra Ministeri';
document.body.appendChild(back);
