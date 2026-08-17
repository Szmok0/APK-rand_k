// EKRAN SPLASH — sekcja 3 MD. Statyczny, spersonalizowany, bez PIN-u, bez timera.
// Motyw dinozaura występuje WYŁĄCZNIE tutaj — reszta appki zostaje w 100% zgodna
// z mockupem (bez dinozaurów w tle). Grafika (dino + tytuł "Zu'z Diary") jest
// gotowym assetem dostarczonym przez klienta — jeden statyczny plik, bez
// żadnego silnika wizualizacji.

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { GoldButton } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* "contain", nie "cover": grafika ma wpisany tytuł u góry (proporcje 2:3) —
          na typowych, węższych proporcjach telefonu "cover" ucinałby napis
          w poziomie. "contain" gwarantuje, że cały kadr (tytuł + dino) zawsze
          mieści się w ekranie, z niewidocznym dopełnieniem (tło obrazu jest
          czarne, praktycznie identyczne z tłem appki). */}
      <Image
        source={require('../assets/splash-dino.jpg')}
        style={[StyleSheet.absoluteFill, styles.artwork]}
        resizeMode="contain"
      />

      <LinearGradient
        colors={['transparent', 'rgba(5,4,10,0.85)']}
        style={styles.fade}
        pointerEvents="none"
      />

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
  },
  artwork: {
    // Zapasowa jawna szerokość/wysokość — samo `absoluteFill` (top/left/right/
    // bottom: 0) potrafi nie wystarczyć do rozciągnięcia obrazu na web, jeśli
    // statyczny asset niesie własne wymiary intrinsic.
    width: '100%',
    height: '100%',
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '35%',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
});
