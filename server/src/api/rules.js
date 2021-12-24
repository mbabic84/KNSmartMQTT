import pgRules from "../pg/rules.js";

async function get(request, response) {
    const get = await pgRules.getSimple();
    response.send(get);
}

async function set(request, response) {
    const set = await pgRules.set(request.body);
    response.send(set);
}

async function del(request, response) {
    const deleted = await pgRules.del(request.query.key);

    response.status(deleted ? 200 : 500).end();
}

export default {
    get,
    set,
    del
}