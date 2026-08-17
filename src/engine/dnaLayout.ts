// Geometria struktury DNA — STAŁA, zaprojektowana raz (sekcja 4 MD).
// Nigdy nie generujemy jej z danych; jedyna zmienna sterowana danymi to
// podświetlenie (patrz emotionalTone.ts). Współrzędne są zaszyte na sztywno
// (deterministyczny seed dla elementów dekoracyjnych), żeby struktura wyglądała
// identycznie przy każdym uruchomieniu, dla każdej relacji.

import type { MoodTag } from '@/theme/tokens';

export const VIEWBOX = 320;
export const CENTER = VIEWBOX / 2;

export type Zone = {
  tag: MoodTag;
  angleDeg: number; // pozycja strefy wokół rdzenia
  hubRadius: number; // odległość huba strefy od centrum
};

// 5 stref, 72° od siebie — jedna na każdy tag nastroju (sekcja 6). Kolejność i kąty
// są stałe niezależnie od danych.
export const ZONES: Zone[] = [
  { tag: 'BLISKOSC', angleDeg: -90, hubRadius: 118 },
  { tag: 'TESKNOTA', angleDeg: -18, hubRadius: 112 },
  { tag: 'NAMIETNOSC', angleDeg: 54, hubRadius: 120 },
  { tag: 'RADOSC', angleDeg: 126, hubRadius: 108 },
  { tag: 'NAPIECIE', angleDeg: 198, hubRadius: 116 },
];

export const CORE_RINGS = [18, 30, 44, 60];

export function polar(angleDeg: number, radius: number, cx = CENTER, cy = CENTER) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

export function zoneHub(zone: Zone) {
  return polar(zone.angleDeg, zone.hubRadius);
}

// Małe, stałe podwęzły wokół każdego huba — struktura, nie dane (sekcja 4:
// "nie renderujemy osobnych węzłów per aktywność").
export function subNodes(zone: Zone, count = 4, orbit = 22) {
  const hub = zoneHub(zone);
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const angle = zone.angleDeg + (360 / count) * i + 20;
    nodes.push(polar(angle, orbit, hub.x, hub.y));
  }
  return nodes;
}

// Deterministyczny PRNG (mulberry32) — te same "gwiazdy tła" przy każdym renderze,
// zgodnie z zasadą stałej geometrii.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type FieldStar = { x: number; y: number; r: number; o: number };

export const FIELD_STARS: FieldStar[] = (() => {
  const rand = mulberry32(20260817);
  return Array.from({ length: 60 }, () => ({
    x: rand() * VIEWBOX,
    y: rand() * VIEWBOX,
    r: rand() * 1.3 + 0.3,
    o: rand() * 0.5 + 0.15,
  }));
})();
