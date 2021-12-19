import mqtt from 'mqtt';

import devices from './devices.js';

import config from '../config/index.js';

const topics = [
    "zigbee2mqtt/bridge/devices",
    "kn2mqtt/devices"
]

const deviceTopics = [];

function ping(client) {
    client.publish("kn2mqtt/devices/ping");
}

function subscribe(client) {
    topics.forEach((topic) => {
        subscribeTopic(topic, client);
    });
}

function subscribeTopic(topic, client) {
    client.subscribe(topic, (error) => {
        if (!error) {
            console.log(`Subscribed to ${topic}!`)
        }
    })
}

function subscribeDeviceTopic(topic, client) {
    if (!deviceTopics.includes(topic)) {
        deviceTopics.push(topic);
        subscribeTopic(topic, client);
    }
}

function listen(client) {
    client.on('message', (topic, message) => {
        if (topic === 'zigbee2mqtt/bridge/devices' && message.length) {
            devices
                .addZigBee(message)
                .then((addedDevices) => {
                    addedDevices
                        .forEach((addedDevice) => {
                            subscribeDeviceTopic(
                                `zigbee2mqtt/${addedDevice.key}`,
                                client
                            );
                        })
                })
        } else if (topic === 'kn2mqtt/devices' && message.length) {
            devices
                .addKN(message)
                .then((addedDevice) => {
                    subscribeDeviceTopic(
                        `kn2mqtt/${addedDevice.key}`,
                        client
                    );
                })
        } else if (deviceTopics.includes(topic) && message.length) {
            devices.saveReport(topic, JSON.parse(message))
        }
    })
}

async function init() {
    const client = mqtt.connect(config.mqtt);

    client.on('connect', () => {
        subscribe(client);
        listen(client);
        ping(client);
    });
}

export default {
    init
}