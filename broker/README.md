# Broker Mosquitto

Broker MQTT central do sistema. Expõe **dois listeners**:

- `1883` (MQTT TCP puro) — usado pelo **ESP32**.
- `9001` (WebSocket) — usado pelo **app React Native** (MQTT.js só fala WebSocket).

> Acesso anônimo está habilitado. Isto só é aceitável porque o broker fica
> restrito à LAN. **Não exponha as portas 1883/9001 à internet.**

## Opção A — Docker (recomendado)

```bash
docker run -it --name mosquitto -p 1883:1883 -p 9001:9001 \
  -v "$(pwd)/mosquitto.conf:/mosquitto/config/mosquitto.conf" \
  eclipse-mosquitto
```

No Windows (PowerShell):

```powershell
docker run -it --name mosquitto -p 1883:1883 -p 9001:9001 `
  -v "${PWD}\mosquitto.conf:/mosquitto/config/mosquitto.conf" `
  eclipse-mosquitto
```

## Opção B — Instalação nativa

- **Windows:** instalar o Mosquitto (https://mosquitto.org/download/) e rodar:
  ```powershell
  mosquitto -c .\mosquitto.conf -v
  ```
- **Linux:** `sudo apt install mosquitto mosquitto-clients` e rodar:
  ```bash
  mosquitto -c ./mosquitto.conf -v
  ```

## Verificação

Em um terminal, assine tudo:

```bash
mosquitto_sub -h localhost -t 'casa/#' -v
```

Em outro, publique um teste:

```bash
mosquitto_pub -h localhost -t 'casa/teste' -m 'ola'
```

A mensagem deve aparecer no primeiro terminal. Para validar o listener
WebSocket (9001), use o app ou um cliente MQTT.js apontando para
`ws://<ip-do-broker>:9001`.

## Descobrir o IP do broker na LAN

O ESP32 (`secrets.h`) e o app (`client.ts`) precisam do IP desta máquina:

- **Windows:** `ipconfig` → "Endereço IPv4".
- **Linux/macOS:** `ip addr` ou `ifconfig`.
