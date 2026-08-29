// THE LID PREVIEW — placeholder. This is where THE LID's 9 slider values
// resolve into PRIMARY TYPE / SECONDARY TRAIT / THREAT LEVEL / FIELD NOTE +
// an archetype illustration (Profiler concept doc section 6). The archetype
// mapping and the illustration assets are both explicitly still open
// (section 14: "Lista archetypów i ilustracji", "Mapowanie suwaków →
// archetyp") — per the THE LID slider spec's own instruction not to invent
// a scoring system here, this stays a real, honest placeholder until that
// design work lands, not a stand-in for the actual preview.

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Header, Screen } from '@/components/ui';
import { colors, spacing, typography } from '@/theme/tokens';

export default function TheLidPreviewScreen() {
  return (
    <Screen>
      <Header title="THE LID PREVIEW" />
      <View style={styles.content}>
        <Ionicons name="help-circle-outline" size={40} color={colors.textFaint} />
        <Text style={styles.title}>No archetype assigned yet.</Text>
        <Text style={styles.subtitle}>
          This will turn THE LID's 9 ratings into a PRIMARY TYPE, a SECONDARY
          TRAIT, a THREAT LEVEL and a FIELD NOTE, with an illustration matching
          the result. The archetype list, the mapping from sliders to
          archetype, and the illustration assets are still being designed —
          nothing here is invented in the meantime.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    ...typography.heading,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textFaint,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
