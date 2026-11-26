import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

interface QuickSOSButtonProps {
  onPress: () => void;
  isEmergencyActive: boolean;
  onCancel: () => void;
  countdown: number;
}

export const QuickSOSButton: React.FC<QuickSOSButtonProps> = ({
  onPress,
  isEmergencyActive,
  onCancel,
  countdown,
}) => {
  if (isEmergencyActive) {
    return (
      <View style={styles.activeContainer}>
        <View style={styles.activeContent}>
          <Ionicons name="warning" size={28} color="#FFF" />
          <View style={styles.activeTextContainer}>
            <Text style={styles.activeTitle}>EMERGENCY BROADCAST LIVE</Text>
            <Text style={styles.activeSub}>GPS streaming to BEL Security & Police PCR</Text>
          </View>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Resolve</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.sosButton, countdown > 0 && styles.sosButtonCounting]}
        onPress={countdown > 0 ? onCancel : onPress}
        activeOpacity={0.85}
      >
        <View style={styles.innerRing}>
          <Ionicons
            name={countdown > 0 ? 'close' : 'alert'}
            size={24}
            color="#FFF"
          />
          <Text style={styles.sosText}>
            {countdown > 0 ? `CANCEL (${countdown}s)` : 'EMERGENCY SOS'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  sosButton: {
    width: '90%',
    height: 56,
    borderRadius: THEME.radii.lg,
    backgroundColor: THEME.colors.critical,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.colors.critical,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  sosButtonCounting: {
    backgroundColor: '#991B1B',
  },
  innerRing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sosText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  activeContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: THEME.colors.critical,
    borderRadius: THEME.radii.lg,
    padding: 12,
  },
  activeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  activeTitle: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 13,
  },
  activeSub: {
    color: '#FEE2E2',
    fontSize: 10,
    marginTop: 2,
  },
  cancelBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radii.sm,
  },
  cancelBtnText: {
    color: THEME.colors.critical,
    fontWeight: '800',
    fontSize: 12,
  },
});
