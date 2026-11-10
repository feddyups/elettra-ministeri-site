/** The line of facts under a painting on its series page: medium, size, year, and the frame when it is part of the work (unless the size already says "with frame"). */
export const factsLine = (work) => [work.medium, work.size, work.year, work.frame && !/\bwith frame\b/i.test(work.size || '') && (work.frameNote || 'hand-painted frame')].filter(Boolean).join(' · ');
