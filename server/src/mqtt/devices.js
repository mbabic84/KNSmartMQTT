import pgDevices from '../pg/devices.js';
import features from '../pg/features.js';

const knownZigbeeDevices = {
    zbtrv: {
        model_id: "TS0601",
        manufacturer: "_TZE200_husqqvux"
    }
};

function getZigBeeDevice(device) {
    let zigBeeDevice;

    Object
        .entries(knownZigbeeDevices)
        .forEach(([type, properties]) => {
            let matched = true;

            Object
                .entries(properties)
                .forEach(([property, value]) => {
                    if (device[property] != value) {
                        matched = false;
                    }
                })

            if (matched) {
                return zigBeeDevice = {
                    key: device.ieee_address,
                    type,
                    data: device
                };
            }
        });

    return zigBeeDevice;
}

async function addZigBee(mqttMessage) {
    const devices = JSON.parse(mqttMessage);

    return await Promise
        .all(
            devices
                .map((device) => {
                    return getZigBeeDevice(device);
                })
                .filter((device) => device)
                .map((device) => {
                    return pgDevices.set(device);
                })
        )
}

function getKnDevice(device) {
    return {
        key: device.key,
        type: device.type,
        data: {
            ip: device.ip,
            version: device.version
        }
    }
}

async function addKN(mqttMessage) {
    const device = JSON.parse(mqttMessage);
    const pgDevice = await pgDevices.set(getKnDevice(device));

    return pgDevice;
}

function saveReport(topic, report) {
    const deviceKey = topic.split("/")[1];
    features.saveReport(report, deviceKey);
}

export default {
    addZigBee,
    addKN,
    saveReport
}