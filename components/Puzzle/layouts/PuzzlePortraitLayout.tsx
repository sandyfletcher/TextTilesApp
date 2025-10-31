// components/Puzzle/layouts/PuzzlePortraitLayout.tsx

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Puzzle } from '../../../types';
import { PuzzleState } from '../../../hooks/usePuzzleState';
import ClueLists from '../ClueLists';
import GameHeader from '../GameHeader';
import OnScreenKeyboard from '../OnScreenKeyboard';
import PuzzleGrid from '../PuzzleGrid';
import { Colors } from '../../../constants/Colors';

interface PuzzleLayoutProps {
  puzzle: Puzzle;
  gameState: PuzzleState;
  onCheckPuzzle: () => void;
}

export default function PuzzlePortraitLayout({ puzzle, gameState, onCheckPuzzle }: PuzzleLayoutProps) {
  const { userGrid, lockedGrid, checkGrid, activeCell, activeClue, handleCellPress, handleClueSelect, handleKeyPress } = gameState;
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: true, header: () => <GameHeader title={puzzle.metadata.title} onCheckPuzzle={onCheckPuzzle} /> }} />
      <View style={styles.topSection}>
        <View style={styles.gridContainer}>
          <PuzzleGrid
            puzzle={puzzle}
            userGrid={userGrid}
            lockedGrid={lockedGrid}
            checkGrid={checkGrid}
            activeCell={activeCell}
            activeClue={activeClue}
            onCellPress={handleCellPress}
          />
        </View>
        <View style={styles.cluesContainer}>
          <ClueLists puzzle={puzzle} activeClue={activeClue} onClueSelect={handleClueSelect} />
        </View>
      </View>
      <OnScreenKeyboard onKeyPress={handleKeyPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topSection: { flex: 1 },
  gridContainer: { flex: 1.2 }, // Give grid slightly more space
  cluesContainer: { 
    flex: 1,
    borderTopWidth: 1, 
    borderColor: Colors.border,
  },
});