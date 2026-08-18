// KALENDARZ — sekcja 9 MD v6. Komórka dnia jest maksymalnie minimalna; tap na dzień
// nie nawiguje — wysuwa zintegrowany panel podglądu pod siatką (bez osobnego route'a).

import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CalendarDayCell } from '@/components/CalendarDayCell';
import { DayDetailPanel } from '@/components/DayDetailPanel';
import { MonthCalendar } from '@/components/MonthCalendar';
import { GoldButton, Header, OutlineButton, Screen } from '@/components/ui';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, spacing } from '@/theme/tokens';
import { fromDateKey, todayKey } from '@/utils/dates';
import { router } from 'expo-router';

const MONTHS_GENITIVE = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
];

function formatDate(dateKey: string) {
  const d = fromDateKey(dateKey);
  return `${d.getDate()} ${MONTHS_GENITIVE[d.getMonth()]}`;
}

export default function CalendarScreen() {
  const { activities } = useRelationship();
  const today = todayKey();
  const [selectedDate, setSelectedDate] = useState(today);

  const activityByDate = useMemo(() => {
    const map = new Map<string, (typeof activities)[number]>();
    for (const a of activities) map.set(a.date, a);
    return map;
  }, [activities]);

  return (
    <Screen>
      <Header title="KALENDARZ" />

      <View style={styles.grid}>
        <MonthCalendar
          onSelectDay={setSelectedDate}
          renderCell={(dateKey, inMonth) => (
            <CalendarDayCell
              dayNumber={fromDateKey(dateKey).getDate()}
              inMonth={inMonth}
              isToday={dateKey === today}
              isSelected={dateKey === selectedDate}
              activity={activityByDate.get(dateKey)}
            />
          )}
        />
      </View>

      <View style={styles.panelHeader}>
        <Text style={styles.panelDate}>{formatDate(selectedDate).toUpperCase()}</Text>
      </View>
      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent}>
        <DayDetailPanel date={selectedDate} />
      </ScrollView>

      <View style={styles.footer}>
        <OutlineButton label="Timeline" icon="analytics-outline" onPress={() => router.push('/timeline')} style={{ flex: 1 }} />
        <GoldButton label="+ Dodaj Aktywność" onPress={() => router.push('/add-activity')} style={{ flex: 1.3 }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: spacing.md,
  },
  panelHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  panelDate: {
    color: colors.gold,
    fontSize: 12,
    letterSpacing: 1.5,
  },
  panel: {
    flex: 1,
  },
  panelContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
