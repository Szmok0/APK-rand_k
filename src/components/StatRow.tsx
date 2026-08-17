import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Summary } from '@/engine/summary';
import { colors, spacing, typography } from '@/theme/tokens';

type Stat = { icon: keyof typeof Ionicons.glyphMap; value: string; label: string };

// Wiersz statystyk pod galaktyką — sekcja 5 MD: 127h / 14 spotkań / 486 wiadomości /
// 5 prezentów / 23 ważne chwile.
export function StatRow({ summary }: { summary: Summary }) {
  const stats: Stat[] = [
    { icon: 'time-outline', value: `${summary.totalHours}h`, label: 'razem' },
    { icon: 'cafe-outline', value: String(summary.meetingCount), label: 'spotkań' },
    { icon: 'chatbubble-outline', value: String(summary.messageCount), label: 'wiadomości' },
    { icon: 'gift-outline', value: String(summary.giftCount), label: 'prezentów' },
    { icon: 'heart-outline', value: String(summary.importantCount), label: 'ważne chwile' },
  ];

  return (
    <View style={styles.row}>
      {stats.map((s) => (
        <View style={styles.item} key={s.label}>
          <Ionicons name={s.icon} size={16} color={colors.gold} style={{ marginBottom: 4 }} />
          <Text style={styles.value}>{s.value}</Text>
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    ...typography.stat,
    fontSize: 16,
    color: colors.textPrimary,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
});
