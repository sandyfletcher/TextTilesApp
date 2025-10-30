// app/index.tsx

import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/Colors';
import { spacing } from '../constants/Layout';

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TextTiles!</Text>
      
      {/* For now, just a simple link to get to the collections */}
      <Link href="/collections" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Browse Puzzle Collections</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.page,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});