// app/collections/index.tsx

import React, { useState, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { getVisiblePuzzles } from '../../services/PuzzleService';
import { FlatListItem, PuzzleManifestEntry, PuzzleTreeNode } from '../../types';
import CollectionItem from '../../components/List/CollectionItem';
import FolderItem from '../../components/List/FolderItem';
import PuzzleItem from '../../components/List/PuzzleItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import WebContainer from '../../components/Shared/WebContainer';

export default function CollectionsScreen() {
  const { colors } = useTheme();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const visibleItems = useMemo(() => getVisiblePuzzles(expandedFolders), [expandedFolders]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderItem = ({ item }: { item: FlatListItem }) => {
    switch (item.type) {
      case 'collection': {
        const node = item.data as PuzzleTreeNode;
        const isExpanded = expandedFolders.has(item.id);
        return (
          <CollectionItem item={item} node={node} isExpanded={isExpanded} onToggle={() => toggleFolder(item.id)} />
        );
      }
      case 'folder': {
        const node = item.data as PuzzleTreeNode;
        const isExpanded = expandedFolders.has(item.id);
        return (
          <FolderItem item={item} node={node} isExpanded={isExpanded} onToggle={() => toggleFolder(item.id)} />
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      paddingTop: 10,
      paddingBottom: 10,
    },
  });

  return (
    <WebContainer>
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <Stack.Screen options={{ title: 'Puzzle Collections' }} />
        <FlatList
          data={visibleItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={true}
          maxToRenderPerBatch={20}
          windowSize={10}
          initialNumToRender={15}
        />
      </SafeAreaView>
    </WebContainer>
  );
}