// app/index.tsx

import { Link } from 'expo-router';
import React from 'react';
import { Text, StyleSheet, Pressable, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../constants/Layout';
import { useTheme } from '../context/ThemeContext';
import WebContainer from '../components/Shared/WebContainer';

export default function MenuScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.page,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 200,
      height: 200,
      marginBottom: spacing.xl,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: spacing.lg,
      color: colors.text,
    },
    button: {
      backgroundColor: colors.primary,
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
      color: colors.textSecondary,
      fontSize: 12,
    },
  });

  return (
    <WebContainer>
      <SafeAreaView style={styles.container}>
        <Image 
          source={require('../assets/images/landing.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        <Text style={styles.title}>Crosswords for Grandma!</Text>
        <Link href="/collections" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Browse Puzzle Collections</Text>
          </Pressable>
        </Link>
        <Text style={[styles.versionText, { bottom: Math.max(insets.bottom, spacing.md) }]}>
          Version 0.0.12
        </Text>
      </SafeAreaView>
    </WebContainer>
  );
}