import { EmergencyContact } from '../types';
import { DEFAULT_EMERGENCY_CONTACTS } from '../constants/sampleFeeds';
import * as Haptics from 'expo-haptics';

export interface SOSBroadcastPayload {
  alertId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  locationAddress: string;
  distressType: 'GESTURE_DETECTED' | 'ONE_TOUCH_SOS' | 'SURROUNDED_THREAT';
  deviceBatteryLevel: string;
  notifiedContactsCount: number;
}

export class EmergencyContactService {
  private static contacts: EmergencyContact[] = [...DEFAULT_EMERGENCY_CONTACTS];

  public static getContacts(): EmergencyContact[] {
    return [...this.contacts];
  }

  public static addContact(name: string, relation: string, phone: string): EmergencyContact {
    const newContact: EmergencyContact = {
      id: `ec-${Date.now()}`,
      name,
      relation,
      phone,
      isPrimary: false,
    };
    this.contacts.push(newContact);
    return newContact;
  }

  public static removeContact(id: string): void {
    this.contacts = this.contacts.filter((c) => c.id !== id);
  }

  /**
   * Executes emergency broadcast sequence:
   * 1. Haptic emergency buzz
   * 2. Creates detailed SOS payload
   * 3. Simulates automated SMS dispatch with GPS link
   */
  public static triggerEmergencyBroadcast(
    distressType: 'GESTURE_DETECTED' | 'ONE_TOUCH_SOS' | 'SURROUNDED_THREAT',
    currentLocation?: { latitude: number; longitude: number; name?: string }
  ): SOSBroadcastPayload {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // Fallback
    }

    const lat = currentLocation?.latitude || 28.5833;
    const lng = currentLocation?.longitude || 77.3167;
    const locationName = currentLocation?.name || 'Near North Ring Bus Terminal, Sector 18';

    const payload: SOSBroadcastPayload = {
      alertId: `SOS-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString(),
      latitude: lat,
      longitude: lng,
      locationAddress: locationName,
      distressType,
      deviceBatteryLevel: '84%',
      notifiedContactsCount: this.contacts.length,
    };

    return payload;
  }
}
