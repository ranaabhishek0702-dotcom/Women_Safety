import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Circle, Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { HotspotZone } from '../types';

interface HotspotMapCardProps {
  hotspots: HotspotZone[];
  selectedHotspot: HotspotZone | null;
  onSelectHotspot: (hotspot: HotspotZone) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_HEIGHT = 280;

export const HotspotMapCard: React.FC<HotspotMapCardProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
}) => {
  const [filterRating, setFilterRating] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const filteredHotspots = hotspots.filter((h) => {
    if (filterRating === 'ALL') return true;
    return h.riskRating === filterRating;
  });

  // Normalized map coordinates for GIS visual representation
  const mapCenter = { lat: 28.575, lng: 77.32 };
  const getMapCoords = (lat: number, lng: number) => {
    const x = ((lng - 77.305) / 0.035) * (SCREEN_WIDTH - 32);
    const y = ((28.595 - lat) / 0.035) * MAP_HEIGHT;
    return {
      x: Math.max(25, Math.min(SCREEN_WIDTH - 55, x)),
      y: Math.max(30, Math.min(MAP_HEIGHT - 35, y)),
    };
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Ionicons name="map" size={16} color={THEME.colors.hudCyan} />
          <Text style={styles.title}>Incident Hotspot Analytics (GIS Map)</Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterPills}>
          {(['ALL', 'HIGH'] as const).map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.filterPill,
                filterRating === r && styles.filterPillActive,
                r === 'HIGH' && filterRating === 'HIGH' && { borderColor: THEME.colors.critical },
              ]}
              onPress={() => setFilterRating(r)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filterRating === r && styles.filterPillTextActive,
                ]}
              >
                {r === 'HIGH' ? 'High Risk' : 'All'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Interactive Vector GIS Safety Map */}
      <View style={styles.mapCanvas}>
        <Svg width="100%" height={MAP_HEIGHT}>
          {/* Grid Background */}
          {[...Array(6)].map((_, i) => (
            <Line
              key={`h-grid-${i}`}
              x1="0"
              y1={i * 45}
              x2={SCREEN_WIDTH - 32}
              y2={i * 45}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <Line
              key={`v-grid-${i}`}
              x1={i * 60}
              y1="0"
              x2={i * 60}
              y2={MAP_HEIGHT}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
          ))}

          {/* Road / Metro Corridor Network Silhouette */}
          <Line
            x1="30"
            y1="50"
            x2={SCREEN_WIDTH - 50}
            y2="240"
            stroke="rgba(56, 189, 248, 0.25)"
            strokeWidth="5"
          />
          <Line
            x1="50"
            y1="230"
            x2={SCREEN_WIDTH - 60}
            y2="40"
            stroke="rgba(56, 189, 248, 0.15)"
            strokeWidth="3"
          />

          {/* Hotspot Radii & Pins */}
          {filteredHotspots.map((hs) => {
            const coords = getMapCoords(hs.latitude, hs.longitude);
            const isSelected = selectedHotspot?.id === hs.id;

            let pinColor = THEME.colors.safe;
            let radiusColor = 'rgba(16, 185, 129, 0.15)';
            let radiusSize = 20;

            if (hs.riskRating === 'HIGH') {
              pinColor = THEME.colors.critical;
              radiusColor = 'rgba(239, 68, 68, 0.25)';
              radiusSize = 35;
            } else if (hs.riskRating === 'MEDIUM') {
              pinColor = THEME.colors.medium;
              radiusColor = 'rgba(251, 191, 36, 0.2)';
              radiusSize = 26;
            }

            return (
              <G key={hs.id}>
                {/* Hotspot Heat Density Circle */}
                <Circle
                  cx={coords.x}
                  cy={coords.y}
                  r={radiusSize}
                  fill={radiusColor}
                  stroke={pinColor}
                  strokeWidth={isSelected ? '2' : '0.5'}
                />

                {/* Hotspot Center Pin */}
                <Circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isSelected ? 9 : 6}
                  fill={pinColor}
                  stroke="#FFF"
                  strokeWidth="2"
                />

                {/* Incident Count Badge */}
                <SvgText
                  x={coords.x}
                  y={coords.y - 12}
                  fill="#FFF"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {hs.incidentCount}
                </SvgText>
              </G>
            );
          })}
        </Svg>

        {/* User GPS Live Beacon */}
        <View style={styles.userBeacon}>
          <View style={styles.userBeaconDot} />
          <Text style={styles.userBeaconText}>Your GPS</Text>
        </View>

        {/* Map Legend */}
        <View style={styles.mapLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: THEME.colors.critical }]} />
            <Text style={styles.legendLabel}>High Risk</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: THEME.colors.medium }]} />
            <Text style={styles.legendLabel}>Medium Risk</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: THEME.colors.safe }]} />
            <Text style={styles.legendLabel}>Safe Zone</Text>
          </View>
        </View>
      </View>

      {/* Selected Hotspot Intelligence Drawer */}
      {selectedHotspot && (
        <View style={styles.hotspotDetailsDrawer}>
          <View style={styles.drawerHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.drawerTitle}>{selectedHotspot.name}</Text>
              <Text style={styles.drawerArea}>
                {selectedHotspot.area} • {selectedHotspot.distanceKm} km away
              </Text>
            </View>

            <View
              style={[
                styles.drawerRiskBadge,
                selectedHotspot.riskRating === 'HIGH'
                  ? { backgroundColor: THEME.colors.criticalBg, borderColor: THEME.colors.critical }
                  : { backgroundColor: THEME.colors.mediumBg, borderColor: THEME.colors.medium },
              ]}
            >
              <Text
                style={[
                  styles.drawerRiskText,
                  {
                    color:
                      selectedHotspot.riskRating === 'HIGH'
                        ? THEME.colors.critical
                        : THEME.colors.medium,
                  },
                ]}
              >
                {selectedHotspot.riskRating} RISK
              </Text>
            </View>
          </View>

          <View style={styles.drawerGrid}>
            <View style={styles.drawerGridItem}>
              <Text style={styles.drawerGridLabel}>Past Incident Count</Text>
              <Text style={styles.drawerGridValue}>{selectedHotspot.incidentCount} Reports</Text>
            </View>
            <View style={styles.drawerGridItem}>
              <Text style={styles.drawerGridLabel}>Peak Vulnerable Hours</Text>
              <Text style={styles.drawerGridValue}>{selectedHotspot.peakVulnerableHours}</Text>
            </View>
            <View style={styles.drawerGridItem}>
              <Text style={styles.drawerGridLabel}>Primary Threat Detected</Text>
              <Text style={styles.drawerGridValue} numberOfLines={1}>
                {selectedHotspot.primaryThreat}
              </Text>
            </View>
            <View style={styles.drawerGridItem}>
              <Text style={styles.drawerGridLabel}>Nearest Patrol Station</Text>
              <Text style={styles.drawerGridValue} numberOfLines={1}>
                {selectedHotspot.nearestPatrolUnit}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Horizontal Hotspot Quick Selector Cards */}
      <View style={styles.chipsRow}>
        {filteredHotspots.slice(0, 4).map((h) => {
          const isSelected = selectedHotspot?.id === h.id;
          return (
            <TouchableOpacity
              key={h.id}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => onSelectHotspot(h)}
            >
              <Text
                style={[styles.chipTitle, isSelected && styles.chipTitleActive]}
                numberOfLines={1}
              >
                {h.name.split(' ')[0]} {h.name.split(' ')[1]}
              </Text>
              <Text style={styles.chipIncidents}>{h.incidentCount} alerts</Text>
            </TouchableOpacity>
          );
        })}
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
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  filterPills: {
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.full,
    backgroundColor: THEME.colors.background,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  filterPillActive: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderColor: THEME.colors.hudCyan,
  },
  filterPillText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  mapCanvas: {
    height: MAP_HEIGHT,
    backgroundColor: '#070C15',
    borderRadius: THEME.radii.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  userBeacon: {
    position: 'absolute',
    top: 130,
    left: 80,
    alignItems: 'center',
  },
  userBeaconDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#38BDF8',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userBeaconText: {
    color: '#38BDF8',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 2,
  },
  mapLegend: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radii.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  legendLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 9,
  },
  hotspotDetailsDrawer: {
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.radii.md,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  drawerTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  drawerArea: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  drawerRiskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
  },
  drawerRiskText: {
    fontSize: 10,
    fontWeight: '800',
  },
  drawerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  drawerGridItem: {
    width: '50%',
    paddingVertical: 4,
  },
  drawerGridLabel: {
    color: THEME.colors.textMuted,
    fontSize: 9,
  },
  drawerGridValue: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  chip: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: THEME.radii.sm,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    alignItems: 'center',
  },
  chipActive: {
    borderColor: THEME.colors.hudCyan,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  chipTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  chipTitleActive: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  chipIncidents: {
    color: THEME.colors.textMuted,
    fontSize: 8,
    marginTop: 1,
  },
});
