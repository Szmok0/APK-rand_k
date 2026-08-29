// THE LID PREVIEW — FIELD NOTE / EASTER EGG / FINAL REMARK content pools
// (THE_LID_PREVIEW_LOGIC sections 10-12). Pure content — selection logic
// (the priority chain, contradiction/easter-egg trigger conditions) lives
// in src/engine/lid/lidNotes.ts and lidEasterEggs.ts. Deliberately a small
// initial pool per the spec ("do not invent a huge content system").

export const LID_NOTES_GENERIC: string[] = [
  'Subject displays surprisingly normal behaviour.',
  'Further observation recommended.',
  'Current evidence remains inconclusive.',
];

export const LID_NOTES_LOW_DATA: string[] = [
  'Insufficient evidence for a responsible conclusion.',
  'Keep observing.',
];

export const LID_NOTES_ROMANTIC: string[] = [
  'Romantic behaviour exceeds expected levels.',
  'Flowers detected. Situation escalating.',
];

export const LID_NOTES_MYSTERY: string[] = [
  'Subject continues to withhold approximately 73% of his backstory.',
  'Further questioning may be required.',
];

export const LID_NOTES_CHAOS: string[] = [
  'The situation appears to have developed its own agenda.',
  'Three incidents is no longer a coincidence.',
];

export const LID_NOTES_CONSISTENCY: string[] = ['Annoyingly reliable.'];

export const LID_NOTES_HUMOR: string[] = ['Unfortunately hilarious.'];

// Contradiction rules (src/engine/lid/lidNotes.ts) return their own text
// directly per THE_LID_PREVIEW_LOGIC section 7 — this generic line is only
// the fallback label for when a contradiction is flagged some other way.
export const LID_NOTES_CONTRADICTION_GENERIC: string[] = [
  'Interesting testimony.',
  "Subject's statements and available evidence do not fully agree.",
];

export const LID_FINAL_REMARKS: string[] = [
  'Love is optional. The LID is forever.',
  'Proceed with snacks.',
  'Handle with questionable optimism.',
  'Evidence suggests continued observation.',
  "This profile is not a promise. It's a probability.",
];
