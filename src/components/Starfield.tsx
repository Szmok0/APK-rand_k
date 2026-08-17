import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type Props = {
  width: number;
  height: number;
  count?: number;
  style?: any;
};

// Drobne cząsteczki o różnej przezroczystości w tle — wrażenie głębi/kosmosu (sekcja 4).
export function Starfield({ width, height, count = 90, style }: Props) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.3,
        o: Math.random() * 0.6 + 0.15,
      })),
    [width, height, count]
  );

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Svg width={width} height={height}>
        {stars.map((s, i) => (
          <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#F3EFE6" opacity={s.o} />
        ))}
      </Svg>
    </View>
  );
}
