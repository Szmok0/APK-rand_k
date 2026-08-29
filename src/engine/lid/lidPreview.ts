// THE LID PREVIEW — top-level orchestrator. Combines every lid/* module
// into the one result object the screen consumes (THE_LID_PREVIEW_LOGIC
// section 18's shape). Deterministic end to end: same slider values + same
// relationship data always produce the same result (no randomness, no
// hidden multipliers, no ML — section 18/19).

import type { Activity, CaseMeta } from '@/types/models';
import { buildLidContext, hasAnyLidRating } from './lidTypes';
import { computePrimaryAndSecondary } from './lidScoring';
import { computeThreatLevel, type ThreatLabel } from './lidThreat';
import { computeProfileConfidence, type ConfidenceLabel } from './lidConfidence';
import { pickFieldNote, pickFinalRemark } from './lidNotes';
import type { RelationshipStats } from './lidTypes';

export type LidPreviewResult = {
  primaryType: string;
  primaryScore: number;
  secondaryType: string | null; // null = UNRESOLVED
  secondaryScore: number | null;
  threatLevel: number;
  threatLabel: ThreatLabel;
  profileConfidence: number;
  profileConfidenceLabel: ConfidenceLabel;
  fieldNote: string;
  finalRemark: string;
  statistics: RelationshipStats;
};

// Section 16: has THE LID been completed at all yet?
export function isLidComplete(caseMeta: CaseMeta): boolean {
  return hasAnyLidRating(caseMeta.lidRatings);
}

export function computeLidPreview(activities: Activity[], caseMeta: CaseMeta): LidPreviewResult {
  const ctx = buildLidContext(activities, caseMeta);
  const { primary, primaryScore, secondary, secondaryScore } = computePrimaryAndSecondary(ctx.normalized);
  const threat = computeThreatLevel(ctx.normalized, ctx.dna, ctx.stats.incidents);
  const confidence = computeProfileConfidence(ctx.stats.totalActivities, ctx.stats.totalDays, ctx.stats.evidenceItems);

  const fieldNote = pickFieldNote({
    ratings: ctx.ratings,
    dna: ctx.dna,
    stats: ctx.stats,
    confidenceScore: confidence.score,
  });
  const finalRemark = pickFinalRemark(ctx.stats.totalActivities);

  return {
    primaryType: primary.label,
    primaryScore: Math.round(primaryScore),
    secondaryType: secondary?.label ?? null,
    secondaryScore: secondaryScore !== null ? Math.round(secondaryScore) : null,
    threatLevel: threat.score,
    threatLabel: threat.label,
    profileConfidence: confidence.score,
    profileConfidenceLabel: confidence.label,
    fieldNote,
    finalRemark,
    statistics: ctx.stats,
  };
}
