// app/_layout.tsx

import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ThemeProvider, useTheme } from '../context/ThemeContext'; // 1. Import ThemeProvider and useTheme

// Create a new component that can consume the theme context
function ThemedRootLayout() {
  const { colors } = useTheme(); // 2. Get the dynamic colors from the context

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface, // 3. Use dynamic colors
        },
        headerTintColor: colors.text, // 4. Use dynamic colors
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="collections/index" options={{ title: 'Puzzle Collections' }} />
      <Stack.Screen name="puzzle/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    // 5. Wrap the entire app with the ThemeProvider
    <ThemeProvider>
      <SafeAreaProvider>
        <ErrorBoundary>
          <ThemedRootLayout />
        </ErrorBoundary>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}