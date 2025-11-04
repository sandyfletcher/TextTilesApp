// components/ErrorBoundary.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { lightColors } from '../constants/Colors'; // Import static colors for fallback

// Note: Because this is a Class Component, it cannot use hooks like `useTheme`.
// We have two options:
// 1. Convert it to a Functional Component (more complex for Error Boundaries).
// 2. Use a static theme for the error screen itself, which is a safe fallback.
// We are choosing option 2 for simplicity and robustness. The rest of the app will still be themed.

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Pressable style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: lightColors.background, // light theme as safe default
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: lightColors.text,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: lightColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: lightColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});