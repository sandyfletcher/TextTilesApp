// components/Puzzle/ClueLists.tsx

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, LayoutChangeEvent } from 'react-native';
import { Puzzle, Clue } from '../../types';
import { ActiveClue } from '../../utils/puzzleUtils';
import { useTheme } from '../../context/ThemeContext';

interface ClueListsProps {
  puzzle: Puzzle;
  activeClue: ActiveClue | null;
  onClueSelect: (clue: Clue, direction: 'across' | 'down') => void;
  layout?: 'row' | 'column';
  direction?: 'across' | 'down' | 'all'; 
}

export default function ClueLists({ puzzle, activeClue, onClueSelect, layout = 'row', direction = 'all' }: ClueListsProps) {
  const { colors } = useTheme();
  const acrossScrollViewRef = useRef<ScrollView>(null);
  const downScrollViewRef = useRef<ScrollView>(null);
  const acrossClueLayouts = useRef(new Map<number, number>());
  const downClueLayouts = useRef(new Map<number, number>());
  // Destructure these values so the Effect depends on primitive values (numbers/strings) instead of the object reference, preventing unnecessary re-runs.
  const activeNumber = activeClue?.number;
  const activeDirection = activeClue?.direction;
  
  useEffect(() => {
    acrossClueLayouts.current.clear();
    downClueLayouts.current.clear();
  }, [puzzle.id]);
  
  // Scroll Logic
  useEffect(() => {
    if (activeNumber === undefined || !activeDirection) return;
    // Use the extracted variables, NOT activeClue
    const scrollViewRef = activeDirection === 'across' ? acrossScrollViewRef : downScrollViewRef;
    const clueLayouts = activeDirection === 'across' ? acrossClueLayouts : downClueLayouts;
    const y = clueLayouts.current.get(activeNumber);
    if (y !== undefined && scrollViewRef.current) {
        scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 40), animated: true });
    }
  }, [activeNumber, activeDirection]); // Dependencies are now clean

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      padding: 5,
    },
    clueListColumn: {
      flex: 1,
      paddingHorizontal: 5,
    },
    columnHeader: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingVertical: 8,
      color: colors.text,
    },
    separator: {
      width: 1,
      backgroundColor: colors.border,
    },
    clueItem: {
      flexDirection: 'row',
      paddingVertical: 4,
      paddingHorizontal: 4,
      borderRadius: 4,
    },
    activeClueItem: {
      backgroundColor: colors.activeWord,
    },
    clueNumber: {
      fontWeight: 'bold',
      color: colors.textSecondary,
    },
    clueText: {
      fontSize: 13,
      flexShrink: 1,
      color: colors.textSecondary,
    },
    activeClueText: {
      color: colors.text,
    }
  });

  const renderClueItem = (clue: Clue, dir: 'across' | 'down') => {
    // Use extracted variables for comparison here too for consistency, though activeClue object access is fine in render.
    const isActive = activeNumber === clue.number && activeDirection === dir;
    const clueLayouts = dir === 'across' ? acrossClueLayouts : downClueLayouts;

    return (
      <Pressable
        key={`${dir}-${clue.number}`}
        onPress={() => onClueSelect(clue, dir)}
        onLayout={(event: LayoutChangeEvent) => {
          clueLayouts.current.set(clue.number, event.nativeEvent.layout.y);
        }}
        style={[styles.clueItem, isActive && styles.activeClueItem]}
      >
        <Text style={[styles.clueNumber, isActive && styles.activeClueText]}>{clue.number}. </Text>
        <Text style={[styles.clueText, isActive && styles.activeClueText]} numberOfLines={2}>{clue.clue}</Text>
      </Pressable>
    );
  };

  const AcrossColumn = (
    <View style={styles.clueListColumn}>
      <Text style={styles.columnHeader}>ACROSS</Text>
      <ScrollView ref={acrossScrollViewRef} showsVerticalScrollIndicator={false}>
        {puzzle.clues.across.map(clue => renderClueItem(clue, 'across'))}
      </ScrollView>
    </View>
  );

  const DownColumn = (
    <View style={styles.clueListColumn}>
      <Text style={styles.columnHeader}>DOWN</Text>
      <ScrollView ref={downScrollViewRef} showsVerticalScrollIndicator={false}>
        {puzzle.clues.down.map(clue => renderClueItem(clue, 'down'))}
      </ScrollView>
    </View>
  );

  if (direction === 'across') return <View style={styles.container}>{AcrossColumn}</View>;
  if (direction === 'down') return <View style={styles.container}>{DownColumn}</View>;

  return (
    <View style={[styles.container, { flexDirection: layout }]}>
      {AcrossColumn}
      {layout === 'row' && <View style={styles.separator} />}
      {DownColumn}
    </View>
  );
}