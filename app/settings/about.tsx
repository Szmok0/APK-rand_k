// O APLIKACJI — sekcja 11 MD.

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header, Screen } from '@/components/ui';
import { colors, spacing, typography } from '@/theme/tokens';

export default function AboutScreen() {
  return (
    <Screen>
      <Header title="O APLIKACJI" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.appName}>Zu'z Diary</Text>
        <Text style={styles.version}>Wersja 1.0.0 (MVP v2)</Text>

        <View style={styles.block}>
          <Text style={styles.text}>
            Spersonalizowany, jednorazowy kalendarz relacyjny. Zapisuje wydarzenia jako
            glify, a z tych samych danych buduje galaktykę Relationship DNA, Timeline
            i klasyczny Kalendarz.
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>Prywatność</Text>
          <Text style={styles.text}>
            Aplikacja działa w pełni lokalnie — bez konta, bez logowania, bez wysyłania
            danych do internetu. Wszystkie dane trzymane są wyłącznie na tym urządzeniu.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  appName: {
    ...typography.title,
    color: colors.gold,
    fontSize: 24,
    marginTop: spacing.md,
  },
  version: {
    color: colors.textFaint,
    fontSize: 12,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  block: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.textFaint,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  text: {
    color: colors.textSecondary,
    lineHeight: 20,
    fontSize: 13,
  },
});
