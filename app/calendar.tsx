// KALENDARZ — sekcja 9 MD. Klasyczny, praktyczny ekran, źródło prawdy.

import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CalendarDayCell } from '@/components/CalendarDayCell';
import { MonthCalendar } from '@/components/MonthCalendar';
import { GoldButton, Header, OutlineButton, Screen } from '@/components/ui';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, spacing } from '@/theme/tokens';
import { fromDateKey, todayKey } from '@/utils/dates';

export default function CalendarScreen() {
  const { activities } = useRelationship();
  const activityByDate = useMemo(() => {
    const map = new Map<string, (typeof activities)[number]>();
    for (const a of activities) map.set(a.date, a);
    return map;
  }, [activities]);
  const today = todayKey();

  return (
    <Screen>
      <Header title="KALENDARZ" />
      <ScrollView contentContainerStyle={styles.content}>
        <MonthCalendar
          onSelectDay={(dateKey) => router.push({ pathname: '/day/[date]', params: { date: dateKey } })}
          renderCell={(dateKey, inMonth) => (
            <CalendarDayCell
              dayNumber={fromDateKey(dateKey).getDate()}
              inMonth={inMonth}
              isToday={dateKey === today}
              activity={activityByDate.get(dateKey)}
            />
          )}
        />

        <View style={styles.legend}>
          <Text style={styles.legendText}>łuk = czas (im dłuższy, tym więcej godzin)</Text>
          <Text style={styles.legendText}>• = notatka (ukryta, dotknij dnia)</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <OutlineButton label="Timeline" icon="analytics-outline" onPress={() => router.push('/timeline')} style={{ flex: 1 }} />
        <GoldButton label="+ Dodaj Aktywność" onPress={() => router.push('/add-activity')} style={{ flex: 1.3 }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  legend: {
    marginTop: spacing.md,
    gap: 4,
  },
  legendText: {
    color: colors.textFaint,
    fontSize: 11,
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
