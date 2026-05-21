#pragma once

// Copie este arquivo para "secrets.h" e preencha com seus valores reais.
// secrets.h NAO deve ser versionado (ver .gitignore).

#define WIFI_SSID     "SUA_REDE_WIFI"
#define WIFI_PASSWORD "SUA_SENHA_WIFI"

// IP da maquina rodando o broker Mosquitto na LAN (ver broker/README.md)
#define MQTT_HOST "192.168.0.10"
#define MQTT_PORT 1883

// device_id unico e estavel. Deixe vazio ("") para derivar do MAC: esp32-<hex>
#define DEVICE_ID_OVERRIDE ""

// Nome amigavel exibido no app
#define DEVICE_NAME "ESP32 Sala"
