/**
 * Where the artist's picks are kept: her Google Sheet, read as CSV through the sheet's "gviz" address. The sheet is shared so
 * that anyone with the link can view it (and only she can edit it); the website reads the "Paintings" sheet of it.
 * To use another sheet, put its address here (https://docs.google.com/spreadsheets/d/<id>/gviz/tq?tqx=out:csv&sheet=Paintings&headers=1). The "headers=1" part fixes the header at the first row; without it Google guesses how many header rows there are and can fold the first paintings into them.
 */
export const PICKS_SHEET_CSV = 'https://docs.google.com/spreadsheets/d/1J06NPJryBTdkxmRN_m4GUgjjIbaB429S/gviz/tq?tqx=out:csv&sheet=Paintings&headers=1';
