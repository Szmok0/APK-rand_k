// Picks a random line from src/data/emptyStates.ts for a given group —
// found during the pre-handoff audit: several screens had copy-pasted ONE
// line out of a group that was clearly written to rotate (e.g. Calendar's
// empty day always showed EMPTY_STATES id 4 verbatim, never the other 3
// options in the same "CALENDAR / EMPTY DAY" group) instead of ever picking
// from the pool. Random per render, same convention as dailyQuote()
// (src/engine/quote.ts) — "should feel alive", not a fixed single line.

import { EMPTY_STATES } from '@/data/emptyStates';

export function emptyStateFor(group: string): { main: string; sub: string } {
  const options = EMPTY_STATES.filter((e) => e.group === group);
  if (options.length === 0) return { main: '', sub: '' };
  const pick = options[Math.floor(Math.random() * options.length)];
  return { main: pick.main, sub: pick.sub };
}
