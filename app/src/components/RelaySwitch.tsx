import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { publish } from '../mqtt/client';
import { commandTopic } from '../mqtt/topics';
import { Relay } from '../store/devices';

interface Props {
  deviceId: string;
  relay: Relay;
  disabled?: boolean;
}

export function RelaySwitch({ deviceId, relay, disabled }: Props) {
  // Nao muda o estado local direto: publica o comando e aguarda o /state
  // retornar (fonte da verdade = ESP32).
  const onToggle = () => {
    publish(commandTopic(deviceId, relay.n), relay.on ? 'OFF' : 'ON');
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{relay.label}</Text>
      <Switch value={relay.on} onValueChange={onToggle} disabled={disabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  label: { fontSize: 16 },
});
