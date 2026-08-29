// THE LID PREVIEW — FIELD NOTE selection (THE_LID_PREVIEW_LOGIC sections
// 7 and 10) and FINAL REMARK (section 12). Priority, per section 10:
// 1. rare Easter Egg, 2. contradiction rule, 3. data-dependent rule,
// 4. archetype-specific rule, 5. generic fallback. Tiers 3-4 share the same
// small set of trait-keyed pools below — a real per-archetype pool on top
// of that would be a second content system for the same information, which
// the spec explicitly says not to build ("do not invent a huge content
// system").
//
// Deterministic throughout — "must be configurable and expandable" per
// section 7, satisfied by these being plain ordered arrays/lists, and never
// randomness (section 18: "same slider values + same relationship data
// must always produce the same result").

import {
  LID_FINAL_REMARKS,
  LID_NOTES_CHAOS,
  LID_NOTES_CONSISTENCY,
  LID_NOTES_GENERIC,
  LID_NOTES_HUMOR,
  LID_NOTES_LOW_DATA,
  LID_NOTES_MYSTERY,
  LID_NOTES_ROMANTIC,
} from '@/data/lidFieldNotes';
import { pickEasterEgg } from './lidEasterEggs';
import type { DnaScores } from '../dna';
import type { LidRatings, RelationshipStats } from './lidTypes';

type NotesContext = {
  ratings: LidRatings;
  dna: DnaScores;
  stats: RelationshipStats;
  confidenceScore: number;
};

// Section 7's contradiction rules, checked in the order given there. Each
// entry is independently configurable — add/remove/reorder without
// touching the picker below.
const CONTRADICTIONS: { check: (ctx: NotesContext) => boolean; text: string }[] = [
  {
    // CONSISTENT >= 4 and DNA CHAOS is high or incidents are repeated.
    check: (ctx) => ctx.ratings.consistency >= 4 && (ctx.dna.CHAOS >= 60 || ctx.stats.incidents >= 2),
    text: "Subject's consistency remains under investigation.",
  },
  {
    // ROMANTIC >= 4 and very few GIFTS / MEETINGS.
    check: (ctx) => ctx.ratings.romantic >= 4 && ctx.stats.gifts + ctx.stats.meetings < 2,
    text: 'Romantic evidence remains surprisingly theoretical.',
  },
  {
    // CARING >= 4 and incidents are high.
    check: (ctx) => ctx.ratings.caring >= 4 && ctx.stats.incidents >= 3,
    text: 'Care appears to coexist with questionable operational decisions.',
  },
  {
    // MYSTERY >= 4 and many DMs but few meetings.
    check: (ctx) => ctx.ratings.mystery >= 4 && ctx.stats.messages >= 5 && ctx.stats.meetings <= 1,
    text: 'Subject has provided extensive communication and suspiciously little physical evidence.',
  },
  {
    // WOULD_DO_IT_AGAIN = 5 and INCIDENT_COUNT > 0.
    check: (ctx) => ctx.ratings.repeat === 5 && ctx.stats.incidents > 0,
    text: 'The LID has been warned.',
  },
  {
    // WOULD_DO_IT_AGAIN = 1.
    check: (ctx) => ctx.ratings.repeat === 1,
    text: 'Further contact is not recommended.',
  },
];

// Deterministic pick off real case data (not random) — same pattern as
// src/engine/dnaFieldNote.ts.
function pick(pool: string[], seed: number): string {
  return pool[((seed % pool.length) + pool.length) % pool.length];
}

export function pickFieldNote(ctx: NotesContext): string {
  const egg = pickEasterEgg(ctx);
  if (egg) return egg;

  const contradiction = CONTRADICTIONS.find((rule) => rule.check(ctx));
  if (contradiction) return contradiction.text;

  const seed = ctx.stats.totalActivities;
  // Tiers 3-4 (data-dependent / archetype-adjacent): checked most-specific
  // first so an unusual case (e.g. very little data) always wins over a
  // milder trait-based read.
  if (ctx.confidenceScore < 30) return pick(LID_NOTES_LOW_DATA, seed);
  if (ctx.dna.CHAOS >= 70) return pick(LID_NOTES_CHAOS, seed);
  if (ctx.ratings.mystery >= 4 || ctx.dna.MYSTERY >= 70) return pick(LID_NOTES_MYSTERY, seed);
  if (ctx.ratings.romantic >= 4) return pick(LID_NOTES_ROMANTIC, seed);
  if (ctx.ratings.consistency >= 4) return pick(LID_NOTES_CONSISTENCY, seed);
  if (ctx.ratings.humor >= 4) return pick(LID_NOTES_HUMOR, seed);

  return pick(LID_NOTES_GENERIC, seed);
}

export function pickFinalRemark(seed: number): string {
  return pick(LID_FINAL_REMARKS, seed);
}
