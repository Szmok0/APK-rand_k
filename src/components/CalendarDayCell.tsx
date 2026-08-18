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

// Komórka dnia — sekcja 9 MD v6: maksymalnie minimalna. Numer dnia + JEDEN mały
// kolorowy wskaźnik aktywności (nigdy pełna ikona glifu — komórka jest fizycznie
// za mała, żeby zmieścić czytelną ikonę) + kropka notatki przy numerze. Treść
// (glify, czas, zdjęcie) przenosi się do panelu podglądu pod siatką.
export function CalendarDayCell({ dayNumber, inMonth, isToday, isSelected, activity }: Props) {
  const moodTags = activity
    ? Array.from(
        new Set(activity.glyphIds.map((id) => GLYPH_MAP[id]?.moodTag).filter((m): m is NonNullable<typeof m> => !!m))
      )
    : [];

  return (
    <View style={[styles.wrap, isSelected && styles.wrapSelected]}>
      <View style={styles.numberRow}>
        <Text
          style={[
            styles.dayNumber,
            !inMonth && styles.dayNumberFaint,
            isToday && styles.dayNumberToday,
          ]}
        >
          {dayNumber}
        </Text>
        {activity?.note ? <View style={styles.noteDot} /> : null}
      </View>

      {moodTags.length > 0 && (
        <View style={styles.indicatorRow}>
          {moodTags.slice(0, 3).map((tag) => (
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
    backgroundColor: colors.goldSoft,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dayNumber: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dayNumberFaint: {
    color: colors.textFaint,
  },
  dayNumberToday: {
    color: colors.gold,
    fontWeight: '700',
  },
  noteDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.gold,
    marginLeft: 2,
    marginTop: 1,
  },
  indicatorRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  indicator: {
    width: 10,
    height: 3,
    borderRadius: 1.5,
  },
});
