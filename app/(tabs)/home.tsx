// HOME — Case Overview (HOME_APPROVED_TECH_SPEC.md). Reuses the existing summary
// engine and Activity data; only the visual language and copy changed. Dynamic
// stats/status/quote are code-driven — never baked into the background image.
//
// Visual language matches the approved mockup as closely as the delivered
// assets allow: profile_frame.png / tape_piece.png / stamp_confidential.png
// were extracted (checkerboard-key, same technique as the original glyph
// alpha fix) from the mockup's own asset-legend composite — real artwork,
// not a code-drawn approximation.

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
  const microStatus = useMemo(() => caseStatus(), []);
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
        style={[StyleSheet.absoluteFill, styles.backgroundImage]}
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
        <Image
          source={require('../../assets/noir/home/stamp_confidential.png')}
          style={styles.confidentialStamp}
          resizeMode="contain"
        />

        <View style={styles.profileWrap}>
          <View style={styles.profileInner}>
            {caseMeta.profilePhotoUri ? (
              <Image source={{ uri: caseMeta.profilePhotoUri }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons name="person-outline" size={40} color={colors.textFaint} />
              </View>
            )}
          </View>
          <Image
            source={require('../../assets/noir/home/profile_frame.png')}
            style={styles.profileFrameArt}
            resizeMode="stretch"
          />
          <Image
            source={require('../../assets/noir/home/tape_piece.png')}
            style={styles.tapeAccent}
            resizeMode="contain"
          />
          <Text style={styles.aliasText}>{caseMeta.alias}</Text>
        </View>

        <Text style={styles.statusLabel}>STATUS</Text>
        <View style={styles.statusHeadRow}>
          <Text style={styles.statusFixed}>UNDER OBSERVATION</Text>
          <View style={styles.statusDot} />
        </View>
        <View style={styles.statusNote}>
          <Text style={styles.statusNoteText} numberOfLines={2}>
            {microStatus}
          </Text>
        </View>

        <Pressable style={styles.contactRow} onPress={() => router.push('/settings')}>
          <Ionicons name="calendar-outline" size={14} color={colors.textFaint} />
          <Text style={styles.contactLabel}>FIRST CONTACT</Text>
          <Text style={styles.contactValue}>{caseMeta.firstContactDate}</Text>
        </Pressable>

        <View style={styles.sectionTag}>
          <Text style={styles.sectionTagText}>CASE OVERVIEW</Text>
        </View>
        <View style={styles.statsRow}>
          {statDefs.map((s) => (
            <View style={styles.statItem} key={s.label}>
              <Ionicons name={s.icon} size={16} color={colors.gold} style={{ marginBottom: 6 }} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.quoteBox}>
          <Text style={styles.quoteMark}>{'“'}</Text>
          <Text style={styles.quoteText}>{quote}</Text>
          <Text style={styles.quoteSignature}>— Z.</Text>
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
  // `StyleSheet.absoluteFill` alone isn't enough on React Native Web — the
  // image's intrinsic size wins over the absolute-position stretch without an
  // explicit 100%/100% too (reproduced bug, see app/index.tsx for detail).
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  scrim: {
    backgroundColor: 'rgba(12, 10, 8, 0.74)',
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
    width: 84,
    height: 50,
    marginTop: spacing.xs,
    marginRight: -spacing.xs,
  },
  profileWrap: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  profileInner: {
    width: 118,
    height: 118,
    marginTop: 10,
    marginBottom: 10,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: radius.sm,
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  // The frame art sits ON TOP of the photo, slightly oversized, so its torn/
  // taped border overlaps the photo edges instead of leaving a gap.
  profileFrameArt: {
    position: 'absolute',
    top: 0,
    width: 148,
    height: 138,
  },
  tapeAccent: {
    position: 'absolute',
    top: -14,
    right: 12,
    width: 40,
    height: 28,
    transform: [{ rotate: '18deg' }],
    opacity: 0.9,
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
  statusHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
  },
  statusFixed: {
    color: colors.red,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.red,
  },
  statusNote: {
    marginTop: spacing.xs,
    backgroundColor: colors.paper,
    borderRadius: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    maxWidth: '90%',
    transform: [{ rotate: '-0.6deg' }],
  },
  statusNoteText: {
    color: colors.textOnPaper,
    fontSize: 11,
    lineHeight: 15,
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
  sectionTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.paper,
    borderRadius: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    transform: [{ rotate: '-0.8deg' }],
  },
  sectionTagText: {
    ...typography.caption,
    color: colors.textOnPaper,
    letterSpacing: 1.5,
    fontWeight: '700',
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
    backgroundColor: colors.paper,
    borderRadius: 4,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  quoteMark: {
    color: colors.paperDark,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: -4,
  },
  quoteText: {
    color: colors.textOnPaper,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  quoteSignature: {
    color: colors.red,
    fontSize: 13,
    fontWeight: '700',
    alignSelf: 'flex-end',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
