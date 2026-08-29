// THE LID PREVIEW — PROFILE CONFIDENCE (THE_LID_PREVIEW_LOGIC section 8).
// NOT the Primary Type percentage — this describes how much real
// relationship data backs the whole classification, from real Calendar/
// Evidence counts only.

export type ConfidenceLabel = 'PRELIMINARY' | 'DEVELOPING' | 'WELL DOCUMENTED' | 'EXTENSIVELY DOCUMENTED';

export function confidenceLabelFor(score: number): ConfidenceLabel {
  if (score < 30) return 'PRELIMINARY';
  if (score < 60) return 'DEVELOPING';
  if (score < 80) return 'WELL DOCUMENTED';
  return 'EXTENSIVELY DOCUMENTED';
}

export function computeProfileConfidence(
  totalActivities: number,
  totalDays: number,
  evidenceItems: number
): { score: number; label: ConfidenceLabel } {
  const activityConfidence = Math.min(totalActivities / 30, 1) * 60;
  const timeConfidence = Math.min(totalDays / 30, 1) * 25;
  const evidenceConfidence = Math.min(evidenceItems / 10, 1) * 15;
  const score = Math.max(0, Math.min(100, Math.round(activityConfidence + timeConfidence + evidenceConfidence)));
  return { score, label: confidenceLabelFor(score) };
}
