// Evidence Archive — a DERIVED VIEW over Activity[], never a second table
// (product decision, matches CASE_LOG_MASTER section 9 / ADD_ACTIVITY_TECH_SPEC).
// Every Activity automatically becomes an exhibit; there is no separate
// "add evidence" flow and nothing here is persisted on its own.

import { GLYPH_MAP } from '@/data/glyphs';
import type { Activity, Exhibit, ExhibitFilter, GlyphCategory } from '@/types/models';

const FILTER_TO_CATEGORY: Partial<Record<ExhibitFilter, GlyphCategory>> = {
  MEETINGS: 'MEETINGS',
  MESSAGES: 'CONTACT',
  ITEMS: 'OBJECTS',
  EMOTIONS: 'EMOTION',
};

export type ExhibitSort = 'NEWEST' | 'OLDEST' | 'IMPORTANCE';

// Exhibit numbers are chronological (#001 = oldest activity), independent of
// how the archive is currently sorted/filtered — matches the "CASE FILE grows,
// exhibit numbers are permanent" framing from the mockups.
export function buildEvidenceArchive(activities: Activity[]): Exhibit[] {
  const chronological = [...activities].sort((a, b) => a.date.localeCompare(b.date));
  const numberById = new Map<string, number>();
  chronological.forEach((a, i) => numberById.set(a.id, i + 1));

  return activities.map((a) => ({
    id: a.id,
    number: numberById.get(a.id) ?? 0,
    date: a.date,
    glyphIds: a.glyphIds,
    note: a.note,
    photoUri: a.photoUri,
    importance: a.importance,
    favorite: a.favorite,
  }));
}

export function filterExhibits(exhibits: Exhibit[], filter: ExhibitFilter): Exhibit[] {
  if (filter === 'ALL') return exhibits;
  if (filter === 'INCIDENTS') return exhibits.filter((e) => e.importance === 2);
  const category = FILTER_TO_CATEGORY[filter];
  if (!category) return exhibits;
  return exhibits.filter((e) => e.glyphIds.some((id) => GLYPH_MAP[id]?.category === category));
}

export function sortExhibits(exhibits: Exhibit[], sort: ExhibitSort): Exhibit[] {
  const copy = [...exhibits];
  if (sort === 'NEWEST') return copy.sort((a, b) => b.date.localeCompare(a.date));
  if (sort === 'OLDEST') return copy.sort((a, b) => a.date.localeCompare(b.date));
  return copy.sort((a, b) => b.importance - a.importance || b.date.localeCompare(a.date));
}

export function exhibitLabel(number: number): string {
  return `EXHIBIT #${String(number).padStart(3, '0')}`;
}
