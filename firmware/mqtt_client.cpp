#include "mqtt_client.h"
#include "relay_controller.h"
#include "discovery.h"
#include "secrets.h"
#include <WiFi.h>
#include <PubSubClient.h>

namespace MqttClient {

  static WiFiClient   net;
  static PubSubClient client(net);
  static String       gDeviceId;
  static CommandHandler gHandler = nullptr;
  static unsigned long lastReconnectAttempt = 0;

  const String& deviceId() { return gDeviceId; }

  static String statusTopic() { return "casa/" + gDeviceId + "/status"; }

  void publishRetained(const String& topic, const String& payload) {
    client.publish(topic.c_str(), payload.c_str(), true);
  }

  void publishState(uint8_t relay, bool on) {
    String topic = "casa/" + gDeviceId + "/rele/" + relay + "/state";
    publishRetained(topic, on ? "ON" : "OFF");
  }

  void publishAllStates() {
    for (uint8_t n = 0; n < RelayController::count(); n++) {
      publishState(n, RelayController::getState(n));
    }
  }

  // Extrai {n} de casa/{id}/rele/{n}/command. Retorna -1 se invalido.
  static int parseRelayIndex(const char* topic) {
    String t(topic);
    int releMark = t.indexOf("/rele/");
    if (releMark < 0) return -1;
    int start = releMark + 6;
    int end = t.indexOf('/', start);
    if (end < 0) return -1;
    return t.substring(start, end).toInt();
  }

  static void onMessage(char* topic, byte* payload, unsigned int len) {
    int n = parseRelayIndex(topic);
    if (n < 0 || n >= RelayController::count()) return;

    String cmd;
    for (unsigned int i = 0; i < len; i++) cmd += (char)payload[i];
    cmd.trim();

    bool on = (cmd == "TOGGLE") ? !RelayController::getState(n) : (cmd == "ON");
    if (gHandler) gHandler((uint8_t)n, on);
  }

  static void resolveDeviceId() {
    if (String(DEVICE_ID_OVERRIDE).length() > 0) {
      gDeviceId = DEVICE_ID_OVERRIDE;
      return;
    }
    uint8_t mac[6];
    WiFi.macAddress(mac);
    char buf[16];
    snprintf(buf, sizeof(buf), "esp32-%02x%02x%02x", mac[3], mac[4], mac[5]);
    gDeviceId = buf;
  }

  static void connectWiFi() {
    if (WiFi.status() == WL_CONNECTED) return;
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Conectando WiFi");
    while (WiFi.status() != WL_CONNECTED) {
      delay(300);
      Serial.print(".");
    }
    Serial.print(" ok, IP=");
    Serial.println(WiFi.localIP());
  }

  static bool connectMQTT() {
    String st = statusTopic();
    // LWT: topico, QoS1, retain=true, payload "offline"
    if (client.connect(gDeviceId.c_str(), nullptr, nullptr,
                       st.c_str(), 1, true, "offline")) {
      publishRetained(st, "online");
      Discovery::publish();
      publishAllStates();
      String cmdTopic = "casa/" + gDeviceId + "/rele/+/command";
      client.subscribe(cmdTopic.c_str(), 1);
      Serial.println("MQTT conectado: " + gDeviceId);
      return true;
    }
    return false;
  }

  void begin(CommandHandler handler) {
    gHandler = handler;
    connectWiFi();
    resolveDeviceId();
    client.setServer(MQTT_HOST, MQTT_PORT);
    client.setBufferSize(512);   // discovery JSON pode passar do default 256
    client.setCallback(onMessage);
    connectMQTT();
  }

  void loop() {
    if (WiFi.status() != WL_CONNECTED) {
      connectWiFi();
    }
    if (!client.connected()) {
      unsigned long now = millis();
      if (now - lastReconnectAttempt > 2000) {  // reconnect nao-bloqueante
        lastReconnectAttempt = now;
        connectMQTT();
      }
    } else {
      client.loop();
    }
  }
}
