/** The line of facts under a painting on its series page: medium, size, year, and the frame when it is part of the work. */
export const factsLine = (work) => [work.medium, work.size, work.year, work.frame && 'hand-painted frame'].filter(Boolean).join(' · ');
