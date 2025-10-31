// components/Puzzle/IconButton.tsx

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface IconButtonProps {
  iconName: keyof typeof Feather.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
}

export default function IconButton({ iconName, onPress, size = 24, color = '#333' }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Feather name={iconName} size={size} color={color} />
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