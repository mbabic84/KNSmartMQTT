import pgPool from './pool.js';

import devices from './tables/devices.js';
import features from './tables/features.js';
import history from './tables/history.js';

async function init() {
    let queries = [];

    queries.push("BEGIN");

    queries = queries.concat(devices);
    queries = queries.concat(features);
    queries = queries.concat(history);

    queries.push("COMMIT");

    return pgPool()
        .query(queries.join(";"));
}

export default {
    init
}