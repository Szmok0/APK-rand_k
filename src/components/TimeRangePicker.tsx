import React, { useRef } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';
import { hourRange } from '@/utils/dates';

const ITEM_HEIGHT = 36;
const VISIBLE = 3;
const HOURS = hourRange();

function HourWheel({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hour: string) => void;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const initialIndex = Math.max(0, HOURS.indexOf(value));

  function handleEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.min(HOURS.length - 1, Math.max(0, index));
    onChange(HOURS[clamped]);
  }

  return (
    <View style={styles.wheelColumn}>
      <Text style={styles.wheelLabel}>{label}</Text>
      <View style={[styles.wheelViewport, { height: ITEM_HEIGHT * VISIBLE }]}>
        <View pointerEvents="none" style={styles.wheelHighlight} />
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
          contentOffset={{ x: 0, y: initialIndex * ITEM_HEIGHT }}
          onMomentumScrollEnd={handleEnd}
        >
          {HOURS.map((h) => (
            <View key={h} style={styles.wheelItem}>
              <Text style={[styles.wheelItemText, h === value && styles.wheelItemTextActive]}>
                {h}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

type Props = {
  startTime: string;
  endTime: string;
  onChange: (next: { startTime: string; endTime: string }) => void;
};

// Wybór czasu — wyłącznie scroll/wheel godzin 00–23, nigdy klawiatura (sekcja 8).
export function TimeRangePicker({ startTime, endTime, onChange }: Props) {
  return (
    <View style={styles.row}>
      <HourWheel label="OD" value={startTime} onChange={(h) => onChange({ startTime: h, endTime })} />
      <Text style={styles.dash}>—</Text>
      <HourWheel label="DO" value={endTime} onChange={(h) => onChange({ startTime, endTime: h })} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  wheelColumn: {
    alignItems: 'center',
  },
  wheelLabel: {
    color: colors.textFaint,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 4,
  },
  wheelViewport: {
    width: 80,
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  wheelHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderRadius: radius.sm,
    backgroundColor: colors.goldSoft,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelItemText: {
    color: colors.textFaint,
    fontSize: 15,
  },
  wheelItemTextActive: {
    color: colors.gold,
    fontWeight: '700',
  },
  dash: {
    color: colors.textFaint,
    marginBottom: ITEM_HEIGHT,
  },
});
