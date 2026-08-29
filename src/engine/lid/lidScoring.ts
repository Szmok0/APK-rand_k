// THE LID PREVIEW — PRIMARY TYPE / SECONDARY TRAIT scoring
// (THE_LID_PREVIEW_LOGIC sections 4-5). Based primarily on THE LID's own
// sliders — Relationship DNA never overwrites the user's assessment here,
// per spec section 4 and 21 ("do not try to make the activity history and
// THE LID agree").

import { LID_ARCHETYPES, LID_UNEXPLAINED, type Archetype, type ArchetypeId } from '@/data/lidArchetypes';
import type { NormalizedLid } from './lidTypes';

// "Sufficiently dominant" for PRIMARY TYPE — below this, section 4 says to
// use UNEXPLAINED instead ("no archetype is sufficiently dominant... or the
// combination is unusually contradictory"). Distinct from (and lower than)
// SECONDARY's 45 threshold, since PRIMARY always needs a real answer while
// SECONDARY is allowed to just say UNRESOLVED.
const PRIMARY_MIN_SCORE = 40;
// Section 5: show SECONDARY only if its score is at least this.
const SECONDARY_MIN_SCORE = 45;

function scoreArchetype(archetype: Archetype, normalized: NormalizedLid): number {
  let total = 0;
  for (const w of archetype.weights) {
    const traitScore = normalized[w.trait].score;
    const score = w.inverse ? 100 - traitScore : traitScore;
    total += score * (w.weight / 100);
  }
  return total;
}

export type ArchetypeScore = { archetype: Archetype; score: number };

// All 7 real archetypes, scored and sorted highest-first. UNEXPLAINED is
// never in this list — it's a fallback state, not something with a weight
// table to score against.
export function rankArchetypes(normalized: NormalizedLid): ArchetypeScore[] {
  return LID_ARCHETYPES.map((archetype) => ({
    archetype,
    score: scoreArchetype(archetype, normalized),
  })).sort((a, b) => b.score - a.score);
}

export type PrimarySecondaryResult = {
  primary: Archetype;
  primaryScore: number;
  secondary: Archetype | null; // null = UNRESOLVED (section 5)
  secondaryScore: number | null;
};

export function computePrimaryAndSecondary(normalized: NormalizedLid): PrimarySecondaryResult {
  const ranked = rankArchetypes(normalized);
  const top = ranked[0];

  if (!top || top.score < PRIMARY_MIN_SCORE) {
    return { primary: LID_UNEXPLAINED, primaryScore: top?.score ?? 0, secondary: null, secondaryScore: null };
  }

  const runnerUp = ranked[1];
  const secondaryQualifies = !!runnerUp && runnerUp.score >= SECONDARY_MIN_SCORE;

  return {
    primary: top.archetype,
    primaryScore: top.score,
    secondary: secondaryQualifies ? runnerUp.archetype : null,
    secondaryScore: secondaryQualifies ? runnerUp.score : null,
  };
}

export type { ArchetypeId };
