import pgGroups from "../pg/groups.js";

async function get(request, response) {
    const groups = await pgGroups.get();
    response.send(groups);
}

async function set(request, response) {
    const group = await pgGroups.set(request.body);
    response.send(group);
}

async function del(request, response) {
    const deleted = await pgGroups.del(request.query.key);

    response.status(deleted ? 200 : 500).end();
}

export default {
    get,
    set,
    del
}