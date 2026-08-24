// CALENDAR — Case Log. Structure preserved from the previous build almost 1:1
// (monthly grid + inline day panel below, no navigation on tap) — CALENDAR_TECH_SPEC
// explicitly asks to keep this mechanic. Visual pass reskinned against the
// product owner's reference screen: cleaner floating day numbers (no grid
// lines), a two-column case-file ticket, and a derived badge row + boxed
// TIME/EVIDENCE readouts in the day panel (src/engine/dayBadges.ts).

import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
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
          useGridImage
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

      <View style={styles.ticketOuter}>
        <View style={styles.ticketImgWrap}>
          <Image
            source={require('../../assets/noir/calendar/ticket_blank.png')}
            style={styles.ticketImg}
          />

          {/* The real ticket asset already bakes in "CASE FILE #", "DAILY
              LOG" and a "RECORDED" stamp — code only fills the 4 real blank
              slots: month/day-number/weekday and the file number. The
              RECORDED stamp is baked unconditionally, so an opaque patch
              covers it on days with no activity (never claim a day was
              recorded when it wasn't). */}
          <View style={styles.ticketMonthSlot}>
            <Text style={styles.ticketMonth}>{MONTH_ABBR[selectedDay.getMonth()]}</Text>
          </View>
          <View style={styles.ticketDaySlot}>
            <Text style={styles.ticketDayNumber}>{selectedDay.getDate()}</Text>
          </View>
          <View style={styles.ticketWeekdaySlot}>
            <Text style={styles.ticketWeekday}>{dayLabelFull(selectedDate)}</Text>
          </View>
          <View style={styles.ticketFileNumSlot}>
            <Text style={styles.ticketFileNum}>
              {selectedDay.getDate().toString().padStart(3, '0')}
            </Text>
          </View>
          {!hasActivity && <View style={styles.recordedCover} />}
        </View>
      </View>

      <View style={[styles.panel, styles.panelContent]}>
        <DayDetailPanel date={selectedDate} fillReport />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
  headerTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  grid: {
    paddingHorizontal: spacing.md,
  },
  // ticket_blank.png is the real "case file" ticket asset from the pack
  // (torn paper + pocket + paperclip + "CASE FILE #" / "DAILY LOG" /
  // "RECORDED" all baked in), inpainted clean of the red placeholder boxes
  // it shipped with — those were "put data here" annotations, not real UI
  // (same call as Home's dashed boxes). Container aspectRatio matches the
  // asset's exact pixel ratio so every slot below always lands in its real
  // blank spot regardless of screen width.
  ticketOuter: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
  },
  ticketImgWrap: {
    width: '100%',
    aspectRatio: 1189 / 385,
    position: 'relative',
  },
  ticketImg: {
    width: '100%',
    height: '100%',
  },
  ticketMonthSlot: {
    position: 'absolute',
    left: '11%',
    top: '10%',
    width: '16%',
    height: '22%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketDaySlot: {
    position: 'absolute',
    left: '11%',
    top: '32%',
    width: '16%',
    height: '31%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketWeekdaySlot: {
    position: 'absolute',
    left: '11%',
    top: '63%',
    width: '16%',
    height: '29%',
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
    fontSize: 28,
    lineHeight: 32,
  },
  ticketWeekday: {
    color: colors.textOnPaper,
    fontSize: 9,
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  ticketFileNumSlot: {
    position: 'absolute',
    left: '81%',
    top: '23%',
    width: '16%',
    height: '18%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  ticketFileNum: {
    color: colors.textOnPaper,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Covers the baked-in "RECORDED" stamp on days with no activity — its
  // position was measured directly off the asset's pixels.
  recordedCover: {
    position: 'absolute',
    left: '71%',
    top: '47.5%',
    width: '27%',
    height: '43%',
    backgroundColor: colors.paper,
  },
  // overflow:'hidden' is a safety net: if the grid+ticket above ever leave
  // less room than the panel below needs, this clips at the boundary
  // instead of the panel's content visually drawing over the tab bar.
  panel: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  panelContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
});
