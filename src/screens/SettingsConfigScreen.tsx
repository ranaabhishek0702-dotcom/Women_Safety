import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useSafetyApp } from '../context/SafetyAppContext';
import { EmergencyContactService } from '../services/emergencyContactService';

export const SettingsConfigScreen: React.FC = () => {
  const { isNightMode, setIsNightMode, appMode, setAppMode, emergencyContacts } = useSafetyApp();

  const [loneWomanThresholdHours, setLoneWomanThresholdHours] = useState<string>('20:00 - 05:00');
  const [proximityDistance, setProximityDistance] = useState<number>(2.5); // meters
  const [surroundedCountThreshold, setSurroundedCountThreshold] = useState<number>(3); // men
  const [gestureSensitivityHigh, setGestureSensitivityHigh] = useState<boolean>(true);
  const [autoSirenSound, setAutoSirenSound] = useState<boolean>(true);

  // New Contact form states
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');
  const [newContactRelation, setNewContactRelation] = useState<string>('');
  const [isAddingContact, setIsAddingContact] = useState<boolean>(false);

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert('Required Fields', 'Please enter both contact name and phone number.');
      return;
    }
    EmergencyContactService.addContact(
      newContactName.trim(),
      newContactRelation.trim() || 'Emergency Contact',
      newContactPhone.trim()
    );
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRelation('');
    setIsAddingContact(false);
    Alert.alert('Success', 'Emergency contact added successfully.');
  };

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
          <Text style={styles.headerTitle}>System Configuration & Rules</Text>
          <Text style={styles.headerSubtitle}>
            Bharat Electronics Limited (BEL) • Women Safety Analytics
          </Text>
        </View>

        {/* Algorithm Threshold Tuning */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="options" size={16} color={THEME.colors.hudCyan} />
            <Text style={styles.sectionTitle}>Analytics Engine Thresholds</Text>
          </View>

          {/* Lone Woman Night Toggle */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.settingLabel}>Night-Time Lone Woman Window</Text>
              <Text style={styles.settingSub}>
                Active between {loneWomanThresholdHours}. Currently {isNightMode ? 'Active' : 'Day mode'}.
              </Text>
            </View>
            <Switch
              value={isNightMode}
              onValueChange={setIsNightMode}
              trackColor={{ false: THEME.colors.surfaceBorder, true: THEME.colors.belGold }}
            />
          </View>

          {/* Proximity Threshold */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.settingLabel}>Surrounded Distance Threshold</Text>
              <Text style={styles.settingSub}>
                Clusters within {proximityDistance}m trigger encirclement alert.
              </Text>
            </View>
            <View style={styles.sliderPill}>
              <TouchableOpacity
                onPress={() => setProximityDistance((p) => Math.max(1.5, parseFloat((p - 0.5).toFixed(1))))}
                style={styles.adjustBtn}
              >
                <Text style={styles.adjustBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.sliderValue}>{proximityDistance}m</Text>
              <TouchableOpacity
                onPress={() => setProximityDistance((p) => Math.min(5.0, parseFloat((p + 0.5).toFixed(1))))}
                style={styles.adjustBtn}
              >
                <Text style={styles.adjustBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Men Clustering Threshold */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.settingLabel}>Surrounding Men Count Trigger</Text>
              <Text style={styles.settingSub}>
                Triggers Critical Alert when &ge; {surroundedCountThreshold} men are in close proximity.
              </Text>
            </View>
            <View style={styles.sliderPill}>
              <TouchableOpacity
                onPress={() => setSurroundedCountThreshold((c) => Math.max(2, c - 1))}
                style={styles.adjustBtn}
              >
                <Text style={styles.adjustBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.sliderValue}>{surroundedCountThreshold}</Text>
              <TouchableOpacity
                onPress={() => setSurroundedCountThreshold((c) => Math.min(6, c + 1))}
                style={styles.adjustBtn}
              >
                <Text style={styles.adjustBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* High Sensitivity Gesture Engine */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.settingLabel}>High Sensitivity SOS Gesture Engine</Text>
              <Text style={styles.settingSub}>
                Enables early stage-2 predictive hand signal evaluation.
              </Text>
            </View>
            <Switch
              value={gestureSensitivityHigh}
              onValueChange={setGestureSensitivityHigh}
              trackColor={{ false: THEME.colors.surfaceBorder, true: THEME.colors.hudCyan }}
            />
          </View>

          {/* Audio Siren Alarm */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.settingLabel}>Audible Distress Siren</Text>
              <Text style={styles.settingSub}>
                Emits loud alarm on confirmed SOS signal to deter perpetrators.
              </Text>
            </View>
            <Switch
              value={autoSirenSound}
              onValueChange={setAutoSirenSound}
              trackColor={{ false: THEME.colors.surfaceBorder, true: THEME.colors.critical }}
            />
          </View>
        </View>

        {/* Emergency Contacts Management */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Ionicons name="call" size={16} color={THEME.colors.hudCyan} />
              <Text style={styles.sectionTitle}>Emergency Dispatch Contacts</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setIsAddingContact(!isAddingContact)}
            >
              <Ionicons name={isAddingContact ? 'close' : 'add'} size={14} color="#FFF" />
              <Text style={styles.addBtnText}>{isAddingContact ? 'Cancel' : 'Add New'}</Text>
            </TouchableOpacity>
          </View>

          {isAddingContact && (
            <View style={styles.addForm}>
              <TextInput
                style={styles.input}
                placeholder="Contact Name (e.g., Mom / Roommate)"
                placeholderTextColor={THEME.colors.textMuted}
                value={newContactName}
                onChangeText={setNewContactName}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number (e.g., +91 98765 43210)"
                placeholderTextColor={THEME.colors.textMuted}
                keyboardType="phone-pad"
                value={newContactPhone}
                onChangeText={setNewContactPhone}
              />
              <TextInput
                style={styles.input}
                placeholder="Relationship (e.g., Family / Friend)"
                placeholderTextColor={THEME.colors.textMuted}
                value={newContactRelation}
                onChangeText={setNewContactRelation}
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddContact}>
                <Text style={styles.saveBtnText}>Save Contact</Text>
              </TouchableOpacity>
            </View>
          )}

          {emergencyContacts.map((contact) => (
            <View key={contact.id} style={styles.contactRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactNameText}>{contact.name}</Text>
                <Text style={styles.contactPhoneText}>
                  {contact.phone} • {contact.relation}
                </Text>
              </View>
              {contact.isPrimary ? (
                <View style={styles.primaryPill}>
                  <Text style={styles.primaryPillText}>PRIMARY</Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => EmergencyContactService.removeContact(contact.id)}
                >
                  <Ionicons name="trash-outline" size={16} color={THEME.colors.critical} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Project & Organization Metadata */}
        <View style={styles.aboutCard}>
          <View style={styles.aboutLogoRow}>
            <View style={styles.aboutBadge}>
              <Text style={styles.aboutBadgeText}>BEL</Text>
            </View>
            <View>
              <Text style={styles.aboutTitle}>Bharat Electronics Limited</Text>
              <Text style={styles.aboutSub}>Department: SBU-BEL • Year: 2024</Text>
            </View>
          </View>

          <Text style={styles.aboutDesc}>
            Smart City Security & Defense Division project providing proactive real-time video
            analytics for women safety: person detection, gender classification, lone woman at night
            tracking, surrounded threat identification, SOS gesture analytics, and GIS hotspot mapping.
          </Text>
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
  header: {
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
  sectionCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingLabel: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  settingSub: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  sliderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  adjustBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  adjustBtnText: {
    color: THEME.colors.hudCyan,
    fontSize: 14,
    fontWeight: '800',
  },
  sliderValue: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    minWidth: 32,
    textAlign: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.belBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radii.sm,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 3,
  },
  addForm: {
    backgroundColor: THEME.colors.background,
    padding: 10,
    borderRadius: THEME.radii.md,
    marginBottom: 10,
  },
  input: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: THEME.radii.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: THEME.colors.textPrimary,
    fontSize: 11,
    marginBottom: 6,
  },
  saveBtn: {
    backgroundColor: THEME.colors.safe,
    paddingVertical: 8,
    borderRadius: THEME.radii.sm,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  contactNameText: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  contactPhoneText: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginTop: 1,
  },
  primaryPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  primaryPillText: {
    color: '#38BDF8',
    fontSize: 8,
    fontWeight: '800',
  },
  aboutCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: THEME.colors.belDarkBlue,
    borderRadius: THEME.radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.belBlue,
  },
  aboutLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aboutBadge: {
    backgroundColor: '#0284C7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10,
  },
  aboutBadgeText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
  },
  aboutTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  aboutSub: {
    color: '#BAE6FD',
    fontSize: 10,
    marginTop: 1,
  },
  aboutDesc: {
    color: '#E0F2FE',
    fontSize: 10,
    lineHeight: 14,
  },
});
