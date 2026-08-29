// PROFILER — hub screen (concept doc `ZUZA_DIARY_PROFILER_KONCEPCJA.md` section 3).
// Two entries only: RELATIONSHIP DNA (the data-driven side) and THE LID (the
// user's subjective read on him). Everything on this screen — title, subtitle,
// both card labels/descriptions, the case stamp, the fingerprint decoration —
// is real, static copy the product owner already approved, so per the concept
// doc's own rule ("Grafika = klimat + stała konstrukcja, Kod = dane + tekst +
// wartości + stan") it's fine for all of it to live in one baked reference
// image instead of being redrawn in code: nothing on this screen is a number,
// percentage or value that changes.
//
// assets/noir/profiler/hub_bg.jpg is that reference screenshot, cropped to
// drop the mockup's own fake status bar and home indicator (the real device's
// will render in their place). The two card rows are real interactive
// buttons, just invisible ones layered exactly on top of their baked artwork
// — same "graphic is the layout, code only adds the touch target" technique
// already used for Calendar's ticket slots and the tab bar's card slots.
//
// Card zones were measured directly off the source image's pixels (border
// lines are ~1132/1325 and ~1357/1550 out of 1730px tall, ~75/780 out of
// 853px wide) rather than eyeballed, so they align with the art exactly.

import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui';

// Exact pixel size of assets/noir/profiler/hub_bg.jpg.
const BG_W = 853;
const BG_H = 1730;

export default function ProfilerScreen() {
  return (
    <Screen>
      <View style={styles.bgBox}>
        <Image
          source={require('../../assets/noir/profiler/hub_bg.jpg')}
          style={styles.bgImage}
          resizeMode="cover"
        />
        <Pressable
          style={styles.dnaHotspot}
          onPress={() => router.push('/profiler/dna')}
          accessibilityRole="button"
          accessibilityLabel="Relationship DNA — what the evidence actually shows"
          hitSlop={4}
        />
        <Pressable
          style={styles.lidHotspot}
          onPress={() => router.push('/profiler/lid')}
          accessibilityRole="button"
          accessibilityLabel="The Lid — your subjective assessment of the subject"
          hitSlop={4}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // Fixed-aspect container (not a screen-filling "cover") so the two hotspots
  // below always land exactly on their card art regardless of device aspect
  // ratio — a "cover" fill would crop by a different amount per device and
  // drift the touch targets off the visible cards. Anchored to the top; any
  // leftover space below (taller screens than this image's ratio) is just
  // Screen's own near-black background, which already matches the art's edge
  // tone closely enough to be invisible.
  bgBox: {
    width: '100%',
    aspectRatio: BG_W / BG_H,
    position: 'relative',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  dnaHotspot: {
    position: 'absolute',
    top: '61.33%',
    left: '8.79%',
    width: '82.65%',
    height: '11.21%',
  },
  lidHotspot: {
    position: 'absolute',
    top: '74.39%',
    left: '8.79%',
    width: '82.65%',
    height: '11.16%',
  },
});
