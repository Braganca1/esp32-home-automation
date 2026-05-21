import mqtt, { MqttClient } from 'mqtt';
import { BROKER_WS_URL } from '../config';

// Cliente MQTT.js sobre WebSocket. Reconexao automatica.
// MQTT.js em React Native SO fala WebSocket -> sempre ws://, nunca mqtt://.
export const client: MqttClient = mqtt.connect(BROKER_WS_URL, {
  reconnectPeriod: 2000,
  clientId: `app-${Math.random().toString(16).slice(2)}`,
});

export function publish(topic: string, payload: string): void {
  client.publish(topic, payload);
}
