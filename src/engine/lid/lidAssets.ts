// THE LID PREVIEW — archetype -> illustration mapping (THE_LID_PREVIEW_LOGIC
// section 13). Only ONE real dinosaur photo was delivered (the sunglasses
// portrait baked into assets/noir/profiler/lid_preview_bg.jpg) — none of
// the other 7 archetypes have a distinct illustration yet, and the spec is
// explicit: "Do not generate images inside the app."
//
// This mapping exists so the architecture is ready the moment real
// per-archetype art arrives, but app/profiler/lid-preview.tsx does NOT
// swap the central image today — the delivered photo is baked directly
// into the background (not a separately swappable layer), so wiring this
// up for real needs either distinct per-archetype photos cropped to match
// that exact frame, or a frame-only background export. Report this rather
// than faking a swap with the one photo standing in for all 8 archetypes.

import type { ArchetypeId } from '@/data/lidArchetypes';

// Deliberately no `any` require() map here yet — see comment above. Add
// entries like `GOLDEN_RETRIEVER: require('../../../assets/noir/profiler/lid_golden.png')`
// once the real assets exist, and wire ARCHETYPE_IMAGE into the screen at
// that point instead of the shared baked photo.
export const ARCHETYPE_IMAGE_FILENAMES: Record<ArchetypeId, string> = {
  GOLDEN_RETRIEVER: 'lid_golden.png',
  GENTLEMAN: 'lid_gentleman.png',
  SPINO: 'lid_spino.png',
  ANKYLO: 'lid_ankylo.png',
  SNAKE: 'lid_snake.png',
  MENACE: 'lid_menace.png',
  GHOST: 'lid_ghost.png',
  UNEXPLAINED: 'lid_unexplained.png',
};
