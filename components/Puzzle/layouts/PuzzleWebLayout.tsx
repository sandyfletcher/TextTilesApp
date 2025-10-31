// components/Puzzle/layouts/PuzzleWebLayout.tsx

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

export default function PuzzleWebLayout({ puzzle, gameState, onCheckPuzzle }: PuzzleLayoutProps) {
  const { userGrid, lockedGrid, checkGrid, activeCell, activeClue, handleCellPress, handleClueSelect, handleKeyPress } = gameState;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: true, header: () => <GameHeader title={puzzle.metadata.title} onCheckPuzzle={onCheckPuzzle} /> }} />
      <View style={styles.content}>
        <View style={styles.cluePanel}>
          <ClueLists puzzle={puzzle} activeClue={activeClue} onClueSelect={handleClueSelect} layout="column" direction="across" />
        </View>
        <View style={styles.centerPanel}>
          <View style={styles.gridWrapper}>
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
          <View style={styles.keyboardWrapper}>
            <OnScreenKeyboard onKeyPress={handleKeyPress} />
          </View>
        </View>
        <View style={styles.cluePanel}>
          <ClueLists puzzle={puzzle} activeClue={activeClue} onClueSelect={handleClueSelect} layout="column" direction="down" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, flexDirection: 'row' },
  cluePanel: { width: 280, borderRightWidth: 1, borderLeftWidth: 1, borderColor: Colors.border },
  centerPanel: { 
    flex: 1,
    justifyContent: 'space-between',
  },
  gridWrapper: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  keyboardWrapper: {
    paddingHorizontal: 40,
    paddingBottom: 10,
  },
});