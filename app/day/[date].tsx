// DAY DETAIL route — deep-link target (e.g. from Evidence Archive). In Calendar
// the same content is embedded inline via DayDetailPanel, no navigation needed.

import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { DayDetailPanel } from '@/components/DayDetailPanel';
import { Header, Screen } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { dateLabelUpper, fromDateKey } from '@/utils/dates';

function formatDate(dateKey: string) {
  const d = fromDateKey(dateKey);
  return `${dateLabelUpper(dateKey)}, ${d.getFullYear()}`;
}

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();

  return (
    <Screen>
      <Header title={`CASE FILE — ${formatDate(date)}`} />
      <ScrollView contentContainerStyle={styles.content}>
        <DayDetailPanel date={date} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
