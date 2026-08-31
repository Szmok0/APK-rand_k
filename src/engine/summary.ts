// Summary Engine — sekcja 18 MD. Statystyki liczone na bieżąco z Activity[], nigdy
// przechowywane jako osobne wartości.

import { GLYPH_MAP, SPECIAL_INCIDENT_GLYPH_IDS } from '@/data/glyphs';
import type { Activity } from '@/types/models';
import { diffInDays, durationHours } from '@/utils/dates';

function countGlyphOccurrences(activities: Activity[], ids: Set<string>): number {
  let count = 0;
  for (const activity of activities) {
    for (const glyphId of activity.glyphIds) {
      if (ids.has(glyphId)) count += 1;
    }
  }
  return count;
}

export function totalHours(activities: Activity[]): number {
  return activities.reduce((sum, a) => sum + durationHours(a.startTime, a.endTime), 0);
}

export function meetingCount(activities: Activity[]): number {
  const meetingIds = new Set(
    Object.values(GLYPH_MAP)
      .filter((g) => g.category === 'MEETINGS')
      .map((g) => g.id)
  );
  return countGlyphOccurrences(activities, meetingIds);
}

export function messageCount(activities: Activity[]): number {
  return countGlyphOccurrences(activities, new Set(['first_message', 'message']));
}

export function giftCount(activities: Activity[]): number {
  return countGlyphOccurrences(activities, new Set(['gift', 'flowers', 'surprise']));
}

export function importantCount(activities: Activity[]): number {
  return activities.filter((a) => a.importance > 0).length;
}

export function activeDays(activities: Activity[]): number {
  return new Set(activities.map((a) => a.date)).size;
}

export function longestMeeting(activities: Activity[]): number {
  let longest = 0;
  for (const a of activities) {
    const hasMeeting = a.glyphIds.some((id) => GLYPH_MAP[id]?.category === 'MEETINGS');
    if (!hasMeeting) continue;
    longest = Math.max(longest, durationHours(a.startTime, a.endTime));
  }
  return longest;
}

export function longestGap(activities: Activity[]): number {
  if (activities.length < 2) return 0;
  const dates = Array.from(new Set(activities.map((a) => a.date))).sort();
  let longest = 0;
  for (let i = 1; i < dates.length; i++) {
    longest = Math.max(longest, diffInDays(dates[i - 1], dates[i]));
  }
  return longest;
}

export type Summary = {
  totalHours: number;
  meetingCount: number;
  messageCount: number;
  giftCount: number;
  importantCount: number;
  activeDays: number;
  longestMeeting: number;
  longestGap: number;
};

export function computeSummary(activities: Activity[]): Summary {
  return {
    totalHours: totalHours(activities),
    meetingCount: meetingCount(activities),
    messageCount: messageCount(activities),
    giftCount: giftCount(activities),
    importantCount: importantCount(activities),
    activeDays: activeDays(activities),
    longestMeeting: longestMeeting(activities),
    longestGap: longestGap(activities),
  };
}

// Also counts Red Flag / Fight (Zuza / Special pack) regardless of manually
// -set priority — feeds DNA's CASE EQUATION and LID PREVIEW's threat score
// (src/data/glyphs.ts's SPECIAL_INCIDENT_GLYPH_IDS comment has the full
// rationale; dayBadges.ts's INCIDENT badge uses the same set).
export function incidentCount(activities: Activity[]): number {
  return activities.filter(
    (a) => a.importance === 2 || a.glyphIds.some((id) => SPECIAL_INCIDENT_GLYPH_IDS.has(id))
  ).length;
}

// The 5 fixed HOME stat concepts (HOME_APPROVED_TECH_SPEC.md): TIME, ENCOUNTERS,
// DMs, EVIDENCE, INCIDENTS — all derived, never independently stored or shown
// as a percentage. EVIDENCE == total exhibit count (Evidence Archive is a 1:1
// derived view over Activity, see src/engine/evidence.ts).
export type HomeStats = {
  time: number;
  encounters: number;
  dms: number;
  evidence: number;
  incidents: number;
};

export function computeHomeStats(activities: Activity[]): HomeStats {
  return {
    time: totalHours(activities),
    encounters: meetingCount(activities),
    dms: messageCount(activities),
    evidence: activities.length,
    incidents: incidentCount(activities),
  };
}
