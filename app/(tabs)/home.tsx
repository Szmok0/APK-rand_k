// HOME — Case Overview. Rebuilt to match the full layout map the product owner
// sent (exact positions for photo/status/stats/quote, with explicit
// placeholder markers for every piece of dynamic content: dashed boxes for
// values, a blank bracket-cornered card for the rotating status note, a black
// rectangle for the photo). Dashed-border "data readout" boxes are kept as a
// real, permanent style for dynamic values (not just a wireframe annotation)
// — it's a deliberate, consistently-repeated visual language in the map.
//
// Top header reuses the same cover art as the Cover screen (identical
// jungle/dino/title composition in the map) — no separate asset was needed.

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

const HEADER_HEIGHT = 190;

type StatDef = { icon: keyof typeof Ionicons.glyphMap; value: string; label: string };

// Small reusable "data readout" frame — dashed red border, used for every
// dynamic value (stat numbers, first-contact date) per the approved map.
function DataBox({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[styles.dataBox, style]}>
      <Text style={styles.dataBoxText}>{children}</Text>
    </View>
  );
}

// Thin red L-shaped corner accents on the status note card.
function CornerBrackets() {
  return (
    <>
      <View style={[styles.bracket, styles.bracketTL]} />
      <View style={[styles.bracket, styles.bracketTR]} />
      <View style={[styles.bracket, styles.bracketBL]} />
      <View style={[styles.bracket, styles.bracketBR]} />
    </>
  );
}

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
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/noir/home/header_banner.jpg')}
            style={[StyleSheet.absoluteFill, styles.headerImage]}
            resizeMode="contain"
          />
          <LinearGradient
            colors={['transparent', colors.background]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <Pressable
            style={[styles.settingsBtn, { top: insets.top + spacing.xs }]}
            onPress={() => router.push('/settings')}
            hitSlop={12}
          >
            <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.topSection}>
            {/* Photo stack */}
            <View style={styles.photoCol}>
              <View style={[styles.photoBacking, { transform: [{ rotate: '-6deg' }] }]} />
              <View style={[styles.photoBacking, { transform: [{ rotate: '4deg' }] }]} />
              <View style={styles.photoStack}>
                {caseMeta.profilePhotoUri ? (
                  <Image source={{ uri: caseMeta.profilePhotoUri }} style={styles.photo} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="person-outline" size={36} color={colors.textFaint} />
                  </View>
                )}
                <Image
                  source={require('../../assets/noir/home/profile_frame.png')}
                  style={styles.frameArt}
                  resizeMode="stretch"
                />
                <Text style={styles.aliasCaption}>{caseMeta.alias}</Text>
              </View>
              <Image
                source={require('../../assets/noir/home/paperclip.png')}
                style={styles.paperclipTop}
                resizeMode="contain"
              />
              <Image
                source={require('../../assets/noir/home/paperclip.png')}
                style={styles.paperclipBottom}
                resizeMode="contain"
              />
            </View>

            {/* Status + first contact */}
            <View style={styles.statusCol}>
              <Text style={styles.statusLabel}>STATUS</Text>
              <View style={styles.statusHeadRow}>
                <Text style={styles.statusFixed}>UNDER OBSERVATION</Text>
                <View style={styles.statusDot} />
              </View>

              <View style={styles.noteCard}>
                <CornerBrackets />
                <Text style={styles.noteCardText} numberOfLines={4}>
                  {microStatus}
                </Text>
              </View>

              <View style={styles.contactCard}>
                <View style={styles.contactHeadRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textPrimary} />
                  <Text style={styles.contactLabel}>FIRST CONTACT</Text>
                </View>
                <DataBox style={styles.contactValueBox}>{caseMeta.firstContactDate}</DataBox>
              </View>
            </View>
          </View>

          <View style={styles.sectionTag}>
            <Text style={styles.sectionTagText}>CASE OVERVIEW</Text>
          </View>

          <View style={styles.statsRow}>
            {statDefs.map((s) => (
              <View style={styles.statCard} key={s.label}>
                <View style={styles.statCorner} />
                <Ionicons name={s.icon} size={20} color={colors.textPrimary} style={{ marginBottom: spacing.sm }} />
                <DataBox style={styles.statValueBox}>{s.value}</DataBox>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.quoteBox}>
            <View style={styles.quotePin} />
            <Image
              source={require('../../assets/noir/home/paperclip.png')}
              style={styles.paperclipQuote}
              resizeMode="contain"
            />
            <Text style={styles.quoteMark}>{'“'}</Text>
            <Text style={styles.quoteText}>{quote}</Text>
            <Text style={styles.quoteSignature}>— Z.</Text>
          </View>

          <GoldButton
            label="+ Add Activity"
            onPress={() => router.push('/add-activity')}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  settingsBtn: {
    position: 'absolute',
    right: spacing.lg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xl,
  },
  topSection: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  photoCol: {
    flex: 0.85,
    alignItems: 'center',
  },
  photoBacking: {
    position: 'absolute',
    top: 6,
    width: '84%',
    height: '90%',
    backgroundColor: colors.paperDark,
    borderRadius: 4,
  },
  photoStack: {
    width: '84%',
    aspectRatio: 0.82,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: radius.sm,
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  frameArt: {
    position: 'absolute',
    top: -8,
    left: '-8%',
    width: '116%',
    height: '112%',
  },
  aliasCaption: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    textAlign: 'center',
    ...typography.heading,
    color: colors.textOnPaper,
  },
  paperclipTop: {
    position: 'absolute',
    top: -14,
    left: 6,
    width: 34,
    height: 34,
    transform: [{ rotate: '-18deg' }],
  },
  paperclipBottom: {
    position: 'absolute',
    bottom: 34,
    left: -6,
    width: 30,
    height: 30,
    transform: [{ rotate: '96deg' }],
    opacity: 0.9,
  },
  statusCol: {
    flex: 1,
    paddingTop: 6,
  },
  statusLabel: {
    ...typography.caption,
    color: colors.textFaint,
    letterSpacing: 1.5,
  },
  statusHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  statusFixed: {
    color: colors.red,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.red,
  },
  noteCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    minHeight: 66,
    justifyContent: 'center',
  },
  noteCardText: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  bracket: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderColor: colors.red,
  },
  bracketTL: { top: 4, left: 4, borderTopWidth: 1.5, borderLeftWidth: 1.5 },
  bracketTR: { top: 4, right: 4, borderTopWidth: 1.5, borderRightWidth: 1.5 },
  bracketBL: { bottom: 4, left: 4, borderBottomWidth: 1.5, borderLeftWidth: 1.5 },
  bracketBR: { bottom: 4, right: 4, borderBottomWidth: 1.5, borderRightWidth: 1.5 },
  contactCard: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  contactHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  contactLabel: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  contactValueBox: {
    alignSelf: 'stretch',
  },
  dataBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.red,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  dataBoxText: {
    ...typography.stat,
    fontSize: 14,
    color: colors.textPrimary,
  },
  sectionTag: {
    alignSelf: 'center',
    backgroundColor: colors.paper,
    borderRadius: 3,
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    transform: [{ rotate: '-0.6deg' }],
  },
  sectionTagText: {
    ...typography.heading,
    color: colors.textOnPaper,
    letterSpacing: 1.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
    alignItems: 'center',
    overflow: 'hidden',
  },
  statCorner: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 14,
    height: 14,
    backgroundColor: colors.red,
    transform: [{ rotate: '45deg' }],
  },
  statValueBox: {
    width: 40,
    height: 30,
    marginBottom: 6,
  },
  statLabel: {
    ...typography.caption,
    fontSize: 8.5,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quoteBox: {
    backgroundColor: colors.paper,
    borderRadius: 4,
    padding: spacing.md,
    paddingTop: spacing.lg,
    marginTop: spacing.lg,
  },
  quotePin: {
    position: 'absolute',
    top: 8,
    left: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.red,
    opacity: 0.8,
  },
  paperclipQuote: {
    position: 'absolute',
    top: -10,
    right: 16,
    width: 30,
    height: 30,
    transform: [{ rotate: '8deg' }],
  },
  quoteMark: {
    color: colors.paperDark,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: -2,
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
