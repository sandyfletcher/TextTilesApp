// components/List/FolderItem.tsx

import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Card from '../Shared/Card';
import { Colors } from '../../constants/Colors';
import { FlatListItem, PuzzleTreeNode } from '../../types';

interface FolderItemProps {
  item: FlatListItem;
  node: PuzzleTreeNode;
  isExpanded: boolean;
  onToggle: () => void;
}

// Helper function to count total puzzles in a folder
function countPuzzles(node: PuzzleTreeNode): number {
  let count = node.puzzles.length;
  node.children.forEach(child => {
    count += countPuzzles(child);
  });
  return count;
}

const FolderItem: React.FC<FolderItemProps> = ({ item, node, isExpanded, onToggle }) => {
  const totalPuzzles = countPuzzles(node);

  return (
    <Card style={{ marginLeft: item.level * 10, marginRight: 16 }}>
      <Pressable style={styles.pressable} onPress={onToggle}>
        <View style={styles.content}>
          <Feather name={isExpanded ? 'chevron-down' : 'chevron-right'} size={18} color={Colors.textSecondary} />
          <Text style={styles.folderText}>📁 {node.name}</Text>
          <Text style={styles.countText}>({totalPuzzles})</Text>
        </View>
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  pressable: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
  },
  countText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
});

export default FolderItem;