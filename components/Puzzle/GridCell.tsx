// components/Puzzle/GridCell.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

interface GridCellProps {
  clueNumber?: number;
  userLetter: string;
  isLocked: boolean;
  isBlack: boolean;
  isActive: boolean;
  isWordActive: boolean;
  cellSize: number;
  checkResult?: boolean | null;
}

export default React.memo(function GridCell({
  clueNumber,
  userLetter,
  isLocked,
  checkResult,
  isBlack,
  isActive,
  isWordActive,
  cellSize
}: GridCellProps) {
  
  const getBackgroundColor = () => {
    if (isBlack) return 'black';
    if (isActive) return Colors.activeCell;
    if (isWordActive) return Colors.activeWord;
    if (isLocked) return Colors.lockedCell;
    return Colors.surface;
  };

  const cellStyle = [
    styles.cell,
    {
      width: cellSize,
      height: cellSize,
      backgroundColor: getBackgroundColor(),
    },
  ];

  const letterStyle = [
    styles.letter,
    { fontSize: cellSize * 0.55 },
    isLocked && styles.lockedLetter,
    checkResult === false && styles.incorrectLetter,
  ];

  const numberStyle = [
    styles.number,
    { fontSize: cellSize * 0.28 },
  ];

  return (
    <View style={cellStyle}>
      {!isBlack && clueNumber && <Text style={numberStyle}>{clueNumber}</Text>}
      
      {/* We explicitly check the length to get a true/false boolean value, preventing the "falsy" empty string from being rendered directly. */}
      {!isBlack && userLetter.length > 0 && (
        <Text style={letterStyle}>{userLetter.toUpperCase()}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#999',
  },
  number: {
    position: 'absolute',
    top: 1,
    left: 2,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  letter: {
    color: Colors.text,
    fontWeight: '400',
  },
  lockedLetter: {
    fontWeight: 'bold',
  },
  incorrectLetter: {
    color: Colors.error,
  },
});