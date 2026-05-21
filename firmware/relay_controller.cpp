#include "relay_controller.h"
#include "config.h"

namespace RelayController {

  static bool states[RELAY_COUNT];

  static void applyToHardware(uint8_t n) {
    const RelayConfig& r = RELAYS[n];
    bool level = r.active_low ? !states[n] : states[n];
    digitalWrite(r.pin, level ? HIGH : LOW);
  }

  void begin() {
    for (uint8_t n = 0; n < RELAY_COUNT; n++) {
      pinMode(RELAYS[n].pin, OUTPUT);
      states[n] = false;
      applyToHardware(n);
    }
  }

  void setRelay(uint8_t n, bool on) {
    if (n >= RELAY_COUNT) return;
    states[n] = on;
    applyToHardware(n);
  }

  bool getState(uint8_t n) {
    if (n >= RELAY_COUNT) return false;
    return states[n];
  }

  bool toggle(uint8_t n) {
    if (n >= RELAY_COUNT) return false;
    setRelay(n, !states[n]);
    return states[n];
  }

  uint8_t count() {
    return RELAY_COUNT;
  }
}
