import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useSafetyApp } from '../context/SafetyAppContext';

export const Header: React.FC = () => {
  const { appMode, setAppMode, isNightMode, setIsNightMode } = useSafetyApp();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>BEL</Text>
          </View>
          <View>
            <Text style={styles.titleText}>Women Safety Analytics</Text>
            <Text style={styles.subtitleText}>Bharat Electronics Limited • SBU-BEL</Text>
          </View>
        </View>

        {/* Night / Day Mode Toggle */}
        <TouchableOpacity
          style={[styles.iconButton, isNightMode ? styles.iconButtonActive : null]}
          onPress={() => setIsNightMode(!isNightMode)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isNightMode ? 'moon' : 'sunny'}
            size={18}
            color={isNightMode ? THEME.colors.belGold : THEME.colors.textSecondary}
          />
          <Text style={[styles.modeButtonText, isNightMode && { color: THEME.colors.belGold }]}>
            {isNightMode ? 'Night' : 'Day'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Role / Mode Switcher Segmented Control */}
      <View style={styles.modeSwitcherContainer}>
        <TouchableOpacity
          style={[styles.modeTab, appMode === 'CITIZEN' && styles.modeTabActive]}
          onPress={() => setAppMode('CITIZEN')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="shield-checkmark"
            size={15}
            color={appMode === 'CITIZEN' ? THEME.colors.textPrimary : THEME.colors.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.modeTabText,
              appMode === 'CITIZEN' && styles.modeTabTextActive,
            ]}
          >
            Citizen Safety Companion
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, appMode === 'LAW_ENFORCEMENT' && styles.modeTabActiveLaw]}
          onPress={() => setAppMode('LAW_ENFORCEMENT')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="radio"
            size={15}
            color={appMode === 'LAW_ENFORCEMENT' ? '#38BDF8' : THEME.colors.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.modeTabText,
              appMode === 'LAW_ENFORCEMENT' && { color: '#38BDF8', fontWeight: '700' },
            ]}
          >
            BEL Command & Patrol
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.backgroundSecondary,
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceBorder,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    backgroundColor: THEME.colors.belDarkBlue,
    borderColor: THEME.colors.belBlue,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10,
  },
  logoBadgeText: {
    color: '#38BDF8',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  titleText: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitleText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  iconButtonActive: {
    borderColor: THEME.colors.belGold,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  modeButtonText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  modeSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.radii.md,
    padding: 3,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: THEME.radii.sm,
  },
  modeTabActive: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: THEME.colors.female,
  },
  modeTabActiveLaw: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: '#0284C7',
  },
  modeTabText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
});
