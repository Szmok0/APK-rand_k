// EVIDENCE ARCHIVE — automatic archive of every recorded Activity, exactly as
// CASE_LOG_MASTER section 9 describes: no second database, no manual "add
// evidence" flow. Filters/sort/search are pure functions over the same
// Activity[] the rest of the app already uses (src/engine/evidence.ts).
//
// Visual pass rebuilt against the product owner's reference screen + asset
// pack (Aug 2026) — real background (room_bg.jpg), a CONFIDENTIAL stamp,
// and the 4 category icons (folder/photo/note/star) — with several
// adaptations flagged where the reference conflicted with product rules:
//
// - The reference's "section_header.png"/"search_bar.png" assets have Polish
//   text baked into the pixels ("PODSUMOWANIE", "Wyszukaj dowody...") —
//   AGENTS.md: "whole app is in English". Skipped those two image assets;
//   recreated the same torn-paper-tag / bordered-bar SHAPE in code with
//   English copy instead.
// - The reference's 4 summary stats are DOCUMENTS/PHOTOS/RECORDINGS/NOTES —
//   but Activity has no "document" or "voice recording" concept at all.
//   Substituted real derivable counts that keep the icon set: total EXHIBITS
//   (folder), WITH PHOTO (camera), WITH NOTES (note), and FAVORITES (star) —
//   the last one a real, newly-persisted field (see toggleFavorite below),
//   not a fake toggle.
// - The reference's "+ DODAJ NOWY DOWÓD" button reads as a standalone
//   add-evidence flow — AGENTS.md: "do not add a standalone 'add evidence'
//   flow", Evidence stays a derived view. Wired to /add-activity instead,
//   same as every other "+" in this app.
// - The reference's bottom nav shows 5 elements (4 tabs + a center FAB) —
//   conflicts with the established 4-tab/no-FAB bottom bar. Left the shared
//   tab bar in app/(tabs)/_layout.tsx completely untouched.
// - The reference's per-card ⭐ toggle is implemented as a real, persisted
//   `favorite` field on Activity (RelationshipStore.toggleFavorite), not a
//   fake screen-local checkbox.
// - The reference's search bar is a real feature here too: a plain substring
//   filter over note text + incident-type names (no fabricated data needed).
//
// Card redesign (real-usage feedback, second pass): the parchment "dossier
// card" list frame read as visually disconnected from the rest of the
// app's pure-dark chrome — rebuilt per the product owner's own dark
// concept mockup. A stable per-glyph "type photo" does the visual work now
// (thumbnailFor() below, src/data/evidencePhotos.ts — 29 real photos
// covering every MEETINGS/OBJECTS glyph), falling back to an enlarged
// glyph icon for glyph types a literal photo doesn't suit (Contact/Dating/
// Emotion). The user's own uploaded photo is deliberately NEVER the
// thumbnail here — product owner: "an added photo should only ever
// display in the [Day Detail] frame, nowhere else" — the ×N badge still
// reflects the real count, just not which image renders.
// Headline is the primary glyph's real name (+ duration if a time window
// exists) — not an invented narrative headline; the second tag is CASE
// PRIORITY, the one thing on an Activity that isn't already shown by the
// first (badge-type) tag.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GLYPH_MAP } from '@/data/glyphs';
import { TYPE_PHOTOS } from '@/data/evidencePhotos';
import { GlyphIcon } from '@/components/GlyphIcon';
import { DAY_BADGE_COLORS, dayBadges } from '@/engine/dayBadges';
import { Screen } from '@/components/ui';
import { emptyStateFor } from '@/engine/emptyState';
import { buildEvidenceArchive, exhibitLabel, filterExhibits, sortExhibits } from '@/engine/evidence';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, priorityColors, priorityLabels, radius, spacing, typography } from '@/theme/tokens';
import type { Exhibit, ExhibitFilter } from '@/types/models';
import { dateLabelUpper, durationHours } from '@/utils/dates';

const FILTERS: ExhibitFilter[] = ['ALL', 'MEETINGS', 'MESSAGES', 'ITEMS', 'EMOTIONS', 'INCIDENTS'];

