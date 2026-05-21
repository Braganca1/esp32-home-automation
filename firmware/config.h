#pragma once

#include <Arduino.h>

#define FW_VERSION "1.0.0"

// ---------------------------------------------------------------------------
// Topologia fisica dos reles.
// Esta e a UNICA fonte da verdade do hardware: para trocar de placa ou mudar
// a quantidade de reles, edite apenas este arquivo.
//
// active_low: a maioria dos modulos rele comuns liga com nivel LOW.
//   true  -> escreve LOW para ligar, HIGH para desligar
//   false -> escreve HIGH para ligar, LOW para desligar
// ---------------------------------------------------------------------------

struct RelayConfig {
  uint8_t     pin;        // GPIO
  const char* label;      // nome exibido no app
  bool        active_low; // logica do modulo rele
};

// Ajuste o array abaixo. relay_count e derivado automaticamente.
static const RelayConfig RELAYS[] = {
  { 16, "Lampada teto", true },
  { 17, "Abajur",       true },
  { 18, "Spot 1",       true },
  { 19, "Spot 2",       true },
};

static const uint8_t RELAY_COUNT = sizeof(RELAYS) / sizeof(RELAYS[0]);
