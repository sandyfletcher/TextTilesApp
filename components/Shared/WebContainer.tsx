// components/Shared/WebContainer.tsx

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface WebContainerProps {
  children: React.ReactNode;
  style?: any;
}

export default function WebContainer({ children, style }: WebContainerProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.outer, { backgroundColor: colors.background }]}>
      <View style={[styles.inner, style]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
    ...Platform.select({
      web: {
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
        minHeight: '100%', 
      }
    })
  }
});