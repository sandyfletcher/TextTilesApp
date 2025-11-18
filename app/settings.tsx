// app/settings.tsx

import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext'; // 1. Import the hook
import WebContainer from '../components/Shared/WebContainer';

export default function SettingsScreen() {
  const { isDark, colors, toggleTheme } = useTheme(); // 2. Get theme state and function

  // Styles now need to be created inside the component to access `colors`
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background, // Use themed background
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border, // Use themed border
    },
    settingText: {
      fontSize: 18,
      color: colors.text, // Use themed text
    },
  });

  return (
    <WebContainer>
      <View style={styles.container}>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            onValueChange={toggleTheme} // 3. Call the function from context
            value={isDark} // 4. Set the switch state from context
          />
        </View>
      </View>
    </WebContainer>
  );
}