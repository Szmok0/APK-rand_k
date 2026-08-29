// Selection logic for RELATIONSHIP DNA's SYSTEM COMMENT and FIELD NOTE —
// deterministic, rule-based over the same DnaScores/CaseEquation the
// percentages on screen are computed from (never random, never invented
// per-run). Content lives in src/data/dnaFieldNotes.ts.

import {
  DNA_DOMINANT_COMMENTS,
  DNA_FIELD_NOTE_GENERIC,
  DNA_FIELD_NOTE_RARE,
  DNA_GENERIC_COMMENTS,
} from '@/data/dnaFieldNotes';
import type { CaseEquation, DnaScores } from './dna';
import { DNA_PARAMETERS, type DnaParameter } from './dnaWeights';
import { giftCount } from './summary';
import type { Activity } from '@/types/models';

const RARE_THRESHOLD = 80;
const MIN_ACTIVITIES_FOR_A_TREND = 3;

function dominantParameter(scores: DnaScores): DnaParameter | null {
  let best: DnaParameter | null = null;
  let bestScore = -1;
  for (const param of DNA_PARAMETERS) {
    if (scores[param] > bestScore) {
      best = param;
      bestScore = scores[param];
    }
  }
  // A flat 0-everywhere board (no data yet) has no real "dominant" trait.
  return bestScore > 0 ? best : null;
}

// Stable per data state (not per render): picks a pool index off the total
// activity count, so it's the same for a given case history and only moves
// as the case actually grows — same determinism guarantee as the DNA score.
function pick<T>(pool: T[], seed: number): T {
  return pool[((seed % pool.length) + pool.length) % pool.length];
}

export function pickSystemComment(scores: DnaScores, eq: CaseEquation): string {
  const dominant = eq.totalActivities >= MIN_ACTIVITIES_FOR_A_TREND ? dominantParameter(scores) : null;
  if (!dominant) return pick(DNA_GENERIC_COMMENTS, eq.totalActivities);
  return pick(DNA_DOMINANT_COMMENTS[dominant], eq.totalActivities);
}

export function pickFieldNote(scores: DnaScores, eq: CaseEquation, activities: Activity[]): string {
  const gifts = giftCount(activities);
  if (eq.totalActivities >= 5 && gifts / eq.totalActivities > 0.3) {
    return DNA_FIELD_NOTE_RARE.GIFT_HEAVY;
  }
  if (scores.CHAOS >= RARE_THRESHOLD) return DNA_FIELD_NOTE_RARE.HIGH_CHAOS;
  if (scores.MYSTERY >= RARE_THRESHOLD) return DNA_FIELD_NOTE_RARE.HIGH_MYSTERY;
  if (scores.EVIDENCE >= RARE_THRESHOLD && eq.incidents > 0) return DNA_FIELD_NOTE_RARE.HIGH_EVIDENCE;
  if (eq.totalActivities === 0) return DNA_FIELD_NOTE_RARE.FALLBACK;
  return pick(DNA_FIELD_NOTE_GENERIC, eq.totalActivities);
}
