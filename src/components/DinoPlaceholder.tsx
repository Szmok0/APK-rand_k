import React from 'react';
import Svg, { Circle, Defs, Ellipse, Polygon, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/theme/tokens';

type Props = {
  width: number;
  height: number;
};

// Placeholder motywu dinozaura (Ankylozaur) — sekcja 3 MD. Widoczny WYŁĄCZNIE na
// splashu; do podmiany na docelową grafikę dostarczoną przez klienta (PNG/SVG).
// Utrzymuje paletę reszty appki (ciemne tło, złote akcenty), żeby przejście do
// START było płynne stylistycznie.
export function DinoPlaceholder({ width, height }: Props) {
  const vbW = 320;
  const vbH = 200;
  const gold = colors.gold;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`}>
      <Defs>
        <RadialGradient id="dinoGlow" cx="50%" cy="55%" r="60%">
          <Stop offset="0%" stopColor={gold} stopOpacity={0.35} />
          <Stop offset="100%" stopColor={gold} stopOpacity={0} />
        </RadialGradient>
      </Defs>

      <Ellipse cx={vbW / 2} cy={vbH / 2} rx={vbW / 2} ry={vbH / 2} fill="url(#dinoGlow)" />

      {/* ogon */}
      <Polygon points="40,140 8,150 40,128" fill={gold} opacity={0.9} />
      <Circle cx={22} cy={148} r={9} fill={gold} opacity={0.9} />

      {/* korpus */}
      <Ellipse cx={150} cy={128} rx={95} ry={38} fill={gold} opacity={0.9} />

      {/* nogi */}
      <Rect x={95} y={155} width={16} height={26} rx={6} fill={gold} opacity={0.85} />
      <Rect x={190} y={155} width={16} height={26} rx={6} fill={gold} opacity={0.85} />

      {/* kolce na grzbiecie */}
      <Polygon points="90,96 102,66 114,96" fill={gold} opacity={0.85} />
      <Polygon points="122,90 134,58 146,90" fill={gold} opacity={0.85} />
      <Polygon points="154,88 166,56 178,88" fill={gold} opacity={0.85} />
      <Polygon points="186,92 198,62 210,92" fill={gold} opacity={0.85} />

      {/* głowa */}
      <Ellipse cx={252} cy={118} rx={34} ry={24} fill={gold} opacity={0.9} />
      <Ellipse cx={280} cy={120} rx={14} ry={12} fill={gold} opacity={0.9} />

      {/* oko */}
      <Circle cx={258} cy={112} r={2.6} fill={colors.background} />
    </Svg>
  );
}
