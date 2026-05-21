#include "config.h"
#include "relay_controller.h"
#include "mqtt_client.h"

// Recebe um comando ja resolvido (indice + estado desejado), aplica no
// hardware e publica o novo estado retido.
void onCommand(uint8_t relay, bool on) {
  RelayController::setRelay(relay, on);
  MqttClient::publishState(relay, on);
}

void setup() {
  Serial.begin(115200);
  RelayController::begin();
  MqttClient::begin(onCommand);
}

void loop() {
  MqttClient::loop();
}
