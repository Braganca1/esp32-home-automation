import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { DeviceCard } from '../components/DeviceCard';
import { useDeviceSync } from '../hooks/useDevices';
import { RootStackParamList } from '../navigation';
import { useDevices } from '../store/devices';

type Props = NativeStackScreenProps<RootStackParamList, 'Devices'>;

export function DevicesScreen({ navigation }: Props) {
  const { connected } = useDeviceSync();
  const devices = useDevices((s) => Object.values(s.devices));

  return (
    <View style={styles.container}>
      <View style={[styles.banner, { backgroundColor: connected ? '#dcfce7' : '#fee2e2' }]}>
        <Text style={styles.bannerText}>
          {connected ? 'Conectado ao broker' : 'Conectando ao broker...'}
        </Text>
      </View>

      {devices.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Nenhum dispositivo encontrado ainda.{'\n'}Ligue um ESP32 na rede.
          </Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(d) => d.device_id}
          renderItem={({ item }) => (
            <DeviceCard
              device={item}
              onPress={() => navigation.navigate('Device', { deviceId: item.device_id })}
            />
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  banner: { padding: 10, alignItems: 'center' },
  bannerText: { fontSize: 13, color: '#374151' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { textAlign: 'center', color: '#6b7280', fontSize: 16 },
});
