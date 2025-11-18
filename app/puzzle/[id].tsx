// app/puzzle/[id].tsx

import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useCallback } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { usePuzzleState } from '../../hooks/usePuzzleState';
import { usePuzzleData } from '../../hooks/usePuzzleData';
import PuzzleWebLayout from '../../components/Puzzle/layouts/PuzzleWebLayout';
import PuzzleLandscapeLayout from '../../components/Puzzle/layouts/PuzzleLandscapeLayout';
import PuzzlePortraitLayout from '../../components/Puzzle/layouts/PuzzlePortraitLayout';
import { useTheme } from '../../context/ThemeContext';

export default function PuzzleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const { puzzle, isLoading, error } = usePuzzleData(id);
  const gameState = usePuzzleState(puzzle);
  const { handleKeyPress, checkPuzzle, isChecking } = gameState; 
  
  const handleCheckPuzzle = useCallback(() => {
    if (isChecking) return;
    const isCorrect = checkPuzzle();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (isCorrect) {
          Alert.alert("Congratulations!", "You have successfully completed the puzzle!");
        } else {
          Alert.alert("Keep Going!", "Correct answers are shown in bold. Incorrect answers are faded.");
        }
      });
    });
  }, [checkPuzzle, isChecking]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    
    const onKeyDown = (e: KeyboardEvent) => {
      // 1. Allow standard system shortcuts
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      if (e.key.length > 1 && !['Backspace', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
        // Allow F-keys, Enter, Escape, etc. unless strictly handled
        return;
      }

      // 2. Prevent default behavior for game keys to stop scrolling/focus change
      // Spacebar often scrolls down, Arrows scroll, Tab changes focus.
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Backspace', ' '].includes(e.key)) {
        e.preventDefault();
      }

      // 3. Pass to game engine
      handleKeyPress(e.key, { shift: e.shiftKey });
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKeyPress]);

  const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    errorText: { color: colors.error },
  });

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }
  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }
  if (!puzzle || gameState.userGrid.length === 0) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  const isWeb = Platform.OS === 'web';
  const isPortrait = height > width;

  if (isWeb && width > 950) {
    return <PuzzleWebLayout puzzle={puzzle} gameState={gameState} onCheckPuzzle={handleCheckPuzzle} onReset={gameState.resetPuzzle} />;
  }
  if (!isPortrait) {
    return <PuzzleLandscapeLayout puzzle={puzzle} gameState={gameState} onCheckPuzzle={handleCheckPuzzle} onReset={gameState.resetPuzzle} />;
  }
  return <PuzzlePortraitLayout puzzle={puzzle} gameState={gameState} onCheckPuzzle={handleCheckPuzzle} onReset={gameState.resetPuzzle} />;
}