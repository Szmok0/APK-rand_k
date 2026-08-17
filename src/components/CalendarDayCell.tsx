import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { GLYPH_MAP } from '@/data/glyphs';
import { GlyphCluster } from '@/components/GlyphCluster';
import { colors, moodColors } from '@/theme/tokens';
import type { Activity } from '@/types/models';
import { durationHours } from '@/utils/dates';

type Props = {
  dayNumber: number;
  inMonth: boolean;
  isToday?: boolean;
  activity?: Activity;
};

const RING_SIZE = 30;
const RING_R = 13;

// Komórka dnia — sekcja 9 MD: numer dnia, glif/ligatura, czas (jeśli wymagany),
// marker notatki, marker zdjęcia. Łuk wokół numeru dnia = wizualny odpowiednik
// czasu trwania (im dłużej, tym więcej łuku) — inspirowane mockupem kalendarza.
export function CalendarDayCell({ dayNumber, inMonth, isToday, activity }: Props) {
  const hours = activity ? durationHours(activity.startTime, activity.endTime) : 0;
  const dominantMood = activity?.glyphIds
    .map((id) => GLYPH_MAP[id]?.moodTag)
    .find((m) => !!m);
  const ringColor = dominantMood ? moodColors[dominantMood] : colors.gold;
  const circumference = 2 * Math.PI * RING_R;
  const dash = circumference * Math.min(hours / 12, 1);

  return (
    <View style={styles.wrap}>
      <View style={styles.numberWrap}>
        {hours > 0 && (
          <Svg
            width={RING_SIZE}
            height={RING_SIZE}
            style={StyleSheet.absoluteFill}
          >
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_R}
              stroke={ringColor}
              strokeOpacity={0.6}
              strokeWidth={1.5}
              fill="none"
              strokeDasharray={`${dash} ${circumference}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            />
          </Svg>
        )}
        <Text
          style={[
            styles.dayNumber,
            !inMonth && styles.dayNumberFaint,
            isToday && styles.dayNumberToday,
          ]}
        >
          {dayNumber}
        </Text>
      </View>

      {activity && activity.glyphIds.length > 0 && (
        <View style={styles.glyphSlot}>
          <GlyphCluster glyphIds={activity.glyphIds} size={14} max={2} />
        </View>
      )}

      {activity?.startTime && activity?.endTime && (
        <Text style={styles.time}>
          {activity.startTime.slice(0, 2)}–{activity.endTime.slice(0, 2)}
        </Text>
      )}

      <View style={styles.markerRow}>
        {activity?.note ? <View style={styles.noteDot} /> : null}
        {activity?.photoUri ? <View style={styles.photoDot} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  numberWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  dayNumberFaint: {
    color: colors.textFaint,
  },
  dayNumberToday: {
    color: colors.gold,
    fontWeight: '700',
  },
  glyphSlot: {
    marginTop: -2,
  },
  time: {
    fontSize: 8,
    color: colors.textFaint,
    marginTop: 1,
  },
  markerRow: {
    flexDirection: 'row',
    marginTop: 1,
    height: 5,
  },
  noteDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: colors.gold,
    marginHorizontal: 1.5,
  },
  photoDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 1.5,
  },
});
