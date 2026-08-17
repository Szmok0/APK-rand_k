// Jeden store, kilka rendererów (sekcja 2 MD) — Calendar/Timeline/START czytają z tego
// samego Activity[]. Lokalny magazyn JSON (AsyncStorage), bez SQLite (sekcja 17).

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { Activity, ArchiveEntry, ExportFile, Relationship } from '@/types/models';
import { todayKey } from '@/utils/dates';

const RELATIONSHIP_KEY = '@zuz-diary/relationship';
const ARCHIVES_KEY = '@zuz-diary/archives';

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function emptyRelationship(): Relationship {
  return { activities: [], startedAt: todayKey() };
}

export type UpsertActivityInput = {
  date: string;
  glyphIds: string[];
  startTime?: string;
  endTime?: string;
  note?: string;
  importance: 0 | 1 | 2;
  photoUri?: string;
};

type RelationshipContextValue = {
  loading: boolean;
  activities: Activity[];
  startedAt: string;
  archives: ArchiveEntry[];
  getActivityByDate: (date: string) => Activity | undefined;
  upsertActivity: (input: UpsertActivityInput) => Activity;
  deleteActivity: (id: string) => void;
  startNewStory: () => Promise<void>;
  exportCurrent: () => ExportFile;
  importRelationship: (file: ExportFile) => Promise<void>;
};

const RelationshipContext = createContext<RelationshipContextValue | null>(null);

export function RelationshipProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [relationship, setRelationship] = useState<Relationship>(emptyRelationship());
  const [archives, setArchives] = useState<ArchiveEntry[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [relRaw, archRaw] = await Promise.all([
          AsyncStorage.getItem(RELATIONSHIP_KEY),
          AsyncStorage.getItem(ARCHIVES_KEY),
        ]);
        if (relRaw) setRelationship(JSON.parse(relRaw));
        if (archRaw) setArchives(JSON.parse(archRaw));
      } catch (e) {
        console.warn('Nie udało się wczytać danych', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistRelationship = useCallback(async (next: Relationship) => {
    setRelationship(next);
    await AsyncStorage.setItem(RELATIONSHIP_KEY, JSON.stringify(next));
  }, []);

  const persistArchives = useCallback(async (next: ArchiveEntry[]) => {
    setArchives(next);
    await AsyncStorage.setItem(ARCHIVES_KEY, JSON.stringify(next));
  }, []);

  const getActivityByDate = useCallback(
    (date: string) => relationship.activities.find((a) => a.date === date),
    [relationship.activities]
  );

  // Zasada scalania przy kolizji dnia (sekcja 12): jeśli dzień już ma Activity,
  // UI ładuje jej stan do formularza przed edycją (patrz app/add-activity.tsx) —
  // tutaj po prostu robimy pełny upsert po dacie, zachowując id/createdAt.
  const upsertActivity = useCallback(
    (input: UpsertActivityInput): Activity => {
      const now = new Date().toISOString();
      const existing = relationship.activities.find((a) => a.date === input.date);
      const activity: Activity = {
        id: existing?.id ?? newId(),
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        glyphIds: input.glyphIds,
        note: input.note,
        importance: input.importance,
        photoUri: input.photoUri,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      const nextActivities = existing
        ? relationship.activities.map((a) => (a.id === existing.id ? activity : a))
        : [...relationship.activities, activity];
      void persistRelationship({ ...relationship, activities: nextActivities });
      return activity;
    },
    [relationship, persistRelationship]
  );

  const deleteActivity = useCallback(
    (id: string) => {
      void persistRelationship({
        ...relationship,
        activities: relationship.activities.filter((a) => a.id !== id),
      });
    },
    [relationship, persistRelationship]
  );

  const exportCurrent = useCallback((): ExportFile => {
    return {
      schema: 'zuz-diary/relationship',
      version: 1,
      exportedAt: new Date().toISOString(),
      relationship,
    };
  }, [relationship]);

  // "Zacznij nową historię" (sekcja 10): auto-archiwizacja bieżących danych jako
  // wpis w lokalnym archiwum (ten sam format co eksport), potem czyszczenie stanu.
  const startNewStory = useCallback(async () => {
    const entry: ArchiveEntry = {
      id: newId(),
      closedAt: new Date().toISOString(),
      relationship,
    };
    const nextArchives = [entry, ...archives];
    await persistArchives(nextArchives);
    await persistRelationship(emptyRelationship());
  }, [relationship, archives, persistArchives, persistRelationship]);

  const importRelationship = useCallback(
    async (file: ExportFile) => {
      if (file.schema !== 'zuz-diary/relationship') {
        throw new Error('Nieprawidłowy format pliku');
      }
      await persistRelationship(file.relationship);
    },
    [persistRelationship]
  );

  const value = useMemo<RelationshipContextValue>(
    () => ({
      loading,
      activities: relationship.activities,
      startedAt: relationship.startedAt,
      archives,
      getActivityByDate,
      upsertActivity,
      deleteActivity,
      startNewStory,
      exportCurrent,
      importRelationship,
    }),
    [
      loading,
      relationship,
      archives,
      getActivityByDate,
      upsertActivity,
      deleteActivity,
      startNewStory,
      exportCurrent,
      importRelationship,
    ]
  );

  return <RelationshipContext.Provider value={value}>{children}</RelationshipContext.Provider>;
}

export function useRelationship(): RelationshipContextValue {
  const ctx = useContext(RelationshipContext);
  if (!ctx) throw new Error('useRelationship musi być użyty wewnątrz RelationshipProvider');
  return ctx;
}
