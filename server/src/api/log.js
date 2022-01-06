import pgLog from "../pg/log.js";

async function get(request, response) {
    const get = await pgLog.get();
    response.send(get);
}

export default {
    get
}