import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import {
  AppMode,
  DetectedPerson,
  SceneAnalytics,
  ThreatAlert,
  GestureDetectionState,
  SimulationScenario,
  EmergencyContact,
} from '../types';
import { SAMPLE_FEEDS } from '../constants/sampleFeeds';
import { VisionAnalyticsEngine, ProximityThreatLink } from '../services/visionAnalyticsEngine';
import { GestureAnalyticsEngine } from '../services/gestureAnalyticsEngine';
import { AlertManager } from '../services/alertManager';
import { EmergencyContactService, SOSBroadcastPayload } from '../services/emergencyContactService';

interface SafetyAppContextType {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;

  // Camera & Surveillance Feeds
  isLiveCameraActive: boolean;
  setIsLiveCameraActive: (active: boolean) => void;
  cameraFacing: 'front' | 'back';
  switchCameraFacing: () => void;
  currentScenario: SimulationScenario;
  selectScenario: (scenarioId: string) => void;
  isNightMode: boolean;
  setIsNightMode: (night: boolean) => void;

  // Real-time Analytics State
  detectedPersons: DetectedPerson[];
  sceneAnalytics: SceneAnalytics;
  proximityLinks: ProximityThreatLink[];

  // Gesture State
  gestureState: GestureDetectionState;
  setGestureStage: (stage: 0 | 1 | 2 | 3) => void;
  triggerManualSOS: () => void;
  cancelSOS: () => void;

  // Alerts & Incidents
  alerts: ThreatAlert[];
  dismissAlert: (alertId: string) => void;
  dispatchPatrolForAlert: (alertId: string, unitName: string) => void;

  // Emergency SOS Broadcast
  isEmergencyActive: boolean;
  sosCountdown: number;
  lastSOSPayload: SOSBroadcastPayload | null;
  emergencyContacts: EmergencyContact[];
}

const SafetyAppContext = createContext<SafetyAppContextType | undefined>(undefined);

