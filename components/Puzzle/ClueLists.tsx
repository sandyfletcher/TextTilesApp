// components/Puzzle/ClueLists.tsx

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, LayoutChangeEvent } from 'react-native';
import { Puzzle, Clue } from '../../types';
import { ActiveClue } from '../../utils/puzzleUtils';
import { Colors } from '../../constants/Colors';

interface ClueListsProps {
  puzzle: Puzzle;
  activeClue: ActiveClue | null;
  onClueSelect: (clue: Clue, direction: 'across' | 'down') => void;
  layout?: 'row' | 'column';
  direction?: 'across' | 'down' | 'all'; 
}

export default function ClueLists({ puzzle, activeClue, onClueSelect, layout = 'row', direction = 'all' }: ClueListsProps) {
  const acrossScrollViewRef = useRef<ScrollView>(null);
  const downScrollViewRef = useRef<ScrollView>(null);
  const acrossClueLayouts = useRef(new Map<number, number>());
  const downClueLayouts = useRef(new Map<number, number>());
  
  // Clear the layout maps when the puzzle changes to prevent memory leaks
  useEffect(() => {
    acrossClueLayouts.current.clear();
    downClueLayouts.current.clear();
  }, [puzzle.id]);
  
  // Auto-scroll to active clue
  useEffect(() => {
    if (!activeClue) return;
    
    const scrollViewRef = activeClue.direction === 'across' ? acrossScrollViewRef : downScrollViewRef;
    const clueLayouts = activeClue.direction === 'across' ? acrossClueLayouts : downClueLayouts;
    const y = clueLayouts.current.get(activeClue.number);
    
    if (y !== undefined && scrollViewRef.current) {
      // Small delay to ensure layout is complete
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 40), animated: true });
      }, 100);
    }
  }, [activeClue]);

  const renderClueItem = (clue: Clue, dir: 'across' | 'down') => {
    const isActive = activeClue?.number === clue.number && activeClue?.direction === dir;
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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.surface,
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
      color: Colors.text,
    },
    separator: {
      width: 1,
      backgroundColor: Colors.border,
    },
    clueItem: {
      flexDirection: 'row',
      paddingVertical: 4,
      paddingHorizontal: 4,
      borderRadius: 4,
    },
    activeClueItem: {
      backgroundColor: Colors.activeWord,
    },
    clueNumber: {
      fontWeight: 'bold',
      color: Colors.textSecondary,
    },
    clueText: {
      fontSize: 13,
      flexShrink: 1, // Allow text to wrap within the flex container
      color: Colors.textSecondary,
    },
    activeClueText: {
      color: Colors.text,
    }
});