import { useEffect, useState } from 'react';
import { client } from '../mqtt/client';
import {
  SUB_DISCOVERY,
  SUB_STATE,
  SUB_STATUS,
  isDiscoveryTopic,
  isStateTopic,
  isStatusTopic,
  parseState,
  parseStatus,
} from '../mqtt/topics';
import { useDevices as useDeviceStore } from '../store/devices';

// Assina discovery/state/status e roteia cada mensagem para o store.
// Tambem expoe o status de conexao com o broker.
export function useDeviceSync() {
  const [connected, setConnected] = useState(client.connected);
  const { addDevice, setRelayState, setOnline } = useDeviceStore();

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      client.subscribe([SUB_DISCOVERY, SUB_STATE, SUB_STATUS]);
    };
    const onClose = () => setConnected(false);

    const onMessage = (topic: string, payload: Uint8Array) => {
      const msg = payload.toString();
      if (isDiscoveryTopic(topic)) {
        if (!msg) return; // discovery vazio = dispositivo removido
        try {
          addDevice(JSON.parse(msg));
        } catch {
          /* payload invalido: ignora */
        }
      } else if (isStateTopic(topic)) {
        const { deviceId, n } = parseState(topic);
        setRelayState(deviceId, n, msg === 'ON');
      } else if (isStatusTopic(topic)) {
        const { deviceId } = parseStatus(topic);
        setOnline(deviceId, msg === 'online');
      }
    };

    client.on('connect', onConnect);
    client.on('close', onClose);
    client.on('message', onMessage);
    if (client.connected) onConnect();

    return () => {
      client.removeListener('connect', onConnect);
      client.removeListener('close', onClose);
      client.removeListener('message', onMessage);
    };
  }, [addDevice, setRelayState, setOnline]);

  return { connected };
}
