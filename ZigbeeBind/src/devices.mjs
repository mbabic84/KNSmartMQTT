import { default as mongo } from './mongo.mjs';

async function saveMany(message) {
    const devices = JSON.parse(message);
    for (const device of devices) {
        await save(device);
    }
}

async function save(device) {
    await mongo
        .devices
        .add(device);

    return await mongo
        .devices
        .get(device.ieee_address);
}

export default {
    saveMany
}