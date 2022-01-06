import axios from 'axios';

import ApiUrl from '../utils/ApiUrl.js';

async function getAll() {
    const response = await axios
        .get(`${ApiUrl()}/groups`)

    return response.data;
}

async function set({ key, name, index = 0, config = { expanded: true } }) {
    const response = await axios
        .put(
            `${ApiUrl()}/group`,
            {
                key,
                name,
                index,
                config
            }
        );

    return response.data;
}

async function del(key) {
    await axios
        .delete(
            `${ApiUrl()}/group`,
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