// One store, several screens read it (Home/Calendar/Evidence Archive all read the
// same Activity[]). Local JSON storage (AsyncStorage), no SQLite.
//
// Storage keys were renamed for the noir rebuild (@zuz-diary/* -> @zuza-case/*) —
// this is the "clean start" the product owner asked for: old test data under the
// previous keys is simply never read again, no migration needed.

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { Activity, ArchiveEntry, CaseMeta, ExportFile, Relationship } from '@/types/models';
import { todayKey } from '@/utils/dates';

const RELATIONSHIP_KEY = '@zuza-case/activities';
const ARCHIVES_KEY = '@zuza-case/archives';
const CASE_META_KEY = '@zuza-case/meta';

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function emptyRelationship(): Relationship {
  return { activities: [], startedAt: todayKey() };
}

// Fixed case identity — see docs/ZUZA_CASE_LOG_CLAUDE_CODE_MASTER.md section 6.
// This is data, not artwork: never bake it into a background image.
function defaultCaseMeta(): CaseMeta {
  return {
    caseNumber: '001',
    alias: 'THE LID',
    subjectName: 'ZUZA',
    firstContactDate: '2026-08-04',
  };
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
  caseMeta: CaseMeta;
  updateCaseMeta: (patch: Partial<CaseMeta>) => Promise<void>;
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
  const [caseMeta, setCaseMeta] = useState<CaseMeta>(defaultCaseMeta());

  useEffect(() => {
    (async () => {
      try {
        const [relRaw, archRaw, metaRaw] = await Promise.all([
          AsyncStorage.getItem(RELATIONSHIP_KEY),
          AsyncStorage.getItem(ARCHIVES_KEY),
          AsyncStorage.getItem(CASE_META_KEY),
        ]);
        if (relRaw) setRelationship(JSON.parse(relRaw));
        if (archRaw) setArchives(JSON.parse(archRaw));
        if (metaRaw) setCaseMeta({ ...defaultCaseMeta(), ...JSON.parse(metaRaw) });
      } catch (e) {
        console.warn('Failed to load stored case data', e);
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

  const updateCaseMeta = useCallback(
    async (patch: Partial<CaseMeta>) => {
      const next = { ...caseMeta, ...patch };
      setCaseMeta(next);
      await AsyncStorage.setItem(CASE_META_KEY, JSON.stringify(next));
    },
    [caseMeta]
  );

  const getActivityByDate = useCallback(
    (date: string) => relationship.activities.find((a) => a.date === date),
    [relationship.activities]
  );

  // Same-day collision rule: if a day already has an Activity, the UI loads its
  // state into the form before editing (see app/add-activity.tsx) — here we just
  // do a full upsert by date, keeping id/createdAt stable.
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

  // "Close & clear case" (Settings): archives the current case as a closed file
  // (same schema as export), then resets state — the case number/alias stay,
  // only activities reset, matching the single-fixed-case product decision.
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
        throw new Error('Invalid case file format');
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
      caseMeta,
      updateCaseMeta,
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
      caseMeta,
      updateCaseMeta,
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
  if (!ctx) throw new Error('useRelationship must be used inside RelationshipProvider');
  return ctx;
}
