// components/Puzzle/GameHeader.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import IconButton from './IconButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

interface GameHeaderProps {
  title: string;
  onCheckPuzzle: () => void;
}

export default function GameHeader({ title, onCheckPuzzle }: GameHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    { paddingTop: insets.top > 0 ? insets.top : 10 },
  ];

  return (
    <View style={containerStyle}>
      <IconButton 
        iconName="arrow-left" 
        onPress={() => router.back()} 
        color={Colors.text}
        accessibilityLabel="Go back"
      />
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.rightIcons}>
        <IconButton 
          iconName="check-square" 
          onPress={onCheckPuzzle} 
          color={Colors.text}
          accessibilityLabel="Check puzzle answers"
        />
        <IconButton 
          iconName="settings" 
          onPress={() => router.push('/settings')} 
          color={Colors.text}
          accessibilityLabel="Open settings"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
    color: Colors.text,
  },
  rightIcons: {
    flexDirection: 'row',
  },
});