#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_BMP280.h>
#include "Adafruit_Sensor.h"
#include "Adafruit_AM2320.h"
#include <Smoothed.h>
#include <ArduinoJson.h>

#define WIFI_SSID   "KraliciNora.Cz"
#define WIFI_PASSWD "blackrabbit"
#define MQTT_SERVER "10.0.0.113"
#define MQTT_PORT   1883

Adafruit_AM2320 am2320 = Adafruit_AM2320();
Adafruit_BMP280 bmp;

Smoothed <float> temperature;
Smoothed <float> humidity;
Smoothed <float> pressure;

long lastSensorRead;
long lastAnnounced;
bool introduced;

String clientId;
String topic;
String payload;

struct RelayState {
  bool state;
  unsigned long ttl;
};

const byte relayOut[] = {D5, D6};
RelayState relayState[] = {{false, 0}, {false, 0}};

WiFiClient wifiClient;
PubSubClient mqtt(wifiClient);

void setup() {
  pinMode(relayOut[0], OUTPUT);
  pinMode(relayOut[1], OUTPUT);

  resetRelays();

  Serial.begin(115200);

  Wire.begin();

  bmp.begin(0x76);
  am2320.begin();

  WiFi.begin(WIFI_SSID, WIFI_PASSWD);

  Serial.println("...");
  Serial.println("...");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting to WIFI!");
    delay(5000);
  }

  Serial.println("Connected to WIFI!");

  clientId = String(WiFi.macAddress());

  mqtt.setServer(MQTT_SERVER, MQTT_PORT);
  mqtt.setCallback(mqttCallback);

  temperature.begin(SMOOTHED_AVERAGE, 10);
  humidity.begin(SMOOTHED_AVERAGE, 10);
  pressure.begin(SMOOTHED_AVERAGE, 10);
}

void loop() {
  mqttConnect();
  introduce();
  sensors();
  announce();
  relayTTL();
}

void announce() {
  if (!lastAnnounced || millis() - lastAnnounced > 60 * 60 * 1000) {
    publishReadings();
  }
}

void relayTTL() {
  for (byte i = 0; i < sizeof(relayOut); i++) {
    if (relayState[i].ttl > 0 && relayState[i].ttl < millis()) {
      relayState[i].ttl = 0;
      setRelay(i, false);
      publishReadings();
    }
  }
}

void sensors() {
  if (!lastSensorRead || millis() - lastSensorRead > 1000) {
    readSensors();
  }
}

void introduce() {
  if (!introduced) {
    introduceMqttDevice();
    introduced = true;
  }
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  if (String(topic) == "kn2mqtt/" + clientId + "/set") {
    executeSet(payload, length);
  }

  if (String(topic) == "kn2mqtt/" + clientId + "/get") {
    publishReadings();
  }

  if (String(topic) == "kn2mqtt/devices/ping") {
    introduceMqttDevice();
  }
}

float roundValue(float value) {
  return round(value * 10) / 10;
}

void executeSet(byte* payload, unsigned int length) {
  DynamicJsonDocument doc(2048);

  deserializeJson(doc, payload);

  if (doc["relay"]["0"]["state"].is<bool>()) {
    relayState[0].state = doc["relay"]["0"]["state"];
  }

  if (doc["relay"]["0"]["duration"].is<int>() && doc["relay"]["0"]["duration"] > 0) {
    int duration = doc["relay"]["0"]["duration"];
    relayState[0].ttl = millis() + (duration * 1000);
  }

  if (doc["relay"]["1"]["state"].is<bool>()) {
    relayState[1].state = doc["relay"]["1"]["state"];
  }

  if (doc["relay"]["1"]["duration"].is<int>() && doc["relay"]["1"]["duration"] > 0) {
    int duration = doc["relay"]["1"]["duration"];
    relayState[1].ttl = millis() + (duration * 1000);
  }

  setRelays();
  publishReadings();
}

void resetRelays() {
  for (byte i = 0; i < sizeof(relayOut); i = i + 1) {
    setRelay(i, false);
  }
}

void setRelays() {
  for (byte i = 0; i < sizeof(relayOut); i = i + 1) {
    setRelay(i, relayState[i].state);
  }
}

void setRelay(byte index, bool state) {
  digitalWrite(relayOut[index], state ? LOW : HIGH);
}

void publishReadings() {
  topic = "kn2mqtt/" + clientId;
  payload = "{\n"
            " \"temperature\": " + String(roundValue(temperature.get())) + ",\n"
            " \"humidity\": " + String(roundValue(humidity.get())) + ",\n"
            " \"pressure\": " + String(roundValue(pressure.get())) + ",\n"
            " \"relay\": {\n"
            "   \"0\": " + String(digitalRead(relayOut[0]) ? "false" : "true") + ",\n"
            "   \"1\": " + String(digitalRead(relayOut[1]) ? "false" : "true") + "\n"
            " },\n"
            " \"rssi\": " + String(WiFi.RSSI()) + "\n"
            "}";

  mqtt.publish(topic.c_str(), payload.c_str());
  
  lastAnnounced = millis();
}

void readSensors() {
  temperature.add((am2320.readTemperature() + bmp.readTemperature()) / 2);
  humidity.add(am2320.readHumidity());
  pressure.add(bmp.readPressure() / 100);
  
  lastSensorRead = millis();
}

void mqttConnect() {
  if (mqtt.connected()) {
    mqtt.loop();
    return;
  }

  while (!mqtt.connected()) {
    Serial.println("Connecting to MQTT!");
    if (mqtt.connect(clientId.c_str())) {
      Serial.println("Connected to MQTT!");

      topic = "kn2mqtt/" + clientId + "/set";
      mqtt.subscribe(topic.c_str());
      Serial.println("Subscribed to " + topic);

      topic = "kn2mqtt/" + clientId + "/get";
      mqtt.subscribe(topic.c_str());
      Serial.println("Subscribed to " + topic);

      topic = "kn2mqtt/devices/ping";
      mqtt.subscribe(topic.c_str());
      Serial.println("Subscribed to " + topic);
    } else {
      delay(5000);
    }
  }
}

void introduceMqttDevice() {
  topic = "kn2mqtt/devices";
  payload = "{\n"
            " \"key\": \"" + clientId + "\",\n"
            " \"ip\": \"" + WiFi.localIP().toString() + "\",\n"
            " \"type\": \"nodemcu\",\n"
            " \"version\": \"2.0.0\"\n"
            "}";

  mqtt.publish(topic.c_str(), payload.c_str());
}
