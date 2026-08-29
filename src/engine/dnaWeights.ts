// RELATIONSHIP DNA scoring weights — v1, product-owner-specified (Profiler
// concept doc section 4/14: "wagi zostaną ustalone osobno"). Kept in one
// place, deliberately separate from the calculation logic in dna.ts, so this
// table can be retuned later without touching how scores are computed.
//
// Activity types are the SAME 5 buckets dayBadges() already classifies every
// Activity into (src/engine/dayBadges.ts) — no second classification system.
// One activity can carry more than one badge (e.g. a MEETING that's also an
// INCIDENT) and contributes its weight to every DNA parameter for each badge
// it has.

import type { DayBadgeKey } from './dayBadges';

export const DNA_PARAMETERS = [
  'CONTACT',
  'EFFORT',
  'CHEMISTRY',
  'CHAOS',
  'MYSTERY',
  'EVIDENCE',
] as const;

export type DnaParameter = (typeof DNA_PARAMETERS)[number];

export type DnaWeightRow = Record<DnaParameter, number>;

// Weight (0-5) each activity type contributes to each DNA parameter.
export const DNA_WEIGHTS: Record<DayBadgeKey, DnaWeightRow> = {
  MEETING: { CONTACT: 5, EFFORT: 4, CHEMISTRY: 4, CHAOS: 0, MYSTERY: 0, EVIDENCE: 2 },
  CALL: { CONTACT: 5, EFFORT: 3, CHEMISTRY: 3, CHAOS: 0, MYSTERY: 1, EVIDENCE: 1 },
  DM: { CONTACT: 3, EFFORT: 1, CHEMISTRY: 2, CHAOS: 1, MYSTERY: 1, EVIDENCE: 1 },
  GIFT: { CONTACT: 1, EFFORT: 5, CHEMISTRY: 5, CHAOS: 0, MYSTERY: 3, EVIDENCE: 2 },
  INCIDENT: { CONTACT: 1, EFFORT: 1, CHEMISTRY: 1, CHAOS: 5, MYSTERY: 4, EVIDENCE: 4 },
};

// The highest weight ANY single activity type contributes to a given
// parameter, per the table above — this is the "maximum possible weight"
// denominator dna.ts scores each parameter against. Derived from the table
// (not hard-coded) so retuning DNA_WEIGHTS never needs a matching edit here.
export function maxWeightFor(param: DnaParameter): number {
  return Math.max(...Object.values(DNA_WEIGHTS).map((row) => row[param]));
}
