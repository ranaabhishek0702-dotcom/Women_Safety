import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { SceneAnalytics } from '../types';

interface GenderDistributionBarProps {
  analytics: SceneAnalytics;
}

export const GenderDistributionBar: React.FC<GenderDistributionBarProps> = ({ analytics }) => {
  const {
    totalPersons,
    menCount,
    womenCount,
    maleToFemaleRatio,
    riskLevel,
    safetyScore,
    isNightTime,
    loneWomanDetected,
    surroundedWomanDetected,
  } = analytics;

  // Percentage calculations
  const menPercent = totalPersons > 0 ? (menCount / totalPersons) * 100 : 50;
  const womenPercent = totalPersons > 0 ? (womenCount / totalPersons) * 100 : 50;

  const getRiskBadgeColor = () => {
    switch (riskLevel) {
      case 'CRITICAL':
        return { bg: THEME.colors.criticalBg, border: THEME.colors.critical, text: THEME.colors.critical };
      case 'HIGH':
        return { bg: THEME.colors.highBg, border: THEME.colors.high, text: THEME.colors.high };
      case 'MEDIUM':
        return { bg: THEME.colors.mediumBg, border: THEME.colors.medium, text: THEME.colors.medium };
      default:
        return { bg: THEME.colors.safeBg, border: THEME.colors.safe, text: THEME.colors.safe };
    }
  };

  const riskBadge = getRiskBadgeColor();

  return (
    <View style={styles.card}>
      {/* Metric Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="people-sharp" size={16} color={THEME.colors.hudCyan} />
          <Text style={styles.headerTitle}>Gender Distribution & Analytics</Text>
        </View>

        {/* Risk Badge */}
        <View style={[styles.riskBadge, { backgroundColor: riskBadge.bg, borderColor: riskBadge.border }]}>
          <View style={[styles.pulseDot, { backgroundColor: riskBadge.text }]} />
          <Text style={[styles.riskBadgeText, { color: riskBadge.text }]}>{riskLevel} RISK</Text>
        </View>
      </View>

      {/* Numerical Stats Counters */}
      <View style={styles.statsRow}>
        {/* Women Pill */}
        <View style={[styles.countPill, styles.womenPill]}>
          <Ionicons name="woman" size={18} color={THEME.colors.female} />
          <View style={styles.pillTextContainer}>
            <Text style={styles.pillNumber}>{womenCount}</Text>
            <Text style={styles.pillLabel}>Women ({totalPersons > 0 ? Math.round(womenPercent) : 0}%)</Text>
          </View>
        </View>

        {/* Ratio Pill */}
        <View style={styles.ratioPill}>
          <Text style={styles.ratioValue}>
            {womenCount === 0 ? `${menCount}:0` : `${maleToFemaleRatio}:1`}
          </Text>
          <Text style={styles.ratioLabel}>M : F Ratio</Text>
        </View>

        {/* Men Pill */}
        <View style={[styles.countPill, styles.menPill]}>
          <Ionicons name="man" size={18} color={THEME.colors.male} />
          <View style={styles.pillTextContainer}>
            <Text style={styles.pillNumber}>{menCount}</Text>
            <Text style={styles.pillLabel}>Men ({totalPersons > 0 ? Math.round(menPercent) : 0}%)</Text>
          </View>
        </View>
      </View>

      {/* Visual Gender Proportional Distribution Bar */}
      <View style={styles.barContainer}>
        {totalPersons === 0 ? (
          <View style={styles.emptyBar}>
            <Text style={styles.emptyBarText}>No subjects detected in frame</Text>
          </View>
        ) : (
          <View style={styles.barTrack}>
            <View style={[styles.barFemale, { width: `${womenPercent}%` }]} />
            <View style={[styles.barMale, { width: `${menPercent}%` }]} />
          </View>
        )}
      </View>

      {/* Safety Score & Detection Badges */}
      <View style={styles.footerRow}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Scene Safety Score:</Text>
          <Text style={[styles.scoreValue, { color: riskBadge.text }]}>
            {safetyScore}<Text style={styles.scoreTotal}>/100</Text>
          </Text>
        </View>

        <View style={styles.tagsContainer}>
          {loneWomanDetected && (
            <View style={[styles.tag, { borderColor: THEME.colors.high, backgroundColor: THEME.colors.highBg }]}>
              <Ionicons name="moon" size={11} color={THEME.colors.high} />
              <Text style={[styles.tagText, { color: THEME.colors.high }]}>Lone Woman at Night</Text>
            </View>
          )}

          {surroundedWomanDetected && (
            <View style={[styles.tag, { borderColor: THEME.colors.critical, backgroundColor: THEME.colors.criticalBg }]}>
              <Ionicons name="warning" size={11} color={THEME.colors.critical} />
              <Text style={[styles.tagText, { color: THEME.colors.critical }]}>Woman Surrounded</Text>
            </View>
          )}

          {!loneWomanDetected && !surroundedWomanDetected && (
            <View style={[styles.tag, { borderColor: THEME.colors.safe, backgroundColor: THEME.colors.safeBg }]}>
              <Ionicons name="checkmark-circle" size={11} color={THEME.colors.safe} />
              <Text style={[styles.tagText, { color: THEME.colors.safe }]}>Normal Crowd Pattern</Text>
            </View>
          )}
        </View>
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  riskBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: THEME.radii.md,
    borderWidth: 1,
  },
  womenPill: {
    backgroundColor: THEME.colors.femaleGlow,
    borderColor: THEME.colors.femaleBorder,
    marginRight: 6,
  },
  menPill: {
    backgroundColor: THEME.colors.maleGlow,
    borderColor: THEME.colors.maleBorder,
    marginLeft: 6,
  },
  pillTextContainer: {
    marginLeft: 8,
  },
  pillNumber: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  pillLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  ratioPill: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  ratioValue: {
    color: THEME.colors.belGold,
    fontWeight: '800',
    fontSize: 14,
  },
  ratioLabel: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    marginTop: 1,
  },
  barContainer: {
    marginBottom: 10,
  },
  barTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: THEME.colors.background,
  },
  barFemale: {
    height: '100%',
    backgroundColor: THEME.colors.female,
  },
  barMale: {
    height: '100%',
    backgroundColor: THEME.colors.male,
  },
  emptyBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBarText: {
    color: THEME.colors.textMuted,
    fontSize: 9,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginRight: 4,
  },
  scoreValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  scoreTotal: {
    color: THEME.colors.textMuted,
    fontSize: 11,
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    marginLeft: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
});
