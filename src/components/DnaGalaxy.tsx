import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Image as SvgImage,
  Line,
  Polygon,
  RadialGradient,
  Stop,
} from 'react-native-svg';

import { RUNE_ICONS } from '@/data/glyphs';
import { computeZoneGlow } from '@/engine/emotionalTone';
import { CENTER, CORE_RINGS, FIELD_STARS, VIEWBOX, ZONES, subNodes, zoneHub } from '@/engine/dnaLayout';
import { colors, moodColors } from '@/theme/tokens';
import type { Activity } from '@/types/models';
import { todayKey } from '@/utils/dates';

type Props = {
  activities: Activity[];
  size: number;
};

const ROTATION_DURATION_MS = 150000; // wolny, ale widoczny obrót całości (sekcja 4)

// Struktura DNA / galaktyka (sekcja 4). Geometria jest ZAWSZE ta sama (dnaLayout.ts);
// jedyną zmienną sterowaną danymi jest podświetlenie stref (Emotional Tone Layer).
export function DnaGalaxy({ activities, size }: Props) {
  const glowByTag = useMemo(() => {
    const zones = computeZoneGlow(activities, todayKey());
    return Object.fromEntries(zones.map((z) => [z.tag, z]));
  }, [activities]);

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: ROTATION_DURATION_MS, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const hubs = ZONES.map((z) => ({ zone: z, hub: zoneHub(z) }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
        <Svg width={size} height={size} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
          <Defs>
            {ZONES.map((zone) => {
              const glow = glowByTag[zone.tag];
              const color = moodColors[zone.tag];
              return (
                <RadialGradient key={zone.tag} id={`glow-${zone.tag}`} cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor={color} stopOpacity={Math.min(0.9, glow.intensity)} />
                  <Stop offset="60%" stopColor={color} stopOpacity={glow.intensity * 0.35} />
                  <Stop offset="100%" stopColor={color} stopOpacity={0} />
                </RadialGradient>
              );
            })}
          </Defs>

          {FIELD_STARS.map((s, i) => (
            <Circle key={`star-${i}`} cx={s.x} cy={s.y} r={s.r} fill="#F3EFE6" opacity={s.o} />
          ))}

          {/* stała, dekoracyjna siatka łącząca strefy — nie zmienia się z danymi */}
          <Polygon
            points={hubs.map(({ hub }) => `${hub.x},${hub.y}`).join(' ')}
            fill="none"
            stroke={colors.textFaint}
            strokeOpacity={0.22}
            strokeWidth={1}
          />

          {CORE_RINGS.map((r, i) => (
            <Circle
              key={r}
              cx={CENTER}
              cy={CENTER}
              r={r}
              fill="none"
              stroke={colors.gold}
              strokeOpacity={0.28 - i * 0.05}
              strokeWidth={1}
              strokeDasharray={i % 2 === 0 ? '1 4' : undefined}
            />
          ))}
          <Circle cx={CENTER} cy={CENTER} r={40} fill="url(#glow-BLISKOSC)" opacity={0.15} />
          <Circle cx={CENTER} cy={CENTER} r={5} fill={colors.gold} />

          {hubs.map(({ zone, hub }) => {
            const glow = glowByTag[zone.tag];
            const color = moodColors[zone.tag];
            const subs = subNodes(zone);
            const haloR = 30 + glow.intensity * 26;
            return (
              <React.Fragment key={zone.tag}>
                <Line
                  x1={CENTER}
                  y1={CENTER}
                  x2={hub.x}
                  y2={hub.y}
                  stroke={color}
                  strokeOpacity={0.15 + glow.intensity * 0.55}
                  strokeWidth={0.75 + glow.intensity * 2}
                />
                <Circle cx={hub.x} cy={hub.y} r={haloR} fill={`url(#glow-${zone.tag})`} />
                <Circle
                  cx={hub.x}
                  cy={hub.y}
                  r={22}
                  fill="none"
                  stroke={color}
                  strokeOpacity={0.2 + glow.intensity * 0.5}
                  strokeWidth={1}
                  strokeDasharray="1 3"
                />
                {subs.map((n, idx) => (
                  <Circle
                    key={idx}
                    cx={n.x}
                    cy={n.y}
                    r={1.6}
                    fill={color}
                    opacity={0.3 + glow.intensity * 0.6}
                  />
                ))}
                <Circle cx={hub.x} cy={hub.y} r={8} fill={color} opacity={0.55 + glow.intensity * 0.45} />
                <SvgImage
                  href={RUNE_ICONS[zone.tag]}
                  x={hub.x - 14}
                  y={hub.y - 17}
                  width={28}
                  height={34}
                  opacity={0.55 + glow.intensity * 0.45}
                />
              </React.Fragment>
            );
          })}
        </Svg>
      </Animated.View>
    </View>
  );
}
