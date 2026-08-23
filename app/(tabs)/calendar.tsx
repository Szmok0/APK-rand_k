// CALENDAR — Case Log. Structure preserved from the previous build almost 1:1
// (monthly grid + inline day panel below, no navigation on tap) — CALENDAR_TECH_SPEC
// explicitly asks to keep this mechanic; only copy/visual language changed.

import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { CalendarDayCell } from '@/components/CalendarDayCell';
import { DayDetailPanel } from '@/components/DayDetailPanel';
import { MonthCalendar } from '@/components/MonthCalendar';
import { GoldButton, Header, Screen } from '@/components/ui';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, spacing } from '@/theme/tokens';
import { dateLabelUpper, fromDateKey, todayKey } from '@/utils/dates';

export default function CalendarScreen() {
  const { activities } = useRelationship();
  const today = todayKey();
  const [selectedDate, setSelectedDate] = useState(today);

  const activityByDate = useMemo(() => {
    const map = new Map<string, (typeof activities)[number]>();
    for (const a of activities) map.set(a.date, a);
    return map;
  }, [activities]);

  const hasActivity = !!activityByDate.get(selectedDate);

  return (
    <Screen>
      <Image
        source={require('../../assets/noir/backgrounds/calendar_bg.jpg')}
        style={[StyleSheet.absoluteFill, styles.backgroundImage]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.scrim]} />

      <Header title="CASE FILES" />

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

      <View style={styles.ticket}>
        <Text style={styles.ticketDate}>{dateLabelUpper(selectedDate)}</Text>
        <View style={styles.ticketDivider} />
        <Text style={styles.ticketTitle}>CASE FILE #{fromDateKey(selectedDate).getDate().toString().padStart(3, '0')}</Text>
        <Text style={styles.ticketSub}>DAILY LOG</Text>
        {hasActivity && (
          <View style={styles.recordedStamp}>
            <Text style={styles.recordedText}>RECORDED</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent}>
        <DayDetailPanel date={selectedDate} />
      </ScrollView>

      <View style={styles.footer}>
        <GoldButton
          label="+ Add Activity"
          onPress={() => router.push({ pathname: '/add-activity', params: { date: selectedDate } })}
          style={{ flex: 1 }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // See app/index.tsx — StyleSheet.absoluteFill alone doesn't stretch an Image
  // correctly on React Native Web without an explicit 100%/100% too.
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  scrim: {
    backgroundColor: 'rgba(12, 10, 8, 0.7)',
  },
  grid: {
    paddingHorizontal: spacing.md,
  },
  ticket: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.paper,
    borderRadius: 4,
    padding: spacing.sm,
  },
  ticketDate: {
    color: colors.textOnPaper,
    fontSize: 11,
    fontWeight: '700',
  },
  ticketDivider: {
    height: 1,
    backgroundColor: colors.paperDark,
    marginVertical: 4,
  },
  ticketTitle: {
    color: colors.textOnPaper,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ticketSub: {
    color: colors.textOnPaper,
    fontSize: 10,
    opacity: 0.7,
  },
  recordedStamp: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.red,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    transform: [{ rotate: '-4deg' }],
  },
  recordedText: {
    color: colors.red,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  panel: {
    flex: 1,
  },
  panelContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
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
