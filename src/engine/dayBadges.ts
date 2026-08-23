// Day-ticket badge row (Calendar detail view) — a coarser, 5-bucket *display*
// grouping of a day's actual glyphs, shown as the real badge tiles from the
// asset pack (assets/noir/calendar/badge_*.jpg). This is NOT a replacement
// for the real 28-icon/5-category glyph set (AGENTS.md: "old icon set
// stays") — Add Activity and Evidence Archive are untouched and still use
// the full set. This is purely a derived "what kind of day was this, at a
// glance" summary, computed fresh from glyphIds/importance every time,
// never stored.

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

export const DAY_BADGE_IMAGES: Record<DayBadgeKey, any> = {
  MEETING: require('../../assets/noir/calendar/badge_meeting.jpg'),
  CALL: require('../../assets/noir/calendar/badge_call.jpg'),
  DM: require('../../assets/noir/calendar/badge_dm.jpg'),
  GIFT: require('../../assets/noir/calendar/badge_gift.jpg'),
  INCIDENT: require('../../assets/noir/calendar/badge_incident.jpg'),
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
