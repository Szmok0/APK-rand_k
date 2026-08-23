import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme/tokens';
import { monthGrid, monthLabel, weekdayLabels } from '@/utils/dates';

// The real grid asset from the pack: a 7x6 grid of thin gold lines baked
// into a dark leather/map texture (decorative compass/folder-stack/inkwell
// corner flourishes). Its line positions were measured directly off the
// pixels — see GRID_COL/GRID_ROW below.
const GRID_BG = require('../../assets/noir/calendar/grid_bg.jpg');
const GRID_COL_LEFT = 3.43; // %
const GRID_COL_WIDTH = 13.28; // %
const GRID_ROW_TOP = 8.85; // %
const GRID_ROW_HEIGHT = 13.2; // %

type Props = {
  initialYear?: number;
  initialMonth?: number; // 0-11
  onMonthChange?: (year: number, month: number) => void;
  renderCell: (dateKey: string, inMonth: boolean) => React.ReactNode;
  onSelectDay: (dateKey: string) => void;
  compact?: boolean;
  // Opt-in: render cells positioned onto the real grid_bg.jpg asset instead
  // of the plain flex-wrap grid. Used by the full Calendar screen only —
  // Add Activity's compact mini-calendar stays on the plain grid.
  useGridImage?: boolean;
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
  useGridImage,
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

      {useGridImage ? (
        <View style={styles.gridImageWrap}>
          <Image source={GRID_BG} style={styles.gridImage} />
          {cells.map(({ key, inMonth }, i) => {
            const col = i % 7;
            const row = Math.floor(i / 7);
            return (
              <Pressable
                key={key}
                style={[
                  styles.gridImageCell,
                  {
                    left: `${GRID_COL_LEFT + col * GRID_COL_WIDTH}%`,
                    top: `${GRID_ROW_TOP + row * GRID_ROW_HEIGHT}%`,
                    width: `${GRID_COL_WIDTH}%`,
                    height: `${GRID_ROW_HEIGHT}%`,
                  },
                ]}
                onPress={() => onSelectDay(key)}
              >
                {renderCell(key, inMonth)}
              </Pressable>
            );
          })}
        </View>
      ) : (
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
      )}
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  cellCompact: {
    aspectRatio: 1,
  },
  gridImageWrap: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridImageCell: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
