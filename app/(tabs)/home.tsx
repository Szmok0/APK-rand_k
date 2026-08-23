// HOME — Case Overview (HOME_APPROVED_TECH_SPEC.md). Reuses the existing summary
// engine and Activity data; only the visual language and copy changed. Dynamic
// stats/status/quote are code-driven — never baked into the background image.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoldButton, Screen } from '@/components/ui';
import { caseStatus } from '@/engine/caseStatus';
import { dailyQuote } from '@/engine/quote';
import { computeHomeStats } from '@/engine/summary';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';

type StatDef = { icon: keyof typeof Ionicons.glyphMap; value: string; label: string };

export default function HomeScreen() {
  const { activities, caseMeta, loading } = useRelationship();
  const insets = useSafeAreaInsets();

  const stats = useMemo(() => computeHomeStats(activities), [activities]);
  const status = useMemo(() => caseStatus(), []);
  const quote = useMemo(() => dailyQuote(), []);

  if (loading) return <Screen />;

  const statDefs: StatDef[] = [
    { icon: 'chatbubble-outline', value: String(stats.encounters + stats.dms), label: 'ACTIVITIES' },
    { icon: 'time-outline', value: `${stats.time}h`, label: 'TIME TOGETHER' },
    { icon: 'camera-outline', value: String(stats.evidence), label: 'EVIDENCE' },
    { icon: 'star-outline', value: String(stats.incidents), label: 'INCIDENTS' },
  ];

  return (
    <Screen>
      <Image
        source={require('../../assets/noir/backgrounds/desk_bg.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.scrim]} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <View style={styles.topRow}>
          <View style={styles.caseNumberBadge}>
            <Text style={styles.caseNumberText}>CASE No. {caseMeta.caseNumber}</Text>
          </View>
          <Pressable onPress={() => router.push('/settings')} hitSlop={12}>
            <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        <View style={styles.confidentialStamp}>
          <Text style={styles.confidentialText}>CONFIDENTIAL</Text>
        </View>

        <View style={styles.profileFrame}>
          {caseMeta.profilePhotoUri ? (
            <Image source={{ uri: caseMeta.profilePhotoUri }} style={styles.profilePhoto} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Ionicons name="person-outline" size={48} color={colors.textFaint} />
            </View>
          )}
          <Text style={styles.aliasText}>{caseMeta.alias}</Text>
        </View>

        <Text style={styles.statusLabel}>STATUS</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusText} numberOfLines={2}>
            {status}
          </Text>
          <View style={styles.statusDot} />
        </View>

        <Pressable style={styles.contactRow} onPress={() => router.push('/settings')}>
          <Ionicons name="calendar-outline" size={14} color={colors.textFaint} />
          <Text style={styles.contactLabel}>FIRST CONTACT</Text>
          <Text style={styles.contactValue}>{caseMeta.firstContactDate}</Text>
        </Pressable>

        <Text style={styles.sectionLabel}>CASE OVERVIEW</Text>
        <View style={styles.statsRow}>
          {statDefs.map((s) => (
            <View style={styles.statItem} key={s.label}>
              <Ionicons name={s.icon} size={16} color={colors.gold} style={{ marginBottom: 6 }} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>TODAY'S DOSSIER</Text>
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>{quote}</Text>
        </View>

        <GoldButton
          label="+ Add Activity"
          onPress={() => router.push('/add-activity')}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrim: {
    backgroundColor: 'rgba(12, 10, 8, 0.62)',
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caseNumberBadge: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  caseNumberText: {
    ...typography.stamp,
    color: colors.textPrimary,
    fontSize: 11,
  },
  confidentialStamp: {
    alignSelf: 'flex-end',
    borderWidth: 1.5,
    borderColor: colors.red,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: spacing.xs,
    transform: [{ rotate: '-4deg' }],
  },
  confidentialText: {
    ...typography.stamp,
    color: colors.red,
    fontSize: 10,
  },
  profileFrame: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  profilePhoto: {
    width: 132,
    height: 132,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.paper,
  },
  profilePlaceholder: {
    width: 132,
    height: 132,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  aliasText: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  statusLabel: {
    ...typography.caption,
    color: colors.textFaint,
    letterSpacing: 1.5,
    marginTop: spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
  },
  statusText: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 14,
    flex: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.red,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  contactLabel: {
    color: colors.textFaint,
    fontSize: 10,
    letterSpacing: 1,
  },
  contactValue: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textFaint,
    letterSpacing: 1.5,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...typography.stat,
    fontSize: 18,
    color: colors.red,
  },
  statLabel: {
    ...typography.caption,
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  quoteBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  quoteText: {
    color: colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
