import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { SafetyRoute } from '../types';
import { MOCK_SAFE_ROUTES } from '../constants/mockHotspots';

export const SafeRouteNavigator: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(MOCK_SAFE_ROUTES[0].id);

  const selectedRoute =
    MOCK_SAFE_ROUTES.find((r) => r.id === selectedRouteId) || MOCK_SAFE_ROUTES[0];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Ionicons name="navigate-circle" size={18} color={THEME.colors.hudCyan} />
          <Text style={styles.title}>Safe Route Navigator (AI Path Risk Evaluator)</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>BEL SafePass</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Evaluates real-time pedestrian routes using incident hotspot history, continuous CCTV
        density, and active PCR police patrol presence:
      </Text>

      {/* Route Selection Tabs */}
      <View style={styles.routeTabs}>
        {MOCK_SAFE_ROUTES.map((route) => {
          const isSelected = route.id === selectedRouteId;
          const isSafest = route.type === 'RECOMMENDED_SAFEST';
          const isDanger = route.type === 'FASTEST';

          return (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routeTab,
                isSelected && styles.routeTabActive,
                isSafest && isSelected && { borderColor: THEME.colors.safe },
                isDanger && isSelected && { borderColor: THEME.colors.critical },
              ]}
              onPress={() => setSelectedRouteId(route.id)}
            >
              <View style={styles.tabHeader}>
                <Ionicons
                  name={isSafest ? 'shield-checkmark' : isDanger ? 'flash' : 'trail-sign'}
                  size={14}
                  color={
                    isSafest
                      ? THEME.colors.safe
                      : isDanger
                      ? THEME.colors.critical
                      : THEME.colors.belGold
                  }
                />
                <Text style={styles.tabDuration}>{route.durationMinutes} min</Text>
              </View>

              <Text
                style={[styles.tabName, isSelected && styles.tabNameActive]}
                numberOfLines={1}
              >
                {route.name.split('(')[0]}
              </Text>

              <View style={styles.tabScoreRow}>
                <Text
                  style={[
                    styles.tabScore,
                    {
                      color:
                        route.safetyScore >= 80
                          ? THEME.colors.safe
                          : route.safetyScore <= 40
                          ? THEME.colors.critical
                          : THEME.colors.medium,
                    },
                  ]}
                >
                  {route.safetyScore}/100 Safety
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Route Detailed Analytics */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailsTop}>
          <View>
            <Text style={styles.detailsTitle}>{selectedRoute.name}</Text>
            <Text style={styles.detailsDistance}>
              {selectedRoute.distanceKm} km • {selectedRoute.durationMinutes} min walk
            </Text>
          </View>

          <View
            style={[
              styles.safetyPill,
              selectedRoute.safetyScore >= 80
                ? { backgroundColor: THEME.colors.safeBg, borderColor: THEME.colors.safe }
                : { backgroundColor: THEME.colors.criticalBg, borderColor: THEME.colors.critical },
            ]}
          >
            <Text
              style={[
                styles.safetyPillText,
                {
                  color:
                    selectedRoute.safetyScore >= 80
                      ? THEME.colors.safe
                      : THEME.colors.critical,
                },
              ]}
            >
              Safety Index: {selectedRoute.safetyScore}%
            </Text>
          </View>
        </View>

        <Text style={styles.descriptionText}>{selectedRoute.riskDescription}</Text>

        {/* Feature Checkpoints */}
        <View style={styles.featureGrid}>
          <View style={styles.featureItem}>
            <Ionicons name="sunny" size={14} color={THEME.colors.belGold} />
            <Text style={styles.featureLabel}>Street Lighting: {selectedRoute.lightingScore}%</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="videocam" size={14} color={THEME.colors.hudCyan} />
            <Text style={styles.featureLabel}>CCTV Coverage: {selectedRoute.cctvCoveragePercent}%</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons
              name={selectedRoute.policePatrolPresence ? 'checkmark-circle' : 'close-circle'}
              size={14}
              color={selectedRoute.policePatrolPresence ? THEME.colors.safe : THEME.colors.critical}
            />
            <Text style={styles.featureLabel}>
              {selectedRoute.policePatrolPresence ? 'Police Patrol Active' : 'No Patrol Coverage'}
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="shield" size={14} color={THEME.colors.safe} />
            <Text style={styles.featureLabel}>
              Avoids {selectedRoute.hotspotsAvoidedCount} Hotspots
            </Text>
          </View>
        </View>

        {/* Navigation Action */}
        <TouchableOpacity style={styles.navigateButton} activeOpacity={0.8}>
          <Ionicons name="navigate" size={15} color="#FFF" />
          <Text style={styles.navigateButtonText}>Start Navigation Along Safe-Corridor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.lg,
    padding: 14,
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
    flex: 1,
  },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  badge: {
    backgroundColor: THEME.colors.belDarkBlue,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.belBlue,
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
  },
  subtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 10,
  },
  routeTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  routeTab: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.radii.md,
    padding: 8,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  routeTabActive: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderColor: THEME.colors.hudCyan,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabDuration: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  tabName: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  tabNameActive: {
    color: THEME.colors.textPrimary,
  },
  tabScoreRow: {
    marginTop: 4,
  },
  tabScore: {
    fontSize: 9,
    fontWeight: '800',
  },
  detailsContainer: {
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.radii.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  detailsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  detailsTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  detailsDistance: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  safetyPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
  },
  safetyPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  descriptionText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 10,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  featureItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  featureLabel: {
    color: THEME.colors.textPrimary,
    fontSize: 10,
    marginLeft: 6,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.safe,
    paddingVertical: 9,
    borderRadius: THEME.radii.md,
  },
  navigateButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
});
