// components/Puzzle/PuzzleGrid.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, LayoutChangeEvent } from 'react-native';
import GridCell from './GridCell';
import { Puzzle } from '../../types';
import { ActiveClue } from '../../utils/puzzleUtils';

interface PuzzleGridProps {
  puzzle: Puzzle;
  userGrid: string[][];
  lockedGrid: boolean[][];
  checkGrid: (boolean | null)[][];
  activeCell: { row: number; col: number };
  activeClue: ActiveClue | null;
  onCellPress: (row: number, col: number) => void;
}

export default function PuzzleGrid({ puzzle, userGrid, lockedGrid, checkGrid, activeCell, activeClue, onCellPress }: PuzzleGridProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  
  const numRows = puzzle.size.rows;
  const numColumns = puzzle.size.cols;
  
  // Calculate cell size based on BOTH width and height constraints
  // Use whichever dimension is more restrictive
  const cellSizeFromWidth = containerWidth > 0 ? (containerWidth - 2) / numColumns : 0;
  const cellSizeFromHeight = containerHeight > 0 ? (containerHeight - 2) / numRows : 0;
  
  // Use the smaller of the two to ensure the grid fits in both dimensions
  const cellSize = Math.min(cellSizeFromWidth, cellSizeFromHeight);

  const isCellInActiveClue = (row: number, col: number): boolean => {
    if (!activeClue) return false;
    if (activeClue.direction === 'across') {
      return row === activeClue.row && col >= activeClue.col && col < activeClue.col + activeClue.answer.length;
    } else { // 'down'
      return col === activeClue.col && row >= activeClue.row && row < activeClue.row + activeClue.answer.length;
    }
  };

  return (
    <View
      style={styles.container}
      onLayout={(event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width);
        setContainerHeight(event.nativeEvent.layout.height);
      }}
    >
      {cellSize > 0 && (
        <View style={styles.grid}>
          {puzzle.grid.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cellValue, colIndex) => {
                const isBlack = cellValue === null;

                if (isBlack) {
                  return <GridCell key={`cell-${rowIndex}-${colIndex}`} isBlack={true} cellSize={cellSize} userLetter="" isLocked={false} isActive={false} isWordActive={false} />;
                }

                const clueNumber = puzzle.clues.across.find(c => c.row === rowIndex && c.col === colIndex)?.number || puzzle.clues.down.find(c => c.row === rowIndex && c.col === colIndex)?.number;
                
              return (
                  <Pressable key={`cell-${rowIndex}-${colIndex}`} onPress={() => onCellPress(rowIndex, colIndex)}>
                    <GridCell
                      clueNumber={clueNumber}
                      userLetter={userGrid[rowIndex]?.[colIndex] || ''}
                      isLocked={lockedGrid[rowIndex]?.[colIndex] || false}
                      checkResult={checkGrid[rowIndex]?.[colIndex] || null}
                      isBlack={false}
                      isActive={activeCell.row === rowIndex && activeCell.col === colIndex}
                      isWordActive={isCellInActiveClue(rowIndex, colIndex)}
                      cellSize={cellSize}
                    />
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  grid: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'black',
  },
  row: {
    flexDirection: 'row',
  },
});