export type Gender = 'male' | 'female';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface DetectedPerson {
  id: string;
  gender: Gender;
  confidence: number; // 0-1
  bbox: BoundingBox;
  isSurrounded?: boolean;
  isLoneWoman?: boolean;
  distanceToNearestFemale?: number; // relative normalized distance
}

export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SceneAnalytics {
  totalPersons: number;
  menCount: number;
  womenCount: number;
  maleToFemaleRatio: number;
  riskLevel: RiskLevel;
  safetyScore: number; // 0-100 (100 is safest)
  isNightTime: boolean;
  loneWomanDetected: boolean;
  surroundedWomanDetected: boolean;
  sosGestureDetected: boolean;
  densityIndex: 'SPARSE' | 'NORMAL' | 'CROWDED' | 'DANGEROUS';
  activeThreatCount: number;
}

export type AlertType = 
  | 'LONE_WOMAN_NIGHT'
  | 'WOMAN_SURROUNDED'
  | 'SOS_GESTURE'
  | 'ANOMALOUS_CROWDING'
  | 'HIGH_RISK_HOTSPOT_ENTRY';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'DISPATCHED' | 'INVESTIGATING' | 'RESOLVED';

export interface ThreatAlert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  locationName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  status: AlertStatus;
  confidenceScore: number;
  cctvCameraId?: string;
  patrolDispatchedTo?: string;
  resolvedAt?: string;
  snapshotPlaceholderColor?: string;
}

export type GestureType = 'SIGNAL_FOR_HELP' | 'RAISED_HANDS' | 'DISTRESS_WAVE' | 'NONE';

export interface GestureDetectionState {
  gestureType: GestureType;
  stage: 0 | 1 | 2 | 3; // 0=none, 1=palm open, 2=thumb tuck, 3=fist over thumb
  stageDescription: string;
  confidence: number; // 0-100%
  isDistressTriggered: boolean;
  countdownSeconds: number;
  lastDetectedTimestamp: number;
}

export interface HotspotZone {
  id: string;
  name: string;
  area: string;
  city: string;
  latitude: number;
  longitude: number;
  riskRating: 'HIGH' | 'MEDIUM' | 'LOW';
  safetyScore: number; // 0-100
  incidentCount: number;
  peakVulnerableHours: string;
  primaryThreat: string;
  nearestPatrolUnit: string;
  distanceKm: number;
  safeShelterNearby: string;
  lightingQuality: 'Adequate' | 'Sub-optimal' | 'Dark Stretch';
  activeCCTVCount: number;
}

export interface SafetyRoute {
  id: string;
  name: string;
  type: 'RECOMMENDED_SAFEST' | 'FASTEST' | 'BALANCED';
  durationMinutes: number;
  distanceKm: number;
  safetyScore: number; // 0-100
  lightingScore: number; // 0-100
  cctvCoveragePercent: number;
  policePatrolPresence: boolean;
  hotspotsAvoidedCount: number;
  riskDescription: string;
}

export type AppMode = 'CITIZEN' | 'LAW_ENFORCEMENT';

export interface SimulationScenario {
  id: string;
  name: string;
  tagline: string;
  description: string;
  timeOfDay: 'DAY' | 'NIGHT';
  simulatedTime: string;
  location: string;
  cameraId: string;
  persons: DetectedPerson[];
  gesture?: GestureType;
  gestureStage?: 0 | 1 | 2 | 3;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
}
