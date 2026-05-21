#include "discovery.h"
#include "mqtt_client.h"
#include "relay_controller.h"
#include "config.h"
#include "secrets.h"
#include <ArduinoJson.h>

namespace Discovery {

  void publish() {
    StaticJsonDocument<512> doc;
    doc["device_id"]   = MqttClient::deviceId();
    doc["name"]        = DEVICE_NAME;
    doc["relay_count"] = RelayController::count();
    doc["fw_version"]  = FW_VERSION;

    JsonArray relays = doc.createNestedArray("relays");
    for (uint8_t n = 0; n < RELAY_COUNT; n++) {
      JsonObject r = relays.createNestedObject();
      r["n"]     = n;
      r["label"] = RELAYS[n].label;
    }

    String payload;
    serializeJson(doc, payload);

    String topic = "casa/discovery/" + MqttClient::deviceId();
    MqttClient::publishRetained(topic, payload);
  }
}
