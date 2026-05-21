import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RelaySwitch } from '../components/RelaySwitch';
import { RootStackParamList } from '../navigation';
import { useDevices } from '../store/devices';

type Props = NativeStackScreenProps<RootStackParamList, 'Device'>;

export function DeviceScreen({ route }: Props) {
  const { deviceId } = route.params;
  const device = useDevices((s) => s.devices[deviceId]);

  if (!device) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Dispositivo indisponivel.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {!device.online && (
        <View style={styles.offline}>
          <Text style={styles.offlineText}>Dispositivo offline</Text>
        </View>
      )}
      <View style={styles.list}>
        {device.relays.map((r) => (
          <RelaySwitch
            key={r.n}
            deviceId={device.device_id}
            relay={r}
            disabled={!device.online}
          />
        ))}
      </View>
      {device.fw_version && (
        <Text style={styles.fw}>Firmware {device.fw_version}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: '#6b7280' },
  offline: { backgroundColor: '#fee2e2', padding: 10, alignItems: 'center' },
  offlineText: { color: '#991b1b' },
  list: { backgroundColor: '#fff', marginTop: 12 },
  fw: { textAlign: 'center', color: '#9ca3af', marginTop: 16, fontSize: 12 },
});