export const SafetyAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appMode, setAppMode] = useState<AppMode>('CITIZEN');
  const [isLiveCameraActive, setIsLiveCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
  const [currentScenario, setCurrentScenario] = useState<SimulationScenario>(SAMPLE_FEEDS[0]);
  const [isNightMode, setIsNightMode] = useState<boolean>(true);

  const [detectedPersons, setDetectedPersons] = useState<DetectedPerson[]>(SAMPLE_FEEDS[0].persons);
  const [proximityLinks, setProximityLinks] = useState<ProximityThreatLink[]>([]);
  const [sceneAnalytics, setSceneAnalytics] = useState<SceneAnalytics>({
    totalPersons: 5,
    menCount: 4,
    womenCount: 1,
    maleToFemaleRatio: 4,
    riskLevel: 'CRITICAL',
    safetyScore: 30,
    isNightTime: true,
    loneWomanDetected: false,
    surroundedWomanDetected: true,
    sosGestureDetected: false,
    densityIndex: 'NORMAL',
    activeThreatCount: 1,
  });

  const [gestureState, setGestureState] = useState<GestureDetectionState>({
    gestureType: 'NONE',
    stage: 0,
    stageDescription: 'Ready for gesture scanning',
    confidence: 0,
    isDistressTriggered: false,
    countdownSeconds: 0,
    lastDetectedTimestamp: Date.now(),
  });

  const [alerts, setAlerts] = useState<ThreatAlert[]>(AlertManager.getAlerts());
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [sosCountdown, setSosCountdown] = useState<number>(0);
  const [lastSOSPayload, setLastSOSPayload] = useState<SOSBroadcastPayload | null>(null);
  const [emergencyContacts] = useState<EmergencyContact[]>(EmergencyContactService.getContacts());

  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Switch scenario and recalculate scene
  const selectScenario = (scenarioId: string) => {
    const found = SAMPLE_FEEDS.find((s) => s.id === scenarioId);
    if (found) {
      setCurrentScenario(found);
      setIsNightMode(found.timeOfDay === 'NIGHT');
      setDetectedPersons(found.persons);

      if (found.gesture && found.gestureStage !== undefined) {
        setGestureStage(found.gestureStage);
      } else {
        setGestureStage(0);
      }
    }
  };

  const switchCameraFacing = () => {
    setCameraFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  // Re-run vision analytics whenever detected persons or night mode changes
  useEffect(() => {
    const result = VisionAnalyticsEngine.analyzeScene(detectedPersons, isNightMode);
    setSceneAnalytics(result.analytics);
    setProximityLinks(result.proximityLinks);

    // Auto-trigger alerts if critical conditions are met
    if (result.analytics.surroundedWomanDetected) {
      AlertManager.triggerAlert(
        'WOMAN_SURROUNDED',
        'Critical Threat: Woman Surrounded by Men',
        'Surveillance engine detected 3+ men tightly clustering around a lone female.',
        'CRITICAL',
        currentScenario.location,
        { latitude: 28.5833, longitude: 77.3167 },
        currentScenario.cameraId
      );
      setAlerts(AlertManager.getAlerts());
    } else if (result.analytics.loneWomanDetected) {
      AlertManager.triggerAlert(
        'LONE_WOMAN_NIGHT',
        'Warning: Lone Woman at Night Detected',
        'Single female identified in unpopulated sector during late-night hours.',
        'HIGH',
        currentScenario.location,
        { latitude: 28.5708, longitude: 77.3211 },
        currentScenario.cameraId
      );
      setAlerts(AlertManager.getAlerts());
    }
  }, [detectedPersons, isNightMode, currentScenario]);

  // Periodic subtle jitter to simulate live video feed motion
  useEffect(() => {
    const interval = setInterval(() => {
      setDetectedPersons((prev) => VisionAnalyticsEngine.jitterPositions(prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Set gesture stage
  const setGestureStage = (stage: 0 | 1 | 2 | 3) => {
    const evalResult = GestureAnalyticsEngine.evaluateGesture(
      stage,
      stage > 0 ? 'SIGNAL_FOR_HELP' : 'NONE'
    );
    setGestureState(evalResult);

    if (evalResult.isDistressTriggered) {
      startSOSCountdown('GESTURE_DETECTED');
    }
  };

  // Start SOS countdown safeguard (3 seconds to cancel)
  const startSOSCountdown = (distressType: 'GESTURE_DETECTED' | 'ONE_TOUCH_SOS') => {
    if (isEmergencyActive) return;

    setSosCountdown(3);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    let count = 3;
    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      setSosCountdown(count);

      if (count <= 0) {
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        // Execute SOS broadcast
        setIsEmergencyActive(true);
        const payload = EmergencyContactService.triggerEmergencyBroadcast(distressType);
        setLastSOSPayload(payload);

        AlertManager.triggerAlert(
          'SOS_GESTURE',
          'EMERGENCY SOS BROADCAST CONFIRMED',
          `Distress signal triggered via ${distressType}. Real-time GPS dispatched to BEL SBU & Police PCR units.`,
          'CRITICAL',
          'Sector 18 Metro Corridor (Near BEL Smart Hub)',
          { latitude: 28.5708, longitude: 77.3211 }
        );
        setAlerts(AlertManager.getAlerts());
      }
    }, 1000);
  };

  const triggerManualSOS = () => {
    startSOSCountdown('ONE_TOUCH_SOS');
  };

  const cancelSOS = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setSosCountdown(0);
    setIsEmergencyActive(false);
  };

  const dismissAlert = (alertId: string) => {
    AlertManager.updateAlertStatus(alertId, 'RESOLVED');
    setAlerts(AlertManager.getAlerts());
  };

  const dispatchPatrolForAlert = (alertId: string, unitName: string) => {
    AlertManager.updateAlertStatus(alertId, 'DISPATCHED', unitName);
    setAlerts(AlertManager.getAlerts());
  };

  return (
    <SafetyAppContext.Provider
      value={{
        appMode,
        setAppMode,
        isLiveCameraActive,
        setIsLiveCameraActive,
        cameraFacing,
        switchCameraFacing,
        currentScenario,
        selectScenario,
        isNightMode,
        setIsNightMode,
        detectedPersons,
        sceneAnalytics,
        proximityLinks,
        gestureState,
        setGestureStage,
        triggerManualSOS,
        cancelSOS,
        alerts,
        dismissAlert,
        dispatchPatrolForAlert,
        isEmergencyActive,
        sosCountdown,
        lastSOSPayload,
        emergencyContacts,
      }}
    >
      {children}
    </SafetyAppContext.Provider>
  );
};

export const useSafetyApp = (): SafetyAppContextType => {
  const context = useContext(SafetyAppContext);
  if (!context) {
    throw new Error('useSafetyApp must be used within a SafetyAppProvider');
  }
  return context;
};
