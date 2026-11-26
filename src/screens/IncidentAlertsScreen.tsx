import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useSafetyApp } from '../context/SafetyAppContext';
import { AlertStatus } from '../types';

export const IncidentAlertsScreen: React.FC = () => {
  const { alerts, dismissAlert, dispatchPatrolForAlert } = useSafetyApp();
  const [statusFilter, setStatusFilter] = useState<'ALL' | AlertStatus>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (statusFilter === 'ALL') return true;
    return a.status === statusFilter;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Threat Incident Audit Trail</Text>
            <Text style={styles.headerSubtitle}>
              Logged safety events, computer vision alerts, and patrol dispatches
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{alerts.length} Total</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterBar}>
          {(['ALL', 'ACTIVE', 'DISPATCHED', 'RESOLVED'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                statusFilter === filter && styles.filterTabActive,
                filter === 'ACTIVE' &&
                  statusFilter === 'ACTIVE' && { borderColor: THEME.colors.critical },
              ]}
              onPress={() => setStatusFilter(filter)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  statusFilter === filter && styles.filterTabTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List of Alerts */}
        {filteredAlerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="shield-checkmark" size={40} color={THEME.colors.safe} />
            <Text style={styles.emptyStateTitle}>No {statusFilter.toLowerCase()} incidents</Text>
            <Text style={styles.emptyStateSub}>All sectors currently operating under safe conditions.</Text>
          </View>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isHigh = alert.severity === 'HIGH';

            return (
              <View
                key={alert.id}
                style={[
                  styles.alertCard,
                  isCritical && styles.alertCardCritical,
                  isHigh && styles.alertCardHigh,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleWrap}>
                    <View
                      style={[
                        styles.severityDot,
                        {
                          backgroundColor: isCritical
                            ? THEME.colors.critical
                            : isHigh
                            ? THEME.colors.high
                            : THEME.colors.medium,
                        },
                      ]}
                    />
                    <Text style={styles.alertTitle} numberOfLines={1}>
                      {alert.title}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      alert.status === 'ACTIVE'
                        ? { backgroundColor: THEME.colors.criticalBg, borderColor: THEME.colors.critical }
                        : alert.status === 'DISPATCHED'
                        ? { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: '#38BDF8' }
                        : { backgroundColor: THEME.colors.safeBg, borderColor: THEME.colors.safe },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        {
                          color:
                            alert.status === 'ACTIVE'
                              ? THEME.colors.critical
                              : alert.status === 'DISPATCHED'
                              ? '#38BDF8'
                              : THEME.colors.safe,
                        },
                      ]}
                    >
                      {alert.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.alertDescription}>{alert.description}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time" size={11} color={THEME.colors.textMuted} />
                    <Text style={styles.metaText}>{alert.timestamp}</Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Ionicons name="location" size={11} color={THEME.colors.textMuted} />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {alert.locationName.split('(')[0]}
                    </Text>
                  </View>

                  {alert.cctvCameraId && (
                    <View style={styles.metaItem}>
                      <Ionicons name="videocam" size={11} color={THEME.colors.textMuted} />
                      <Text style={styles.metaText}>{alert.cctvCameraId}</Text>
                    </View>
                  )}
                </View>

                {alert.patrolDispatchedTo && (
                  <View style={styles.dispatchPill}>
                    <Ionicons name="shield-checkmark" size={12} color="#38BDF8" />
                    <Text style={styles.dispatchPillText}>
                      Assigned: {alert.patrolDispatchedTo}
                    </Text>
                  </View>
                )}

                {/* Actions */}
                <View style={styles.cardActions}>
                  {alert.status === 'ACTIVE' && (
                    <TouchableOpacity
                      style={styles.dispatchBtn}
                      onPress={() => dispatchPatrolForAlert(alert.id, 'BEL PCR Interceptor')}
                    >
                      <Ionicons name="car-sport" size={13} color="#FFF" />
                      <Text style={styles.dispatchBtnText}>Dispatch Patrol Unit</Text>
                    </TouchableOpacity>
                  )}

                  {alert.status !== 'RESOLVED' && (
                    <TouchableOpacity
                      style={styles.resolveBtn}
                      onPress={() => dismissAlert(alert.id)}
                    >
                      <Ionicons name="checkmark" size={13} color={THEME.colors.textSecondary} />
                      <Text style={styles.resolveBtnText}>Mark Resolved</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  headerTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  countBadgeText: {
    color: THEME.colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.md,
    padding: 3,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  filterTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: THEME.radii.sm,
  },
  filterTabActive: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: THEME.colors.hudCyan,
  },
  filterTabText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  filterTabTextActive: {
    color: THEME.colors.textPrimary,
  },
  alertCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  alertCardCritical: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  alertCardHigh: {
    borderColor: 'rgba(245, 158, 11, 0.5)',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  alertTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  alertDescription: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginVertical: 2,
  },
  metaText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    marginLeft: 3,
  },
  dispatchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radii.sm,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  dispatchPillText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 5,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 8,
  },
  dispatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.critical,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radii.sm,
    marginRight: 6,
  },
  dispatchBtnText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  resolveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  resolveBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginLeft: 3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
  },
  emptyStateSub: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});
