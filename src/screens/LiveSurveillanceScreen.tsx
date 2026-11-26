import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useSafetyApp } from '../context/SafetyAppContext';
import { CameraVisionOverlay } from '../components/CameraVisionOverlay';
import { GenderDistributionBar } from '../components/GenderDistributionBar';
import { AlertNotificationBanner } from '../components/AlertNotificationBanner';
import { QuickSOSButton } from '../components/QuickSOSButton';
import { SAMPLE_FEEDS } from '../constants/sampleFeeds';

export const LiveSurveillanceScreen: React.FC = () => {
  const {
    detectedPersons,
    sceneAnalytics,
    proximityLinks,
    currentScenario,
    selectScenario,
    isNightMode,
    setIsNightMode,
    alerts,
    dismissAlert,
    dispatchPatrolForAlert,
    triggerManualSOS,
    cancelSOS,
    isEmergencyActive,
    sosCountdown,
    appMode,
  } = useSafetyApp();

  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Alert Banner */}
        <AlertNotificationBanner
          alerts={alerts}
          onDismiss={dismissAlert}
          onDispatch={(id) => dispatchPatrolForAlert(id, 'BEL Quick Reaction Team (PCR)')}
        />

        {/* Live Camera / Synthetic CCTV Vision Overlay */}
        <CameraVisionOverlay
          persons={detectedPersons}
          analytics={sceneAnalytics}
          proximityLinks={proximityLinks}
          cameraId={currentScenario.cameraId}
          locationName={currentScenario.location}
          isNightMode={isNightMode}
          onToggleNight={() => setIsNightMode(!isNightMode)}
          onSwitchCamera={() => setIsFrontCamera(!isFrontCamera)}
          isFrontCamera={isFrontCamera}
        />

        {/* Gender Distribution & Threat Analysis Card */}
        <GenderDistributionBar analytics={sceneAnalytics} />

        {/* Preset Surveillance Test Scenarios (Allows instant verification of all 6 project requirements) */}
        <View style={styles.scenariosSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="film-outline" size={16} color={THEME.colors.hudCyan} />
            <Text style={styles.sectionTitle}>CCTV Feed Scenario Simulator</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Select test scenarios to evaluate vision algorithms on diverse threat patterns:
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scenarioList}
          >
            {SAMPLE_FEEDS.map((scenario) => {
              const isSelected = scenario.id === currentScenario.id;
              const isDanger =
                scenario.id === 'scenario-surrounded' || scenario.id === 'scenario-gesture-sos';

              return (
                <TouchableOpacity
                  key={scenario.id}
                  style={[
                    styles.scenarioCard,
                    isSelected && styles.scenarioCardActive,
                    isSelected && isDanger && { borderColor: THEME.colors.critical },
                  ]}
                  onPress={() => selectScenario(scenario.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.scenarioCardHeader}>
                    <Text
                      style={[
                        styles.scenarioTime,
                        scenario.timeOfDay === 'NIGHT'
                          ? { color: THEME.colors.belGold }
                          : { color: THEME.colors.hudCyan },
                      ]}
                    >
                      {scenario.timeOfDay} • {scenario.simulatedTime}
                    </Text>
                    {isDanger && (
                      <View style={styles.dangerDot}>
                        <Ionicons name="warning" size={10} color="#FFF" />
                      </View>
                    )}
                  </View>

                  <Text
                    style={[styles.scenarioName, isSelected && styles.scenarioNameActive]}
                    numberOfLines={1}
                  >
                    {scenario.name.split(':')[1] || scenario.name}
                  </Text>
                  <Text style={styles.scenarioTagline} numberOfLines={2}>
                    {scenario.tagline}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Quick Emergency SOS Action */}
        <QuickSOSButton
          onPress={triggerManualSOS}
          isEmergencyActive={isEmergencyActive}
          onCancel={cancelSOS}
          countdown={sosCountdown}
        />

        {/* Law Enforcement Dispatch Snapshot (Shown when in Patrol Mode) */}
        {appMode === 'LAW_ENFORCEMENT' && (
          <View style={styles.patrolCard}>
            <View style={styles.patrolHeader}>
              <Ionicons name="shield-half" size={16} color="#38BDF8" />
              <Text style={styles.patrolTitle}>BEL SBU Patrol Dispatch Telemetry</Text>
            </View>
            <Text style={styles.patrolInfo}>
              Camera Stream: {currentScenario.cameraId} connected via encrypted BEL optical mesh.
            </Text>
            <View style={styles.patrolStatusRow}>
              <Text style={styles.patrolLabel}>Nearest Interceptor:</Text>
              <Text style={styles.patrolValue}>PCR Eagle-4 (ETA 90 seconds)</Text>
            </View>
            <View style={styles.patrolStatusRow}>
              <Text style={styles.patrolLabel}>Crowd Density:</Text>
              <Text style={styles.patrolValue}>{sceneAnalytics.densityIndex}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  scenariosSection: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  sectionSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 10,
  },
  scenarioList: {
    paddingRight: 10,
  },
  scenarioCard: {
    width: 170,
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.radii.md,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  scenarioCardActive: {
    borderColor: THEME.colors.hudCyan,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  scenarioCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scenarioTime: {
    fontSize: 9,
    fontWeight: '800',
  },
  dangerDot: {
    backgroundColor: THEME.colors.critical,
    borderRadius: 8,
    padding: 2,
  },
  scenarioName: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  scenarioNameActive: {
    color: THEME.colors.textPrimary,
  },
  scenarioTagline: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    lineHeight: 13,
  },
  patrolCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: THEME.colors.belDarkBlue,
    borderRadius: THEME.radii.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.belBlue,
  },
  patrolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  patrolTitle: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
  },
  patrolInfo: {
    color: '#E0F2FE',
    fontSize: 11,
    marginBottom: 6,
  },
  patrolStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  patrolLabel: {
    color: '#93C5FD',
    fontSize: 10,
  },
  patrolValue: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
