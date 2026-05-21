# App — Casa (React Native + Expo)

App de controle dos relés. Conecta direto ao broker via **MQTT sobre WebSocket**
(MQTT.js) e usa **auto-discovery**: dispositivos aparecem sozinhos conforme os
ESP32 anunciam em `casa/discovery/+` (mensagens retidas).

## Configuração

Edite o IP do broker em [src/config.ts](src/config.ts):

```ts
export const BROKER_WS_URL = 'ws://192.168.0.10:9001';
```

Use o **mesmo IP da máquina que roda o Mosquitto** e a porta do listener
WebSocket (`9001`). O celular e o broker precisam estar na **mesma rede**.

## Instalar e rodar

```bash
npm install
npm start
```

Abra no Expo Go (celular) ou em um emulador. Para web: `npm run web`.

## Observações importantes

- **Sempre `ws://`** (WebSocket), nunca `mqtt://`: MQTT.js em React Native só
  fala WebSocket. O broker precisa do listener `9001` ativo.
- Em redes que exigem HTTPS ou em produção, troque para `wss://` com TLS no
  broker. Aqui usamos `ws://` puro na LAN (`usesCleartextTraffic` já habilitado
  no Android via [app.json](app.json)).
- Se a conexão MQTT falhar com erros de `Buffer`/`process` indefinidos em alguns
  ambientes RN, instale e importe um polyfill no topo de `App.tsx`
  (ex.: `react-native-get-random-values` / `buffer`). O Expo SDK 51 geralmente
  já cobre o necessário.

## Como testar

1. Suba o broker (ver `../broker/README.md`) e ligue ao menos um ESP32.
2. Abra o app: a lista deve preencher sozinha (discovery retido).
3. Toque num dispositivo e alterne um relé — o LED físico muda e o switch
   reflete o estado real que volta em `.../state`.
4. Reabra o app com relés já ligados: os switches já vêm em ON (prova do retain).
