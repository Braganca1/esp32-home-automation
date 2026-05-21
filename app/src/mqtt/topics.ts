// Unico lugar que conhece o formato dos topicos MQTT.
// Espelha o contrato definido no planejamento (secao 1).

export const SUB_DISCOVERY = 'casa/discovery/+';
export const SUB_STATE = 'casa/+/rele/+/state';
export const SUB_STATUS = 'casa/+/status';

export function commandTopic(deviceId: string, n: number): string {
  return `casa/${deviceId}/rele/${n}/command`;
}

export function isDiscoveryTopic(topic: string): boolean {
  return topic.startsWith('casa/discovery/');
}

export function isStateTopic(topic: string): boolean {
  return /^casa\/[^/]+\/rele\/\d+\/state$/.test(topic);
}

export function isStatusTopic(topic: string): boolean {
  return /^casa\/[^/]+\/status$/.test(topic);
}

export function parseState(topic: string): { deviceId: string; n: number } {
  const parts = topic.split('/'); // casa, {id}, rele, {n}, state
  return { deviceId: parts[1], n: parseInt(parts[3], 10) };
}

export function parseStatus(topic: string): { deviceId: string } {
  const parts = topic.split('/'); // casa, {id}, status
  return { deviceId: parts[1] };
}
