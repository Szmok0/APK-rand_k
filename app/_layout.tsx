import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RelationshipProvider } from '@/store/RelationshipStore';
import { colors } from '@/theme/tokens';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <RelationshipProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="start" />
            <Stack.Screen name="calendar" />
            <Stack.Screen name="timeline" />
            <Stack.Screen name="day/[date]" />
            <Stack.Screen name="add-activity" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="settings/index" />
            <Stack.Screen name="settings/archive" />
            <Stack.Screen name="settings/about" />
          </Stack>
        </RelationshipProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
