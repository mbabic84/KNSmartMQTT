import axios from 'axios';

async function getAll() {
    const response = await axios
        .get('http://10.0.0.40:8740/groups')

    return response.data;
}

async function update(key, name, index = 0, config = {expanded: true}) {
    const response = await axios
        .post(
            'http://10.0.0.40:8740/group',
            {
                key,
                name,
                index,
                config
            }
        );

    return response.data;
}

async function remove(key) {
    await axios
        .delete(
            'http://10.0.0.40:8740/group',
            {
                params: {
                    key
                }
            }
        )
}

export default {
    getAll,
    update,
    remove
}