import axios from 'axios';
import moment from 'moment';

async function getAll() {
    const response = await axios
        .get('http://10.0.0.40:8740/features')

    return response.data;
}

async function setConfig(key, config) {
    const response = await axios
        .post(
            'http://10.0.0.40:8740/feature/config',
            {
                key,
                config
            }
        );

    return response.data;
}

async function getChartData(nodeKey, type, since = moment().subtract(1, "hours").format()) {
    const response = await axios
        .get(
            'http://10.0.0.40:8740/feature/chart',
            {
                params: {
                    nodeKey,
                    type,
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