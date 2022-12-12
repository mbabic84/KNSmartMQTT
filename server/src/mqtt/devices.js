import pgDevices from '../pg/devices.js';
import pgFeatures from '../pg/features.js';
import heaterQueue from '../control/queue.js';
import log from '../utils/log.js';
import { warn } from '../utils/log.js';

const knownZigbeeDevices = {
    zbtrv: {
        model_id: "TS0601",
        manufacturer: "_TZE200_husqqvux"
    },
    zbPlug: {
        model_id: "Plug Value",
        manufacturer: "LEDVANCE"
    },
    zbRealy: {
        model_id: "BASICZBR3",
        manufacturer: "SONOFF"
    },
    zbBulb: {
        model_id: "VIYU-A60-806-CCT-10011723",
        manufacturer: "HORNBACH Baumarkt AG"
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
    } else {
        warn(`Unknown ZigBee device ${device.ieee_address} | Type: "${device.type}" | ModelID: "${device.model_id}" | Manufacturer: "${device.manufacturer}"`);
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
    heaterQueue.add(deviceKey, report);
}

export default {
    addZigBee,
    addKN,
    saveReport
}