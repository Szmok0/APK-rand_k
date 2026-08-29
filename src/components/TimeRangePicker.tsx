import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';
import { hourRange } from '@/utils/dates';

const HOURS = hourRange();

function stepHour(hour: string, delta: number): string {
  const index = HOURS.indexOf(hour);
  const next = (index + delta + HOURS.length) % HOURS.length;
  return HOURS[next];
}

function HourStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hour: string) => void;
}) {
  return (
    <View style={styles.column}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        hitSlop={8}
        style={styles.stepBtn}
        onPress={() => onChange(stepHour(value, 1))}
      >
        <Ionicons name="chevron-up" size={18} color={colors.gold} />
      </Pressable>
      <View style={styles.valueBox}>
        <Text style={styles.valueText}>{value}</Text>
      </View>
      <Pressable
        hitSlop={8}
        style={styles.stepBtn}
        onPress={() => onChange(stepHour(value, -1))}
      >
        <Ionicons name="chevron-down" size={18} color={colors.gold} />
      </Pressable>
    </View>
  );
}

type Props = {
  startTime: string;
  endTime: string;
  onChange: (next: { startTime: string; endTime: string }) => void;
};

// Time picker — tap-only steppers (up/down chevrons cycle through 00–23), never
// a keyboard (sekcja 8). Replaces an earlier scroll/wheel version: a vertical
// snap-scroll wheel nested inside this screen's outer ScrollView never
// registered gestures on a real Android device (the outer scroll always won
// the touch), so hour selection silently did nothing. Tap targets have no
// nested-scroll ambiguity and work the same on every platform.
export function TimeRangePicker({ startTime, endTime, onChange }: Props) {
  return (
    <View style={styles.row}>
      <HourStepper label="FROM" value={startTime} onChange={(h) => onChange({ startTime: h, endTime })} />
      <Text style={styles.dash}>—</Text>
      <HourStepper label="TO" value={endTime} onChange={(h) => onChange({ startTime, endTime: h })} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginVertical: spacing.sm,
  },
  column: {
    alignItems: 'center',
  },
  label: {
    color: colors.textFaint,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 4,
  },
  stepBtn: {
    width: 44,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueBox: {
    width: 80,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  valueText: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 18,
  },
  dash: {
    color: colors.textFaint,
    marginTop: 18,
  },
});
