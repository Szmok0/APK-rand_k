import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { GLYPH_MAP } from '@/data/glyphs';
import { GlyphCluster } from '@/components/GlyphCluster';
import { colors, moodColors } from '@/theme/tokens';
import type { Activity } from '@/types/models';
import { dayLabelShort, durationHours, fromDateKey } from '@/utils/dates';

type Props = {
  days: string[]; // rosnąco, jeden punkt na dzień (sekcja 7)
  activityByDate: Map<string, Activity>;
  width: number; // dostępna szerokość kontenera — geometria skaluje się do niej
  dense?: boolean; // widok miesięczny — mniejsze punkty, bez podpisów dat
  onSelectDay: (dateKey: string) => void;
};

const SPACING_NORMAL = 92;
const SPACING_DENSE = 40;
const LABEL_GAP = 14;
const MIN_LABEL_WIDTH = 84;

// Zakręcony timeline — jedna linia, jeden punkt = jeden dzień, stała odległość
// między punktami (sekcja 7). Ligatura = wspólny glow dla wielu glifów jednego dnia.
// Geometria (centerX, amplituda, szerokość etykiet) skaluje się do realnej
// szerokości ekranu, żeby etykiety nigdy nie wychodziły poza widoczny obszar.
export function TimelinePath({ days, activityByDate, width, dense, onSelectDay }: Props) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const rowSpacing = dense ? SPACING_DENSE : SPACING_NORMAL;
  const centerX = width / 2;
  const amplitude = dense ? 0 : Math.min(26, width * 0.09);
  const labelWidth = Math.max(MIN_LABEL_WIDTH, centerX - amplitude - LABEL_GAP - 8);

  const points = useMemo(
    () =>
      days.map((date, i) => ({
        date,
        x: centerX + amplitude * Math.sin(i * 1.05),
        y: 24 + i * rowSpacing,
      })),
    [days, rowSpacing, centerX, amplitude]
  );

  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const midY = (prev.y + cur.y) / 2;
      d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
    }
    return d;
  }, [points]);

  const height = points.length ? points[points.length - 1].y + 40 : 0;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Path d={pathD} stroke={colors.gold} strokeOpacity={0.35} strokeWidth={1.5} fill="none" />
        {points.map((p) => {
          const activity = activityByDate.get(p.date);
          const hasActivity = !!activity && activity.glyphIds.length > 0;
          const dominantMood = activity?.glyphIds
            .map((id) => GLYPH_MAP[id]?.moodTag)
            .find((m) => !!m);
          const color = dominantMood ? moodColors[dominantMood] : colors.textFaint;
          const important = activity && activity.importance === 2;
          return (
            <React.Fragment key={p.date}>
              {important && (
                <Circle
                  cx={p.x}
                  cy={p.y}
                  r={dense ? 7 : 11}
                  stroke={color}
                  strokeOpacity={0.8}
                  strokeDasharray="2 3"
                  strokeWidth={1}
                  fill="none"
                />
              )}
              <Circle
                cx={p.x}
                cy={p.y}
                r={hasActivity ? (dense ? 3.5 : 5) : dense ? 1.6 : 2.5}
                fill={hasActivity ? color : colors.textFaint}
                opacity={hasActivity ? 0.95 : 0.4}
              />
            </React.Fragment>
          );
        })}
      </Svg>

      {points.map((p, i) => {
        const activity = activityByDate.get(p.date);
        const d = fromDateKey(p.date);
        const label = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
        const isRight = Math.sin(i * 1.05) >= 0;
        const labelLeft = isRight
          ? Math.min(width - labelWidth - 4, p.x + amplitude + LABEL_GAP)
          : Math.max(4, p.x - amplitude - LABEL_GAP - labelWidth);

        return (
          <React.Fragment key={p.date}>
            <Pressable
              hitSlop={10}
              style={[styles.hit, { top: p.y - 16, left: p.x - 16 }]}
              onPress={() => (dense ? setTooltip(p.date === tooltip ? null : p.date) : onSelectDay(p.date))}
              onLongPress={() => onSelectDay(p.date)}
            />

            {!dense && (
              <Pressable
                onPress={() => onSelectDay(p.date)}
                style={[
                  styles.labelWrap,
                  { top: p.y - 6, left: labelLeft, width: labelWidth },
                  isRight ? styles.labelAlignLeft : styles.labelAlignRight,
                ]}
              >
                <Text style={styles.dateLabel} numberOfLines={1}>
                  {label} · {dayLabelShort(p.date)}
                </Text>
                {activity && activity.glyphIds.length > 0 && (
                  <>
                    <GlyphCluster glyphIds={activity.glyphIds} size={16} />
                    <Text style={styles.eventLabel} numberOfLines={1}>
                      {activity.glyphIds.map((id) => GLYPH_MAP[id]?.name).join(' + ')}
                      {activity.startTime && activity.endTime
                        ? ` · ${durationHours(activity.startTime, activity.endTime)}h`
                        : ''}
                    </Text>
                  </>
                )}
              </Pressable>
            )}

            {dense && tooltip === p.date && (
              <View style={[styles.tooltip, { top: p.y - 22, left: p.x - 20 }]}>
                <Text style={styles.tooltipText}>{label}</Text>
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  hit: {
    position: 'absolute',
    width: 32,
    height: 32,
  },
  labelWrap: {
    position: 'absolute',
  },
  labelAlignLeft: {
    alignItems: 'flex-start',
  },
  labelAlignRight: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    marginBottom: 2,
  },
  eventLabel: {
    color: colors.textFaint,
    fontSize: 10,
    maxWidth: '100%',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tooltipText: {
    color: colors.textPrimary,
    fontSize: 10,
  },
});
