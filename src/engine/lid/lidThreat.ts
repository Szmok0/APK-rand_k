// THE LID PREVIEW — THREAT LEVEL (THE_LID_PREVIEW_LOGIC section 6).
// Intentionally independent of Primary Type; blends THE LID's own sliders,
// real RELATIONSHIP DNA, and real incident count. Weights already sum to a
// 0-100 range by construction (0.70 + 0.25 + 0.05 max contributions), the
// clamp below is just the spec's explicit belt-and-suspenders.

import type { DnaScores } from '../dna';
import type { NormalizedLid } from './lidTypes';

export type ThreatLabel = 'CLEAR' | 'LOW' | 'MODERATE' | 'ELEVATED' | 'UNEXPLAINED';

export function threatLabelFor(score: number): ThreatLabel {
  if (score < 20) return 'CLEAR';
  if (score < 40) return 'LOW';
  if (score < 60) return 'MODERATE';
  if (score < 80) return 'ELEVATED';
  return 'UNEXPLAINED';
}

export function computeThreatLevel(
  normalized: NormalizedLid,
  dna: DnaScores,
  incidentCount: number
): { score: number; label: ThreatLabel } {
  const lidContribution =
    normalized.drama.score * 0.3 +
    normalized.mystery.score * 0.2 +
    normalized.initiative.score * 0.1 +
    normalized.repeat.score * 0.1;

  const dnaContribution = dna.CHAOS * 0.15 + dna.MYSTERY * 0.1;

  const incidentScore = Math.min(incidentCount / 5, 1) * 100;
  const incidentContribution = incidentScore * 0.05;

  const raw = lidContribution + dnaContribution + incidentContribution;
  const score = Math.max(0, Math.min(100, Math.round(raw)));
  return { score, label: threatLabelFor(score) };
}
