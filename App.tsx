import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from './src/constants/theme';
import { SafetyAppProvider } from './src/context/SafetyAppContext';
import { Header } from './src/components/Header';
import { TabNavigator } from './src/navigation/TabNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafetyAppProvider>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          <StatusBar style="light" backgroundColor={THEME.colors.background} />
          {/* Global BEL Branding & Mode Switcher Header */}
          <Header />
          {/* Main App Bottom Tab Navigation */}
          <TabNavigator />
        </SafeAreaView>
      </SafetyAppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
});
