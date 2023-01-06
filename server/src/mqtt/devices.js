import pgDevices from '../pg/devices.js';
import pgFeatures from '../pg/features.js';
import deviceReport from '../device/report.js';
import log, { warn } from '../utils/log.js';
import heaterControl from '../control/heater.js';

import Devices from '../Devices.js';

const deviceTypes = {};
const typeDebounce = {
    zbRadiatorValve: 5
};
const debounceTimers = {};

function getZigBeeDevice(device) {
    let zigBeeDevice;

    Devices
        .forEach(({ type, identifiers }) => {
            let matched = true;

            Object
                .entries(identifiers)
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
        log(`Device ${d.key} (${d.type}) was saved!`);

        deviceTypes[d.key] = d.type;

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

function parseReport({ message }) {
    try {
        return JSON.parse(message);
    } catch (e) {

    }
}

async function saveReport({ deviceKey, mqttMessage }) {
    const report = parseReport({ message: mqttMessage });

    if (report) {
        const device = await pgDevices.get(deviceKey);

        if (device.type.startsWith("zb")) {
            await deviceReport.save({ device, report });
        } else {
            await pgFeatures.saveReport(report, deviceKey, device);
        }

        heaterControl.report({ deviceKey, report });
    }
}

async function processMessage(topic, mqttMessage) {
    const deviceKey = topic.split("/")[1];
    const deviceType = deviceTypes[deviceKey];
    const debounceTime = typeDebounce[deviceType] || 1;

    clearTimeout(debounceTimers[deviceKey]);
    debounceTimers[deviceKey] = setTimeout(() => {
        saveReport({ deviceKey, mqttMessage });
    }, debounceTime * 1000)
}

export default {
    addZigBee,
    addKN,
    processMessage
}