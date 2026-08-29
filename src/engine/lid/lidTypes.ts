// THE LID PREVIEW — shared types + the one "gather all the real numbers"
// function every other lid/* module builds on. Per the spec: "Use the
// existing activity model and existing Relationship DNA" / "Do not invent
// values" — everything here is either read straight from LID_TRAITS'
// stored ratings or computed from real Activity data via the engines that
// already exist (dayBadges, summary, dna).

import { dayBadges } from '@/engine/dayBadges';
import { computeCaseEquation, computeDnaScores, type CaseEquation, type DnaScores } from '@/engine/dna';
import { giftCount } from '@/engine/summary';
import { LID_TRAITS, LID_DEFAULT_VALUE, type LidTraitId } from '@/data/theLidTraits';
import type { Activity, CaseMeta } from '@/types/models';

export type LidValue = 1 | 2 | 3 | 4 | 5;

// Raw 1-5 ratings for all 9 traits, defaulting anything never touched to
// LID_DEFAULT_VALUE — same default the slider screen itself displays, so
// "hasn't touched this one" reads the same on both screens.
export type LidRatings = Record<LidTraitId, LidValue>;

export function resolveLidRatings(saved: Record<string, number> | undefined): LidRatings {
  const out = {} as LidRatings;
  for (const trait of LID_TRAITS) {
    const v = saved?.[trait.id];
    out[trait.id] = (v && v >= 1 && v <= 5 ? v : LID_DEFAULT_VALUE) as LidValue;
  }
  return out;
}

// THE LID hasn't been touched at all yet — section 16's empty state — vs.
// "has at least one real rating, treat the rest as their default 3".
export function hasAnyLidRating(saved: Record<string, number> | undefined): boolean {
  return !!saved && Object.keys(saved).length > 0;
}

// Section 3: normalize 1-5 -> 0/25/50/75/100, keeping the raw value alongside.
export type NormalizedLid = Record<LidTraitId, { raw: LidValue; score: number }>;

export function normalizeLidRatings(ratings: LidRatings): NormalizedLid {
  const out = {} as NormalizedLid;
  for (const trait of LID_TRAITS) {
    const raw = ratings[trait.id];
    out[trait.id] = { raw, score: ((raw - 1) / 4) * 100 };
  }
  return out;
}

// Section 9: RELATIONSHIP DATA. Meetings/calls/messages are computed via
// dayBadges() — the SAME classification RELATIONSHIP DNA already scores
// against (src/engine/dna.ts) — rather than a second, slightly different
// definition; totalDays/totalActivities/evidenceItems/incidents/
// activitiesPerDay are computeCaseEquation's, unchanged.
export type RelationshipStats = CaseEquation & {
  meetings: number;
  calls: number;
  messages: number;
  gifts: number;
};

export function computeRelationshipStats(activities: Activity[], caseMeta: CaseMeta): RelationshipStats {
  const eq = computeCaseEquation(activities, caseMeta.firstContactDate);
  let meetings = 0;
  let calls = 0;
  let messages = 0;
  for (const activity of activities) {
    const badges = dayBadges(activity);
    if (badges.includes('MEETING')) meetings += 1;
    if (badges.includes('CALL')) calls += 1;
    if (badges.includes('DM')) messages += 1;
  }
  return { ...eq, meetings, calls, messages, gifts: giftCount(activities) };
}

export type LidContext = {
  ratings: LidRatings;
  normalized: NormalizedLid;
  dna: DnaScores;
  stats: RelationshipStats;
};

export function buildLidContext(
  activities: Activity[],
  caseMeta: CaseMeta
): LidContext {
  const ratings = resolveLidRatings(caseMeta.lidRatings);
  return {
    ratings,
    normalized: normalizeLidRatings(ratings),
    dna: computeDnaScores(activities),
    stats: computeRelationshipStats(activities, caseMeta),
  };
}
