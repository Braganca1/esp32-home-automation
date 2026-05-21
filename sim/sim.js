// Simulador de ESP32 via MQTT.
// Comportamento identico ao firmware: discovery retido, LWT, responde a commands.
//
// Uso: node sim.js [device_id] [relay_count]
// Ex:  node sim.js esp32-sala 3
//      node sim.js esp32-quarto 2

const mqtt = require('mqtt');

const BROKER = process.env.BROKER || 'mqtt://localhost:1883';
const DEVICE_ID = process.argv[2] || 'esp32-sala';
const RELAY_COUNT = parseInt(process.argv[3] || '4', 10);

const LABELS = ['Lampada teto', 'Abajur', 'Spot 1', 'Spot 2', 'Tomada', 'Ventilador'];
const relays = Array.from({ length: RELAY_COUNT }, (_, n) => ({
  n,
  label: LABELS[n] || `Rele ${n}`,
  on: false,
}));

const statusTopic  = `casa/${DEVICE_ID}/status`;
const commandTopic = `casa/${DEVICE_ID}/rele/+/command`;
const discoveryTopic = `casa/discovery/${DEVICE_ID}`;

const client = mqtt.connect(BROKER, {
  clientId: DEVICE_ID,
  will: { topic: statusTopic, payload: 'offline', retain: true, qos: 1 },
  reconnectPeriod: 2000,
});

function stateTopic(n) { return `casa/${DEVICE_ID}/rele/${n}/state`; }

function publishDiscovery() {
  const payload = JSON.stringify({
    device_id: DEVICE_ID,
    name: `ESP32 ${DEVICE_ID.replace('esp32-', '')}`,
    relay_count: RELAY_COUNT,
    relays: relays.map(r => ({ n: r.n, label: r.label })),
    fw_version: 'sim-1.0',
  });
  client.publish(discoveryTopic, payload, { retain: true, qos: 1 });
}

function publishAllStates() {
  relays.forEach(r =>
    client.publish(stateTopic(r.n), r.on ? 'ON' : 'OFF', { retain: true, qos: 1 })
  );
}

function applyCommand(n, cmd) {
  const relay = relays[n];
  if (!relay) return;
  const on = cmd === 'TOGGLE' ? !relay.on : cmd === 'ON';
  relay.on = on;
  client.publish(stateTopic(n), on ? 'ON' : 'OFF', { retain: true, qos: 1 });
  console.log(`[${DEVICE_ID}] rele/${n} -> ${on ? 'ON' : 'OFF'}  (cmd: ${cmd})`);
}

client.on('connect', () => {
  console.log(`[${DEVICE_ID}] conectado ao broker ${BROKER}`);
  client.publish(statusTopic, 'online', { retain: true, qos: 1 });
  publishDiscovery();
  publishAllStates();
  client.subscribe(commandTopic, { qos: 1 });
  console.log(`[${DEVICE_ID}] ${RELAY_COUNT} rele(s): ${relays.map(r => r.label).join(', ')}`);
});

client.on('message', (topic, payload) => {
  const cmd = payload.toString().trim();
  // extrai n de casa/{id}/rele/{n}/command
  const match = topic.match(/\/rele\/(\d+)\/command$/);
  if (!match) return;
  applyCommand(parseInt(match[1], 10), cmd);
});

client.on('error', err => console.error(`[${DEVICE_ID}] erro:`, err.message));
client.on('disconnect', () => console.log(`[${DEVICE_ID}] desconectado`));

console.log(`Iniciando simulador ${DEVICE_ID} (${RELAY_COUNT} reles)...`);
