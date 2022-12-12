import mqttPromise from './promise.js';
import mqttDevices from './devices.js';
import serverConfig from '../config/server.js';
import Config from '../config/index.js';
import pgDevices from '../pg/devices.js';
import log from '../utils/log.js';

let client;
let deviceTopics = [];
let loopConfig;
let loopStarted;

async function subscribeDevice(topic, client) {
    if (!deviceTopics.includes(topic)) {
        deviceTopics.push(topic);
        await mqttPromise
            .subscribe(topic, client)
            .finally(() => log(`Subscribed to ${topic}`));
    }
}

async function processZigBeeDevices(message) {
    let devices = JSON.parse(message);
    await Promise.all(
        devices.map(async (device) => {
            await mqttDevices
                .addZigBee(device)
                .then(async (saved) => {
                    if (saved) {
                        const deviceTopic = `zigbee2mqtt/${saved.key}`;
                        await subscribeDevice(deviceTopic, client);
                    }
                })
        })
    )
}

async function processKNDevice(message) {
    let device = JSON.parse(message);
    await mqttDevices
        .addKN(device)
        .then(async (saved) => {
            if (saved) {
                const deviceTopic = `kn2mqtt/${saved.key}`;
                await subscribeDevice(deviceTopic, client);
            }
        })
}

async function loop() {
    // Startup delay to allow MQTT settle
    if (!loopStarted) {
        loopStarted = Date.now();
    }
    if (Date.now() - loopStarted < 15 * 1000) {
        return;
    }

    const date = new Date();
    const seconds = (date.getMinutes() * 60) + date.getSeconds();

    if (
        !loopConfig
        || seconds % 60 === 0
    ) {
        loopConfig = await await Config.get("mqtt");
    }

    if (loopConfig.intervals?.get && seconds % loopConfig.intervals.get === 0) {
        if (loopConfig.allowGet) {
            const devices = await pgDevices.get();
            requestMessageFromDevices(devices);
            log("Requesting data from devices");
        } else {
            log.warn("Configuration mqtt.allowGet is disabled or missing!");
        }
    }
}

async function requestMessageFromDevices(devices) {
    for (const device of devices) {
        switch (device.type) {
            case "zbtrv":
                await requestStateFromZigBeeTrv(device);
                break;
            case "nodemcu":
                await requestStateFromNodeMcu(device);
                break;
            case "zbPlug":
            case "zbBulb":
            case "zbRealy":
                await requestStateFromZigBee(device);
                break;
        }
    }
}

async function requestStateFromZigBee(device) {
    await mqttPromise.publish(
        `zigbee2mqtt/${device.key}/get`,
        JSON.stringify({
            "state": ""
        }),
        client
    )
}

async function requestStateFromZigBeeTrv(device) {
    await mqttPromise.publish(
        `zigbee2mqtt/${device.key}/set`,
        JSON.stringify({
            "online": "ON"
        }),
        client
    )
}

async function requestStateFromNodeMcu(device) {
    await mqttPromise.publish(
        `kn2mqtt/${device.key}/get`,
        "",
        client
    )
}

async function publish(topic, message) {
    await mqttPromise.publish(
        topic,
        message,
        client
    );
}

async function init() {
    client = await mqttPromise
        .connect(serverConfig.mqtt)
        .finally(() => log("Connected to MQTT"));

    client.on("message", async (topic, message) => {
        if (topic === "zigbee2mqtt/bridge/devices") {
            processZigBeeDevices(message);
        } else if (topic === "kn2mqtt/devices") {
            processKNDevice(message);
        } else if (deviceTopics.includes(topic)) {
            await mqttDevices.saveReport(topic, message);
        }
    })

    await mqttPromise
        .subscribe("zigbee2mqtt/bridge/devices", client)
        .finally(() => log("Subscribed to zigbee2mqtt/bridge/devices!"));

    await mqttPromise
        .subscribe("kn2mqtt/devices", client)
        .finally(() => log("Subscribed to kn2mqtt/devices!"));

    await mqttPromise
        .publish("kn2mqtt/devices/ping", "", client)
        .finally(() => log("KN2MQTT devices pinged!"));

    setInterval(() => {
        loop();
    }, 1000);
}

export default {
    init,
    publish
}