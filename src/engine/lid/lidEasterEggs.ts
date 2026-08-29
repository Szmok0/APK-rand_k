// THE LID PREVIEW — rare, deterministic Easter Eggs (THE_LID_PREVIEW_LOGIC
// section 11). Checked in array order — first match wins, so this list IS
// the priority system the spec asks for ("only the strongest applicable
// Easter Egg wins"), most specific/extreme conditions first.

import type { DnaScores } from '../dna';
import type { LidRatings, RelationshipStats } from './lidTypes';

const ALL_TRAITS: (keyof LidRatings)[] = [
  'romantic',
  'caring',
  'honest',
  'consistency',
  'initiative',
  'humor',
  'mystery',
  'drama',
  'repeat',
];

type EggContext = { ratings: LidRatings; dna: DnaScores; stats: RelationshipStats };

type Egg = { id: string; check: (ctx: EggContext) => boolean; text: string };

const EASTER_EGGS: Egg[] = [
  {
    id: 'all-five',
    check: (ctx) => ALL_TRAITS.every((t) => ctx.ratings[t] === 5),
    text: 'CLASSIFICATION FAILURE\nSubject appears suspiciously perfect. This cannot be trusted.',
  },
  {
    id: 'all-one',
    check: (ctx) => ALL_TRAITS.every((t) => ctx.ratings[t] === 1),
    text: 'NO FURTHER QUESTIONS.',
  },
  {
    id: 'drama-mystery-max',
    check: (ctx) => ctx.ratings.drama === 5 && ctx.ratings.mystery === 5,
    text: 'WARNING\nThis combination has historically caused unnecessary plot development.',
  },
  {
    id: 'rare-specimen',
    check: (ctx) => ctx.ratings.romantic >= 4 && ctx.ratings.caring >= 4 && ctx.ratings.consistency >= 4,
    text: 'RARE SPECIMEN DETECTED.',
  },
  {
    id: 'humor-drama-max',
    check: (ctx) => ctx.ratings.humor === 5 && ctx.ratings.drama === 5,
    text: 'THIS IS GOING TO BE A PROBLEM.',
  },
  {
    id: 'repeat-max-with-incidents',
    check: (ctx) => ctx.ratings.repeat === 5 && ctx.stats.incidents > 0,
    text: 'THE LID HAS BEEN WARNED.',
  },
  {
    id: 'chaos-vs-consistent',
    check: (ctx) => ctx.dna.CHAOS >= 80 && ctx.ratings.consistency >= 4,
    text: 'Interesting testimony.',
  },
];

export function pickEasterEgg(ctx: EggContext): string | null {
  for (const egg of EASTER_EGGS) {
    if (egg.check(ctx)) return egg.text;
  }
  return null;
}
