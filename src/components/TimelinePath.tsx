import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

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
const WAVE_FREQUENCY = 0.85; // stała, przewidywalna — "rzeka", nie przypadkowy wężyk (v4)

let gradientCounter = 0;

// Zakręcony timeline — jedna linia, jeden punkt = jeden dzień, stała odległość
// między punktami (sekcja 7). Styl (v3/v4 MD v6): gradient koloru wzdłuż linii
// zależny od nastroju pobliskich wydarzeń, poświata wokół węzłów, leader-line
// jednoznacznie łączący etykietę z jej punktem, łagodna/przewidywalna sinusoida.
export function TimelinePath({ days, activityByDate, width, dense, onSelectDay }: Props) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const rowSpacing = dense ? SPACING_DENSE : SPACING_NORMAL;
  const centerX = width / 2;
  const amplitude = dense ? 0 : Math.min(26, width * 0.09);
  const labelWidth = Math.max(MIN_LABEL_WIDTH, centerX - amplitude - LABEL_GAP - 8);
  const gradientId = useMemo(() => `timeline-gradient-${gradientCounter++}`, []);

  const points = useMemo(
    () =>
      days.map((date, i) => {
        const activity = activityByDate.get(date);
        const hasActivity = !!activity && activity.glyphIds.length > 0;
        const dominantMood = activity?.glyphIds.map((id) => GLYPH_MAP[id]?.moodTag).find((m) => !!m);
        const color = dominantMood ? moodColors[dominantMood] : colors.textFaint;
        return {
          date,
          x: centerX + amplitude * Math.sin(i * WAVE_FREQUENCY),
          y: 24 + i * rowSpacing,
          hasActivity,
          color,
          important: !!activity && activity.importance === 2,
        };
      }),
    [days, rowSpacing, centerX, amplitude, activityByDate]
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
        <Defs>
          {/* Gradient wzdłuż linii — kolor podąża za nastrojem pobliskich wydarzeń,
              nie jest jednolity (poprawka v3/v4). */}
          <LinearGradient id={gradientId} x1={0} y1={0} x2={0} y2={height} gradientUnits="userSpaceOnUse">
            {points.map((p, i) => (
              <Stop
                key={p.date}
                offset={height > 0 ? p.y / height : i / Math.max(1, points.length - 1)}
                stopColor={p.color}
                stopOpacity={p.hasActivity ? 0.9 : 0.3}
              />
            ))}
          </LinearGradient>
        </Defs>

        <Path d={pathD} stroke={`url(#${gradientId})`} strokeWidth={2} fill="none" />

        {points.map((p) => (
          <React.Fragment key={p.date}>
            {p.hasActivity && (
              <>
                {/* poświata (halo) wokół węzła — warstwy o malejącej nieprzezroczystości */}
                <Circle cx={p.x} cy={p.y} r={dense ? 8 : 14} fill={p.color} opacity={0.12} />
                <Circle cx={p.x} cy={p.y} r={dense ? 5 : 9} fill={p.color} opacity={0.22} />
              </>
            )}
            {p.important && (
              <Circle
                cx={p.x}
                cy={p.y}
                r={dense ? 7 : 11}
                stroke={p.color}
                strokeOpacity={0.8}
                strokeDasharray="2 3"
                strokeWidth={1}
                fill="none"
              />
            )}
            <Circle
              cx={p.x}
              cy={p.y}
              r={p.hasActivity ? (dense ? 3.5 : 5) : dense ? 1.6 : 2.5}
              fill={p.hasActivity ? p.color : colors.textFaint}
              opacity={p.hasActivity ? 0.95 : 0.4}
            />
          </React.Fragment>
        ))}

        {/* Leader line — krótki łącznik od punktu do etykiety, żeby przypisanie
            daty do punktu było jednoznaczne (poprawka v4), nigdy "wisząca" etykieta. */}
        {!dense &&
          points.map((p, i) => {
            const isRight = Math.sin(i * WAVE_FREQUENCY) >= 0;
            const nodeR = p.hasActivity ? 5 : 2.5;
            const x2 = isRight ? p.x + nodeR + LABEL_GAP - 2 : p.x - nodeR - LABEL_GAP + 2;
            return (
              <Line
                key={`leader-${p.date}`}
                x1={isRight ? p.x + nodeR : p.x - nodeR}
                y1={p.y}
                x2={x2}
                y2={p.y}
                stroke={p.color}
                strokeOpacity={0.45}
                strokeWidth={1}
              />
            );
          })}
      </Svg>

      {points.map((p, i) => {
        const activity = activityByDate.get(p.date);
        const d = fromDateKey(p.date);
        const label = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
        const isRight = Math.sin(i * WAVE_FREQUENCY) >= 0;
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
