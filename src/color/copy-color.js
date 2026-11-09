const COPIED_MS = 1400;

/**
 * Copies a color's hex code to the clipboard and announces it on `document` as an `em:color` event
 * (`detail.action` is "copy"), so anything that wants to gather colors can listen for it.
 */
export const copyColor = (color) => {
  if (navigator.clipboard) navigator.clipboard.writeText(color.hex).catch(() => {});
  document.dispatchEvent(new CustomEvent('em:color', { detail: { action: 'copy', ...color } }));
  return COPIED_MS;
};
