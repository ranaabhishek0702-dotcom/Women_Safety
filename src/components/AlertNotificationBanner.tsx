import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { ThreatAlert } from '../types';

interface AlertNotificationBannerProps {
  alerts: ThreatAlert[];
  onDismiss: (id: string) => void;
  onDispatch: (id: string) => void;
}

export const AlertNotificationBanner: React.FC<AlertNotificationBannerProps> = ({
  alerts,
  onDismiss,
  onDispatch,
}) => {
  const activeCriticalAlerts = alerts.filter(
    (a) => a.status === 'ACTIVE' && (a.severity === 'CRITICAL' || a.severity === 'HIGH')
  );

  if (activeCriticalAlerts.length === 0) return null;

  const currentAlert = activeCriticalAlerts[0];
  const isCritical = currentAlert.severity === 'CRITICAL';

  return (
    <View
      style={[
        styles.bannerContainer,
        isCritical ? styles.bannerCritical : styles.bannerHigh,
      ]}
    >
      <View style={styles.topInfoRow}>
        <View style={styles.badgeRow}>
          <View style={[styles.iconBox, isCritical ? styles.iconBoxCritical : styles.iconBoxHigh]}>
            <Ionicons
              name={isCritical ? 'alert-circle' : 'warning'}
              size={20}
              color="#FFF"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={styles.titleWrap}>
              <Text style={styles.alertTitle}>{currentAlert.title}</Text>
              <Text style={styles.timestampText}>{currentAlert.timestamp}</Text>
            </View>
            <Text style={styles.locationText}>
              <Ionicons name="location" size={11} color={isCritical ? '#FCA5A5' : '#FDE68A'} />
              {' '}{currentAlert.locationName}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.descriptionText}>{currentAlert.description}</Text>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.dispatchButton}
          onPress={() => onDispatch(currentAlert.id)}
          activeOpacity={0.8}
        >
          <Ionicons name="shield-sharp" size={14} color="#FFF" />
          <Text style={styles.dispatchButtonText}>Dispatch Patrol (PCR)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dismissButton}
          onPress={() => onDismiss(currentAlert.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.dismissButtonText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: THEME.radii.md,
    padding: 12,
    borderWidth: 1.5,
  },
  bannerCritical: {
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    borderColor: THEME.colors.critical,
  },
  bannerHigh: {
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderColor: THEME.colors.belGold,
  },
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxCritical: {
    backgroundColor: THEME.colors.critical,
  },
  iconBoxHigh: {
    backgroundColor: THEME.colors.high,
  },
  titleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
  timestampText: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginLeft: 6,
  },
  locationText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  descriptionText: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    marginTop: 6,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dispatchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.critical,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radii.sm,
    marginRight: 8,
  },
  dispatchButtonText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  dismissButton: {
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  dismissButtonText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
});
