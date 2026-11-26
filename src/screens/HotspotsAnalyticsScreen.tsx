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
import { HotspotZone } from '../types';
import { HotspotMapCard } from '../components/HotspotMapCard';
import { SafeRouteNavigator } from '../components/SafeRouteNavigator';
import { HotspotAnalyticsService, PatrolRecommendation } from '../services/hotspotAnalytics';
import { MOCK_HOTSPOTS } from '../constants/mockHotspots';

export const HotspotsAnalyticsScreen: React.FC = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotZone | null>(MOCK_HOTSPOTS[0]);
  const [patrolRecommendations] = useState<PatrolRecommendation[]>(
    HotspotAnalyticsService.generatePatrolRecommendations()
  );
  const cityMetrics = HotspotAnalyticsService.getOverallCitySafetyMetrics();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* City Safety Metrics Overview Bar */}
        <View style={styles.metricsCard}>
          <View style={styles.metricsHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="analytics" size={16} color={THEME.colors.hudCyan} />
              <Text style={styles.metricsTitle}>City-Wide Women Safety Telemetry</Text>
            </View>
            <View style={styles.cityPill}>
              <Text style={styles.cityPillText}>NCR Urban Sector</Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Monitored Zones</Text>
              <Text style={styles.metricValue}>{cityMetrics.totalZones}</Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>High Risk Hotspots</Text>
              <Text style={[styles.metricValue, { color: THEME.colors.critical }]}>
                {cityMetrics.highRiskCount}
              </Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Past 30d Incidents</Text>
              <Text style={[styles.metricValue, { color: THEME.colors.belGold }]}>
                {cityMetrics.totalIncidents}
              </Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Active CCTV Feeds</Text>
              <Text style={[styles.metricValue, { color: THEME.colors.safe }]}>
                {cityMetrics.totalActiveCCTV}
              </Text>
            </View>
          </View>
        </View>

        {/* GIS Hotspot Vector Map Card */}
        <HotspotMapCard
          hotspots={MOCK_HOTSPOTS}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={(h) => setSelectedHotspot(h)}
        />

        {/* AI Safe Route Navigator */}
        <SafeRouteNavigator />

        {/* BEL SBU Patrol Deployment Recommender */}
        <View style={styles.patrolCard}>
          <View style={styles.patrolHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Ionicons name="car-sport" size={18} color="#38BDF8" />
              <Text style={styles.patrolSectionTitle}>
                Strategic PCR Patrol Deployment (BEL SBU)
              </Text>
            </View>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI OPTIMIZED</Text>
            </View>
          </View>

          <Text style={styles.patrolSubtitle}>
            Autonomous recommendations based on high incident density, unlit dark stretches, and
            peak vulnerability windows:
          </Text>

          {patrolRecommendations.map((rec) => (
            <View key={rec.unitId} style={styles.recItem}>
              <View style={styles.recTopRow}>
                <View style={styles.unitPill}>
                  <Text style={styles.unitPillText}>{rec.unitId}</Text>
                </View>
                <Text style={styles.recLocation}>{rec.recommendedHotspot.name}</Text>
                <View
                  style={[
                    styles.priorityBadge,
                    rec.priority === 'URGENT'
                      ? { backgroundColor: THEME.colors.criticalBg, borderColor: THEME.colors.critical }
                      : { backgroundColor: THEME.colors.highBg, borderColor: THEME.colors.high },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      { color: rec.priority === 'URGENT' ? THEME.colors.critical : THEME.colors.high },
                    ]}
                  >
                    {rec.priority}
                  </Text>
                </View>
              </View>

              <Text style={styles.recReason}>{rec.reason}</Text>
              <View style={styles.actionRow}>
                <Ionicons name="arrow-forward-circle" size={13} color="#38BDF8" />
                <Text style={styles.actionText}>{rec.suggestedAction}</Text>
              </View>
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
  metricsCard: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  metricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricsTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  cityPill: {
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  cityPillText: {
    color: THEME.colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    marginBottom: 3,
  },
  metricValue: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  patrolCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  patrolHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  patrolSectionTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  aiBadge: {
    backgroundColor: THEME.colors.belDarkBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.belBlue,
  },
  aiBadgeText: {
    color: '#38BDF8',
    fontSize: 8,
    fontWeight: '800',
  },
  patrolSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 10,
  },
  recItem: {
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.radii.md,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  recTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  unitPill: {
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radii.sm,
    marginRight: 6,
  },
  unitPillText: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
  },
  recLocation: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 8,
    fontWeight: '800',
  },
  recReason: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  actionText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
});
