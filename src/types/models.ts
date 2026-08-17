// Model danych — sekcja 12 MD ("MVP — Relacyjny Kalendarz Piktograficzny v2").

import type { MoodTag } from '@/theme/tokens';

export type { MoodTag };

export type GlyphCategory = 'CONTACT' | 'DATING' | 'MEETINGS' | 'EMOTION' | 'OBJECTS';

export type Glyph = {
  id: string;
  name: string;
  category: GlyphCategory;
  moodTag: MoodTag | null;
  requiresDuration: boolean;
};

// Jeden dzień = jedna Activity. Wiele glifów na jedną aktywność (sekcja 12).
export type Activity = {
  id: string;
  date: string; // 'YYYY-MM-DD', unikalna w skali relacji
  startTime?: string; // 'HH:00', opcjonalne
  endTime?: string; // 'HH:00', opcjonalne
  glyphIds: string[];
  note?: string;
  importance: 0 | 1 | 2;
  photoUri?: string;
  createdAt: string;
  updatedAt: string;
};

export type Relationship = {
  activities: Activity[];
  startedAt: string;
};

// Archiwum — plik zamkniętej historii (sekcja 10, ten sam format co eksport, sekcja 15).
export type ArchiveEntry = {
  id: string;
  closedAt: string;
  relationship: Relationship;
};

// Format pliku eksportu / archiwum (sekcja 15) — jeden spójny schemat.
export type ExportFile = {
  schema: 'zuz-diary/relationship';
  version: 1;
  exportedAt: string;
  relationship: Relationship;
};
