// RELATIONSHIP DNA screen — SYSTEM COMMENT / FIELD NOTE content pools.
// Structure only, per the product owner's instruction: generic + data-
// dependent + rare tiers exist, but this is deliberately a SMALL initial
// pool, not a full content system. Selection logic lives in
// src/engine/dnaFieldNote.ts — these are pure content, same split as
// caseStatusLines.ts / caseStatus.ts elsewhere in the app.

import type { DnaParameter } from '@/engine/dnaWeights';

// Used when there isn't enough data yet for a dominant trait to mean much.
export const DNA_GENERIC_COMMENTS: string[] = [
  'Insufficient data for a confident pattern. The case remains open.',
  'The evidence points in several directions at once.',
  'No dominant trait has emerged yet. Keep logging.',
  'The numbers are still forming an opinion.',
];

// One short bank per DNA parameter, used when that parameter is the
// dominant (highest-scoring) one.
export const DNA_DOMINANT_COMMENTS: Record<DnaParameter, string[]> = {
  CONTACT: [
    'Communication levels are consistent with an active investigation.',
    'Contact frequency suggests the subject is, at minimum, responsive.',
    'The Lid answers. That much is documented.',
  ],
  EFFORT: [
    "Effort levels exceed what boredom alone would explain.",
    'Someone is trying. The file does not specify why.',
    'Consistent effort detected. Motive remains unconfirmed.',
  ],
  CHEMISTRY: [
    "Chemistry readings run higher than the subject's alibi would suggest.",
    'The evidence suggests genuine attraction, against all professional advice.',
    "Warning: chemistry levels may be affecting the investigator's judgment.",
  ],
  CHAOS: [
    'Chaos levels are elevated. Proceed with popcorn.',
    'The pattern is unstable. So, reportedly, is the subject.',
    'This case generates more incidents than closure.',
  ],
  MYSTERY: [
    'The subject remains difficult to classify.',
    'Several entries raise more questions than they answer.',
    'Mystery levels suggest the file is incomplete by design.',
  ],
  EVIDENCE: [
    'The paperwork is thorough. The conclusions are not.',
    'Documentation is extensive. Certainty is not guaranteed.',
    'The archive grows faster than the explanation.',
  ],
};

// FIELD NOTE — shorter, one-line, used most of the time.
export const DNA_FIELD_NOTE_GENERIC: string[] = [
  'Subject observed behaving consistently with prior entries.',
  'No unusual patterns beyond the expected.',
  'Recommend continued observation.',
  'File remains active.',
];

// Rare tier — reuses the Profiler concept doc's own approved Easter Egg
// lines (section 8) rather than inventing new ones. Trigger conditions live
// in dnaFieldNote.ts.
export const DNA_FIELD_NOTE_RARE: Record<string, string> = {
  GIFT_HEAVY: 'SUSPICIOUS AMOUNT OF GIFTS DETECTED.',
  HIGH_CHAOS: 'THE SYSTEM HAS STOPPED PRETENDING THIS IS SCIENCE.',
  HIGH_MYSTERY: 'EVIDENCE DISAGREES.',
  HIGH_EVIDENCE: 'FURTHER INVESTIGATION REQUIRED.',
  FALLBACK: 'CITATION NEEDED.',
};
