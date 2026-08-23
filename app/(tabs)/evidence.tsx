// EVIDENCE ARCHIVE — automatic archive of every recorded Activity, exactly as
// CASE_LOG_MASTER section 9 describes: no second database, no manual "add
// evidence" flow. Filters/sort are pure functions over the same Activity[] the
// rest of the app already uses (src/engine/evidence.ts).

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GLYPH_MAP } from '@/data/glyphs';
import { GlyphIcon } from '@/components/GlyphIcon';
import { Header, Screen } from '@/components/ui';
import { buildEvidenceArchive, exhibitLabel, filterExhibits, sortExhibits } from '@/engine/evidence';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, priorityColors, radius, spacing, typography } from '@/theme/tokens';
import type { Exhibit, ExhibitFilter } from '@/types/models';
import { dateLabelUpper } from '@/utils/dates';

const FILTERS: ExhibitFilter[] = ['ALL', 'MEETINGS', 'MESSAGES', 'ITEMS', 'EMOTIONS', 'INCIDENTS'];

export default function EvidenceScreen() {
  const { activities } = useRelationship();
  const [filter, setFilter] = useState<ExhibitFilter>('ALL');

  const exhibits = useMemo(() => {
    const all = buildEvidenceArchive(activities);
    const filtered = filterExhibits(all, filter);
    return sortExhibits(filtered, 'NEWEST');
  }, [activities, filter]);

  return (
    <Screen>
      <Header title="EVIDENCE ROOM" />

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.xs }}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterLabel, filter === f && styles.filterLabelActive]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {exhibits.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="folder-open-outline" size={32} color={colors.textFaint} />
          <Text style={styles.emptyText}>No evidence collected yet.</Text>
          <Text style={styles.emptySubtext}>Either nothing happened or nobody documented it.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {exhibits.map((e) => (
            <ExhibitCard key={e.id} exhibit={e} />
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}

function ExhibitCard({ exhibit }: { exhibit: Exhibit }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push({ pathname: '/day/[date]', params: { date: exhibit.date } })}
    >
      <Image
        source={require('../../assets/noir/evidence/evidence_card_frame.png')}
        style={[StyleSheet.absoluteFill, styles.cardFrame]}
        resizeMode="stretch"
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.exhibitNumber}>{exhibitLabel(exhibit.number)}</Text>
          <Text style={styles.exhibitDate}>{dateLabelUpper(exhibit.date)}</Text>
        </View>

        <View style={styles.glyphRow}>
          {exhibit.glyphIds.slice(0, 4).map((id) => (
            <GlyphIcon key={id} glyphId={id} size={22} />
          ))}
          <Text style={styles.glyphNames} numberOfLines={1}>
            {exhibit.glyphIds.map((id) => GLYPH_MAP[id]?.name).join(' + ')}
          </Text>
        </View>

        {exhibit.note && (
          <Text style={styles.note} numberOfLines={2}>
            {exhibit.note}
          </Text>
        )}

        <View style={styles.cardFooterRow}>
          {exhibit.photoUri && (
            <View style={styles.photoBadge}>
              <Ionicons name="camera" size={12} color={colors.textOnPaper} />
            </View>
          )}
          {exhibit.importance > 0 && (
            <View style={[styles.priorityDot, { backgroundColor: priorityColors[exhibit.importance] }]} />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // See app/index.tsx — StyleSheet.absoluteFill alone doesn't stretch an Image
  // correctly on React Native Web without an explicit 100%/100% too.
  cardFrame: {
    width: '100%',
    height: '100%',
  },
  filterRow: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  filterChipActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldSoft,
  },
  filterLabel: {
    color: colors.textFaint,
    fontSize: 10,
    letterSpacing: 1,
  },
  filterLabelActive: {
    color: colors.gold,
    fontWeight: '700',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptySubtext: {
    color: colors.textFaint,
    fontSize: 12,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  card: {
    minHeight: 118,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  cardContent: {
    padding: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  exhibitNumber: {
    ...typography.stamp,
    color: colors.textOnPaper,
    fontSize: 11,
  },
  exhibitDate: {
    color: colors.textOnPaper,
    fontSize: 11,
    opacity: 0.65,
  },
  glyphRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  glyphNames: {
    color: colors.textOnPaper,
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  note: {
    color: colors.textOnPaper,
    fontSize: 12,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  photoBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.paperDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
