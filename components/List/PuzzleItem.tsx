// components/List/PuzzleItem.tsx

import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Card from '../Shared/Card';
import { Colors } from '../../constants/Colors';
import { FlatListItem, PuzzleManifestEntry } from '../../types';

interface PuzzleItemProps {
  item: FlatListItem;
  puzzleData: PuzzleManifestEntry;
}

const PuzzleItem: React.FC<PuzzleItemProps> = ({ item, puzzleData }) => {
  return (
    <Card style={{ marginLeft: item.level * 10, marginRight: 16 }}>
      <Link href={`/puzzle/${puzzleData.id}`} asChild>
        <Pressable style={styles.pressable}>
          <Text style={styles.itemText}>🧩 {puzzleData.metadata.title}</Text>
        </Pressable>
      </Link>
    </Card>
  );
};

const styles = StyleSheet.create({
  pressable: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemText: {
    color: Colors.text,
  },
});

export default PuzzleItem;