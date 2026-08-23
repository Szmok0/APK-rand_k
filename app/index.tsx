// START / COVER — CASE_LOG_MASTER section 5: poster language, no loading
// animation, direct entry. Dinosaur art is the one existing approved asset that
// already matches this screen's tone (it always lived only on this splash).

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { GoldButton } from '@/components/ui';
import { colors, spacing, typography } from '@/theme/tokens';

export default function CoverScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splash-dino.jpg')}
        style={[StyleSheet.absoluteFill, styles.artwork]}
        resizeMode="contain"
      />

      <LinearGradient
        colors={['transparent', 'rgba(12,10,8,0.9)']}
        style={styles.fade}
        pointerEvents="none"
      />

      <View style={styles.footer}>
        <Text style={styles.tagline}>PSYCHOLOGICAL WARFARE{'\n'}IN THE TINDER JUNGLE</Text>
        <Text style={styles.subtagline}>Some secrets should stay extinct.</Text>
        <GoldButton label="Open Case File" onPress={() => router.replace('/(tabs)/home')} style={{ marginTop: spacing.lg }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  tagline: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
  subtagline: {
    color: colors.textFaint,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
});
