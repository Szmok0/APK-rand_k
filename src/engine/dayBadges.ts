// Day-ticket badge row (Calendar detail view) — a coarser, 5-bucket *display*
// grouping of a day's actual glyphs, shown as compact colored chips on the
// Case File ticket. This is NOT a replacement for the real 28-icon/5-category
// glyph set (AGENTS.md: "old icon set stays") — Add Activity and Evidence
// Archive are untouched and still use the full set. This is purely a
// derived "what kind of day was this, at a glance" summary, computed fresh
// from glyphIds/importance every time, never stored.

import { Ionicons } from '@expo/vector-icons';

import { GLYPH_MAP } from '@/data/glyphs';
import { colors, moodColors } from '@/theme/tokens';
import type { Activity } from '@/types/models';

export type DayBadgeKey = 'MEETING' | 'CALL' | 'DM' | 'GIFT' | 'INCIDENT';

export const DAY_BADGE_COLORS: Record<DayBadgeKey, string> = {
  MEETING: colors.olive,
  CALL: colors.amber,
  DM: moodColors.TESKNOTA,
  GIFT: colors.purple,
  INCIDENT: colors.red,
};

export const DAY_BADGE_ICONS: Record<DayBadgeKey, keyof typeof Ionicons.glyphMap> = {
  MEETING: 'people-outline',
  CALL: 'call-outline',
  DM: 'chatbubble-outline',
  GIFT: 'gift-outline',
  INCIDENT: 'alert-circle-outline',
};

const CALL_IDS = new Set(['phone', 'video_call']);
const DM_IDS = new Set(['message', 'first_message', 'reconnect']);

export function dayBadges(activity: Activity): DayBadgeKey[] {
  const keys = new Set<DayBadgeKey>();
  for (const id of activity.glyphIds) {
    const glyph = GLYPH_MAP[id];
    if (!glyph) continue;
    if (glyph.category === 'MEETINGS') keys.add('MEETING');
    else if (CALL_IDS.has(id)) keys.add('CALL');
    else if (DM_IDS.has(id)) keys.add('DM');
    else if (glyph.category === 'OBJECTS') keys.add('GIFT');
  }
  if (activity.importance === 2) keys.add('INCIDENT');
  return Array.from(keys);
}
