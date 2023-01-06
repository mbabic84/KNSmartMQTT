import pgDevices from '../pg/devices.js';

async function get(request, response) {
    const devices = await pgDevices.get(request.params.key);
    response.send(devices);
}

export default {
    get
}