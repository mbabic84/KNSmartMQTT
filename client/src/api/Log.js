import axios from 'axios';

import ApiUrl from '../utils/ApiUrl.js';

async function get() {
    const response = await axios
        .get(`${ApiUrl()}/log`)

    return response.data;
}

export default {
    get
}