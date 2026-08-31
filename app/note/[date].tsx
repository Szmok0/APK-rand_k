// NOTE — a dedicated, full-screen editor for a single day's REPORT text.
// Notes are the actual point of this app (it's a diary), so they get their
// own screen instead of being squeezed into a small scrollable box inside
// Calendar's inline panel or Day Detail's REPORT card — both of those used a
// ScrollView nested inside another ScrollView, which never registered
// scroll gestures on a real Android device (the outer scroll always won).
// Tapping the REPORT area in either place navigates here instead.

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui';
import { emptyStateFor } from '@/engine/emptyState';
import { NOTE_MAX_LENGTH } from '@/engine/notes';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, spacing, typography } from '@/theme/tokens';
import { dateBadgeLabel } from '@/utils/dates';

export default function NoteScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { getActivityByDate, upsertActivity } = useRelationship();
  const insets = useSafeAreaInsets();

  const activity = getActivityByDate(date);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(activity?.note ?? '');
  // Picked once per screen visit — was hardcoded to always show the same
  // line (id 18) even though the pool has 2 rotating options for this exact
  // empty state.
  const [emptyState] = useState(() => emptyStateFor('EVIDENCE / NO TEXT NOTE'));

  // Keep the draft in sync with the stored note whenever we're not actively
  // editing (e.g. arriving fresh, or after a save/delete resets isEditing).
  useEffect(() => {
    if (!isEditing) setDraft(activity?.note ?? '');
  }, [activity?.note, isEditing]);

  function commit(nextNote: string | undefined) {
    if (!activity) return;
    upsertActivity({
      date: activity.date,
      glyphIds: activity.glyphIds,
      startTime: activity.startTime,
      endTime: activity.endTime,
      note: nextNote,
      importance: activity.importance,
      photoUris: activity.photoUris,
    });
  }

  function handleSave() {
    commit(draft.trim() || undefined);
    setIsEditing(false);
  }

  function handleDelete() {
    Alert.alert('Clear this report?', 'The written statement will be removed. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          commit(undefined);
          setIsEditing(false);
        },
      },
    ]);
  }

  return (
    <Screen>
      <Image
        source={require('../../assets/noir/note/bg.jpg')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name={isEditing ? 'close' : 'chevron-back'} size={22} color={colors.textOnPaper} />
        </Pressable>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>REPORT</Text>
          <Text style={styles.headerSubtitle}>{dateBadgeLabel(date)}</Text>
        </View>
        <View style={styles.headerActions}>
          {isEditing ? (
            <Pressable onPress={handleSave} hitSlop={10}>
              <Ionicons name="checkmark" size={24} color={colors.textOnPaper} />
            </Pressable>
          ) : (
            <>
              <Pressable onPress={() => setIsEditing(true)} hitSlop={10}>
                <Ionicons name="pencil-outline" size={20} color={colors.textOnPaper} />
              </Pressable>
              <Pressable onPress={handleDelete} hitSlop={10}>
                <Ionicons name="trash-outline" size={20} color={colors.textOnPaper} />
              </Pressable>
            </>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={draft}
              onChangeText={(t) => setDraft(t.slice(0, NOTE_MAX_LENGTH))}
              placeholder="What happened? Details, context, observations, feelings..."
              placeholderTextColor="rgba(36, 29, 24, 0.45)"
              multiline
              maxLength={NOTE_MAX_LENGTH}
              autoFocus
            />
            <Text style={styles.counter}>
              {draft.length} / {NOTE_MAX_LENGTH}
            </Text>
          </>
        ) : activity?.note ? (
          <Text style={styles.noteText}>{activity.note}</Text>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{emptyState.main}</Text>
            <Pressable style={styles.addBtn} onPress={() => setIsEditing(true)}>
              <Ionicons name="pencil-outline" size={16} color={colors.textOnPaper} />
              <Text style={styles.addBtnLabel}>Write a report</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitleCol: {
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.title,
    color: colors.textOnPaper,
  },
  headerSubtitle: {
    ...typography.caption,
    color: 'rgba(36, 29, 24, 0.6)',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: 60,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  input: {
    // Was flex:1/minHeight only (unbounded growth) — at 5000 chars that
    // made the box enormous instead of scrolling. A bounded maxHeight lets
    // the native multiline TextInput scroll internally on its own, no
    // wrapping RN ScrollView needed — this file's own header comment
    // explains why that would be a real (not theoretical) risk here.
    minHeight: 200,
    maxHeight: 480,
    color: colors.textOnPaper,
    fontSize: 16,
    lineHeight: 26,
    textAlignVertical: 'top',
  },
  counter: {
    color: 'rgba(36, 29, 24, 0.55)',
    fontSize: 11,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  noteText: {
    color: colors.textOnPaper,
    fontSize: 16,
    lineHeight: 26,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  emptyText: {
    color: 'rgba(36, 29, 24, 0.6)',
    fontSize: 14,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.textOnPaper,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
  },
  addBtnLabel: {
    color: colors.textOnPaper,
    fontWeight: '700',
  },
});
