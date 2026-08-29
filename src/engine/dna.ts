// RELATIONSHIP DNA — Profiler concept doc section 4. A deterministic,
// fictional scoring model over real Activity data (never a real
// psychological measurement — see AGENTS.md "No fake Profiler").
//
// No hidden multipliers, decay, time weighting, randomness or ML: the same
// activity history always produces the same result. Visual design is
// entirely separate from this file — app/profiler/dna.tsx only reads the
// numbers computed here and lays them over the static background art.

import { dayBadges } from './dayBadges';
import { DNA_PARAMETERS, DNA_WEIGHTS, maxWeightFor, type DnaParameter } from './dnaWeights';
import { incidentCount } from './summary';
import type { Activity } from '@/types/models';
import { diffInDays, todayKey } from '@/utils/dates';

export type DnaScores = Record<DnaParameter, number>; // 0-100, integer

// score(param) = (sum of weights every activity generated for that param)
//                / (max possible weight for that param × total activities)
//                × 100, clamped to 0-100.
//
// This is a DNA SCORE, not literally "percentage of activities that were
// contact/effort/etc." — see the worked example in dnaWeights.ts's weight
// table (32 CONTACT points out of a possible 5×10 = 50 → 64%).
export function computeDnaScores(activities: Pick<Activity, 'glyphIds' | 'importance'>[]): DnaScores {
  const totals: Record<DnaParameter, number> = {
    CONTACT: 0,
    EFFORT: 0,
    CHEMISTRY: 0,
    CHAOS: 0,
    MYSTERY: 0,
    EVIDENCE: 0,
  };

  for (const activity of activities) {
    for (const badge of dayBadges(activity)) {
      const row = DNA_WEIGHTS[badge];
      for (const param of DNA_PARAMETERS) totals[param] += row[param];
    }
  }

  const totalActivities = activities.length;
  const scores = {} as DnaScores;
  for (const param of DNA_PARAMETERS) {
    const denominator = maxWeightFor(param) * totalActivities;
    const raw = denominator > 0 ? (totals[param] / denominator) * 100 : 0;
    scores[param] = Math.max(0, Math.min(100, Math.round(raw)));
  }
  return scores;
}

export type CaseEquation = {
  totalDays: number;
  totalActivities: number;
  evidenceItems: number;
  incidents: number;
  activitiesPerDay: number;
};

// firstContactDate is CaseMeta's real, persisted "day 1" (src/types/models.ts,
// already shown on Home) — not inferred from the earliest logged Activity,
// since the case can start before anything is logged.
export function computeCaseEquation(activities: Activity[], firstContactDate: string): CaseEquation {
  const totalDays = Math.max(1, diffInDays(firstContactDate, todayKey()) + 1);
  const totalActivities = activities.length;
  // Evidence Archive is a 1:1 derived view over Activity (AGENTS.md) — this
  // is computed independently from TOTAL ACTIVITIES per spec, but will
  // always equal it by the app's own architecture, not by coincidence.
  const evidenceItems = activities.length;
  const incidents = incidentCount(activities);
  const activitiesPerDay = totalActivities / totalDays;
  return { totalDays, totalActivities, evidenceItems, incidents, activitiesPerDay };
}
