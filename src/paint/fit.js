/** The size to work at for a picture of `width` x `height`: at most `maxWidth` wide and `maxPixels` in all, in the picture's proportions. */
export const fitWorkSize = (width, height, maxWidth, maxPixels) => {
  const scale = Math.min(1, maxWidth / width, Math.sqrt(maxPixels / (width * height)));
  return { W: Math.max(1, Math.round(width * scale)), H: Math.max(1, Math.round(height * scale)) };
};
