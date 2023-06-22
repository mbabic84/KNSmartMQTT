import { connect as mqttConnect } from 'mqtt';

import { saveDevices, getDeviceTopics } from './devices.mjs';
import { getBind, getPayload } from './binds.mjs';

import { default as config } from './config.mjs';

const mqttClient = mqttConnect(config.mqtt.uri);

mqttClient.on('connect', function () {
    mqttClient.subscribe(config.mqtt.topics.devices);
})

mqttClient.on('message', function (topic, message) {
    if (topic === config.mqtt.topics.devices) {
        saveDevices(message);

        const deviceTopics = getDeviceTopics();
        for (const deviceTopic of deviceTopics) {
            mqttClient.subscribe(deviceTopic);
            console.log(`Subscribed to ${deviceTopic}`);
        }
    }

    if (getDeviceTopics().includes(topic)) {
        const payload = JSON.parse(message);
        const bind = getBind(topic, payload);
        
        if (bind) {
            console.log(`Bind request from ${topic}`);

            const payloadToSend = getPayload(bind);

            mqttClient.publish(bind.destination.topic, payloadToSend);
            
            console.log(`Payload ${payloadToSend} sent to ${bind.destination.topic}`);
        }
    }
})