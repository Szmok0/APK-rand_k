// THE LID PREVIEW — PRIMARY TYPE archetypes (THE_LID_PREVIEW_LOGIC section
// 4, product-owner-specified v1). Weights are already normalized to 100%
// per archetype; `inverse: true` on a trait means score it as (100 - trait
// score) — a low rating counts FOR that archetype, not against it.
//
// UNEXPLAINED has no weight table — it's the fallback used when nothing
// else is dominant (src/engine/lid/lidScoring.ts), never scored directly.

import type { LidTraitId } from './theLidTraits';

export type ArchetypeId =
  | 'GOLDEN_RETRIEVER'
  | 'GENTLEMAN'
  | 'SPINO'
  | 'ANKYLO'
  | 'SNAKE'
  | 'MENACE'
  | 'GHOST'
  | 'UNEXPLAINED';

export type ArchetypeWeight = { trait: LidTraitId; weight: number; inverse?: boolean };

export type Archetype = {
  id: ArchetypeId;
  label: string;
  weights: ArchetypeWeight[];
};

// Scored archetypes — everything except UNEXPLAINED.
export const LID_ARCHETYPES: Archetype[] = [
  {
    id: 'GOLDEN_RETRIEVER',
    label: 'THE GOLDEN RETRIEVER',
    weights: [
      { trait: 'romantic', weight: 20 },
      { trait: 'caring', weight: 30 },
      { trait: 'honest', weight: 10 },
      { trait: 'consistency', weight: 20 },
      { trait: 'initiative', weight: 10 },
      { trait: 'humor', weight: 10 },
    ],
  },
  {
    id: 'GENTLEMAN',
    label: 'THE GENTLEMAN',
    weights: [
      { trait: 'romantic', weight: 25 },
      { trait: 'caring', weight: 20 },
      { trait: 'honest', weight: 20 },
      { trait: 'consistency', weight: 25 },
      { trait: 'initiative', weight: 10 },
    ],
  },
  {
    id: 'SPINO',
    label: 'THE SPINO',
    weights: [
      { trait: 'initiative', weight: 25 },
      { trait: 'mystery', weight: 25 },
      { trait: 'humor', weight: 10 },
      { trait: 'drama', weight: 10 },
      { trait: 'repeat', weight: 15 },
      { trait: 'caring', weight: 15 },
    ],
  },
  {
    id: 'ANKYLO',
    label: 'THE ANKYLO',
    weights: [
      { trait: 'caring', weight: 30 },
      { trait: 'consistency', weight: 30 },
      { trait: 'honest', weight: 15 },
      { trait: 'romantic', weight: 10 },
      { trait: 'initiative', weight: 10 },
      { trait: 'drama', weight: 5, inverse: true },
    ],
  },
  {
    id: 'SNAKE',
    label: 'THE SNAKE',
    weights: [
      { trait: 'mystery', weight: 30 },
      { trait: 'drama', weight: 20 },
      { trait: 'honest', weight: 5, inverse: true },
      { trait: 'consistency', weight: 10, inverse: true },
      { trait: 'humor', weight: 15 },
      { trait: 'repeat', weight: 20 },
    ],
  },
  {
    id: 'MENACE',
    label: 'THE MENACE',
    weights: [
      { trait: 'drama', weight: 35 },
      { trait: 'mystery', weight: 20 },
      { trait: 'initiative', weight: 15 },
      { trait: 'humor', weight: 15 },
      { trait: 'repeat', weight: 15 },
    ],
  },
  {
    id: 'GHOST',
    label: 'THE GHOST',
    weights: [
      { trait: 'mystery', weight: 30 },
      { trait: 'consistency', weight: 25, inverse: true },
      { trait: 'initiative', weight: 20, inverse: true },
      { trait: 'honest', weight: 15, inverse: true },
      { trait: 'repeat', weight: 10 },
    ],
  },
];

export const LID_UNEXPLAINED: Archetype = {
  id: 'UNEXPLAINED',
  label: 'THE UNEXPLAINED',
  weights: [],
};
