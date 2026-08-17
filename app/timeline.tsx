// TIMELINE — sekcja 7 MD. Widok tygodniowy (domyślny) i miesięczny (przełączany).

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TimelinePath } from '@/components/TimelinePath';
import { Header, Screen } from '@/components/ui';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, radius, spacing } from '@/theme/tokens';
import { monthGrid, monthLabel, weekDays } from '@/utils/dates';

type Mode = 'week' | 'month';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PATH_WIDTH = SCREEN_WIDTH - spacing.md * 2;

export default function TimelineScreen() {
  const { activities } = useRelationship();
  const [mode, setMode] = useState<Mode>('week');
  const [weekOffset, setWeekOffset] = useState(0);
  const now = new Date();
  const [monthCursor, setMonthCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });

  const activityByDate = useMemo(() => {
    const map = new Map<string, (typeof activities)[number]>();
    for (const a of activities) map.set(a.date, a);
    return map;
  }, [activities]);

  const days = useMemo(() => {
    if (mode === 'week') return weekDays(weekOffset);
    return monthGrid(monthCursor.year, monthCursor.month)
      .filter((c) => c.inMonth)
      .map((c) => c.key);
  }, [mode, weekOffset, monthCursor]);

  return (
    <Screen>
      <Header
        title="TIMELINE"
        right={
          <Pressable onPress={() => setMode(mode === 'week' ? 'month' : 'week')} hitSlop={10}>
            <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
          </Pressable>
        }
      />

      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggle, mode === 'week' && styles.toggleActive]}
          onPress={() => setMode('week')}
        >
          <Text style={[styles.toggleLabel, mode === 'week' && styles.toggleLabelActive]}>Tydzień</Text>
        </Pressable>
        <Pressable
          style={[styles.toggle, mode === 'month' && styles.toggleActive]}
          onPress={() => setMode('month')}
        >
          <Text style={[styles.toggleLabel, mode === 'month' && styles.toggleLabelActive]}>Miesiąc</Text>
        </Pressable>
      </View>

      <View style={styles.nav}>
        {mode === 'week' ? (
          <>
            <Pressable onPress={() => setWeekOffset((w) => w - 1)} hitSlop={10}>
              <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
            </Pressable>
            <Text style={styles.navLabel}>
              {days[0]} → {days[6]}
            </Text>
            <Pressable onPress={() => setWeekOffset((w) => w + 1)} hitSlop={10}>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              onPress={() =>
                setMonthCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }))
              }
              hitSlop={10}
            >
              <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
            </Pressable>
            <Text style={styles.navLabel}>{monthLabel(monthCursor.year, monthCursor.month)}</Text>
            <Pressable
              onPress={() =>
                setMonthCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }))
              }
              hitSlop={10}
            >
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </Pressable>
          </>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TimelinePath
          days={days}
          activityByDate={activityByDate}
          width={PATH_WIDTH}
          dense={mode === 'month'}
          onSelectDay={(date) => router.push({ pathname: '/day/[date]', params: { date } })}
        />
      </ScrollView>

      <View style={styles.legend}>
        <LegendItem colorDot={colors.gold} label="wydarzenie" />
        <LegendItem ring label="ważne" />
        <LegendItem line label="przerwa" />
      </View>
    </Screen>
  );
}

function LegendItem({
  colorDot,
  ring,
  line,
  label,
}: {
  colorDot?: string;
  ring?: boolean;
  line?: boolean;
  label: string;
}) {
  return (
    <View style={styles.legendItem}>
      {colorDot && <View style={[styles.legendDot, { backgroundColor: colorDot }]} />}
      {ring && <View style={styles.legendRing} />}
      {line && <View style={styles.legendLine} />}
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 3,
    marginBottom: spacing.sm,
  },
  toggle: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.goldSoft,
  },
  toggleLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
  },
  toggleLabelActive: {
    color: colors.gold,
    fontWeight: '600',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  navLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendRing: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderStyle: 'dashed',
  },
  legendLine: {
    width: 14,
    height: 0,
    borderTopWidth: 1,
    borderColor: colors.textFaint,
    borderStyle: 'dashed',
  },
  legendText: {
    color: colors.textFaint,
    fontSize: 10,
  },
});
