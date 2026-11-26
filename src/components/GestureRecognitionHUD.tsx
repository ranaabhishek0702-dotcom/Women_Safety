import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { GestureDetectionState } from '../types';

interface GestureRecognitionHUDProps {
  gestureState: GestureDetectionState;
  onSelectStage: (stage: 0 | 1 | 2 | 3) => void;
  onManualSOS: () => void;
  isEmergencyActive: boolean;
  sosCountdown: number;
  onCancelSOS: () => void;
}

export const GestureRecognitionHUD: React.FC<GestureRecognitionHUDProps> = ({
  gestureState,
  onSelectStage,
  onManualSOS,
  isEmergencyActive,
  sosCountdown,
  onCancelSOS,
}) => {
  const { stage, stageDescription, confidence, isDistressTriggered } = gestureState;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Ionicons name="hand-left" size={18} color={THEME.colors.hudCyan} />
          <Text style={styles.title}>Universal SOS Gesture Analytics</Text>
        </View>

        {confidence > 0 && (
          <View style={styles.confidencePill}>
            <Text style={styles.confidenceText}>Confidence: {confidence}%</Text>
          </View>
        )}
      </View>

      <Text style={styles.description}>
        The computer vision system actively scans for the international 3-step{' '}
        <Text style={{ fontWeight: '700', color: THEME.colors.belGold }}>Signal for Help</Text>{' '}
        distress gesture:
      </Text>

      {/* 3-Step Interactive Gesture Visualizer & Stage Selector */}
      <View style={styles.stepsContainer}>
        {/* Step 1 */}
        <TouchableOpacity
          style={[styles.stepItem, stage === 1 && styles.stepItemActive]}
          onPress={() => onSelectStage(1)}
          activeOpacity={0.8}
        >
          <View style={[styles.stepNumberBadge, stage === 1 && styles.stepNumberBadgeActive]}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Ionicons
            name="hand-left-outline"
            size={28}
            color={stage === 1 ? THEME.colors.hudCyan : THEME.colors.textMuted}
          />
          <Text style={[styles.stepLabel, stage === 1 && styles.stepLabelActive]}>
            Palm Open
          </Text>
          <Text style={styles.stepSublabel}>Fingers extended</Text>
        </TouchableOpacity>

        {/* Arrow */}
        <Ionicons name="arrow-forward" size={16} color={THEME.colors.textMuted} />

        {/* Step 2 */}
        <TouchableOpacity
          style={[styles.stepItem, stage === 2 && styles.stepItemActive]}
          onPress={() => onSelectStage(2)}
          activeOpacity={0.8}
        >
          <View style={[styles.stepNumberBadge, stage === 2 && styles.stepNumberBadgeActive]}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Ionicons
            name="finger-print-outline"
            size={28}
            color={stage === 2 ? THEME.colors.belGold : THEME.colors.textMuted}
          />
          <Text style={[styles.stepLabel, stage === 2 && styles.stepLabelActive]}>
            Tuck Thumb
          </Text>
          <Text style={styles.stepSublabel}>Inside palm</Text>
        </TouchableOpacity>

        {/* Arrow */}
        <Ionicons name="arrow-forward" size={16} color={THEME.colors.textMuted} />

        {/* Step 3 (Distress Trigger) */}
        <TouchableOpacity
          style={[styles.stepItem, stage === 3 && styles.stepItemCritical]}
          onPress={() => onSelectStage(3)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.stepNumberBadge,
              stage === 3 && { backgroundColor: THEME.colors.critical },
            ]}
          >
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Ionicons
            name="radio-button-on"
            size={28}
            color={stage === 3 ? THEME.colors.critical : THEME.colors.textMuted}
          />
          <Text style={[styles.stepLabel, stage === 3 && { color: THEME.colors.critical, fontWeight: '800' }]}>
            Trap Thumb
          </Text>
          <Text style={styles.stepSublabel}>Fold fingers down</Text>
        </TouchableOpacity>
      </View>

      {/* Detection Status Box */}
      <View
        style={[
          styles.statusBox,
          isDistressTriggered ? styles.statusBoxCritical : styles.statusBoxNormal,
        ]}
      >
        <Ionicons
          name={isDistressTriggered ? 'warning' : 'information-circle-outline'}
          size={18}
          color={isDistressTriggered ? THEME.colors.critical : THEME.colors.hudCyan}
        />
        <Text
          style={[
            styles.statusText,
            isDistressTriggered && { color: THEME.colors.critical, fontWeight: '700' },
          ]}
        >
          {stageDescription}
        </Text>
      </View>

      {/* 3-Second Safeguard Countdown Banner */}
      {sosCountdown > 0 && !isEmergencyActive && (
        <View style={styles.countdownBanner}>
          <View style={styles.countdownCircle}>
            <Text style={styles.countdownNumber}>{sosCountdown}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.countdownTitle}>Distress Signal Confirmed</Text>
            <Text style={styles.countdownSubtitle}>
              Broadcasting GPS & dispatching emergency patrol in {sosCountdown}s
            </Text>
          </View>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancelSOS}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Emergency Active Broadcast Indicator */}
      {isEmergencyActive && (
        <View style={styles.emergencyActiveBanner}>
          <Ionicons name="notifications" size={24} color="#FFF" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.emergencyActiveTitle}>EMERGENCY BROADCAST ACTIVE</Text>
            <Text style={styles.emergencyActiveSubtitle}>
              Live Coordinates sent to BEL SBU & Police Patrol PCR Eagle-4.
            </Text>
          </View>
          <TouchableOpacity style={styles.stopButton} onPress={onCancelSOS}>
            <Text style={styles.stopButtonText}>Resolve</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Manual SOS Override Button */}
      <TouchableOpacity
        style={styles.manualSosButton}
        onPress={onManualSOS}
        activeOpacity={0.8}
      >
        <Ionicons name="flash" size={16} color="#FFF" />
        <Text style={styles.manualSosText}>Instant 1-Touch Emergency SOS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  confidencePill: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: THEME.colors.hudCyan,
  },
  confidenceText: {
    color: THEME.colors.hudCyan,
    fontSize: 10,
    fontWeight: '700',
  },
  description: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.radii.md,
    padding: 10,
    marginBottom: 12,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    borderRadius: THEME.radii.sm,
  },
  stepItemActive: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: THEME.colors.hudCyan,
  },
  stepItemCritical: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: THEME.colors.critical,
  },
  stepNumberBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: THEME.colors.surfaceBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepNumberBadgeActive: {
    backgroundColor: THEME.colors.hudCyan,
  },
  stepNumberText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  stepLabel: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  stepLabelActive: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  stepSublabel: {
    color: THEME.colors.textMuted,
    fontSize: 9,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: THEME.radii.md,
    marginBottom: 10,
  },
  statusBoxNormal: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  statusBoxCritical: {
    backgroundColor: THEME.colors.criticalBg,
    borderWidth: 1,
    borderColor: THEME.colors.critical,
  },
  statusText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginLeft: 8,
    flex: 1,
  },
  countdownBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.criticalBg,
    borderColor: THEME.colors.critical,
    borderWidth: 1.5,
    borderRadius: THEME.radii.md,
    padding: 10,
    marginBottom: 10,
  },
  countdownCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.colors.critical,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownNumber: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
  },
  countdownTitle: {
    color: THEME.colors.critical,
    fontSize: 12,
    fontWeight: '800',
  },
  countdownSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  cancelButton: {
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  cancelButtonText: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  emergencyActiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.critical,
    borderRadius: THEME.radii.md,
    padding: 12,
    marginBottom: 10,
  },
  emergencyActiveTitle: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 12,
  },
  emergencyActiveSubtitle: {
    color: '#FEE2E2',
    fontSize: 10,
    marginTop: 2,
  },
  stopButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radii.sm,
  },
  stopButtonText: {
    color: THEME.colors.critical,
    fontWeight: '800',
    fontSize: 11,
  },
  manualSosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.critical,
    paddingVertical: 10,
    borderRadius: THEME.radii.md,
  },
  manualSosText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 12,
    marginLeft: 6,
  },
});
