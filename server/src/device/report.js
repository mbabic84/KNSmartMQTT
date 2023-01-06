import pgFeature from '../pg/features.js';
import pgHistory from '../pg/history.js';
import log, { info, warn } from '../utils/log.js';
import socketio from '../socketio/index.js';

const historyWhitelist = {
    local_temperature: true,
    current_heating_setpoint: true,
    state: true
}

function getExposedFeatures({ exposes }) {
    let features = [];
    for (const exposed of exposes) {
        if (exposed.features) {
            features = features.concat(getExposedFeatures({ exposes: exposed.features }));
        } else {
            features.push(exposed);
        }
    }

    return features;
}

async function save({ device, report }) {
    const exposedFeatures = getExposedFeatures({ exposes: device.data.definition.exposes });

    for (const exposedFeature of exposedFeatures) {
        if (report[exposedFeature.property] !== undefined) {
            saveFeature({
                key: `${device.key}/${exposedFeature.property}`,
                deviceKey: device.key,
                type: exposedFeature.property,
                value: report[exposedFeature.property]
            })
        }
    }
}

async function saveFeatureHistory({ featureKey, value }) {
    await pgHistory.set({
        featureKey,
        value
    });
    log(`History data saved! Feature: ${featureKey}, value: ${value}`);
}

async function saveFeature({ key, deviceKey, type, value }) {
    const feature = await pgFeature.set({
        key,
        deviceKey,
        type,
        value
    });

    if (historyWhitelist[type]) {
        await saveFeatureHistory({
            featureKey: key,
            value
        });
    }

    socketio.emitFeature(feature);
}

export default {
    save
}