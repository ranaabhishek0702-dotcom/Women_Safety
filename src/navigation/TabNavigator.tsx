import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useSafetyApp } from '../context/SafetyAppContext';

import { LiveSurveillanceScreen } from '../screens/LiveSurveillanceScreen';
import { GestureSOSScreen } from '../screens/GestureSOSScreen';
import { HotspotsAnalyticsScreen } from '../screens/HotspotsAnalyticsScreen';
import { IncidentAlertsScreen } from '../screens/IncidentAlertsScreen';
import { SettingsConfigScreen } from '../screens/SettingsConfigScreen';

type TabRoute = 'VISION' | 'GESTURE' | 'HOTSPOTS' | 'ALERTS' | 'CONFIG';

export const TabNavigator: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabRoute>('VISION');
  const { alerts, sceneAnalytics } = useSafetyApp();

  const activeAlertCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'VISION':
        return <LiveSurveillanceScreen />;
      case 'GESTURE':
        return <GestureSOSScreen />;
      case 'HOTSPOTS':
        return <HotspotsAnalyticsScreen />;
      case 'ALERTS':
        return <IncidentAlertsScreen />;
      case 'CONFIG':
        return <SettingsConfigScreen />;
      default:
        return <LiveSurveillanceScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Screen Content */}
      <View style={styles.content}>{renderActiveScreen()}</View>

      {/* Modern Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        {/* Tab 1: Live Vision */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentTab('VISION')}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={currentTab === 'VISION' ? 'videocam' : 'videocam-outline'}
              size={22}
              color={currentTab === 'VISION' ? THEME.colors.hudCyan : THEME.colors.textMuted}
            />
            {sceneAnalytics.activeThreatCount > 0 && (
              <View style={styles.threatDot} />
            )}
          </View>
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'VISION' && styles.tabLabelActive,
            ]}
          >
            Live Vision
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Gesture SOS */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentTab('GESTURE')}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={currentTab === 'GESTURE' ? 'hand-left' : 'hand-left-outline'}
              size={22}
              color={currentTab === 'GESTURE' ? THEME.colors.female : THEME.colors.textMuted}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'GESTURE' && { color: THEME.colors.female, fontWeight: '700' },
            ]}
          >
            Gesture SOS
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Hotspots GIS */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentTab('HOTSPOTS')}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={currentTab === 'HOTSPOTS' ? 'map' : 'map-outline'}
              size={22}
              color={currentTab === 'HOTSPOTS' ? THEME.colors.belGold : THEME.colors.textMuted}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'HOTSPOTS' && { color: THEME.colors.belGold, fontWeight: '700' },
            ]}
          >
            Hotspots
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Threat Alerts */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentTab('ALERTS')}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={currentTab === 'ALERTS' ? 'notifications' : 'notifications-outline'}
              size={22}
              color={currentTab === 'ALERTS' ? THEME.colors.critical : THEME.colors.textMuted}
            />
            {activeAlertCount > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeText}>{activeAlertCount}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'ALERTS' && { color: THEME.colors.critical, fontWeight: '700' },
            ]}
          >
            Alerts
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Settings / Config */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentTab('CONFIG')}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={currentTab === 'CONFIG' ? 'settings' : 'settings-outline'}
              size={22}
              color={currentTab === 'CONFIG' ? '#38BDF8' : THEME.colors.textMuted}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'CONFIG' && { color: '#38BDF8', fontWeight: '700' },
            ]}
          >
            Config
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: THEME.colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  tabLabelActive: {
    color: THEME.colors.hudCyan,
    fontWeight: '700',
  },
  threatDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.critical,
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: THEME.colors.critical,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
});
