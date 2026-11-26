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
import { GestureRecognitionHUD } from '../components/GestureRecognitionHUD';

export const GestureSOSScreen: React.FC = () => {
  const {
    gestureState,
    setGestureStage,
    triggerManualSOS,
    cancelSOS,
    isEmergencyActive,
    sosCountdown,
    emergencyContacts,
    lastSOSPayload,
  } = useSafetyApp();

  const [activeGestureTab, setActiveGestureTab] = useState<'SIGNAL_FOR_HELP' | 'RAISED_HANDS'>(
    'SIGNAL_FOR_HELP'
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Introduction Banner */}
        <View style={styles.introBanner}>
          <View style={styles.introBadge}>
            <Ionicons name="sparkles" size={14} color="#38BDF8" />
            <Text style={styles.introBadgeText}>AI VISION GESTURE ENGINE</Text>
          </View>
          <Text style={styles.introTitle}>Distress Gesture Recognition</Text>
          <Text style={styles.introSubtitle}>
            Enables women to covertly or overtly call for help using internationally recognized
            hand signals. The AI detects the motion pattern even when unable to speak.
          </Text>
        </View>

        {/* Gesture Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeTab,
              activeGestureTab === 'SIGNAL_FOR_HELP' && styles.typeTabActive,
            ]}
            onPress={() => setActiveGestureTab('SIGNAL_FOR_HELP')}
          >
            <Ionicons
              name="hand-left"
              size={15}
              color={
                activeGestureTab === 'SIGNAL_FOR_HELP' ? THEME.colors.hudCyan : THEME.colors.textMuted
              }
            />
            <Text
              style={[
                styles.typeTabText,
                activeGestureTab === 'SIGNAL_FOR_HELP' && styles.typeTabTextActive,
              ]}
            >
              Signal for Help (Universal)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeTab,
              activeGestureTab === 'RAISED_HANDS' && styles.typeTabActive,
            ]}
            onPress={() => setActiveGestureTab('RAISED_HANDS')}
          >
            <Ionicons
              name="body"
              size={15}
              color={
                activeGestureTab === 'RAISED_HANDS' ? THEME.colors.hudCyan : THEME.colors.textMuted
              }
            />
            <Text
              style={[
                styles.typeTabText,
                activeGestureTab === 'RAISED_HANDS' && styles.typeTabTextActive,
              ]}
            >
              Raised Hands
            </Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Gesture Recognition HUD */}
        <GestureRecognitionHUD
          gestureState={gestureState}
          onSelectStage={setGestureStage}
          onManualSOS={triggerManualSOS}
          isEmergencyActive={isEmergencyActive}
          sosCountdown={sosCountdown}
          onCancelSOS={cancelSOS}
        />

        {/* Emergency Broadcast Telemetry Log */}
        {lastSOSPayload && (
          <View style={styles.payloadCard}>
            <View style={styles.payloadHeader}>
              <Ionicons name="send" size={15} color={THEME.colors.safe} />
              <Text style={styles.payloadTitle}>Last Emergency Broadcast Record</Text>
            </View>
            <View style={styles.payloadRow}>
              <Text style={styles.payloadLabel}>Alert ID:</Text>
              <Text style={styles.payloadValue}>{lastSOSPayload.alertId}</Text>
            </View>
            <View style={styles.payloadRow}>
              <Text style={styles.payloadLabel}>Trigger Source:</Text>
              <Text style={styles.payloadValue}>{lastSOSPayload.distressType}</Text>
            </View>
            <View style={styles.payloadRow}>
              <Text style={styles.payloadLabel}>GPS Coords:</Text>
              <Text style={styles.payloadValue}>
                {lastSOSPayload.latitude.toFixed(4)}, {lastSOSPayload.longitude.toFixed(4)}
              </Text>
            </View>
            <View style={styles.payloadRow}>
              <Text style={styles.payloadLabel}>Contacts Notified:</Text>
              <Text style={styles.payloadValue}>{lastSOSPayload.notifiedContactsCount} Units</Text>
            </View>
          </View>
        )}

        {/* Configured Emergency Contacts Card */}
        <View style={styles.contactsCard}>
          <View style={styles.contactsHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="call" size={16} color={THEME.colors.hudCyan} />
              <Text style={styles.contactsTitle}>Active Emergency Dispatch Network</Text>
            </View>
            <Text style={styles.contactsCount}>{emergencyContacts.length} Connected</Text>
          </View>

          {emergencyContacts.map((contact) => (
            <View key={contact.id} style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Ionicons
                  name={contact.isPrimary ? 'shield-checkmark' : 'person'}
                  size={16}
                  color={contact.isPrimary ? '#38BDF8' : THEME.colors.textSecondary}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelation}>
                  {contact.relation} • {contact.phone}
                </Text>
              </View>
              {contact.isPrimary && (
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryBadgeText}>INSTANT DISPATCH</Text>
                </View>
              )}
            </View>
          ))}
        </View>
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
  introBanner: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  introBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.belDarkBlue,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.sm,
    marginBottom: 8,
  },
  introBadgeText: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 4,
  },
  introTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  introSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.md,
    padding: 3,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: THEME.radii.sm,
  },
  typeTabActive: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: THEME.colors.hudCyan,
  },
  typeTabText: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
  },
  typeTabTextActive: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  payloadCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.safe,
  },
  payloadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  payloadTitle: {
    color: THEME.colors.safe,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
  },
  payloadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  payloadLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
  },
  payloadValue: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  contactsCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactsTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  contactsCount: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    padding: 10,
    borderRadius: THEME.radii.md,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactName: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  contactRelation: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginTop: 1,
  },
  primaryBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  primaryBadgeText: {
    color: '#38BDF8',
    fontSize: 8,
    fontWeight: '800',
  },
});
