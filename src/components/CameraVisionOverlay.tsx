import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Rect, Line, Circle, Text as SvgText, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { DetectedPerson, SceneAnalytics } from '../types';
import { ProximityThreatLink } from '../services/visionAnalyticsEngine';

interface CameraVisionOverlayProps {
  persons: DetectedPerson[];
  analytics: SceneAnalytics;
  proximityLinks: ProximityThreatLink[];
  cameraId: string;
  locationName: string;
  isNightMode: boolean;
  onToggleNight?: () => void;
  onSwitchCamera?: () => void;
  isFrontCamera?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const OVERLAY_HEIGHT = 380;

export const CameraVisionOverlay: React.FC<CameraVisionOverlayProps> = ({
  persons,
  analytics,
  proximityLinks,
  cameraId,
  locationName,
  isNightMode,
  onToggleNight,
  onSwitchCamera,
  isFrontCamera,
}) => {
  const [showMesh, setShowMesh] = useState<boolean>(true);

  return (
    <View style={styles.container}>
      {/* Feed Background (Mimics CCTV Camera Viewfinder / Thermal Night Vision) */}
      <View
        style={[
          styles.viewfinderBg,
          isNightMode ? styles.viewfinderNight : styles.viewfinderDay,
        ]}
      >
        {/* Synthetic CCTV Scene Elements (Architectural silhouettes to represent street/underpass) */}
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          {/* Grid Scanner Mesh */}
          {showMesh && (
            <G opacity={isNightMode ? 0.15 : 0.08}>
              {[...Array(8)].map((_, i) => (
                <Line
                  key={`h-${i}`}
                  x1="0"
                  y1={i * 50}
                  x2={SCREEN_WIDTH}
                  y2={i * 50}
                  stroke={isNightMode ? '#38BDF8' : '#FFF'}
                  strokeWidth="1"
                  strokeDasharray="4, 4"
                />
              ))}
              {[...Array(7)].map((_, i) => (
                <Line
                  key={`v-${i}`}
                  x1={i * 60}
                  y1="0"
                  x2={i * 60}
                  y2={OVERLAY_HEIGHT}
                  stroke={isNightMode ? '#38BDF8' : '#FFF'}
                  strokeWidth="1"
                  strokeDasharray="4, 4"
                />
              ))}
            </G>
          )}

          {/* Proximity Threat Lines: Drawn directly from surrounding men to female */}
          {proximityLinks.map((link, idx) => {
            const x1 = (link.femaleCoord.x / 100) * SCREEN_WIDTH;
            const y1 = (link.femaleCoord.y / 100) * OVERLAY_HEIGHT;
            const x2 = (link.maleCoord.x / 100) * SCREEN_WIDTH;
            const y2 = (link.maleCoord.y / 100) * OVERLAY_HEIGHT;

            return (
              <G key={`threat-link-${idx}`}>
                <Line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={THEME.colors.critical}
                  strokeWidth="2.5"
                  strokeDasharray="6, 3"
                />
                <Circle cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} r="3" fill={THEME.colors.critical} />
              </G>
            );
          })}

          {/* Person Bounding Boxes with Gender Tags & Danger Framing */}
          {persons.map((person) => {
            const bx = (person.bbox.x / 100) * SCREEN_WIDTH;
            const by = (person.bbox.y / 100) * OVERLAY_HEIGHT;
            const bw = (person.bbox.width / 100) * SCREEN_WIDTH;
            const bh = (person.bbox.height / 100) * OVERLAY_HEIGHT;

            const isFemale = person.gender === 'female';
            const isCriticalSurrounded = person.isSurrounded;
            const isLoneAtNight = person.isLoneWoman;

            let strokeColor = isFemale ? THEME.colors.female : THEME.colors.male;
            let fillColor = isFemale ? THEME.colors.femaleGlow : THEME.colors.maleGlow;

            if (isCriticalSurrounded) {
              strokeColor = THEME.colors.critical;
              fillColor = THEME.colors.criticalBg;
            } else if (isLoneAtNight) {
              strokeColor = THEME.colors.high;
              fillColor = THEME.colors.highBg;
            }

            return (
              <G key={person.id}>
                {/* Person Bounding Box */}
                <Rect
                  x={bx}
                  y={by}
                  width={bw}
                  height={bh}
                  stroke={strokeColor}
                  strokeWidth={isCriticalSurrounded ? '3' : '2'}
                  fill={fillColor}
                  rx="4"
                />

                {/* Corner Accents for High-Tech HUD aesthetic */}
                <Line x1={bx} y1={by} x2={bx + 8} y2={by} stroke={strokeColor} strokeWidth="3" />
                <Line x1={bx} y1={by} x2={bx} y2={by + 8} stroke={strokeColor} strokeWidth="3" />
                <Line x1={bx + bw} y1={by} x2={bx + bw - 8} y2={by} stroke={strokeColor} strokeWidth="3" />
                <Line x1={bx + bw} y1={by} x2={bx + bw} y2={by + 8} stroke={strokeColor} strokeWidth="3" />

                {/* Gender & Confidence Label Plaque */}
                <Rect
                  x={bx}
                  y={by - 20}
                  width={Math.max(76, bw)}
                  height="18"
                  fill={strokeColor}
                  rx="3"
                />
                <SvgText
                  x={bx + 4}
                  y={by - 6}
                  fill="#FFF"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {isFemale ? 'WOMAN' : 'MAN'} {Math.round(person.confidence * 100)}%
                </SvgText>

                {/* Threat Tag if Surrounded or Lone Woman */}
                {isCriticalSurrounded && (
                  <G>
                    <Rect
                      x={bx}
                      y={by + bh + 4}
                      width={124}
                      height="18"
                      fill={THEME.colors.critical}
                      rx="3"
                    />
                    <SvgText
                      x={bx + 5}
                      y={by + bh + 17}
                      fill="#FFF"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      SURROUNDED THREAT!
                    </SvgText>
                  </G>
                )}

                {isLoneAtNight && (
                  <G>
                    <Rect
                      x={bx}
                      y={by + bh + 4}
                      width={120}
                      height="18"
                      fill={THEME.colors.high}
                      rx="3"
                    />
                    <SvgText
                      x={bx + 5}
                      y={by + bh + 17}
                      fill="#FFF"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      LONE WOMAN (NIGHT)
                    </SvgText>
                  </G>
                )}
              </G>
            );
          })}
        </Svg>

        {/* Top HUD Telemetry Bar */}
        <View style={styles.topHud}>
          <View style={styles.cctvBadge}>
            <View style={styles.liveRecDot} />
            <Text style={styles.cctvText}>{cameraId} • LIVE REC</Text>
          </View>

          <View style={styles.hudActions}>
            <TouchableOpacity
              style={styles.hudButton}
              onPress={() => setShowMesh(!showMesh)}
            >
              <Ionicons name="grid-outline" size={14} color="#38BDF8" />
            </TouchableOpacity>

            {onSwitchCamera && (
              <TouchableOpacity style={styles.hudButton} onPress={onSwitchCamera}>
                <Ionicons
                  name={isFrontCamera ? 'camera-reverse' : 'camera'}
                  size={14}
                  color="#FFF"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Bottom HUD Location & AI Status */}
        <View style={styles.bottomHud}>
          <View style={styles.locationPill}>
            <Ionicons name="videocam" size={12} color="#38BDF8" />
            <Text style={styles.locationPillText} numberOfLines={1}>
              {locationName}
            </Text>
          </View>

          <View style={styles.telemetryBox}>
            <Text style={styles.telemetryText}>
              FPS: 30 • RES: 1080p • {isNightMode ? 'IR NIGHT VISION' : 'RGB DAYLIGHT'}
            </Text>
          </View>
        </View>

        {/* Center Critical Alert Flashing HUD Watermark (when surrounded) */}
        {analytics.surroundedWomanDetected && (
          <View style={styles.surroundedWarningHUD}>
            <Ionicons name="warning" size={24} color={THEME.colors.critical} />
            <Text style={styles.surroundedWarningText}>
              CRITICAL: SURROUNDED THREAT DETECTED
            </Text>
            <Text style={styles.surroundedSubtext}>
              {analytics.menCount} Men clustering around female subject
            </Text>
          </View>
        )}

        {/* Lone Woman Indicator Overlay */}
        {analytics.loneWomanDetected && (
          <View style={styles.loneWomanHUD}>
            <Ionicons name="moon" size={18} color={THEME.colors.high} />
            <Text style={styles.loneWomanText}>
              PROACTIVE TRACKING: LONE WOMAN AT NIGHT
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.radii.lg,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
    backgroundColor: '#000',
  },
  viewfinderBg: {
    height: OVERLAY_HEIGHT,
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
  },
  viewfinderNight: {
    backgroundColor: '#07111D', // Deep IR Night Camera Tint
  },
  viewfinderDay: {
    backgroundColor: '#1E293B',
  },
  topHud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    zIndex: 10,
  },
  cctvBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  liveRecDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: THEME.colors.critical,
    marginRight: 6,
  },
  cctvText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  hudActions: {
    flexDirection: 'row',
  },
  hudButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: 6,
    borderRadius: THEME.radii.sm,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  bottomHud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  locationPillText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 5,
  },
  telemetryBox: {
    alignItems: 'flex-end',
  },
  telemetryText: {
    color: '#94A3B8',
    fontSize: 9,
    fontFamily: THEME.typography.fontMono,
  },
  surroundedWarningHUD: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.92)',
    padding: 10,
    borderRadius: THEME.radii.md,
    alignItems: 'center',
    zIndex: 20,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  surroundedWarningText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  surroundedSubtext: {
    color: '#FEE2E2',
    fontSize: 10,
    marginTop: 2,
  },
  loneWomanHUD: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.92)',
    padding: 8,
    borderRadius: THEME.radii.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 20,
  },
  loneWomanText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 11,
    marginLeft: 6,
  },
});
