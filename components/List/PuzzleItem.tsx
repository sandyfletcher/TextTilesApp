// components/List/PuzzleItem.tsx

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FlatListItem, PuzzleManifestEntry } from '../../types';
import { usePuzzleProgress } from '../../hooks/usePuzzleProgress';
import { spacing } from '../../constants/Layout';
import { useTheme } from '../../context/ThemeContext';

interface PuzzleItemProps {
  item: FlatListItem;
  puzzleData: PuzzleManifestEntry;
}

export default function PuzzleItem({ item, puzzleData }: PuzzleItemProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const { progress, isLoading } = usePuzzleProgress(puzzleData.id);

  const handlePress = () => {
    router.push(`/puzzle/${puzzleData.id}`);
  };

  const getProgressIndicator = () => {
    if (isLoading) return null;
    if (!progress) return null;
    
    if (progress.isCompleted) {
      return <Text style={styles.completedBadge}>✓ Complete</Text>;
    }
    
    if (progress.percentComplete > 0) {
      return <Text style={styles.progressText}>{progress.percentComplete}%</Text>;
    }
    
    return null;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      marginVertical: 2,
      marginHorizontal: spacing.sm,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pressed: {
      backgroundColor: colors.activeWord,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md,
    },
    mainInfo: {
      flex: 1,
      marginRight: spacing.sm,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    progressContainer: {
      minWidth: 80,
      alignItems: 'flex-end',
    },
    progressText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    completedBadge: {
      fontSize: 13,
      fontWeight: '600',
      color: '#10b981', // Green
      backgroundColor: '#d1fae5', // Light green
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
  });

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        { paddingLeft: spacing.md * item.level },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {puzzleData.metadata.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {puzzleData.metadata.author} • {puzzleData.metadata.date}
          </Text>
        </View>
        <View style={styles.progressContainer}>
          {getProgressIndicator()}
        </View>
      </View>
    </Pressable>
  );
}