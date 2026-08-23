// Bottom navigation — 4 real destinations, no FAB (product decision: "if there
// are 4 core screens, there should be 4 buttons"). Evidence Archive is what the
// early mockups sometimes labelled "Activity" — same destination, one name.
//
// Custom tab bar: same "single flat image + minimal overlay" rule as Home
// (see app/(tabs)/home.tsx) — assets/noir/home/tabbar_bg.jpg is the exact
// bottom strip of the approved layout map (4 plain card slots; the original
// dashed icon square / red underline were annotation-only and are inpainted
// out, same as Home's dashed boxes). Code overlays only the actual icon +
// label per tab, positioned by percentage to match the 4 slots exactly.

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/theme/tokens';

// Exact pixel size of assets/noir/home/tabbar_bg.jpg.
const BG_W = 853;
const BG_H = 180;

// The 4 card slots, measured off the source composite the same way as
// Home's zones (see home.tsx ZONES comment).
const TAB_SLOTS = [
  { left: 26, width: 196 },
  { left: 232, width: 190 },
  { left: 430, width: 190 },
  { left: 629, width: 193 },
].map(
  (s) =>
    ({
      left: `${(s.left / BG_W) * 100}%`,
      width: `${(s.width / BG_W) * 100}%`,
      top: `${(8 / BG_H) * 100}%`,
      height: `${(148 / BG_H) * 100}%`,
    }) as const
);

const TAB_META: Record<string, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  home: { icon: 'home-outline', label: 'HOME' },
  calendar: { icon: 'calendar-outline', label: 'CALENDAR' },
  evidence: { icon: 'folder-outline', label: 'EVIDENCE' },
  profiler: { icon: 'finger-print-outline', label: 'PROFILER' },
};

// The dashed icon square / red underline that used to anchor these were
// annotation-only and have been inpainted out of tabbar_bg.jpg (same "not
// permanent UI" call as Home's dashed boxes) — the cards are now plain, so
// icon/label position is just a reasonable split of each slot's height.
const ICON_CENTER_PCT = 38;
const LABEL_CENTER_PCT = 76;

// Always reserve at least this much below the bar, even if a device somehow
// reports a 0/near-0 bottom inset (safe-area-context can't be verified from
// this sandbox — there's no physical home indicator/gesture bar to measure
// in a browser) — real device insets, which are usually taller, still win.
const MIN_BOTTOM_SAFE_PAD = 16;

function CaseTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_SAFE_PAD) }]}>
      <View style={styles.bgContainer}>
        <Image
          source={require('../../assets/noir/home/tabbar_bg.jpg')}
          style={styles.bgImage}
          resizeMode="cover"
        />
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const meta = TAB_META[route.name] ?? { icon: 'ellipse-outline', label: route.name };
          const slot = TAB_SLOTS[index];

          function onPress() {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[styles.slot, slot]}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              <View style={[styles.iconWrap, { top: `${ICON_CENTER_PCT}%` }]}>
                <Ionicons name={meta.icon} size={22} color={isFocused ? colors.gold : colors.textFaint} />
              </View>
              <View style={[styles.labelWrap, { top: `${LABEL_CENTER_PCT}%` }]}>
                <Text style={[styles.label, isFocused && styles.labelActive]}>{meta.label}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CaseTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" options={{ title: 'HOME' }} />
      <Tabs.Screen name="calendar" options={{ title: 'CALENDAR' }} />
      <Tabs.Screen name="evidence" options={{ title: 'EVIDENCE' }} />
      <Tabs.Screen name="profiler" options={{ title: 'PROFILER' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.background,
    width: '100%',
  },
  bgContainer: {
    width: '100%',
    aspectRatio: BG_W / BG_H,
    position: 'relative',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  slot: {
    position: 'absolute',
  },
  // Icon and label are independently centered on the dashed square / red
  // underline they sit on top of (not stacked as a block) — see
  // ICON_CENTER_PCT / LABEL_CENTER_PCT above for where those measured to.
  iconWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -11 }],
  },
  labelWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -7 }],
  },
  label: {
    fontFamily: fonts.display,
    fontSize: 8.5,
    letterSpacing: 0.6,
    color: colors.textFaint,
    fontWeight: '700',
  },
  labelActive: {
    color: colors.gold,
  },
});
