import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GLYPH_MAP } from '@/data/glyphs';
import { colors, moodColors } from '@/theme/tokens';
import type { Activity } from '@/types/models';

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
    <View style={[styles.wrap, isSelected && styles.wrapSelected]}>
      {isToday && (
        <View style={styles.todayBadge}>
          <Ionicons name="star" size={9} color={colors.gold} />
        </View>
      )}
      <Text
        style={[
          styles.dayNumber,
          !inMonth && styles.dayNumberFaint,
          isToday && styles.dayNumberToday,
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
    borderRadius: 8,
  },
  wrapSelected: {
    borderWidth: 1.5,
    borderColor: colors.gold,
    borderRadius: 10,
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
  todayBadge: {
    position: 'absolute',
    top: 2,
    right: 4,
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
