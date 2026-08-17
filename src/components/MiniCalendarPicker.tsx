import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MonthCalendar } from '@/components/MonthCalendar';
import { colors, radius } from '@/theme/tokens';
import { fromDateKey } from '@/utils/dates';

type Props = {
  selected: string;
  hasActivity: (dateKey: string) => boolean;
  onSelect: (dateKey: string) => void;
};

// Mini-kalendarz w Add Activity — wybór WYŁĄCZNIE przez tap (sekcja 8). Dni z istniejącą
// aktywnością oznaczone kropką; tap na taki dzień = wejście w edycję (obsłużone przez
// rodzica, który wczytuje istniejący rekord do formularza).
export function MiniCalendarPicker({ selected, hasActivity, onSelect }: Props) {
  const selectedDate = fromDateKey(selected);
  return (
    <MonthCalendar
      compact
      initialYear={selectedDate.getFullYear()}
      initialMonth={selectedDate.getMonth()}
      onSelectDay={onSelect}
      renderCell={(dateKey, inMonth) => {
        const isSelected = dateKey === selected;
        const day = fromDateKey(dateKey).getDate();
        return (
          <View style={[styles.cell, isSelected && styles.cellSelected]}>
            <Text style={[styles.day, !inMonth && styles.dayFaint, isSelected && styles.daySelected]}>
              {day}
            </Text>
            {hasActivity(dateKey) && <View style={[styles.dot, isSelected && styles.dotSelected]} />}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellSelected: {
    backgroundColor: colors.gold,
  },
  day: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dayFaint: {
    color: colors.textFaint,
  },
  daySelected: {
    color: colors.background,
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    bottom: 2,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.gold,
  },
  dotSelected: {
    backgroundColor: colors.background,
  },
});
