// Data model — Zuza's Diary: Case Log (noir rebuild). Engine mostly carried over
// from the previous "relationship calendar" build; renamed/extended for the
// single, fixed Case concept (see docs/ZUZA_CASE_LOG_CLAUDE_CODE_MASTER.md).

import type { MoodTag } from '@/theme/tokens';

export type { MoodTag };

export type GlyphCategory = 'CONTACT' | 'DATING' | 'MEETINGS' | 'EMOTION' | 'OBJECTS';

export type Glyph = {
  id: string;
  name: string;
  category: GlyphCategory;
  moodTag: MoodTag | null;
  requiresDuration: boolean;
  // Add Activity's visual section header — decoupled from `category` on
  // purpose (see src/data/glyphs.ts header comment): grouping in the UI can
  // be as rich as needed (8 new icon packs) without touching any of the
  // engine logic that keys off the existing 5-value `category`.
  pack: string;
};

// One day = one Activity. Multiple glyphs ("incident types") per activity.
//
// photoUris was a single `photoUri?: string` (ADD_ACTIVITY_TECH_SPEC called
// for a "single photo attachment area") until real usage feedback: one
// photo per day was too limiting. Now an array, capped at MAX_PHOTOS_PER_ACTIVITY
// (src/engine/photos.ts) — see migrateActivity() in RelationshipStore.tsx for
// how existing single-photoUri data (already-shipped gift builds included)
// loads forward as a 1-item array.
export type Activity = {
  id: string;
  date: string; // 'YYYY-MM-DD', unique across the case
  startTime?: string; // 'HH:00', optional
  endTime?: string; // 'HH:00', optional
  glyphIds: string[];
  note?: string;
  importance: 0 | 1 | 2; // CASE PRIORITY: 0 routine, 1 noted, 2 critical
  photoUris?: string[];
  favorite?: boolean; // Evidence Archive "starred" flag — real, persisted field
  createdAt: string;
  updatedAt: string;
};

// There is exactly one, permanent case (product decision: "single stable case,
// case-file-style name/number, user may clear it if the relationship changes").
export type CaseMeta = {
  caseNumber: string; // 'No. 001'
  alias: string; // "THE LID" — shown on Home/nav, never the real name
  subjectName: string; // "ZUZA" — used where the Profiler addresses her directly
  firstContactDate: string; // 'YYYY-MM-DD'
  profilePhotoUri?: string;
  // THE LID (Profiler) — one 1-5 rating per trait id (src/data/theLidTraits.ts),
  // keyed by trait id. No separate SAVE step: each slider persists here the
  // moment it's released (app/profiler/lid.tsx). Missing key = never rated.
  lidRatings?: Record<string, number>;
};

export type Relationship = {
  activities: Activity[];
  startedAt: string;
};

// Evidence Archive is a DERIVED VIEW over Activity — no separate table, no
// second database (product decision, matches CASE_LOG_MASTER section 9 and
// ADD_ACTIVITY_TECH_SPEC). See src/engine/evidence.ts.
export type ExhibitFilter = 'ALL' | 'MEETINGS' | 'MESSAGES' | 'ITEMS' | 'EMOTIONS' | 'INCIDENTS';

export type Exhibit = {
  id: string; // same id as the source Activity
  number: number; // chronological exhibit number (#001 = oldest)
  date: string;
  glyphIds: string[];
  note?: string;
  photoUris?: string[];
  importance: 0 | 1 | 2;
  favorite?: boolean;
};

// Archive — closed-case file (same schema as export, section below).
export type ArchiveEntry = {
  id: string;
  closedAt: string;
  relationship: Relationship;
};

// Export/import file format — one consistent schema.
export type ExportFile = {
  schema: 'zuz-diary/relationship';
  version: 1;
  exportedAt: string;
  relationship: Relationship;
};
