/**
 * Where the artist's favorites are kept: her Google Sheet, read as CSV through the sheet's "gviz" address. The sheet is shared so
 * that anyone with the link can view it (and only she can edit it); the website reads the "Paintings" sheet of it.
 * To use another sheet, put its address here (https://docs.google.com/spreadsheets/d/<id>/gviz/tq?tqx=out:csv&sheet=Paintings).
 */
export const FAVORITES_SHEET_CSV = 'https://docs.google.com/spreadsheets/d/1J06NPJryBTdkxmRN_m4GUgjjIbaB429S/gviz/tq?tqx=out:csv&sheet=Paintings';
