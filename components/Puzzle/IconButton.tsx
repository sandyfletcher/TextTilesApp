// components/Puzzle/IconButton.tsx

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface IconButtonProps {
  iconName: keyof typeof Feather.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
}

export default function IconButton({ 
  iconName, 
  onPress, 
  size = 24, 
  color,
  accessibilityLabel 
}: IconButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || iconName}
    >
      <Feather name={iconName} size={size} color={color || colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 50,
  },
  pressed: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});