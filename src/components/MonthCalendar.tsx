import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme/tokens';
import { monthGrid, monthLabel, weekdayLabels } from '@/utils/dates';

type Props = {
  initialYear?: number;
  initialMonth?: number; // 0-11
  onMonthChange?: (year: number, month: number) => void;
  renderCell: (dateKey: string, inMonth: boolean) => React.ReactNode;
  onSelectDay: (dateKey: string) => void;
  compact?: boolean;
};

// Klasyczny widok miesiąca — źródło prawdy (sekcja 9). Reużywany też jako
// mini-kalendarz w Add Activity (sekcja 8), z prostszym renderCell.
export function MonthCalendar({
  initialYear,
  initialMonth,
  onMonthChange,
  renderCell,
  onSelectDay,
  compact,
}: Props) {
  const now = new Date();
  const [year, setYear] = useState(initialYear ?? now.getFullYear());
  const [month, setMonth] = useState(initialMonth ?? now.getMonth());

  const cells = useMemo(() => monthGrid(year, month), [year, month]);

  function go(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setYear(y);
    setMonth(m);
    onMonthChange?.(y, m);
  }

  return (
    <View>
      <View style={styles.nav}>
        <Pressable onPress={() => go(-1)} hitSlop={10}>
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </Pressable>
        <Text style={[styles.monthLabel, compact && styles.monthLabelCompact]}>
          {monthLabel(year, month)}
        </Text>
        <Pressable onPress={() => go(1)} hitSlop={10}>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {weekdayLabels().map((w) => (
          <Text key={w} style={styles.weekday}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map(({ key, inMonth }) => (
          <Pressable
            key={key}
            style={[styles.cell, compact && styles.cellCompact]}
            onPress={() => onSelectDay(key)}
          >
            {renderCell(key, inMonth)}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  monthLabel: {
    ...typography.heading,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  monthLabelCompact: {
    fontSize: 14,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    color: colors.textFaint,
    fontSize: 11,
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  cellCompact: {
    borderWidth: 0,
    aspectRatio: 1,
  },
});
