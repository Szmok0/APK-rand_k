// EKRAN START — "Zu'z Diary" (sekcja 4/5 MD). Najważniejszy ekran aplikacji:
// Relationship DNA + Emotional Tone Layer + podsumowanie + codzienny cytat + 3 CTA.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DnaGalaxy } from '@/components/DnaGalaxy';
import { StatRow } from '@/components/StatRow';
import { GoldButton, OutlineButton, Screen } from '@/components/ui';
import { dailyQuote } from '@/engine/quote';
import { computeSummary } from '@/engine/summary';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, spacing, typography } from '@/theme/tokens';

const { width } = Dimensions.get('window');
const GALAXY_SIZE = Math.min(width - spacing.lg * 2, 340);

export default function StartScreen() {
  const { activities, loading } = useRelationship();
  const summary = useMemo(() => computeSummary(activities), [activities]);
  const quote = useMemo(() => dailyQuote(), []);

  if (loading) return <Screen />;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ width: 32 }} />
          <Text style={styles.title}>Zu'z Diary</Text>
          <Pressable hitSlop={12} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>

        <View style={styles.galaxyWrap}>
          <DnaGalaxy activities={activities} size={GALAXY_SIZE} />
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
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  quoteBox: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
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
