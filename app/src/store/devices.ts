import { create } from 'zustand';

export interface Relay {
  n: number;
  label: string;
  on: boolean;
}

export interface Device {
  device_id: string;
  name: string;
  fw_version?: string;
  online: boolean;
  relays: Relay[];
}

interface DiscoveryPayload {
  device_id: string;
  name: string;
  fw_version?: string;
  relays: { n: number; label: string }[];
}

interface DevicesState {
  devices: Record<string, Device>;
  addDevice: (d: DiscoveryPayload) => void;
  setRelayState: (deviceId: string, n: number, on: boolean) => void;
  setOnline: (deviceId: string, online: boolean) => void;
}

// Verdade local: dicionario de dispositivos, alimentado por mensagens MQTT.
// Estado dos reles e dirigido pelo broker (state-driven, nao otimista).
export const useDevices = create<DevicesState>((set) => ({
  devices: {},

  addDevice: (d) =>
    set((s) => {
      const prev = s.devices[d.device_id];
      const relays: Relay[] = d.relays.map((r) => ({
        n: r.n,
        label: r.label,
        // preserva estado conhecido caso o discovery chegue depois
        on: prev?.relays.find((p) => p.n === r.n)?.on ?? false,
      }));
      return {
        devices: {
          ...s.devices,
          [d.device_id]: {
            device_id: d.device_id,
            name: d.name,
            fw_version: d.fw_version,
            online: prev?.online ?? false,
            relays,
          },
        },
      };
    }),

  setRelayState: (deviceId, n, on) =>
    set((s) => {
      const dev = s.devices[deviceId];
      if (!dev) return s;
      return {
        devices: {
          ...s.devices,
          [deviceId]: {
            ...dev,
            relays: dev.relays.map((r) => (r.n === n ? { ...r, on } : r)),
          },
        },
      };
    }),

  setOnline: (deviceId, online) =>
    set((s) => {
      const dev = s.devices[deviceId];
      if (!dev) return s;
      return {
        devices: { ...s.devices, [deviceId]: { ...dev, online } },
      };
    }),
}));
