#pragma once

#include <Arduino.h>

// Gerencia WiFi + conexao MQTT (PubSubClient).
// - reconexao nao-bloqueante (chamar loop() no loop principal)
// - registra LWT (status offline)
// - na (re)conexao: publica status online, discovery e todos os states; e
//   assina casa/{id}/rele/+/command
namespace MqttClient {

  // Callback chamado quando chega um comando: (indice do rele, ligar?)
  typedef void (*CommandHandler)(uint8_t relay, bool on);

  void begin(CommandHandler handler);
  void loop();

  const String& deviceId();

  // Publica com retain=true (helper usado por discovery e states).
  void publishRetained(const String& topic, const String& payload);

  void publishState(uint8_t relay, bool on);
  void publishAllStates();
}
