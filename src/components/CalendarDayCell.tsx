import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { GLYPH_MAP } from '@/data/glyphs';
import { colors, moodColors } from '@/theme/tokens';
import type { Activity } from '@/types/models';

// Real asset from the pack: the "selected day" marker card (dark leather
// tile, gold frame, star badge baked into its own top-right corner). Shown
// once, full-cell, behind the selected day only — not per-cell, and not
// combined with a second code-drawn star (it already has one).
const DAY_MARKER = require('../../assets/noir/calendar/day_marker.png');

type Props = {
  dayNumber: number;
  inMonth: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  activity?: Activity;
};

// Day cell — kept deliberately minimal (CALENDAR_TECH_SPEC): number + up to 2
// small colored dots (never a full glyph icon, the cell is physically too
// small to render one legibly). Content (glyphs, time, photo) lives in the
// detail panel below the grid, not in the cell.
export function CalendarDayCell({ dayNumber, inMonth, isToday, isSelected, activity }: Props) {
  const moodTags = activity
    ? Array.from(
        new Set(activity.glyphIds.map((id) => GLYPH_MAP[id]?.moodTag).filter((m): m is NonNullable<typeof m> => !!m))
      )
    : [];

  return (
    <View style={styles.wrap}>
      {isSelected && <Image source={DAY_MARKER} style={styles.selectedMarker} />}
      {isToday && !isSelected && <View style={styles.todayDot} />}
      <Text
        style={[
          styles.dayNumber,
          !inMonth && styles.dayNumberFaint,
          isToday && styles.dayNumberToday,
          isSelected && styles.dayNumberSelected,
        ]}
      >
        {dayNumber}
      </Text>

      {moodTags.length > 0 && (
        <View style={styles.indicatorRow}>
          {moodTags.slice(0, 2).map((tag) => (
            <View key={tag} style={[styles.indicator, { backgroundColor: moodColors[tag] }]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  selectedMarker: {
    position: 'absolute',
    width: '86%',
    height: '86%',
    borderRadius: 6,
  },
  dayNumber: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  dayNumberFaint: {
    color: colors.textFaint,
  },
  dayNumberToday: {
    color: colors.gold,
    fontWeight: '700',
  },
  dayNumberSelected: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  todayDot: {
    position: 'absolute',
    top: 3,
    right: 5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.gold,
  },
  indicatorRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 4,
  },
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
