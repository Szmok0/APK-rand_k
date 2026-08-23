// CALENDAR — Case Log. Structure preserved from the previous build almost 1:1
// (monthly grid + inline day panel below, no navigation on tap) — CALENDAR_TECH_SPEC
// explicitly asks to keep this mechanic. Visual pass reskinned against the
// product owner's reference screen: cleaner floating day numbers (no grid
// lines), a two-column case-file ticket, and a derived badge row + boxed
// TIME/EVIDENCE readouts in the day panel (src/engine/dayBadges.ts).

import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalendarDayCell } from '@/components/CalendarDayCell';
import { DayDetailPanel } from '@/components/DayDetailPanel';
import { MonthCalendar } from '@/components/MonthCalendar';
import { Screen } from '@/components/ui';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, spacing, typography } from '@/theme/tokens';
import { dayLabelFull, fromDateKey, todayKey } from '@/utils/dates';

const MONTH_ABBR = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default function CalendarScreen() {
  const { activities } = useRelationship();
  const insets = useSafeAreaInsets();
  const today = todayKey();
  const [selectedDate, setSelectedDate] = useState(today);

  const activityByDate = useMemo(() => {
    const map = new Map<string, (typeof activities)[number]>();
    for (const a of activities) map.set(a.date, a);
    return map;
  }, [activities]);

  const hasActivity = !!activityByDate.get(selectedDate);
  const selectedDay = fromDateKey(selectedDate);

  return (
    <Screen>
      <Image
        source={require('../../assets/noir/backgrounds/calendar_bg.jpg')}
        style={[StyleSheet.absoluteFill, styles.backgroundImage]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.scrim]} />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.push('/settings')} hitSlop={12}>
          <Ionicons name="menu-outline" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>CALENDAR</Text>
        <Pressable
          onPress={() => router.push({ pathname: '/add-activity', params: { date: selectedDate } })}
          hitSlop={12}
        >
          <Ionicons name="add" size={24} color={colors.gold} />
        </Pressable>
      </View>

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
        <Ionicons name="attach" size={18} color={colors.textOnPaper} style={styles.ticketPaperclip} />

        <View style={styles.ticketDateCol}>
          <Text style={styles.ticketMonth}>{MONTH_ABBR[selectedDay.getMonth()]}</Text>
          <Text style={styles.ticketDayNumber}>{selectedDay.getDate()}</Text>
          <Text style={styles.ticketWeekday}>{dayLabelFull(selectedDate)}</Text>
        </View>

        <View style={styles.ticketVDivider} />

        <View style={styles.ticketFileCol}>
          <Text style={styles.ticketTitle}>
            CASE FILE #{selectedDay.getDate().toString().padStart(3, '0')}
          </Text>
          <Text style={styles.ticketSub}>DAILY LOG</Text>
          {hasActivity && (
            <View style={styles.recordedStamp}>
              <Text style={styles.recordedText}>RECORDED</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent}>
        <DayDetailPanel date={selectedDate} />
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  grid: {
    paddingHorizontal: spacing.md,
  },
  ticket: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.paper,
    borderRadius: 4,
    padding: spacing.md,
    minHeight: 88,
  },
  ticketPaperclip: {
    position: 'absolute',
    top: -8,
    left: 12,
    transform: [{ rotate: '-14deg' }],
  },
  ticketDateCol: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketMonth: {
    color: colors.textOnPaper,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    opacity: 0.7,
  },
  ticketDayNumber: {
    ...typography.title,
    color: colors.textOnPaper,
    fontSize: 32,
    lineHeight: 36,
  },
  ticketWeekday: {
    color: colors.textOnPaper,
    fontSize: 9,
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  ticketVDivider: {
    width: 1,
    backgroundColor: colors.paperDark,
    marginHorizontal: spacing.md,
  },
  ticketFileCol: {
    flex: 1,
    justifyContent: 'center',
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
    marginTop: 2,
  },
  recordedStamp: {
    position: 'absolute',
    right: 0,
    bottom: -4,
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
});