export default function EvidenceScreen() {
  const { activities, toggleFavorite } = useRelationship();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<ExhibitFilter>('ALL');
  const [query, setQuery] = useState('');

  const archive = useMemo(() => buildEvidenceArchive(activities), [activities]);

  const stats = useMemo(
    () => ({
      total: archive.length,
      withPhoto: archive.filter((e) => !!e.photoUris?.length).length,
      withNotes: archive.filter((e) => !!e.note).length,
      favorites: archive.filter((e) => !!e.favorite).length,
    }),
    [archive]
  );

  const exhibits = useMemo(() => {
    const filtered = filterExhibits(archive, filter);
    const q = query.trim().toLowerCase();
    const searched = !q
      ? filtered
      : filtered.filter((e) => {
          const names = e.glyphIds.map((id) => GLYPH_MAP[id]?.name ?? '').join(' ');
          return `${e.note ?? ''} ${names}`.toLowerCase().includes(q);
        });
    return sortExhibits(searched, 'NEWEST');
  }, [archive, filter, query]);

  // Picked once per screen visit (empty deps), not once per filter/search
  // keystroke — otherwise the line would visibly flicker while typing.
  const emptyState = useMemo(() => emptyStateFor('EVIDENCE / EMPTY'), []);

  return (
    <Screen>
      <Image
        source={require('../../assets/noir/evidence/room_bg.jpg')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.scrim]} />

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/settings')} hitSlop={12}>
            <Ionicons name="menu-outline" size={22} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>EVIDENCE ROOM</Text>
            <Text style={styles.headerSubtitle}>CASE 001</Text>
          </View>
          <View style={styles.headerSide} />
        </View>
        <Image
          source={require('../../assets/noir/evidence/confidential_stamp.png')}
          style={styles.confidentialStamp}
          resizeMode="contain"
        />

        <View style={styles.summaryTag}>
          <Text style={styles.summaryTagLabel}>SUMMARY</Text>
        </View>
        <View style={styles.statsRow}>
          <StatCard icon="icon_folder" color={colors.paper} value={stats.total} label="EXHIBITS" />
          <StatCard icon="icon_photo" color={colors.olive} value={stats.withPhoto} label="WITH PHOTO" />
          <StatCard icon="icon_note" color={colors.purple} value={stats.withNotes} label="WITH NOTES" />
          <StatCard icon="icon_star" color={colors.gold} value={stats.favorites} label="FAVORITES" />
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={colors.textFaint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search evidence..."
            placeholderTextColor={colors.textFaint}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
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

        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderLabel}>LATEST EVIDENCE</Text>
          <Text style={styles.listHeaderSub}>DATE ↓</Text>
        </View>

        {exhibits.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={32} color={colors.textFaint} />
            <Text style={styles.emptyText}>{emptyState.main}</Text>
            <Text style={styles.emptySubtext}>{emptyState.sub}</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {exhibits.map((e) => (
              <ExhibitCard key={e.id} exhibit={e} onToggleFavorite={() => toggleFavorite(e.id)} />
            ))}
          </View>
        )}

        <Pressable style={styles.addBtn} onPress={() => router.push('/add-activity')}>
          <Ionicons name="folder-outline" size={18} color={colors.gold} />
          <Text style={styles.addBtnLabel}>FILE NEW REPORT</Text>
        </Pressable>

        <View style={{ height: insets.bottom + spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const STAT_ICONS = {
  icon_folder: require('../../assets/noir/evidence/icon_folder.png'),
  icon_photo: require('../../assets/noir/evidence/icon_photo.png'),
  icon_note: require('../../assets/noir/evidence/icon_note.png'),
  icon_star: require('../../assets/noir/evidence/icon_star.png'),
};

function StatCard({
  icon,
  color,
  value,
  label,
}: {
  icon: keyof typeof STAT_ICONS;
  color: string;
  value: number;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconRow}>
        <Image source={STAT_ICONS[icon]} style={styles.statIcon} resizeMode="contain" />
        <View style={[styles.statDot, { backgroundColor: color }]} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// The user's own uploaded photo is intentionally NEVER shown here — product
// owner: "an added photo should only ever display in the [Day Detail]
// frame, nowhere else." Evidence's thumbnail is a stable per-activity-type
// visual (src/data/evidencePhotos.ts), falling back to an enlarged glyph
// icon for the categories with no type-photo (Contact/Dating/Emotion). The
// ×N badge below still reflects the real photo count — this only concerns
// which image renders as the thumbnail.
function thumbnailFor(exhibit: Exhibit): { kind: 'photo'; source: any } | { kind: 'icon'; glyphId: string } | null {
  for (const id of exhibit.glyphIds) {
    if (TYPE_PHOTOS[id]) return { kind: 'photo', source: TYPE_PHOTOS[id] };
  }
  return exhibit.glyphIds[0] ? { kind: 'icon', glyphId: exhibit.glyphIds[0] } : null;
}

function ExhibitCard({
  exhibit,
  onToggleFavorite,
}: {
  exhibit: Exhibit;
  onToggleFavorite: () => void;
}) {
  // Same 5-bucket derived classification Calendar's day ticket already uses
  // (src/engine/dayBadges.ts) — reused here as the card's category tag,
  // instead of inventing a second taxonomy for the archive.
  const badges = dayBadges(exhibit);
  const badge = badges[0];
  const thumbnail = thumbnailFor(exhibit);

  const primaryGlyphName = GLYPH_MAP[exhibit.glyphIds[0]]?.name?.toUpperCase() ?? 'UNTITLED ENTRY';
  const hours = exhibit.startTime && exhibit.endTime ? durationHours(exhibit.startTime, exhibit.endTime) : 0;
  const headline = hours > 0 ? `${primaryGlyphName} · ${hours}H` : primaryGlyphName;

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push({ pathname: '/day/[date]', params: { date: exhibit.date } })}
    >
      <View style={styles.thumbnailWrap}>
        {thumbnail?.kind === 'photo' ? (
          <Image source={thumbnail.source} style={styles.thumbnailImage} resizeMode="cover" />
        ) : thumbnail?.kind === 'icon' ? (
          <View style={styles.thumbnailIconWrap}>
            <GlyphIcon glyphId={thumbnail.glyphId} style={styles.thumbnailIcon} />
          </View>
        ) : (
          <View style={styles.thumbnailIconWrap}>
            <Ionicons name="folder-outline" size={28} color={colors.textFaint} />
          </View>
        )}
        {/* Was dropped during the redesign, restored per real-usage report:
            with no count visible here, "did the multi-photo save actually
            work" was only checkable by opening the full Day Detail screen. */}
        {exhibit.photoUris && exhibit.photoUris.length > 1 && (
          <View style={styles.thumbnailCountBadge}>
            <Text style={styles.thumbnailCountText}>×{exhibit.photoUris.length}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.exhibitNumber}>{exhibitLabel(exhibit.number)}</Text>
          <Text style={styles.exhibitDate}>{dateLabelUpper(exhibit.date)}</Text>
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>
          {headline}
        </Text>
        {!!exhibit.note && (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {exhibit.note}
          </Text>
        )}

        <View style={styles.cardFooterRow}>
          <View style={styles.tagRow}>
            {badge && (
              <View style={[styles.tagPill, { borderColor: DAY_BADGE_COLORS[badge] }]}>
                <Text style={[styles.tagPillLabel, { color: DAY_BADGE_COLORS[badge] }]}>{badge}</Text>
              </View>
            )}
            <View style={[styles.tagPill, { borderColor: priorityColors[exhibit.importance] }]}>
              <Text style={[styles.tagPillLabel, { color: priorityColors[exhibit.importance] }]}>
                {priorityLabels[exhibit.importance]}
              </Text>
            </View>
          </View>
          <Pressable hitSlop={10} onPress={onToggleFavorite}>
            <Ionicons
              name={exhibit.favorite ? 'star' : 'star-outline'}
              size={16}
              color={exhibit.favorite ? colors.gold : colors.textFaint}
            />
          </Pressable>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color={colors.textFaint} style={styles.cardChevron} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    width: '100%',
    height: '100%',
  },
  scrim: {
    backgroundColor: 'rgba(12, 10, 8, 0.55)',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleCol: {
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textFaint,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  headerSide: {
    width: 22,
  },
  confidentialStamp: {
    position: 'absolute',
    top: 4,
    right: 0,
    width: 100,
    height: 42,
    transform: [{ rotate: '6deg' }],
  },
  // Recreated in code (not the reference's section_header.png, which has
  // Polish text baked in) — same torn-paper-tag silhouette, English label.
  summaryTag: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.paper,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
  },
  summaryTagLabel: {
    ...typography.stamp,
    color: colors.textOnPaper,
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  statIconRow: {
    position: 'relative',
  },
  statIcon: {
    width: 26,
    height: 26,
  },
  statDot: {
    position: 'absolute',
    top: -1,
    right: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statValue: {
    ...typography.stat,
    color: colors.textPrimary,
    fontSize: 18,
  },
  statLabel: {
    fontSize: 8,
    letterSpacing: 0.5,
    color: colors.textFaint,
  },
  // Recreated in code (not the reference's search_bar.png, Polish placeholder).
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginTop: spacing.lg,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    padding: 0,
  },
  filterRow: {
    gap: spacing.xs,
    paddingVertical: spacing.sm,
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
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  listHeaderLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    letterSpacing: 1,
    fontSize: 11,
  },
  listHeaderSub: {
    color: colors.textFaint,
    fontSize: 11,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.xxl,
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
    gap: spacing.md,
  },
  // Was a parchment "dossier card" image frame (dossier_card.png) — real-
  // usage feedback: it read as visually disconnected from the rest of the
  // app's pure-dark chrome. Rebuilt as a plain dark card matching every
  // other surface in the app (statCard/searchBar above), with a real photo
  // thumbnail doing the work the paper texture used to.
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 100,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  thumbnailWrap: {
    width: 72,
    height: 92,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailIconWrap: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailIcon: {
    width: '60%',
    height: '60%',
  },
  thumbnailCountBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    backgroundColor: 'rgba(12, 10, 8, 0.75)',
    borderRadius: radius.sm,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  thumbnailCountText: {
    color: colors.textPrimary,
    fontSize: 9,
    fontWeight: '700',
  },
  cardContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  exhibitNumber: {
    ...typography.stamp,
    color: colors.red,
    fontSize: 11,
    letterSpacing: 1,
  },
  cardTitle: {
    ...typography.stamp,
    color: colors.textPrimary,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  cardDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  tagRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  exhibitDate: {
    color: colors.textFaint,
    fontSize: 10,
  },
  tagPill: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagPillLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardChevron: {
    marginLeft: spacing.xs,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: colors.goldSoft,
    borderRadius: radius.md,
    paddingVertical: 14,
    marginTop: spacing.lg,
  },
  addBtnLabel: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
