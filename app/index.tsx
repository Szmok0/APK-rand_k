// EKRAN SPLASH — sekcja 3 MD. Statyczny, spersonalizowany, bez PIN-u, bez timera.
// Motyw dinozaura występuje WYŁĄCZNIE tutaj — reszta appki zostaje w 100% zgodna
// z mockupem (bez dinozaurów w tle).

import { router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { DinoPlaceholder } from '@/components/DinoPlaceholder';
import { Starfield } from '@/components/Starfield';
import { GoldButton } from '@/components/ui';
import { colors, spacing, typography } from '@/theme/tokens';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Starfield width={width} height={height} count={70} />

      <View style={styles.artwork}>
        <DinoPlaceholder width={width * 0.85} height={width * 0.85 * (200 / 320)} />
        <Text style={styles.greeting}>Hej Zuza</Text>
        <Text style={styles.subtitle}>coś dla Ciebie zaczyna się tutaj</Text>
      </View>

      <View style={styles.footer}>
        <GoldButton label="Przekrocz próg" onPress={() => router.replace('/start')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
  },
  artwork: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
  },
  greeting: {
    ...typography.title,
    fontSize: 30,
    color: colors.gold,
    marginTop: spacing.lg,
    letterSpacing: 4,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    letterSpacing: 1,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
});
