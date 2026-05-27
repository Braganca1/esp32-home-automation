// precompiled-mqtt: mqtt.js pre-compilado para React Native (sem dependencias
// de Node built-ins como 'url', 'net', 'tls')
import mqtt from 'precompiled-mqtt';
import { BROKER_WS_URL } from '../config';

// Cliente MQTT.js sobre WebSocket. Reconexao automatica.
// MQTT.js em React Native SO fala WebSocket -> sempre ws://, nunca mqtt://.
export const client = mqtt.connect(BROKER_WS_URL, {
  reconnectPeriod: 2000,
  clientId: `app-${Math.random().toString(16).slice(2)}`,
});

export function publish(topic: string, payload: string): void {
  client.publish(topic, payload);
}
