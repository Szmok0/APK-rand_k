// DAY DETAIL jako route — od v4 używany wyłącznie przez Timeline ("tap → detail",
// sekcja 22). W Kalendarzu ten sam widok jest osadzony inline (sekcja 9 MD v6) przez
// DayDetailPanel, bez nawigacji na osobny ekran.

import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { DayDetailPanel } from '@/components/DayDetailPanel';
import { Header, Screen } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { fromDateKey } from '@/utils/dates';

const MONTHS_GENITIVE = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
];

function formatDate(dateKey: string) {
  const d = fromDateKey(dateKey);
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS_GENITIVE[d.getMonth()]} ${d.getFullYear()}`;
}

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();

  return (
    <Screen>
      <Header title={formatDate(date).toUpperCase()} />
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
