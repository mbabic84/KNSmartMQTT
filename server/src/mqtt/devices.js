import pgDevices from '../pg/devices.js';
import pgFeatures from '../pg/features.js';
import heaterControl from '../control/heater.js';
import log from '../utils/log.js';

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

async function addZigBee(device) {
    const zigBeeDevice = getZigBeeDevice(device);

    if (zigBeeDevice) {
        const d = await pgDevices.set(zigBeeDevice);
        log(`Device ${d.key} was saved!`);

        return d;
    }
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

async function addKN(device) {
    const d = await pgDevices.set(getKnDevice(device));

    log(`Device ${d.key} was saved!`);

    return d;
}

async function saveReport(topic, mqttMessage) {
    const deviceKey = topic.split("/")[1];
    const report = JSON.parse(mqttMessage);
    await pgFeatures.saveReport(report, deviceKey);
    await heaterControl.heat(deviceKey);
}

export default {
    addZigBee,
    addKN,
    saveReport
}