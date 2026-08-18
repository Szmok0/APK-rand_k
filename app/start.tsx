// EKRAN START — "Zu'z Diary" (sekcja 4/5 MD v6). Galaktyka DNA jest teraz statycznym
// obrazem (v5) — Emotional Tone Layer (dynamiczne podświetlenie) odłożone (sekcja 6).
// Layout wypełnia całą wysokość ekranu (poprawka v4) — bez ScrollView, bez pustej
// przestrzeni pod przyciskami.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatRow } from '@/components/StatRow';
import { GoldButton, OutlineButton, Screen } from '@/components/ui';
import { dailyQuote } from '@/engine/quote';
import { computeSummary } from '@/engine/summary';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, spacing, typography } from '@/theme/tokens';

export default function StartScreen() {
  const { activities, loading } = useRelationship();
  const insets = useSafeAreaInsets();
  const summary = useMemo(() => computeSummary(activities), [activities]);
  const quote = useMemo(() => dailyQuote(), []);

  if (loading) return <Screen />;

  return (
    <Screen>
      <View style={[styles.content, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.header}>
          <View style={{ width: 32 }} />
          <Text style={styles.title}>Zu'z Diary</Text>
          <Pressable hitSlop={12} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Galaktyka DNA — statyczny obraz (v5), największy elastyczny element,
            wypełnia miejsce pozostałe po reszcie treści (poprawka v4). */}
        <View style={styles.galaxyWrap}>
          <Image
            source={require('../assets/dna_background.png')}
            style={styles.galaxyImage}
            resizeMode="contain"
          />
        </View>

        <StatRow summary={summary} />

        <View style={styles.quoteBox}>
          <Text style={styles.quote}>{quote}</Text>
        </View>

        <View style={styles.ctaRow}>
          <OutlineButton label="Kalendarz" icon="calendar-outline" onPress={() => router.push('/calendar')} style={{ flex: 1 }} />
          <OutlineButton label="Timeline" icon="analytics-outline" onPress={() => router.push('/timeline')} style={{ flex: 1 }} />
        </View>
        <GoldButton
          label="+ Dodaj Aktywność"
          onPress={() => router.push('/add-activity')}
          style={styles.mainCta}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  galaxyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
  },
  galaxyImage: {
    width: '100%',
    height: '100%',
  },
  quoteBox: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  quote: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  mainCta: {
    marginTop: spacing.xs,
  },
});
