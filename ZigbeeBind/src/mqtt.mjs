import { connect as mqttConnect } from 'mqtt';

import { default as mongo } from './mongo.mjs';
import { default as devices } from './devices.mjs';

import { getBind, getPayload } from './binds.mjs';
import { emitMetric } from './grafana.mjs';

import { default as config } from '../config.mjs';

async function getTopics() {
    const devices = await mongo.devices.getAll();
    return devices.map((device) => `zigbee2mqtt/${device.friendly_name}`);
}

export default {
    init: async () => {
        const mqttClient = mqttConnect(config.mqtt.uri);

        mqttClient.on('connect', function () {
            mqttClient.subscribe(config.mqtt.topics.devices);
        })

        mqttClient.on('message', async function (topic, message) {
            if (topic === config.mqtt.topics.devices) {
                await devices.saveMany(message);                
                for (const deviceTopic of await getTopics()) {
                    mqttClient.subscribe(deviceTopic);
                    console.log(JSON.stringify({
                        action: "mqtt-subscribe",
                        topic: deviceTopic
                    }));
                }
            } else if ((await getTopics()).includes(topic)) {
                const payload = JSON.parse(message);
                const bind = getBind(topic, payload);

                if (payload.hasOwnProperty("temperature")) {
                    await emitMetric({
                        name: `zigbee_sensor_temperature_current`,
                        labelName: `sensor`,
                        labelValue: topic,
                        source: `smart-home`,
                        metric: payload.temperature
                    })
                }

                if (payload.hasOwnProperty("humidity")) {
                    await emitMetric({
                        name: `zigbee_sensor_humidity_current`,
                        labelName: `sensor`,
                        labelValue: topic,
                        source: `smart-home`,
                        metric: payload.humidity
                    })
                }

                if (bind) {
                    console.log(`Bind request from ${topic}`);

                    const payloadToSend = getPayload(bind);

                    mqttClient.publish(bind.destination.topic, payloadToSend);

                    console.log(`Payload ${payloadToSend} sent to ${bind.destination.topic}`);
                }
            }
        })
    }
}