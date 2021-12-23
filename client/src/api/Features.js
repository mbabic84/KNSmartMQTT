import axios from 'axios';
import moment from 'moment';

import ApiUrl from '../utils/ApiUrl.js';

async function getAll() {
    const response = await axios
        .get(`${ApiUrl()}/features`)

    return response.data;
}

async function setConfig(key, config) {
    const response = await axios
        .put(
            `${ApiUrl()}/feature/config`,
            {
                key,
                config
            }
        );

    return response.data;
}

async function getChartData(featureKey, since = moment().subtract(1, "hours").format()) {
    const response = await axios
        .get(
            `${ApiUrl()}/feature/chart`,
            {
                params: {
                    featureKey,
                    since
                }

            }
        )
    
        return response.data;
}

export default {
    getAll,
    setConfig,
    getChartData
}