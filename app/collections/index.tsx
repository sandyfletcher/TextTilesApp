// app/collections/index.tsx

import React, { useState, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { getVisiblePuzzles } from '../../services/PuzzleService';
import { FlatListItem, PuzzleManifestEntry, PuzzleTreeNode } from '../../types';
import CollectionItem from '../../components/List/CollectionItem';
import FolderItem from '../../components/List/FolderItem';
import PuzzleItem from '../../components/List/PuzzleItem';
import { Colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CollectionsScreen() {
  // Track which folders are currently expanded using a Set for efficient lookups.
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // useMemo ensures that we only recalculate the visible items when the user
  // expands or collapses a folder. This is a key performance optimization.
  const visibleItems = useMemo(
    () => getVisiblePuzzles(expandedFolders),
    [expandedFolders]
  );

  // This function handles the logic for expanding or collapsing a folder.
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      // Create a mutable copy of the previous set.
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId); // If it's already there, remove it (collapse).
      } else {
        next.add(folderId); // Otherwise, add it (expand).
      }
      return next;
    });
  };

  // The renderItem function for our FlatList. It determines which component
  // to render based on the 'type' of the list item.
  const renderItem = ({ item }: { item: FlatListItem }) => {
    switch (item.type) {
      case 'collection': {
        const node = item.data as PuzzleTreeNode;
        const isExpanded = expandedFolders.has(item.id);
        return (
          <CollectionItem
            item={item}
            node={node}
            isExpanded={isExpanded}
            onToggle={() => toggleFolder(item.id)}
          />
        );
      }
      case 'folder': {
        const node = item.data as PuzzleTreeNode;
        const isExpanded = expandedFolders.has(item.id);
        return (
          <FolderItem
            item={item}
            node={node}
            isExpanded={isExpanded}
            onToggle={() => toggleFolder(item.id)}
          />
        );
      }
      case 'puzzle': {
        const puzzleData = item.data as PuzzleManifestEntry;
        return <PuzzleItem item={item} puzzleData={puzzleData} />;
      }
      default:
        return null;
    }
  };

  return (
    // SafeAreaView prevents our list from overlapping with the status bar.
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: 'Puzzle Collections' }} />
      <FlatList
        data={visibleItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        // Performance optimizations for long lists
        removeClippedSubviews={true}
        maxToRenderPerBatch={20}
        windowSize={10}
        initialNumToRender={15}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 10,
  }
});