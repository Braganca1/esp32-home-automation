# esp32-home-automation

Sistema de automação residencial com ESP32, broker MQTT Mosquitto e app React Native + Expo.

```
broker/    Configuração do Mosquitto (Docker ou nativo)
firmware/  Código do ESP32 (Arduino / C++)
app/       App React Native + Expo
sim/       Simulador Node.js que imita um ESP32 (para testes sem hardware)
```

---

## 1. Broker Mosquitto

Expõe dois listeners: `1883` (MQTT TCP — ESP32) e `9001` (WebSocket — app).

**Docker (recomendado)** — rodar na pasta `broker/`:

```powershell
docker run -d --name mosquitto -p 1883:1883 -p 9001:9001 `
  -v "${PWD}\mosquitto.conf:/mosquitto/config/mosquitto.conf" `
  eclipse-mosquitto
```

**Nativo (Windows):**
```powershell
mosquitto -c .\broker\mosquitto.conf -v
```

**Verificar:**
```bash
mosquitto_sub -h localhost -t 'casa/#' -v
```

> Acesso anônimo habilitado — mantenha o broker restrito à LAN.

---

## 2. Firmware ESP32

**Dependências (Arduino IDE → Library Manager):** `PubSubClient`, `ArduinoJson`.

**Configuração antes de gravar:**

1. Copie `firmware/secrets.example.h` → `firmware/secrets.h` e preencha:
   ```cpp
   #define WIFI_SSID     "SUA_REDE"
   #define WIFI_PASSWORD "SUA_SENHA"
   #define MQTT_HOST     "192.168.x.x"  // IP do broker na LAN
   #define DEVICE_NAME   "ESP32 Sala"
   ```
2. Ajuste os pinos GPIO e labels em `firmware/config.h`.
3. Grave via Arduino IDE (`firmware/firmware.ino`).

**Para descobrir o IP do broker:** `ipconfig` (Windows) → "Endereço IPv4".

---

## 3. App React Native + Expo

**Configuração:** edite o IP do broker em `app/src/config.ts`:
```ts
export const BROKER_WS_URL = 'ws://192.168.x.x:9001';
```
Use `ws://localhost:9001` para testes locais com Docker.

**Instalar e rodar:**
```bash
cd app
npm install
npm run web      # navegador
npm start        # Expo Go (celular) ou emulador
```

> MQTT.js em React Native só fala WebSocket — sempre `ws://`, nunca `mqtt://`.
> Android requer `usesCleartextTraffic: true` no `app.json` (já configurado).

---

## 4. Simulador ESP32 (sem hardware)

Imita um ESP32: publica discovery retido, responde a comandos, atualiza states.

```bash
cd sim
node sim.js esp32-sala 4       # device_id, nº de relés
node sim.js esp32-quarto 2     # segundo dispositivo simultaneamente
```

Requer o broker rodando. Conecta via `mqtt://localhost:1883`.

---

## Ordem de setup

1. **Broker** — suba o Mosquitto e confirme as portas 1883 e 9001.
2. **Firmware ou Simulador** — grave no ESP32 ou rode `node sim/sim.js`.
3. **App** — `npm run web` e abra `http://localhost:8081`.

Os dispositivos aparecem automaticamente via MQTT retain (auto-discovery) — sem configuração manual no app.
