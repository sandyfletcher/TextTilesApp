// components/Puzzle/OnScreenKeyboard.tsx

import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

interface OnScreenKeyboardProps {
    onKeyPress: (key: string) => void;
}

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
];

export default function OnScreenKeyboard({ onKeyPress }: OnScreenKeyboardProps) {
  const { colors } = useTheme();

  const handlePress = (key: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onKeyPress(key);
  };
  
  const styles = StyleSheet.create({
    keyboard: {
      padding: 3,
      backgroundColor: colors.border,
      paddingBottom: 20,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 4,
    },
    key: {
      backgroundColor: colors.surface,
      paddingVertical: 10,
      marginHorizontal: 2,
      borderRadius: 5,
      flex: 1,
      minWidth: 30,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backspaceKey: {
      minWidth: 50,
      flex: 1.5,
    },
    keyText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    keyPressed: {
      backgroundColor: colors.activeCell,
    },
  });

  return (
    <View style={styles.keyboard}>
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key) => (
            <Pressable
              key={key}
              style={({ pressed }) => [
                styles.key,
                key === 'Backspace' && styles.backspaceKey,
                pressed && styles.keyPressed,
              ]}
              onPress={() => handlePress(key)}
            >
              <Text style={styles.keyText}>{key === 'Backspace' ? '⌫' : key}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};