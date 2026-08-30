// START / COVER — CASE_LOG_MASTER section 5: poster language, no loading
// animation, direct entry. The approved poster art already bakes in the full
// tagline ("ZUZA — PSYCHOLOGICAL WARFARE", "SOME SECRETS SHOULD STAY EXTINCT",
// "YOUR TINDER. YOUR CASE. YOUR TRUTH.") — this screen only adds the button.

import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoldButton } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';

export default function CoverScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/noir/cover.jpg')}
        style={[StyleSheet.absoluteFill, styles.artwork]}
        resizeMode="cover"
      />

      {/* Real-device report: the button covered a bit of the poster's own
          baked tagline text. Pulled it down closer to the bottom edge
          (insets.bottom already clears the home indicator/gesture area on
          its own) rather than moving the poster art itself. */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <GoldButton label="Open the Case" onPress={() => router.replace('/(tabs)/home')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // `StyleSheet.absoluteFill` alone isn't enough on React Native Web here — the
  // image's intrinsic size otherwise wins over the absolute-position stretch,
  // so an explicit 100%/100% is required too (real, reproduced bug: without
  // this the cover art rendered zoomed/cropped instead of filling the screen).
  artwork: {
    width: '100%',
    height: '100%',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
  },
});
