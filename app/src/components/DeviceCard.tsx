import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Device } from '../store/devices';

interface Props {
  device: Device;
  onPress: () => void;
}

export function DeviceCard({ device, onPress }: Props) {
  const onCount = device.relays.filter((r) => r.on).length;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{device.name}</Text>
        <View
          style={[styles.dot, { backgroundColor: device.online ? '#22c55e' : '#9ca3af' }]}
        />
      </View>
      <Text style={styles.sub}>
        {device.relays.length} rele(s) · {onCount} ligado(s)
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 18, fontWeight: '600' },
  dot: { width: 12, height: 12, borderRadius: 6 },
  sub: { marginTop: 6, color: '#6b7280' },
});
