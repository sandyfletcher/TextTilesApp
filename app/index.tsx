// app/index.tsx

import { Link } from 'expo-router';
import React from 'react';
import { Text, StyleSheet, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { spacing } from '../constants/Layout';

export default function MenuScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/images/landing.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Crosswords for Grandma!</Text>
      
      <Link href="/collections" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Browse Puzzle Collections</Text>
        </Pressable>
      </Link>
      
      <Text style={styles.versionText}>Version 0.0.7</Text>
    </SafeAreaView>
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
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain', 
    marginBottom: spacing.xl,
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
  versionText: {
    position: 'absolute',
    bottom: spacing.md,
    color: Colors.textSecondary,
    fontSize: 12,
  },
});