import axios from 'axios';

import ApiUrl from '../utils/ApiUrl.js';

async function getAll() {
    const response = await axios
        .get(`${ApiUrl()}/rules`)

    return response.data;
}

async function set({key, type, current, setpoint, handler, active, config = {}}) {
    const response = await axios
        .put(
            `${ApiUrl()}/rule`,
            {
                key,
                type,
                current,
                setpoint,
                handler,
                active,
                config
            }
        );

    return response.data;
}

async function del(key) {
    await axios
        .delete(
            `${ApiUrl()}/rule`,
            {
                params: {
                    key
                }
            }
        )
}

export default {
    getAll,
    set,
    del
}