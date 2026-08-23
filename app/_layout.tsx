import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RelationshipProvider } from '@/store/RelationshipStore';
import { colors } from '@/theme/tokens';

// Appka jest projektowana pod szerokość telefonu. Na web (podgląd w przeglądarce
// na komputerze) okno bywa dużo szersze niż telefon — bez tego ograniczenia
// siatki (np. Kalendarz) rozciągają się na całą szerokość okna, komórki robią
// się nienaturalnie duże, a elementy zależne od pozostałej wysokości ekranu
// (np. panel podglądu dnia) mogą wypaść poza widoczny obszar. Na prawdziwym
// telefonie szerokość ekranu i tak jest mniejsza niż PHONE_MAX_WIDTH, więc to
// ograniczenie tam nic nie zmienia.
const PHONE_MAX_WIDTH = 430;

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <RelationshipProvider>
          <StatusBar style="light" />
          <View style={styles.root}>
            <View style={styles.phoneFrame}>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.background },
                  animation: 'fade',
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="day/[date]" />
                <Stack.Screen name="add-activity" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
                <Stack.Screen name="settings/index" />
                <Stack.Screen name="settings/archive" />
                <Stack.Screen name="settings/about" />
              </Stack>
            </View>
          </View>
        </RelationshipProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    maxWidth: PHONE_MAX_WIDTH,
    ...Platform.select({
      web: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: colors.border,
      },
      default: {},
    }),
  },
});
