/**
 * Prints what to paste into Squarespace after a release, and the three places to paste it:
 *
 *   npm run pins            uses the newest git tag
 *   npm run pins -- v1.22.34
 *
 * The three places each load the site's code from a fixed release, so each must be changed by hand.
 */
import { execSync } from 'node:child_process';

const tag = process.argv[2] || execSync('git tag --sort=-v:refname', { cwd: new URL('..', import.meta.url) }).toString().split('\n')[0];
const base = `https://cdn.jsdelivr.net/gh/feddyups/elettra-ministeri-site@${tag}/src`;

console.log(`Release ${tag}\n`);
console.log('1. Settings → Developer Tools → Code Injection → HEADER (three tags):');
console.log(`   <link rel="stylesheet" href="${base}/themes/tones.generated.css">`);
console.log(`   <link rel="stylesheet" href="${base}/themes/series-theme.css">`);
console.log(`   <script src="${base}/themes/series-attr.js"></script>\n`);
console.log('2. Same page → FOOTER (two tags):');
console.log(`   <script type="module" src="${base}/enquiry/main.js"></script>`);
console.log(`   <script type="module" src="${base}/blocks.js"></script>\n`);
console.log('3. Home page → the code block at the bottom ("Embedded scripts"):');
console.log(`   <script type="module" src="${base}/main.js"></script>\n`);
console.log('In each, only the version after the @ changes. Then run: npm run check:site');
