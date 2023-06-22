let devices = {};
let topics = [];

export function saveDevices(message) {
    const devices = JSON.parse(message);
    for (const device of devices) {
        const savedDevice = saveDevice(device);
        const deviceTopic = `zigbee2mqtt/${savedDevice.friendly_name}`;
        
        saveDeviceTopic(deviceTopic);
    }
}

export function saveDeviceTopic(topic) {
    if (!topics.includes(topic)) {
        topics.push(topic);
    }
}

export function getDeviceTopics() {
    return topics;
}

export function saveDevice(device) {
    devices[device.ieee_address] = device;
    return getDevice(device.ieee_address);
}

export function getDevices() {
    return devices;
}

export function getDevice(deviceKey) {
    return devices[deviceKey];
}