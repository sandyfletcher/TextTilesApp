// components/Puzzle/GameHeader.tsx

import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import IconButton from './IconButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deletePuzzleProgress } from '../../services/PuzzleStorageService';
import { useTheme } from '../../context/ThemeContext';

interface GameHeaderProps {
  title: string;
  puzzleId: string;
  onCheckPuzzle: () => void;
  onReset?: () => void;
}

export default function GameHeader({ title, puzzleId, onCheckPuzzle, onReset }: GameHeaderProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleReset = () => {
    Alert.alert(
      "Reset Puzzle",
      "Are you sure you want to clear all progress and start over?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePuzzleProgress(puzzleId);
              if (onReset) {
                onReset();
              } else {
                router.back();
              }
            } catch (error: any) {
              console.error("Failed to reset puzzle progress:", error);
              Alert.alert("Error", `Failed to reset puzzle progress. ${error.message || ''}`);
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      paddingBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 10,
      color: colors.text,
    },
    rightIcons: {
      flexDirection: 'row',
    },
  });
  
  const containerStyle = [
    styles.container,
    { paddingTop: insets.top > 0 ? insets.top : 10 },
  ];

  return (
    <View style={containerStyle}>
      <IconButton iconName="arrow-left" onPress={() => router.back()} accessibilityLabel="Go back" />
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.rightIcons}>
        <IconButton iconName="rotate-ccw" onPress={handleReset} accessibilityLabel="Reset puzzle" />
        <IconButton iconName="check-square" onPress={onCheckPuzzle} accessibilityLabel="Check puzzle answers" />
        <IconButton iconName="settings" onPress={() => router.push('/settings')} accessibilityLabel="Open settings" />
      </View>
    </View>
  );
}