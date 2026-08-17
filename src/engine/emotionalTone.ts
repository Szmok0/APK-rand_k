// Emotional Tone Layer — sekcja 6 MD.
// Nie wpływa na geometrię struktury DNA (ta jest stała) — tylko na jej podświetlenie/kolor.
// Okno czasowe: rolling 7 dni, przeliczane na bieżąco.

import { GLYPH_MAP } from '@/data/glyphs';
import type { MoodTag } from '@/theme/tokens';
import type { Activity } from '@/types/models';
import { addDays } from '@/utils/dates';

export const MOOD_TAGS: MoodTag[] = ['BLISKOSC', 'TESKNOTA', 'NAMIETNOSC', 'RADOSC', 'NAPIECIE'];

export type IntensityBand = 'dim' | 'calm' | 'clear' | 'lead';

// Pasma intensywności podświetlenia — sekcja 6. Zwraca znormalizowaną siłę 0..1
// do sterowania opacity/blur warstw glow, niezależnie per tag (brak "winner take all").
export function bandForShare(share: number): { band: IntensityBand; intensity: number } {
  const pct = share * 100;
  if (pct < 10) return { band: 'dim', intensity: 0.12 + (pct / 10) * 0.13 };
  if (pct < 25) return { band: 'calm', intensity: 0.25 + ((pct - 10) / 15) * 0.2 };
  if (pct < 40) return { band: 'clear', intensity: 0.45 + ((pct - 25) / 15) * 0.25 };
  return { band: 'lead', intensity: Math.min(1, 0.7 + ((pct - 40) / 60) * 0.3) };
}

export type MoodShare = Record<MoodTag, number>; // udział % (0..1) per tag, w oknie

// Zwraca aktywności z okna [endKey - (days-1), endKey] włącznie.
export function activitiesInWindow(
  activities: Activity[],
  endKey: string,
  days = 7
): Activity[] {
  const startKey = addDays(endKey, -(days - 1));
  return activities.filter((a) => a.date >= startKey && a.date <= endKey);
}

// udział(tag) = liczba glifów z danym tagiem w oknie / liczba wszystkich glifów
// "emocjonalnych" w tym oknie (z pominięciem neutralnych).
export function computeMoodShare(activities: Activity[], endKey: string, days = 7): MoodShare {
  const windowActivities = activitiesInWindow(activities, endKey, days);
  const counts: Record<MoodTag, number> = {
    BLISKOSC: 0,
    TESKNOTA: 0,
    NAMIETNOSC: 0,
    RADOSC: 0,
    NAPIECIE: 0,
  };
  let totalEmotional = 0;

  for (const activity of windowActivities) {
    for (const glyphId of activity.glyphIds) {
      const glyph = GLYPH_MAP[glyphId];
      if (!glyph?.moodTag) continue; // neutralne nie liczą się do nastroju
      counts[glyph.moodTag] += 1;
      totalEmotional += 1;
    }
  }

  const shares = {} as MoodShare;
  for (const tag of MOOD_TAGS) {
    shares[tag] = totalEmotional === 0 ? 0 : counts[tag] / totalEmotional;
  }
  return shares;
}

export type ZoneGlow = {
  tag: MoodTag;
  share: number;
  band: IntensityBand;
  intensity: number;
};

export function computeZoneGlow(activities: Activity[], endKey: string, days = 7): ZoneGlow[] {
  const shares = computeMoodShare(activities, endKey, days);
  return MOOD_TAGS.map((tag) => {
    const { band, intensity } = bandForShare(shares[tag]);
    return { tag, share: shares[tag], band, intensity };
  });
}
