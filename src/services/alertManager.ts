import { ThreatAlert, AlertType, AlertSeverity } from '../types';
import { MOCK_ALERTS } from '../constants/mockAlerts';
import * as Haptics from 'expo-haptics';

export class AlertManager {
  private static alerts: ThreatAlert[] = [...MOCK_ALERTS];
  private static lastCreatedAlertTime: Record<string, number> = {};
  private static DEDUP_INTERVAL_MS = 15000; // prevent alert spamming within 15 seconds

  public static getAlerts(): ThreatAlert[] {
    return [...this.alerts];
  }

  public static triggerAlert(
    type: AlertType,
    title: string,
    description: string,
    severity: AlertSeverity,
    locationName: string,
    coordinates: { latitude: number; longitude: number },
    cctvCameraId?: string
  ): ThreatAlert | null {
    const now = Date.now();
    const lastTime = this.lastCreatedAlertTime[type] || 0;

    if (now - lastTime < this.DEDUP_INTERVAL_MS) {
      return null; // Suppress duplicate alert within window
    }

    this.lastCreatedAlertTime[type] = now;

    // Trigger device haptics
    try {
      if (severity === 'CRITICAL') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (severity === 'HIGH') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch {
      // Haptics fallback on web or unsupported platforms
    }

    const newAlert: ThreatAlert = {
      id: `alt-${Date.now().toString().slice(-4)}`,
      type,
      title,
      description,
      severity,
      timestamp: 'Just now (' + new Date().toLocaleTimeString() + ')',
      locationName,
      coordinates,
      status: 'ACTIVE',
      confidenceScore: 0.95,
      cctvCameraId: cctvCameraId || 'BEL-LIVE-AI',
      patrolDispatchedTo: 'BEL Security Quick Reaction Team (QRT)',
      snapshotPlaceholderColor: severity === 'CRITICAL' ? '#EF4444' : '#F59E0B',
    };

    this.alerts = [newAlert, ...this.alerts];
    return newAlert;
  }

  public static updateAlertStatus(
    alertId: string,
    status: 'ACTIVE' | 'DISPATCHED' | 'INVESTIGATING' | 'RESOLVED',
    patrolDispatchedTo?: string
  ): void {
    this.alerts = this.alerts.map((a) => {
      if (a.id === alertId) {
        return {
          ...a,
          status,
          patrolDispatchedTo: patrolDispatchedTo || a.patrolDispatchedTo,
          resolvedAt: status === 'RESOLVED' ? new Date().toLocaleTimeString() : a.resolvedAt,
        };
      }
      return a;
    });
  }

  public static clearResolvedAlerts(): void {
    this.alerts = this.alerts.filter((a) => a.status !== 'RESOLVED');
  }
}
