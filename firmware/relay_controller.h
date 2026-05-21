#pragma once

#include <Arduino.h>

// Abstrai o hardware dos reles. Nao conhece MQTT.
// Expoe sempre a semantica logica: true = ligado, false = desligado.
// A inversao active-low fica encapsulada aqui.
namespace RelayController {

  void begin();                  // configura pinos, inicia tudo desligado
  void setRelay(uint8_t n, bool on);
  bool getState(uint8_t n);
  bool toggle(uint8_t n);        // retorna o novo estado
  uint8_t count();
}
