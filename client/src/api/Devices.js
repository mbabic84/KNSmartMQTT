import axios from 'axios';

import ApiUrl from '../utils/ApiUrl.js';

async function getAll() {
    const response = await axios
        .get(`${ApiUrl()}/devices`)

    return response.data;
}

async function get(key) {
    const response = await axios
        .get(`${ApiUrl}/devices/${key}`);

    return response.data;
}

export default {
    getAll,
    get
}