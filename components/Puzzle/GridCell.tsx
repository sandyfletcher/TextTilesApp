// components/Puzzle/GridCell.tsx

import React from 'react';
import { Pressable, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface GridCellProps {
  clueNumber?: number;
  userLetter: string;
  isLocked: boolean;
  isBlack: boolean;
  isActive: boolean;
  isWordActive: boolean;
  cellSize: number;
  checkResult?: boolean | null;
  row: number;
  col: number;
  onPress: (r: number, c: number) => void;
}

export default React.memo(function GridCell({
  clueNumber,
  userLetter,
  isLocked,
  checkResult,
  isBlack,
  isActive,
  isWordActive,
  cellSize,
  row,
  col,
  onPress
}: GridCellProps) {
  const { colors } = useTheme();

  const handlePress = () => { // Internal handler to ensure we don't fire events for black cells
    if (!isBlack) {
      onPress(row, col);
    }
  };

  const getBackgroundColor = () => {
    if (isBlack) return 'black';
    if (isActive) return colors.activeCell;
    if (isWordActive) return colors.activeWord;
    if (isLocked) return colors.lockedCell;
    return colors.surface;
  };
  
  const styles = StyleSheet.create({
    cell: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0.5,
      borderColor: colors.border,
      // Cast to 'any' to bypass strict React Native type checking
      // "none" is valid CSS for web, but TS thinks it needs to be "solid"|"dashed" etc.
      ...Platform.select({
        web: {
          outlineStyle: 'none',
        } as any,
      }),
    },
    activeCellBorder: {
      zIndex: 10, 
      borderColor: colors.text,
      borderWidth: 2,
    },
    number: {
      position: 'absolute',
      top: 1,
      left: 2,
      color: colors.textSecondary,
      fontWeight: 'bold',
    },
    letter: {
      color: colors.text,
      fontWeight: '400',
    },
    correctLetter: {
      fontWeight: 'bold',
    },
    incorrectLetter: {
      opacity: 0.35,
    },
  });

  const cellStyle = [
    styles.cell,
    {
      width: cellSize,
      height: cellSize,
      backgroundColor: getBackgroundColor(),
    },
    // Apply the active border style LAST so it overrides defaults
    isActive && styles.activeCellBorder 
  ];

  const letterStyle = [
    styles.letter,
    { fontSize: cellSize * 0.55 },
    (isLocked || checkResult === true) && styles.correctLetter,
    checkResult === false && styles.incorrectLetter,
  ];

  const numberStyle = [
    styles.number,
    { fontSize: cellSize * 0.28 },
  ];

  return (
    <Pressable onPress={handlePress} style={cellStyle}>
      {!isBlack && clueNumber && <Text style={numberStyle}>{clueNumber}</Text>}
      {!isBlack && userLetter.length > 0 && (
        <Text style={letterStyle}>{userLetter.toUpperCase()}</Text>
      )}
    </Pressable>
  );
});