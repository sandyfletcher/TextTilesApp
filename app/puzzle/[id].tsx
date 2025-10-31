// app/puzzle/[id].tsx

import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useCallback } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { usePuzzleState } from '../../hooks/usePuzzleState';
import { usePuzzleData } from '../../hooks/usePuzzleData';
import PuzzleWebLayout from '../../components/Puzzle/layouts/PuzzleWebLayout';
import PuzzleLandscapeLayout from '../../components/Puzzle/layouts/PuzzleLandscapeLayout';
import PuzzlePortraitLayout from '../../components/Puzzle/layouts/PuzzlePortraitLayout';
import { Colors } from '../../constants/Colors';

export default function PuzzleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width, height } = useWindowDimensions();
  const { puzzle, isLoading, error } = usePuzzleData(id);
  const gameState = usePuzzleState(puzzle);
  
  // Destructure functions needed by effects to stabilize dependencies
  const { handleKeyPress, checkPuzzle, isChecking } = gameState;

  // useCallback memoizes the function so it doesn't get recreated on every render
  const handleCheckPuzzle = useCallback(() => {
    if (isChecking) return; // Prevent multiple checks during cooldown
    
    const isCorrect = checkPuzzle();
    
    // Use requestAnimationFrame to wait for UI to update, then show alert
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

  // Effect for handling hardware keyboard input on web
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      handleKeyPress(e.key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKeyPress]);

  // --- Conditional Rendering for Loading/Error States ---
  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }
  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }
  if (!puzzle || gameState.userGrid.length === 0) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  // --- Responsive Layout Logic ---
  const isWeb = Platform.OS === 'web';
  const isPortrait = height > width;

  if (isWeb && width > 950) {
    return <PuzzleWebLayout puzzle={puzzle} gameState={gameState} onCheckPuzzle={handleCheckPuzzle} />;
  } 
  
  if (!isPortrait) {
    return <PuzzleLandscapeLayout puzzle={puzzle} gameState={gameState} onCheckPuzzle={handleCheckPuzzle} />;
  }
  
  return <PuzzlePortraitLayout puzzle={puzzle} gameState={gameState} onCheckPuzzle={handleCheckPuzzle} />;
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  errorText: { color: Colors.error },
});